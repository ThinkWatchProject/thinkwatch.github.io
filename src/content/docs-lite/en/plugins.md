# Plugins

Plugins adapt requests and answers to a particular setup: adding today's date to the system prompt, unifying terms in answers, removing a parameter that a relay rejects, masking internal host names, or rewriting file paths in tool calls between WSL and Windows. A plugin is a short JavaScript file. It runs in a sandbox inside core, sees placeholders instead of the keys it would otherwise find, and every change it makes is recorded on the request and checked by the same protections as anything a client sends.

This page covers what plugins can do, how one is added, the API for writing one, permissions, limits and the security model. Five example plugins are listed at the end.

## What a plugin can change

| Side | What can be changed |
|---|---|
| Request, before it goes to an upstream | The system prompt; the messages, including tool results and the arguments of earlier tool calls; the tool definitions; the model, `max_tokens`, `temperature`, `top_p` and `stop`. A plugin can also refuse the request. |
| Answer, before it reaches the client | The text of the answer, as a whole block or as it streams; the tool calls in the answer, which can be changed, removed or added. |

A plugin sees the same structure whatever API format the client uses (Anthropic Messages, OpenAI Chat Completions, OpenAI Responses or Gemini). Core writes the changes back in the client's own format and touches only the items that changed; cache markers, signatures, images and fields it does not know are kept. A request that no plugin changes is forwarded byte for byte, so the upstream's prompt cache is unaffected.

Request headers, upstream addresses and credentials are not available to plugins. Images are passed as their media type only, without their data, and thinking blocks can be read but not changed.

## Adding a plugin

1. On the **Plugins** page, choose **Add plugin**, then choose a `.js` file or paste the code.
2. The **Review plugin** dialog shows the full code, each requested permission with what it allows, the scope, the settings, the plugin's id and the behavior on errors.
3. Choosing **Install** raises a system dialog with the plugin's name, its permissions in plain words and the beginning of the file's SHA-256 hash. The plugin is installed only after it is confirmed there.

The system dialog is raised by the app itself, outside the page, and the endpoints that install a plugin, replace its code or approve a changed file are not available to the page. A script injected into the page cannot install a plugin on its own.

Plugins are installed only from a local file or from pasted code. There is no installation from a link, no plugin marketplace and no automatic update.

Core keeps the approved copy of each plugin together with its SHA-256 hash. When the file on disk changes, the plugin stops running and its status shows **File changed**; its review dialog shows the differences from the approved copy, and the plugin runs again once the new version is approved in the system dialog. **Replace code** goes through the same review and system dialog.

On the Plugins page:

- **Order.** Plugins run in the order of the list. Each plugin sees the result of the one before it and is checked against its own permissions.
- **Settings.** Values for the settings a plugin declares, the scope, and the behavior on errors.
- **Trial run.** Runs the plugin on a recent request from the history and shows the request or answer before and after, with the plugin's log. Nothing is sent to an upstream.
- **Logs.** The latest 500 lines the plugin wrote with `console`.
- **Statistics** since core started: calls, changes, refusals, errors and the average CPU time per call.

On the Traffic page, requests changed by a plugin carry a mark. A request's detail lists every plugin that ran with its outcome (unchanged, changed, refused, error or skipped) and its CPU time, and shows the request as the client sent it and as it was after the plugins. A failing plugin raises a notification.

When the app is connected to a [remote core](/docs/lite/remote-core), plugins are installed on the server and run there.

## Writing a plugin

A plugin is a single ES module file in UTF-8, at most 1 MiB. It exports a `manifest` and one or more hooks.

```js
export const manifest = {
  name: "Add today's date",
  api: 1,
  description: "Appends today's date to the system prompt.",
  permissions: ["system"],
  match: { clients: ["claude-code"], models: ["claude-*"] },
  settings: {
    utc_offset: { type: "number", label: "Time zone (hours from UTC)", default: 0 },
  },
};

export function onRequest(req, ctx) {
  const offset = Number(ctx.settings.utc_offset ?? 0);
  const today = new Date(Date.now() + offset * 3600 * 1000).toISOString().slice(0, 10);
  req.system = req.system ? `${req.system}\n\nToday's date: ${today}` : `Today's date: ${today}`;
  return req;
}
```

