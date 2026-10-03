# Plugins

Plugins adapt requests and answers to a particular setup: adding instructions to the system prompt, removing a parameter that one upstream rejects, asking for answers in a chosen language, or rewriting file paths in tool calls between WSL and Windows. A plugin is a short JavaScript file. It runs in a sandbox inside core, sees placeholders instead of the keys it would otherwise find, and every change it makes is recorded on the request and checked by the same protections as anything a client sends.

This page covers what plugins can do, where they run, how one is added and edited, the API for writing one, permissions, limits and the security model. Two plugins ship with the app, both off by default; they are described at the end.

## What a plugin can change

| Side | What can be changed |
|---|---|
| Request, before it goes to an upstream | The system prompt; the messages, including tool results and the arguments of earlier tool calls; the tool definitions; the model, `max_tokens`, `temperature`, `top_p` and `stop`. A plugin can also refuse the request. |
| Answer, before it reaches the client | The text of the answer, as a whole block or as it streams; the tool calls in the answer, which can be changed, removed or added. |

A plugin sees the same structure whatever API format the client uses (Anthropic Messages, OpenAI Chat Completions, OpenAI Responses or Gemini). By default a plugin handles conversations: requests that generate an answer, and the token counts and Responses compaction requests that carry the same conversation. A plugin that declares them also handles embeddings and legacy completions, where it can change the text of each input; see [Embeddings and legacy completions](#embeddings-and-legacy-completions). Other endpoints, such as images and audio, pass every plugin untouched.

Plugins also run on the WebSocket connection Codex uses for the Responses API: each `response.create` goes through the request hooks, and each answer through the answer hooks. A connection keeps the plugins that were in place when it opened. Other WebSocket connections, such as the Realtime API, are not handled by plugins.

Core writes the changes back in the client's own format and touches only the items that changed; cache markers, signatures, images and fields it does not know are kept. A request that no plugin changes is forwarded byte for byte, so the upstream's prompt cache is unaffected.

Request headers, upstream addresses and credentials are not available to plugins. Images are passed as their media type only, without their data, and thinking blocks can be read but not changed.

## Where plugins run

A request is routed first, on what the client sent: the routing rules, a rule's model rename, failover groups, keeping a session on one upstream and the models the key may use all apply to the client's original request, and plugins cannot change where it goes. Then, for each attempt to send it to an upstream:

1. Keys in the request are replaced with placeholders.
2. The request hooks in scope for this attempt run in list order, starting from the request as the client sent it. The placeholders are restored after them.
3. If a plugin changed the request, the content filter checks it again, hidden-character rules included, and reports only what the plugins added. A block refuses the whole request; it is not tried on another upstream.
4. The request is converted to the upstream's format if needed, outbound redaction applies, and it is sent.

When an attempt fails and the request moves to another upstream, the hooks run again from the request as the client sent it, so changes made for one upstream never reach another. A retry to the same upstream, such as the one after a sign-in token is refreshed, reuses what the hooks produced.

A plugin that changes the model renames only what is sent to the upstream of this attempt, like a routing rule's rename, and replaces any name a rule set. The request is not routed again and the upstream's model list is not checked again, but the models the key may use still apply: a model outside them refuses the request.

On the answer side, the hooks run after the answer is converted to the client's format and before the tool-call inspection.

## Adding and editing a plugin

Each plugin is a single file that holds everything about it: the code, the requests it handles, what happens when it fails and the value of each setting. The file alone describes the plugin, so a copy of it carries the settings too. Only whether the plugin is on is kept outside the file, as a switch in the app.

**Settings** on a plugin's row opens its editor, which has two tabs and a single **Save**:

- **Settings** holds the **Enabled** switch, the scope (**Applies to**), the behavior on errors (**On error**) and the plugin's own settings. Apart from **Enabled**, changes made here are written into the manifest in the code: the app rewrites only the manifest and leaves every other byte of the file as it is.
- **Code** holds the whole file. When typing pauses, core reads the code again and the Settings tab follows it. Code that cannot be loaded is marked at the line and column of the error, and the Settings tab waits until it loads again.

Changes on both tabs are kept while switching between them and saved together.

**Add plugin** opens the same editor on the **Code** tab, with a small working plugin to start from. The code is edited or pasted there, or loaded with **Import from file…** at the top right, and **Install** installs the plugin. For a new plugin the Settings tab also has the **Plugin ID**: lowercase letters, digits and hyphens, up to 40, suggested from the file name or the plugin's name. The ID cannot be changed after installing. A new plugin is installed turned off unless **Enabled** is switched on first. Plugins are installed only from a local file or pasted code; there is no installation from a link, no plugin marketplace and no automatic update.

On the Plugins page:

- **Order.** Plugins run in the order of the list, which **Reorder** changes by dragging or with the arrows. Each plugin sees the result of the one before it and is checked against its own permissions.
- **Trial run.** Runs the plugin on a recent request from the history, with the routing that request had: the upstream that answered and the model sent to it. It shows the request or answer before and after, with the plugin's log. Nothing is sent to an upstream, and a trial run does not count in the statistics.
- **Logs.** The latest 500 lines the plugin wrote with `console`.
- **Statistics** since the gateway started: runs, changes, rejections, errors and the average CPU time.

On the Traffic page, requests changed by a plugin carry a mark. A request's detail lists every plugin run, grouped by attempt, with its outcome (unchanged, changed, rejected, error or skipped) and its CPU time, and shows the request as the client sent it and as it was sent to the upstream that answered. A failing plugin raises a notification.

When the app is connected to a [remote core](/docs/lite/remote-core), plugins are installed on the server and run there.

### Confirmation in a system dialog

Routine changes are saved directly. A system dialog is needed only for four steps, and only for a plugin that can change tool calls (one with the `reply.tool_calls` permission): installing it, turning it on, saving a change to its code, and approving a change made to its file outside the app. A change to the code counts when the permission is there before or after it, so adding `reply.tool_calls` is confirmed as well, and a plugin whose permissions cannot be read is treated as one that has it.

The dialog is raised by the app itself, outside the page. It names the plugin, what the plugin can do and what is changing, and for new code the beginning of its SHA-256 hash, to compare with the one shown in the app. Core accepts these four steps only through the dialog, so a script injected into the page cannot take them on its own.

No system dialog is needed for the settings, scope and behavior on errors of any plugin, for turning a plugin off, reordering or deleting, or for installing, turning on and editing a plugin that cannot change tool calls. Editing the config file in the app or restoring a version from its version history cannot install a plugin that can change tool calls, turn it on or change its code; such a change is refused there and made on the Plugins page.

### When the file changes outside the app

A plugin runs only as it was approved. Core keeps an approved copy of each plugin together with its SHA-256 hash, and a save in the app updates the file, the copy and the hash at once. When the file is changed or removed outside the app, the plugin stops running within seconds and its status shows **File changed**. **Review changes** shows the differences from the approved copy, and **Approve changes** lets the plugin run again; saving the plugin in its editor instead writes the editor's code back to the file.

## Writing a plugin

A plugin is a single ES module file in UTF-8, at most 1 MiB. It exports a `manifest`, which describes the plugin and holds its configuration, and one or more hooks.

```js
export const manifest = {
  name: "Project notes",
  api: 1,
  description: "Appends the notes set here to the system prompt.",
  permissions: ["system"],
  match: { clients: ["claude-code"], models: [], upstreams: [] },
  on_error: "reject",
  settings: {
    notes: { type: "string", label: "Notes", value: "Use pnpm, not npm." },
  },
};

export function onRequest(req, ctx) {
  const notes = String(ctx.settings.notes).trim();
  if (notes === "") return; // nothing to add: the request is sent as it is
  req.system = req.system ? `${req.system}\n\n${notes}` : notes;
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
| `requests` | No | The kinds of request the plugin handles: one or more of `conversation`, `embeddings` and `completions`. Without it, conversations only; see [Embeddings and legacy completions](#embeddings-and-legacy-completions). |
| `match` | No | The [scope](#scope): `clients`, `models` and `upstreams`, each a list of up to 100 patterns in which `*` matches any run of characters. A missing or empty list matches everything. Shown as **Applies to** on the Settings tab. |
| `on_error` | No | `"reject"` (the default) or `"skip"`: what happens when the plugin fails, described in [When a plugin fails](#when-a-plugin-fails). Shown as **On error** on the Settings tab. |
| `reply` | No | `"block"` (the default) or `"stream"`: how `onReplyText` receives text. |
| `settings` | No | Up to 20 entries, each named with letters, digits and `_` and not starting with a digit, with `type` (`string`, `number` or `boolean`), `label` (plain text, up to 100 characters) and `value`, the current value (`""`, `0` or `false` when left out). Values are edited on the Settings tab and passed in `ctx.settings`. A string value may span several lines, up to 10,000 characters. |

Whether the plugin is on is not part of the manifest; it is the **Enabled** switch in the app.

The manifest is plain data, which lets core read it straight from the source and the app rewrite it without running the code. It is an object literal whose values are strings, numbers, `true`, `false`, `null`, lists and nested objects; keys are names or quoted strings, and trailing commas are allowed. Expressions, variables, function calls, spreads, computed keys, getters and template literals with `${}` are not data: a file that uses them in the manifest does not load, and neither does one whose code changes the manifest after declaring it.

A rewrite replaces only the manifest literal, and every byte outside it stays as it is. The literal is written back in one fixed style, the one used in the examples on this page, and comments inside it are not kept, so notes about the settings belong above the manifest.

The file is checked when it is added and whenever core loads it. It must export a valid manifest, with no fields other than these, and at least one hook. Each exported hook needs its permission, and each permission must be used by an exported hook, so that a plugin requests nothing it does not use; `onReplyTextEnd` also needs `onReplyText` and stream mode. A file that fails any check is not installed, and the error names the line and column where it can.

### Scope

The scope is the manifest's `match`. It is edited under **Applies to** on the Settings tab, which suggests the clients, models and upstreams the gateway knows.

| List | Matches |
|---|---|
| `clients` | The client the request came from, as recorded on the request, such as `claude-code`. A request from a client that is not recognized matches only an empty list. |
| `models` | The model sent to the upstream, after a routing rule renamed it. |
| `upstreams` | The upstream of the attempt. |

All three lists apply to request hooks and answer hooks alike, and patterns ignore case. A request hook is in scope per attempt: after a failover, a plugin limited to one upstream runs only for the attempts that go there. The request hooks of an attempt are chosen before any of them runs, so a model renamed by one plugin does not change which request hooks run; answer hooks match the model the answering upstream received. A plugin also handles only the kinds of request it declares in `requests`.

### Hooks

| Hook | Permission | Called |
|---|---|---|
| `onRequest(req, ctx)` | `system`, `messages`, `tools` or `params` | Before each attempt to send the request to an upstream, after routing. |
| `onReplyText(text, ctx)` | `reply.text` | For the text of the answer. |
| `onReplyTextEnd(ctx)` | `reply.text` | In stream mode, at the end of each text block. Optional. |
| `onToolCall(call, ctx)` | `reply.tool_calls` | For each tool call in the answer, once it is complete. |

**`onRequest`** receives the [request view](#the-request-view) and returns it changed, or returns nothing to leave the request as it is. Calling `reject("reason")` refuses the request, and the client receives an error that names the plugin; `reject` ends the hook by throwing, and the refusal stands even if the plugin catches what it throws. The hook runs once for each attempt to send the request to an upstream, as described in [Where plugins run](#where-plugins-run). Besides requests that generate an answer, it runs on token counts (`/v1/messages/count_tokens`, Gemini's `countTokens` and the Responses API's `input_tokens`) and on Responses compaction, which carry the same conversation, so that what a plugin removes is not sent through them either. On these, a changed model is applied but changes to the other `params` are not, because these endpoints do not accept them. A token count that the gateway estimates itself, without contacting an upstream, runs no plugin.

**`onReplyText`** in block mode, the default, is called once for each text block with the whole text of the block, and the text reaches the client after the call. In stream mode it is called for each piece of streamed text and returns what to send now; returning `""` holds the text back, and `onReplyTextEnd` returns whatever is still held when the block ends. An answer that is not streamed is passed in one call, followed by `onReplyTextEnd` in stream mode. Returning nothing leaves the text unchanged.

**`onToolCall`** receives `{ id, name, input }`. Streamed arguments are collected until the call is complete, and the result is sent in the client's format. The hook returns nothing to leave the call unchanged, an object to replace it, `null` to remove it, or an array to replace it with several calls. An `id` is generated where one is missing.

Answer hooks run only on the answers to conversations. Thinking blocks are not passed to plugins and reach the client unchanged.

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

`model` and `params.model` hold the model that will be sent to the upstream of this attempt, the same as `ctx.model`. `system` is the instruction at the start of the conversation: the `system` field in Anthropic Messages, the leading system or developer messages in Chat Completions, `instructions` in Responses and `systemInstruction` in Gemini. Setting it to `""` removes it. Messages that carry only tool results have the role `tool`, and system or developer messages later in the conversation have the role `system`.

Core assigns a `key` to every message, part and tool. The rules for changes:

- A message, part or tool keeps its `key` to be changed and has no `key` when it is new. An unknown or repeated `key` is an error.
- Messages can be removed, changed or added. Added messages have the role `user`, `assistant` or `system` and contain text parts only. Messages that are kept keep their order and their role.
- Within a kept message, parts can be removed, their editable fields changed, and text parts added. `type`, `id`, `name` and `call_id` cannot be changed, and neither can thinking, image and other parts.
- Tools can be removed or added, and their `description` and `input_schema` changed. Tool names stay unique. The view lists the tools the client defines itself; tools whose definition comes from the API, such as web search, are not shown, are kept as they are, and a new tool cannot take their names.
- `max_tokens`, `temperature`, `top_p` and `stop` can be changed or removed, and `params.model` can be changed. A changed `params.model` renames the model sent to the upstream of this attempt, as described in [Where plugins run](#where-plugins-run).

A result that breaks a rule, or that contains a section the plugin was not granted, counts as an error.

### Embeddings and legacy completions

A plugin that lists them in `requests` also handles embeddings (OpenAI `/v1/embeddings`, Gemini `:embedContent` and `:batchEmbedContents`) and legacy completions (OpenAI `/v1/completions`). Their view has the same shape, without a system prompt or tools:

```ts
type InputsView = {
  format: "openai_embeddings" | "openai_completions" | "gemini_embed"; // read-only
  model: string;        // read-only; the model is changed through params.model
  messages?: Message[]; // with "messages": one user message per input
  params?: Params;      // with "params": the model; for completions also max_tokens, temperature, top_p, stop
};
```

- Each input is one `user` message. For OpenAI, each element of an `input` (embeddings) or `prompt` (completions) array is one message, and a single string is one message; for Gemini, each content is one message, with one part for each of its parts.
- Only the text of text parts can be changed. An input given as token ids is a read-only `other` part labelled `tokens`, and other parts that are not text are read-only too.
- Messages and parts cannot be added, removed or reordered, because the answer comes back input by input.
- `params` holds the model, and for completions also `max_tokens`, `temperature`, `top_p` and `stop`. Other fields, such as `suffix` and `dimensions`, are not shown and stay as they are.

Everything else works as for conversations: the placeholders, a run for each attempt after routing, a changed model renaming what is sent to this upstream, recording and trial runs. A changed request is checked again by the content filter, on the text of its inputs. Answer hooks do not run on these requests: an embeddings answer carries no text, and a legacy completions answer is passed through as it is.

`messages` and `params` apply to all three kinds; `system`, `tools`, `reply.text` and `reply.tool_calls` apply to conversations only. A plugin does not load when `requests` is empty, names an unknown kind or names one twice, when a kind it declares is reached by none of its permissions (embeddings and completions need `messages` or `params`), or when it holds a permission that applies to none of its kinds, such as `system` without `conversation`.

A request of a kind that a plugin does not declare is outside its scope. It passes untouched and nothing is recorded, whatever the plugin's behavior on errors, and even while the plugin's file has changed or it fails to load.

### `ctx`

```ts
type Ctx = {
  client: string | null;    // the client, as recorded on the request, e.g. "claude-code"
  model: string;            // the model sent to the upstream, after a routing rule or an earlier plugin renamed it
  requested_model: string;  // the model the client asked for
  format: "anthropic" | "openai_chat" | "openai_responses" | "gemini"
        | "openai_embeddings" | "openai_completions" | "gemini_embed"; // the format of the client's request
  upstream: string;         // the upstream of this attempt, or the one that served the answer
  settings: Record<string, string | number | boolean>;
};
```

`ctx` is frozen and cannot be changed.

### Available JavaScript

Plugins have the standard JavaScript built-ins, such as `JSON`, `RegExp`, `Map`, `Date` and `Math`; `console.log`, `console.info`, `console.warn` and `console.error`, which write to the plugin's log; and `reject`, which is valid only in `onRequest`. There is no `fetch`, `require` or timer, `import` and `import()` load nothing, and there is no access to files, the network, environment variables or processes. The sandbox's clock is UTC. Nothing a plugin stores in a variable outlives the request attempt or answer it runs for.

## Permissions

A permission decides both what a plugin sees and what it may change. Sections that are not granted are not passed to the plugin, and a result that changes them counts as an error.

| Permission | Sees and may change | Note in the app |
|---|---|---|
| `system` | The system prompt | |
| `messages` | Messages: text, tool results and the arguments of earlier tool calls; thinking is read-only and images are passed as their type only. For embeddings and legacy completions, the text of each input | Can add instructions to the conversation |
| `tools` | Tool definitions | Changes which tools the model can use |
| `params` | Model, `max_tokens`, `temperature`, `top_p`, `stop`; for embeddings, the model only | Can change the model sent to the upstream, and so what the request costs |
| `reply.text` | The text of answers | |
| `reply.tool_calls` | The tool calls in answers: change, remove, add | High risk, shown in red: a plugin can change what the client runs. The tool-call inspection still checks the result, and installing such a plugin, turning it on, changing its code and approving a change to its file are confirmed in a system dialog. |

## When a plugin fails

A plugin fails when it throws an error, exceeds a [limit](#limits), returns something that is not valid, or changes a section it was not granted. A request of a kind the plugin handles whose body cannot be read counts as a failure as well. The manifest's `on_error`, shown as **On error** on the Settings tab, sets what happens then:

- **Reject the request** (the default): the request is refused, or the answer ends, with an error that names the plugin. A refused request is not tried on another upstream.
- **Skip this plugin**: the plugin is left out of this request, or of the rest of the answer, and the request continues as if it were not installed.

The same choice applies while a plugin cannot run: when its file has changed and has not been approved, or when it fails to load. Its behavior on errors and its scope then come from the approved file, which core reads as data even when the code cannot run, so such a plugin refuses only the attempts within its scope, matched by request kind, client, model and upstream like a working one. A plugin that fails to load counts as handling conversations only, and one whose manifest cannot be read at all rejects every conversation. Every failure is recorded on the request.

## Limits

| Hook | CPU time | Memory | Output |
|---|---|---|---|
| Request | 200 ms per call, including the module's top-level code | 128 MiB | Twice the size of the request view, plus 1 MiB |
| Answer | 20 ms per call; 2 s for the whole answer | 64 MiB | Twice the size of the text or tool call passed in, plus 1 MiB; text released by `onReplyTextEnd`: 1 MiB |

Each call can write 100 lines to the log, and a line longer than 4 KiB is cut short. The plugin file can be up to 1 MiB. A call that exceeds a limit, including a 101st log line, is stopped and counts as an error.

Across the gateway, at most 32 answer-hook instances run at the same time. Each plugin with answer hooks takes one for every answer it handles and gives it back when the answer ends. When none is free, the plugin's behavior on errors decides: **Reject the request** refuses the request before any of the answer is sent, and **Skip this plugin** lets that answer through without the plugin. Either way the run is recorded as an error and raises a notification.

## Security model

- **A sandbox with nothing in it.** Plugins run in QuickJS compiled to WebAssembly and executed by Wasmtime inside core. Plugin code never runs in the app's window and never runs as native code. The sandbox has no network, files, environment variables or processes; even a flaw in the JavaScript engine reaches only the sandbox's own memory, not the keys and tokens in core's memory.
- **Nothing is kept.** Every request-hook call runs in a new instance. For each answer, a plugin gets one instance, shared by its hooks for that answer and discarded when the answer ends. Plugins share nothing with each other.
- **Placeholders instead of keys.** Keys that the outbound redaction rules recognize are replaced with placeholders before a plugin sees them and restored after it, on the request and on the answer, whatever mode the protection is in. The answer side matters as much as the request: answers become part of the conversation and are sent upstream again with the next request, so a plugin that could see a real key could hide it, encoded, in an answer.
- **The protections still apply.** Request hooks run after routing, and a request they change is checked again by the content filter before outbound redaction; answer hooks run before the tool-call inspection. Whatever a plugin writes is checked like anything else, and plugins cannot change where a request is routed or switch to a model the key may not use.
- **Approved code only.** A plugin runs only while its file matches the approved SHA-256 hash, and a save in the app updates the file and the hash together. Installing a plugin that may change tool calls, turning it on, changing its code and approving a change to its file are confirmed in a system dialog outside the page, as described in [Confirmation in a system dialog](#confirmation-in-a-system-dialog).
- **Every change is visible.** Each run is recorded on the request, a changed request is stored as it was sent to the upstream that answered (with keys replaced, like every stored request), and requests changed by plugins are marked on the Traffic page.
- **Bounded.** Every call has limits on CPU time, memory, output and log volume, and the number of answer instances alive at once is capped. Plugins run in a separate thread pool, so a slow plugin does not hold up the gateway's own work.
- **Plain text.** The app shows a plugin's name, description, setting labels, logs and errors as plain text.

## What the sandbox cannot prevent

A plugin is allowed to change content, and the sandbox cannot judge whether a change is honest. A plugin with `system` or `messages` can write instructions into the prompt, and one with `reply.text` can make an answer misleading. A plugin with `params` can switch to a more expensive model among those the key may use. A plugin with `reply.tool_calls` can change what the client runs; the tool-call inspection catches only the patterns in its rules. Keys that the outbound redaction rules do not recognize are visible to plugins; they are also sent to the upstream as they are, and a custom rule on the Security page covers such a format.

These risks are limited by granting a plugin only the permissions it needs, by reading its code before installing it, and by comparing the request before and after the plugins in the request's detail.

## Plugins that ship with the app

Two plugins come with the app. They appear in the plugin list like any other, both off, and are turned on and configured the same way; the app shows their names and setting labels in the interface language. One of them, `wsl-paths`, may change tool calls, so turning it on is confirmed in a system dialog, while its setting, scope and behavior on errors change without one. While no plugin is on, core does not start the sandbox, so plugins that stay off take no memory. The plugins ship with core, so a remote core has them too. Both handle conversations only, and their code is in the ThinkWatch Core repository, in [`crates/tw-gateway/src/plugin/defaults`](https://github.com/ThinkWatchProject/ThinkWatch-Core/tree/main/crates/tw-gateway/src/plugin/defaults).

### Answer in a chosen language (`reply-language`)

Adds a fixed line to the end of the system prompt that asks the model to answer in the chosen language, unless the user explicitly asks for another. The line is the same on every request, so the upstream's prompt cache keeps hitting.

- Permission: `system`.
- Setting: `language`, the answer language, shipped as `简体中文` (Simplified Chinese). Only a language name is accepted (letters, spaces, parentheses and hyphens, up to 40 characters), so the setting cannot add other instructions; with any other value the plugin fails on every request.

The manifest as shipped:

```js
export const manifest = {
  name: "Answer in a chosen language",
  api: 1,
  description: "Adds a fixed line to the end of the system prompt that asks the model to answer in the language set here.",
  permissions: ["system"],
  on_error: "reject",
  settings: {
    language: { type: "string", label: "Answer language", value: "简体中文" },
  },
};
```

### Convert WSL and Windows paths (`wsl-paths`)

A client running in WSL cannot open `C:\Users\…`, and a client running on Windows cannot open `/mnt/c/Users/…`. The plugin rewrites every tool-call argument whose whole value is a drive path into the form the client can open, in the tool calls of answers and in earlier tool calls in the conversation, so the model keeps seeing one form. Paths inside command lines, the text of the conversation and tool results are left as they are.

- Permissions: `messages`, `reply.tool_calls`.
- Setting: `windows_client`, whether the client runs on Windows; shipped as `false`, for a client in WSL. The conversion is fixed in the code, and the setting cannot express any other rewrite.

The manifest as shipped:

```js
export const manifest = {
  name: "Convert WSL and Windows paths",
  api: 1,
  description: "Rewrites drive paths in tool-call arguments to the form the client can open (WSL /mnt/c/… or Windows C:\\…), in answers and in the conversation history.",
  permissions: ["messages", "reply.tool_calls"],
  on_error: "reject",
  settings: {
    windows_client: {
      type: "boolean",
      label: "The client runs on Windows (otherwise WSL)",
      value: false,
    },
  },
};
```

A built-in plugin that is deleted is not added again, and one whose code was edited is left as it is; changes made on its Settings tab do not count as editing the code. Otherwise, when an update ships a newer version of a built-in plugin, the plugin is updated and keeps its on/off state, its behavior on errors, its scope and the value of each setting the new version still declares with the same type; a new version that asks for more permissions or more kinds of request is turned off.

## Upgrading

The first launch after updating to the version that introduces plugins clears the request history, including stored requests and answers. The configuration, keys and upstreams are kept, and the two built-in plugins are added to the list, turned off.

## Next steps

- [Features](/docs/lite/features): the other pages of the app, including the Security page and its protections.
- [Connecting to a remote core](/docs/lite/remote-core): plugins on a core running on a server.
