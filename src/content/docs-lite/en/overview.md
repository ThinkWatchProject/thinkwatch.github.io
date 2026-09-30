# ThinkWatch Lite

ThinkWatch Lite is a local gateway for Claude Code, Codex and other AI clients, on macOS, Windows and Linux. Each client is connected once; after that, upstreams and models change in the gateway without touching the client. Every request is recorded with its cost and route, and the API keys in it can be replaced before it leaves the machine.

> It runs on macOS 12 or later on Apple silicon, on Windows 10 21H2 or later on x64 or ARM64 and on Linux on x86_64 or aarch64, is [installed](/docs/lite/install) with Homebrew, a disk image, the Windows installer or an AppImage, and updates itself.

## Highlights

- **Connect once, switch freely.** Seven clients are pointed at the gateway in one step, with the change previewed and the original backed up; Cursor, Continue and Antigravity CLI come with instructions.
- **Keys replaced before sending.** Outbound redaction, tool-call inspection, hidden-character detection, a content filter and an output limit apply to every request, each in Off, Observe or Enforce.
- **MCP servers, skills and hooks, scanned.** The MCP servers of eight clients side by side, and a scan of client configuration for hidden characters, prompt injection, dangerous commands and overly broad permissions.
- **Every request traceable.** The matched rule, each attempt, any format conversion and the cost, with replay against another upstream.
- **Routing and failover.** Rules by model, tools, images and more; groups that fail over before the answer begins and keep each session on one upstream.
- **Any upstream.** API keys, Amazon Bedrock, ChatGPT and Z.ai accounts, relays and local models, with conversion between the Anthropic, OpenAI and Gemini APIs.
- **Costs stated as they are.** Estimates marked, unpriced requests counted separately rather than as zero.

## Pages

| Page | Contents |
|---|---|
| Overview | Tokens, cost and requests over a period, trends by model, cache, latency, generation speed and security results |
| Traffic | Every request, or requests grouped into sessions, with the details of each |
| Clients | Pointing clients at the gateway, and restoring them |
| Keys | The gateway keys clients connect with, each with its route and limits |
| Upstreams | Upstreams, outbound proxies and price sheets |
| Routing | Routes, rules and groups, auxiliary requests, and the dry run |
| Security | The security log and the five protections with their rules |
| MCP | MCP servers, skills and hooks in each client, and the configuration scan |
| Settings | Connection, language, appearance, menu bar, notifications, listening, retention, updates and uninstall |

Each page is described in [Features](/docs/lite/features).

## Further reading

- [Install and update](/docs/lite/install)
- [Connecting to a remote core](/docs/lite/remote-core): the gateway is [ThinkWatch Core](/docs/core), which runs beside the app or on a Linux server.
- [Architecture](/docs/lite/architecture): Lite holds no routing, forwarding or accounting logic; it controls Core over an encrypted control channel.
- [Build from source](/docs/lite/run-from-source)

ThinkWatch Lite is licensed under the MIT License.
