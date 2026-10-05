# Use Codex with Claude, Gemini or a Chat Completions-only relay

ThinkWatch Lite connects Codex to a gateway on the same computer that accepts the OpenAI Responses API, the only format Codex uses with a custom provider. The gateway converts each request and its answer between Responses and the upstream's format: Anthropic Messages for Claude, Google Gemini, or OpenAI Chat Completions for a relay that offers nothing else. The model is named in Codex's configuration or set by a routing rule.

## Before you start

- ThinkWatch Lite, [installed](/docs/lite/install/).
- Codex, either the Codex CLI or the Codex in the ChatGPT desktop app, run at least once.
- An API key for Anthropic, Google Gemini or the relay.

## Steps

1. On the Upstreams page, choose **New upstream** and pick a **Service**: **Anthropic** for Claude, or **Google Gemini**; each fills in the address and protocol. For a relay, choose **Custom**, enter its **Base URL** without an endpoint path such as `/chat/completions`, and set **Protocol** to **OpenAI Chat Completions**; for GLM, for example, `https://api.z.ai/api/paas/v4`, or `…/api/coding/paas/v4` on a GLM Coding Plan. A base URL that ends with its own version, such as `/v4` or Volcengine Ark's `/api/v3`, is used as written from ThinkWatch Lite 2026.10.5. Enter the **API key**, choose **Check connection**, then **Next**. If the relay does not list its models, enter them one per line under **Manual list**. Choose **Next**, then **Create**.
2. On the Clients page, choose **Connect…** on the Codex row. The dialog shows the change to `~/.codex/config.toml`:

   | Field | Value |
   |---|---|
   | `model_provider` | `thinkwatch` |
   | `model_providers.thinkwatch.base_url` | The gateway address with `/v1`, by default `http://127.0.0.1:8788/v1` |
   | `model_providers.thinkwatch.wire_api` | `responses` |
   | `model_providers.thinkwatch.experimental_bearer_token` | A new key named `codex` |
   | `model_providers.thinkwatch.http_headers` | `X-ThinkWatch-Client = "codex"` |
   | `name`, `requires_openai_auth`, `supports_websockets` in the same table | `ThinkWatch`, `false`, `false` |

   Choose **Connect**, then reopen the terminal. The ChatGPT desktop app reads the same file and picks up the change after a restart.
3. Name the model. Connecting leaves `model` as it was, so Codex keeps asking for the model it used before. Either:
   - set `model = "<model ID>"` at the top of `~/.codex/config.toml`, before the first `[section]`, or pass `-c model=<model ID>` for a single run; or
   - keep Codex's model and rewrite it: on the Routing page, open the `default` route and choose **Add rule**, add the conditions **Model** `gpt-*` and **Key** `codex`, set **On match** to **Forward** and **Forward to** to the upstream, and under **Parameter rewrites** enter the model ID in **Change model to**. Choose **Add**, then **Save**.

## Notes

- **Codex's model table.** Codex carries metadata for its own models, such as the context window, inside the program. A model it does not know, such as a Claude or Gemini model, runs on fallback metadata with a 272,000-token context window, and Codex warns: "Model metadata for `<model>` not found. Defaulting to fallback metadata; this can degrade performance and cause issues." For a model with a smaller window, `model_context_window` in `config.toml` sets the window Codex assumes. The gateway's model list does not appear in Codex's model picker, as Codex expects a catalog in its own format.
- **Conversion.** Requests and streamed answers are converted in both directions. Traffic marks such requests **Converted**; fields the target format cannot carry are dropped and listed in the request details. Server-side tools such as web search run only at the provider they belong to and are dropped in conversion. Codex accepts only `responses` for `wire_api`, so this conversion is what makes a Chat Completions-only relay usable.
- **Credentials.** With `requires_openai_auth = false`, Codex authenticates to the gateway with its own key and sends no OpenAI key or ChatGPT token. A ChatGPT account signed in from the app can still serve the OpenAI models next to Claude or Gemini: each request goes to an upstream that lists the model asked for.
- **Sessions.** Codex lists sessions started before and after connecting separately. `codex resume <session ID> -c model_provider=thinkwatch` continues an earlier session through the gateway. After **Restore…**, sessions started while connected can still be opened, and go straight to OpenAI.
- **Cost.** A rewritten request is priced as the model actually sent.

Related: [Features](/docs/lite/features/), [Use Claude Code with GLM, DeepSeek or Kimi](/docs/lite/claude-code-other-models/), [Install and update](/docs/lite/install/).
