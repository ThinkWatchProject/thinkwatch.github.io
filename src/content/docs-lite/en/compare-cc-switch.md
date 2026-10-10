# ThinkWatch Lite vs CC Switch

CC Switch and ThinkWatch Lite both connect AI coding clients such as Claude Code and Codex to different providers, and both are MIT-licensed. CC Switch switches providers by writing each client's configuration file, with an optional local proxy. ThinkWatch Lite points each client at a local gateway once, then switches, routes and records every request in the gateway, where credentials can be replaced and dangerous tool calls cut off.

## How they work

CC Switch keeps providers in its own database. Enabling one writes its address and key into the client's configuration, such as `env.ANTHROPIC_BASE_URL` in `~/.claude/settings.json` for Claude Code, or `~/.codex/auth.json` and `config.toml` for Codex. Claude Code picks up the change without a restart; most other clients need the client or its terminal restarted.

Its local proxy mode, called routing in its manual, covers Claude Code, Codex, Gemini CLI and Grok Build. Turning it on writes the client's configuration to point at the proxy (`http://127.0.0.1:15721` by default); providers are then switched inside the proxy without restarting the client, and the configuration is restored when the proxy is turned off. Proxy request logs, failover and format conversion need this mode.

ThinkWatch Lite runs a gateway, ThinkWatch Core, on the computer. The Clients page connects each client once, showing the full diff, backing up the original file and giving the client its own key. Upstreams, routing rules and failover then change in the gateway without touching the client's configuration.

## Comparison

A dash means the feature is not described in that product's documentation.

| | CC Switch | ThinkWatch Lite |
|---|---|---|
| Clients | Claude Code, Claude Desktop, Codex, Gemini CLI, Grok Build, OpenCode, OpenClaw, Hermes Agent, Pi, MiniMax Code | In one step: Claude Code, Claude Desktop, Codex (also in the ChatGPT desktop app), opencode, Pi, oh-my-pi, Grok Build, Qwen Code, Hermes Agent, Zed, Aider, DeepSeek Harness. With instructions: Cursor, Continue, Antigravity CLI |
| Adding providers | More than 50 presets; `ccswitch://` links import providers, MCP servers, prompts and skills | A new upstream starts from the service, in three groups: model vendors (Anthropic, OpenAI, Google Gemini, DeepSeek, Z.ai / BigModel), platforms and relays (Amazon Bedrock, OpenRouter, ThinkWatch Enterprise, Sub2API, New API / One API), and Ollama or any compatible endpoint; ChatGPT and Z.ai / BigModel accounts sign in inside the dialog; `thinkwatch://import` links from a relay or vendor pre-fill one upstream |
| Routing | In proxy mode, each client's requests go to its current provider; models can be mapped per provider | Ordered rules per key by model, API format, input tokens, tools, images, extended thinking and more; rules can rewrite the model |
| Failover | Queue in priority order with a circuit breaker (proxy mode) | Next upstream in the group when an attempt fails before the answer begins; a session stays on one upstream |
| Load balancing | — | Group strategies: in order, manual, round robin, lowest latency, lowest cost |
| API format conversion | Proxy mode: Claude Code to OpenAI Chat Completions or Responses; Codex to Chat Completions or Anthropic Messages | Among Anthropic Messages, OpenAI Chat Completions, OpenAI Responses and Gemini |
| Usage and cost | Requests, tokens, cache hit rate and estimated cost, from proxy logs or the clients' session logs; custom prices, optional sync from models.dev; quota and balance display | Tokens, cost and requests by period, model and upstream; LiteLLM prices refreshed daily, or custom price sheets; estimates marked, unpriced requests counted separately; the balances and quotas that upstreams report |
| Request details | Provider, model, tokens, cost, timing and status; parameters, a response summary and errors | Matched rule, each attempt with its status, request and response bodies, cost; full-text search; replay against another upstream |
| Outbound redaction and tool-call inspection | — | API keys, private keys, ID and bank card numbers replaced before a request leaves; tool calls that download and run code or send out credentials cut off. Both start by only recording |
| MCP and skills | One MCP server list synced to the selected clients; skills installed from GitHub or ZIP files | MCP servers of 13 clients side by side, copied or removed for 4; skills and hooks listed; all scanned for hidden characters, prompt injection, dangerous commands and overly broad permissions |
| Prompts | Prompt presets written to `CLAUDE.md`, `AGENTS.md` or `GEMINI.md` | — |
| Sessions | Reads the clients' own session files; search, resume in a terminal, delete | Requests that passed through the gateway grouped into sessions and replayed turn by turn |
| Subscription accounts | ChatGPT (Codex OAuth), GitHub Copilot and xAI accounts through its reverse proxies | ChatGPT and Z.ai / BigModel accounts as upstreams; Claude Pro or Max sign-in is not supported |
| Server and remote use | — (the proxy can listen on `0.0.0.0`; provider data syncs across devices through Dropbox, OneDrive, iCloud or WebDAV) | The gateway runs as a systemd service on a Linux server, managed from the app over an encrypted control channel |
| Platforms | Windows 10 or later; macOS 12 or later on Intel and Apple silicon, signed and notarized; Linux as deb, rpm or AppImage | macOS 12 or later on Apple silicon; Windows 10 21H2 or later on x64 and ARM64; Linux on x86_64 and aarch64 as an AppImage; not signed by Apple or Microsoft |
| License | MIT | MIT |

## Which one fits

- **CC Switch** is the more direct choice for switching among a few providers, starting from presets, and managing MCP servers, prompts and skills for several clients in one place.
- **ThinkWatch Lite** fits when the cost and destination of each request need to be visible, requests should follow routing rules, credentials in requests should not reach a relay, or the gateway should run on a server.

## Using both

Both apps write Claude Code's endpoint, `env.ANTHROPIC_BASE_URL` in `~/.claude/settings.json`, and Codex's `~/.codex/config.toml`. When both connect the same client they overwrite each other: the last write decides where the client sends requests, and each app's restore puts back the value it saved before its own change.

They can run side by side when each client goes through only one of them, for example CC Switch for Gemini CLI or OpenClaw, which ThinkWatch Lite does not connect, and ThinkWatch Lite for Claude Code and Codex. To move a client from CC Switch to ThinkWatch Lite, turn off CC Switch's proxy for that client and stop switching its providers there, then connect it on the Clients page. To move it back, restore it on the Clients page first.

## Notes

- The description of CC Switch is based on its README, user manual and release notes for v3.20.4, as of October 2026 ([farion1231/cc-switch](https://github.com/farion1231/cc-switch)). Later versions may differ.
- The description of ThinkWatch Lite applies to version 2026.10.4.

Related: [Features](/docs/lite/features/), [Install and update](/docs/lite/install/), [Connecting to a remote core](/docs/lite/remote-core/), [FAQ](/docs/lite/faq/).
