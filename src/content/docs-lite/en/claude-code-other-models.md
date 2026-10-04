# Use Claude Code with GLM, DeepSeek or Kimi

ThinkWatch Lite connects Claude Code to a gateway on the same computer, which forwards each request to an upstream that serves the model asked for. A GLM, DeepSeek or Kimi model is either named in Claude Code, with `/model` or the model variables in `settings.json`, or reached by a routing rule that rewrites Claude's model names to it. All three providers offer an Anthropic-compatible address, so Claude Code's requests reach them without format conversion.

## Before you start

- ThinkWatch Lite, [installed](/docs/lite/install/), and Claude Code, run at least once.
- An API key from the provider. For GLM, a Z.ai or BigModel account with a GLM Coding Plan can sign in from the app instead.
- A Claude Pro or Max sign-in cannot serve as an upstream; once connected, Claude Code uses its gateway key instead.

## Steps

1. On the Upstreams page, choose **New upstream** and pick a **Service**:
   - **DeepSeek** fills in `https://api.deepseek.com/anthropic` and the protocol. Enter the **API key**.
   - GLM with a key: **Custom**, with `https://open.bigmodel.cn/api/anthropic` or `https://api.z.ai/api/anthropic` as the **Base URL**, **Protocol** set to **Anthropic Messages**, and the **API key**.
   - GLM with an account: **Z.ai / BigModel account**. Select the **Account service**, tick **Acknowledge the notes above and continue signing in**, choose **Sign in** and authorize in the browser. The app creates an API key named `thinkwatch` on the account and saves the upstream.
   - Kimi: **Custom**, with the Anthropic-compatible base URL from Kimi's documentation and **Protocol** set to **Anthropic Messages**. For Kimi For Coding, also turn on **Forward client identity**.

   **Check connection** verifies the address and key and fetches the model list at no cost. Choose **Next** twice, then **Create**.
2. On the Clients page, choose **Connect…** on the Claude Code row. The dialog lists the fields that change in `~/.claude/settings.json`: `env.ANTHROPIC_BASE_URL`, `env.ANTHROPIC_AUTH_TOKEN` (a new key named `claude-code`) and `env.CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY`. Choose **Connect**.
3. Choose how the model is selected:
   - **By name.** In Claude Code, `/model <model ID>` switches to the model, and `claude --model <model ID>` starts with it. To map Claude Code's model aliases to it, add these to the `env` block of `~/.claude/settings.json`; the Haiku one also runs background tasks.

     ```json
     "ANTHROPIC_DEFAULT_OPUS_MODEL": "<model ID>",
     "ANTHROPIC_DEFAULT_SONNET_MODEL": "<model ID>",
     "ANTHROPIC_DEFAULT_HAIKU_MODEL": "<model ID>"
     ```

     No routing rule is needed; the default route skips upstreams whose model list does not contain it.
   - **By rewriting.** On the Routing page, open the `default` route and choose **Add rule**. With **Add condition**, add **Model** `claude-*`, and **Key** `claude-code` to leave other clients alone. Set **On match** to **Forward**, **Forward to** to the upstream, and **Change model to** under **Parameter rewrites** to the model ID. Choose **Add**, then **Save**. Claude Code keeps showing Claude's names.

## Notes

- **Format conversion.** Claude Code sends Anthropic Messages; with that protocol the request goes out unchanged, apart from identity fields such as `metadata.user_id`, which the gateway removes. Only an upstream in another format, such as an OpenAI-compatible address set to OpenAI Chat Completions, gets a converted request: Traffic marks it **Converted** and its details list any dropped fields. Web search, a server-side tool, cannot be converted and is not sent to such an upstream. **Auto-detect** does not recognize these addresses and forwards requests in the client's own format, which suits Claude Code but not Codex.
- **Forward client identity** is off by default, so upstreams see ThinkWatch's User-Agent and no client identity. Kimi For Coding, Bailian Coding Plan and similar upstreams accept only certain clients; with the switch on, they receive Claude Code's own User-Agent, identity headers such as `x-app` and the identity fields in the body, unaltered.
- **GLM Coding Plan.** An upstream on `api.z.ai` or `open.bigmodel.cn`, signed in or added with a key, shows its 5-hour and weekly limits, and the credits left on a plan billed in credits, in the Quota / billing column and in the menu bar or tray menu.
- **The /model list** shows gateway models only when their names contain `claude` or `anthropic`. Other models are typed by name, or added as one entry with `ANTHROPIC_CUSTOM_MODEL_OPTION`.
- **Cost.** A rewritten request is priced as the model actually sent.
- **Restore…** puts back only the fields the app wrote; model variables added by hand stay in `settings.json`.

Related: [Features](/docs/lite/features/), [Use Codex with Claude, Gemini or a Chat Completions-only relay](/docs/lite/codex-other-models/), [Use Claude Desktop with third-party models](/docs/lite/claude-desktop-third-party-models/).
