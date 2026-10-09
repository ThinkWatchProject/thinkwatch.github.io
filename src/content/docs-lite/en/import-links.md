# Import links

ThinkWatch Lite accepts links that pre-fill a new upstream. A relay or a model vendor can place such a link in its dashboard or in a welcome message. A user who has the app installed opens the link, reviews the settings in a confirmation dialog, and creates the upstream in one step.

This page is written for relay and vendor operators. It describes the two forms of the link, the parameters, what the app checks, and what a link intentionally cannot do. A link builder is at the end of the page.

## Link forms

Both forms carry the same parameters.

| Form | Description |
|---|---|
| `thinkwatch://import?…` | Opens the app directly. The browser asks for permission before it hands the link to the app. |
| `https://thinkwat.ch/import#…` | A web page that shows the settings, opens the app with a button, and offers the download when the app is not installed. The parameters are in the fragment after `#`, which browsers do not send to any server. The page loads no analytics or third-party scripts and removes the fragment from the address bar after reading it. |

The web form suits emails and dashboards whose users may not have the app yet. The page checks the parameters with the same rules as the app and shows nothing for a link that fails them.

## Parameters

| Parameter | Required | Value |
|---|---|---|
| `url` | Yes | The base URL of the service, without endpoint paths such as `/chat/completions` or `/messages`. `https://` only; `http://` is accepted only for `localhost`, `127.0.0.1` and `[::1]`. No user name or password, query string or fragment. |
| `name` | No | The upstream's name in the app. When omitted, the app derives one from the address. |
| `protocol` | No | `anthropic`, `openai-chat`, `openai-responses` or `gemini`. When omitted, the app detects the protocol from the address. |
| `key` | No | The API key, stored as given. Letters, digits and `- _ . ~ + / = :` only. |
| `models` | No | Comma-separated model IDs, added to the upstream by hand. The app offers them next to the models the service lists, so a service that lists only some of its models can name the rest here; when the service lists none, they are its whole list. |

Encoding rules:

- Each value is percent-encoded, for example with `encodeURIComponent`. A literal `+` means a space, so a key that contains `+` is written as `%2B`.
- Each parameter appears at most once.
- A link with any other parameter, an empty value, or a value that fails its rule is rejected as a whole. The app ignores such a link without opening a window.

Limits:

| Item | Limit |
|---|---|
| Whole link | 8192 characters |
| `name` | 64 characters; no leading or trailing spaces; none of `/`, `\`, `$`, `{`, `}`, `<`, `>`, `"` or the backtick; not starting with `__`; no control or invisible characters |
| `url` | 2048 characters |
| `key` | 512 characters |
| `models` | 64 entries, 128 characters each; letters, digits and `- _ . : / @ +` |

## What the app does with a link

1. **Checks the link.** Every rule above is applied in the app, whatever the page that produced the link has checked.
2. **Shows a confirmation dialog.** The dialog states the host that will receive request content and the API key, in ASCII: an internationalized domain name is shown as punycode (`xn--…`), so a look-alike domain cannot pass for a familiar one. It also shows the base URL, the protocol, the key (hidden until revealed) and the model list. Only the name can be changed. Values are displayed as plain text.
3. **Saves nothing before confirmation.** Until **Create** is chosen, the configuration is not written and the app makes no network request to the address: no connection test and no model listing.
4. **Creates one new upstream.** An import never changes, replaces or deletes an existing upstream. When the name is already in use, a different name must be entered; there is no option to overwrite. The new upstream is not made the default and is not added to any route. After creation it behaves like an upstream added by hand, including fetching its model list.
5. **Handles one link at a time.** Links that arrive while the dialog is open, or within a few seconds after it closes, are ignored and do not bring the window to the front.

## Examples

An Anthropic-compatible relay:

```text
thinkwatch://import?name=example-relay&url=https%3A%2F%2Fapi.relay.example&protocol=anthropic&key=sk-relay-EXAMPLE
```

```text
https://thinkwat.ch/import#name=example-relay&url=https%3A%2F%2Fapi.relay.example&protocol=anthropic&key=sk-relay-EXAMPLE
```

An OpenAI-compatible relay that does not list its models:

```text
thinkwatch://import?name=example-openai&url=https%3A%2F%2Fapi.relay.example%2Fv1&protocol=openai-chat&key=sk-relay-EXAMPLE&models=gpt-5%2Cgpt-5-mini
```

```text
https://thinkwat.ch/import#name=example-openai&url=https%3A%2F%2Fapi.relay.example%2Fv1&protocol=openai-chat&key=sk-relay-EXAMPLE&models=gpt-5%2Cgpt-5-mini
```

## What a link cannot set

Any web page can open a link, so a link is limited to what a user can judge in one dialog. The following are intentionally not supported:

| Not supported | Reason |
|---|---|
| Environment variable references in the key (`${NAME}`) | The app reads `${NAME}` from the user's environment. A link with `key=${OPENAI_API_KEY}` would send the user's own key to the relay's host. Keys containing `$`, `{` or `}` are rejected. |
| Request headers | Header values can reference environment variables and credentials, and can change how requests are authenticated in ways the dialog cannot show clearly. |
| Outbound proxy | A link must not route traffic through a third party. |
| Pricing and billing | How cost is counted is the user's decision. |
| Routing rules and the default upstream | A link must not redirect the traffic of clients that are already configured. |
| MCP servers and client configuration | They run commands or change the settings of other applications. |
| Icons and other presentation | Not needed to connect, and a way to imitate a familiar service. |
| Plain `http://` to other hosts | The key would travel unencrypted. |
| ChatGPT account sign-in and Amazon Bedrock | They need an interactive sign-in or AWS credentials, which a link cannot carry. |

These settings can be changed in the app after the upstream is created.

## Keys in links

A link that contains a key is a credential. Generate a separate link for each customer and deliver it through a private channel, such as the customer's own dashboard. A link without `key` creates the upstream without a key; the key is then added by editing the upstream in the app.