### Manifest

| Field | Required | Value |
|---|---|---|
| `name` | Yes | 1 to 64 characters. |
| `api` | Yes | `1`, the only version supported. |
| `description` | No | Up to 500 characters. |
| `permissions` | Yes | One or more of `system`, `messages`, `tools`, `params`, `reply.text` and `reply.tool_calls`; see [Permissions](#permissions). |
| `match` | No | The initial scope: `clients`, `models` and `upstreams`, each a list of patterns where `*` matches any run of characters. A missing or empty list matches everything. `upstreams` applies only to answer hooks, because the upstream is not known before routing. The scope can be changed on the Plugins page. |
| `reply` | No | `"block"` (the default) or `"stream"`: how `onReplyText` receives text. |
| `settings` | No | Up to 20 entries, each with `type` (`string`, `number` or `boolean`), `label` and `default`. Values are edited on the Plugins page and passed in `ctx.settings`. |

The file is checked when it is added and whenever core loads it. It must export a valid manifest and at least one hook; each exported hook needs its permission, and each permission must be used by an exported hook, so that a plugin requests nothing it does not use. A file that fails any check is not installed, and the error names the line and column where it can.

### Hooks

| Hook | Permission | Called |
|---|---|---|
| `onRequest(req, ctx)` | `system`, `messages`, `tools` or `params` | Once for each request, before it goes to an upstream. |
| `onReplyText(text, ctx)` | `reply.text` | For the text of the answer. |
| `onReplyTextEnd(ctx)` | `reply.text` | In stream mode, at the end of each text block. Optional. |
| `onToolCall(call, ctx)` | `reply.tool_calls` | For each tool call in the answer, once it is complete. |

**`onRequest`** receives the [request view](#the-request-view) and returns it changed, or returns nothing to leave the request as it is. Calling `reject("reason")` refuses the request, and the client receives an error that names the plugin; `reject` ends the hook by throwing, and the refusal stands even if the plugin catches what it throws. The hook runs once for each request: when the request moves to another upstream after a failure, the result is reused and the hook does not run again. It runs for requests that generate an answer; token-count requests (`/v1/messages/count_tokens` and Gemini's `countTokens`) are forwarded without it.

**`onReplyText`** in block mode, the default, is called once for each text block with the whole text of the block, and the text reaches the client after the call. In stream mode it is called for each piece of streamed text and returns what to send now; returning `""` holds the text back, and `onReplyTextEnd` returns whatever is still held when the block ends. An answer that is not streamed is passed in one call, followed by `onReplyTextEnd` in stream mode. Returning nothing leaves the text unchanged.

**`onToolCall`** receives `{ id, name, input }`. Streamed arguments are collected until the call is complete, and the result is sent in the client's format. The hook returns nothing to leave the call unchanged, an object to replace it, `null` to remove it, or an array to replace it with several calls. An `id` is generated where one is missing.

Thinking blocks are not passed to plugins and reach the client unchanged.

A hook may be an `async` function or return a promise; it is settled within the same call and the same limits, and a promise that never settles counts as an error.

### The request view

```ts
type RequestView = {
  format: "anthropic" | "openai_chat" | "openai_responses" | "gemini"; // read-only
  model: string;        // read-only; the model is changed through params.model
  system?: string;      // with "system"; "" when there is none
  messages?: Message[]; // with "messages"
  tools?: Tool[];       // with "tools"
  params?: Params;      // with "params"
};
type Message = { key?: string; role: "user" | "assistant" | "tool" | "system"; parts: Part[] };
type Part =
  | { key?: string; type: "text"; text: string }
  | { key?: string; type: "thinking"; text: string }                              // read-only
  | { key?: string; type: "tool_call"; id: string; name: string; input: unknown }   // input can be changed
  | { key?: string; type: "tool_result"; call_id: string; text: string; is_error: boolean } // text can be changed
  | { key?: string; type: "image"; media_type: string | null }                     // read-only, no data
  | { key?: string; type: "other"; label: string };                                // read-only
type Tool = { key?: string; name: string; description: string; input_schema: unknown };
type Params = { model: string; max_tokens?: number; temperature?: number; top_p?: number; stop?: string[] };
```

`system` is the instruction at the start of the conversation: the `system` field in Anthropic Messages, the leading system or developer messages in Chat Completions, `instructions` in Responses and `systemInstruction` in Gemini. Setting it to `""` removes it. Messages that carry only tool results have the role `tool`, and system or developer messages later in the conversation have the role `system`.

Core assigns a `key` to every message, part and tool. The rules for changes:

- A message, part or tool keeps its `key` to be changed and has no `key` when it is new. An unknown or repeated `key` is an error.
- Messages can be removed, changed or added. Added messages have the role `user`, `assistant` or `system` and contain text parts only. Messages that are kept keep their order and their role.
- Within a kept message, parts can be removed, their editable fields changed, and text parts added. `type`, `id`, `name` and `call_id` cannot be changed, and neither can thinking, image and other parts.
- Tools can be removed or added, and their `description` and `input_schema` changed. Tool names stay unique.
- Values in `params` can be changed; a changed `params.model` is the model that routing uses.

A result that breaks a rule, or that contains a section the plugin was not granted, counts as an error.

### `ctx`

```ts
type Ctx = {
  client: string | null;   // the client, as recorded on the request, e.g. "claude-code"
  model: string;           // the model the client asked for
  format: "anthropic" | "openai_chat" | "openai_responses" | "gemini"; // the client's format
  upstream: string | null; // answer hooks only: the upstream that served the answer
  settings: Record<string, string | number | boolean>;
};
```

`ctx` is frozen and cannot be changed.

### Available JavaScript

Plugins have the standard JavaScript built-ins, such as `JSON`, `RegExp`, `Map`, `Date` and `Math`; `console.log`, `console.info`, `console.warn` and `console.error`, which write to the plugin's log; and `reject`, which is valid only in `onRequest`. There is no `fetch`, `require` or timer, `import` and `import()` load nothing, and there is no access to files, the network, environment variables or processes. Nothing a plugin stores in a variable outlives the request or answer it runs for.

## Permissions

A permission decides both what a plugin sees and what it may change. Sections that are not granted are not passed to the plugin, and a result that changes them counts as an error.

| Permission | Sees and may change | Shown at installation |
|---|---|---|
| `system` | The system prompt | |
| `messages` | Messages: text, tool results and the arguments of earlier tool calls; thinking is read-only and images are passed as their type only | Can add instructions to the conversation |
| `tools` | Tool definitions | Changes which tools the model can use |
| `params` | Model, `max_tokens`, `temperature`, `top_p`, `stop` | Can change which upstream the request goes to and what it costs |
| `reply.text` | The text of answers | |
| `reply.tool_calls` | The tool calls in answers: change, remove, add | High risk, shown in red: a plugin can change what the client runs. The tool-call inspection still checks the result. |

## When a plugin fails

A plugin fails when it throws an error, exceeds a [limit](#limits), returns something that is not valid, or changes a section it was not granted. Each plugin sets what happens then:

- **Reject the request** (the default): the request is refused, or the answer ends, with an error that names the plugin.
- **Skip this plugin**: the plugin is left out for this request, and the request continues as if it were not installed.

The same choice applies to requests in a plugin's scope while it cannot run: when its file has changed and has not been approved, or when it fails to load. Every failure is recorded on the request.

## Limits

| Hook | CPU time | Memory | Output |
|---|---|---|---|
| Request | 200 ms per call, including the module's top-level code | 128 MiB | Twice the size of the request view, plus 1 MiB |
| Answer | 20 ms per call; 2 s for the whole answer | 64 MiB | Twice the size of the text or tool call passed in, plus 1 MiB; text released by `onReplyTextEnd`: 1 MiB |

Each call can write 100 lines to the log, and a line longer than 4 KiB is cut short. The plugin file can be up to 1 MiB. A call that exceeds a limit, including a 101st log line, is stopped and counts as an error.

## Security model

- **A sandbox with nothing in it.** Plugins run in QuickJS compiled to WebAssembly and executed by Wasmtime inside core. Plugin code never runs in the app's window and never runs as native code. The sandbox has no network, files, environment variables or processes; even a flaw in the JavaScript engine reaches only the sandbox's own memory, not the keys and tokens in core's memory.
- **Nothing is kept.** Each request runs its hook in a new instance. Each answer gets one instance, shared by that answer's hooks and discarded when the answer ends. Plugins share nothing with each other.
- **Placeholders instead of keys.** Keys that the outbound redaction rules recognize are replaced with placeholders before a plugin sees them and restored after it, on the request and on the answer, whatever mode the protection is in. The answer side matters as much as the request: answers become part of the conversation and are sent upstream again with the next request, so a plugin that could see a real key could hide it, encoded, in an answer.
- **The protections still apply.** Request hooks run before the content filter, the hidden-character check, outbound redaction and routing; answer hooks run before the tool-call inspection and the output limit. Whatever a plugin writes is checked like anything else.
- **Approved code only.** A plugin runs only while its file matches the SHA-256 hash approved at installation. Installing, replacing code and approving a changed file are confirmed in a system dialog.
- **Every change is visible.** Each run is recorded on the request, a changed request is stored as it was after the plugins (with keys replaced, like every stored request), and requests changed by plugins are marked on the Traffic page.
- **Bounded.** Every call has limits on CPU time, memory, output and log volume. Plugins run in a separate thread pool, so a slow plugin does not hold up the gateway's own work.
- **Plain text.** The app shows a plugin's name, description, setting labels, logs and errors as plain text.

## What the sandbox cannot prevent

A plugin is allowed to change content, and the sandbox cannot judge whether a change is honest. A plugin with `system` or `messages` can write instructions into the prompt, and one with `reply.text` can make an answer misleading. A plugin with `params` can switch to a more expensive model. A plugin with `reply.tool_calls` can change what the client runs; the tool-call inspection catches only the patterns in its rules. Keys that the outbound redaction rules do not recognize are visible to plugins; they are also sent to the upstream as they are, and a custom rule on the Security page covers such a format.

These risks are limited by granting a plugin only the permissions it needs, by reading its code before installing it, and by comparing the request before and after the plugins in the request's detail.

## Examples

The ThinkWatch Core repository has five example plugins in [`examples/plugins`](https://github.com/ThinkWatchProject/ThinkWatch-Core/tree/main/examples/plugins).

| File | Permission | What it does |
|---|---|---|
| `add-date.js` | `system` | Appends today's date, in a configurable time zone, to the system prompt. |
| `unify-terms.js` | `reply.text` | Replaces terms in answers according to a list in its settings. Stream mode: the answer keeps streaming, and only a few characters that may start a term are held back until the next piece arrives. |
| `strip-params.js` | `params` | Removes `temperature`, `top_p` or `stop` before the request goes out, for relays and models that reject them. |
| `mask-pattern.js` | `reply.text` | Replaces text in answers that matches a regular expression in its settings, such as internal host names. |
| `wsl-paths.js` | `reply.tool_calls` | Rewrites paths in tool-call arguments between WSL (`/mnt/c/…`) and Windows (`C:\…`). |

The stream-mode replacement in `unify-terms.js`, in outline:

```js
export const manifest = {
  name: "Unify terms",
  api: 1,
  permissions: ["reply.text"],
  reply: "stream",
  settings: { terms: { type: "string", label: "Terms (from=to, comma-separated)", default: "e-mail=email" } },
};

let held = ""; // the answer's hooks share one instance, so this lasts for the whole answer

export function onReplyText(text, ctx) {
  return convert(held + text, ctx, false); // sends what is settled, keeps a possible start of a term in `held`
}

export function onReplyTextEnd(ctx) {
  return convert(held, ctx, true); // the block has ended: send everything that is left
}
```

## Next steps

- [Features](/docs/lite/features): the other pages of the app, including the Security page and its protections.
- [Connecting to a remote core](/docs/lite/remote-core): plugins on a core running on a server.
