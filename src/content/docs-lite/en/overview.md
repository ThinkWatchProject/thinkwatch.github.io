# ThinkWatch Lite

ThinkWatch Lite is a desktop app that runs a local AI API gateway on macOS, Windows and Linux, from the macOS menu bar, the Windows notification area or the Linux system tray. Claude Code, Codex and other clients of the Anthropic, OpenAI and Gemini APIs send their requests through the gateway, and the app records what each request cost, which upstream served it and why, and which credentials were redacted before it was sent.

The gateway is [ThinkWatch Core](/docs/core). It runs beside the app on the same computer, or on a Linux server that the app connects to; see [Connecting to a remote core](/docs/lite/remote-core).

> It runs on macOS 12 or later on Apple silicon, on Windows 10 21H2 or later on x64 or ARM64 and on Linux on x86_64 or aarch64, is [installed](/docs/lite/install) with Homebrew, a disk image, the Windows installer or an AppImage, and updates itself.

## Pages

| Page | Contents |
|---|---|
| Overview | Tokens, cost and requests over a period, trends by model, cache, latency and security results |
| Traffic | Every request, or requests grouped into sessions, with the details of each |
| Clients | Pointing clients at the gateway, and restoring them |
| Keys | The gateway keys clients connect with, each with its route and limits |
| Upstreams | Upstreams, outbound proxies and price sheets |
| Routing | Routes, rules and groups, auxiliary requests, and the dry run |
| Security | The security log and the five protections with their rules |
| MCP | MCP servers, skills and hooks in each client, and the configuration scan |
| Settings | Connection, language, appearance, menu bar, notifications, listening, retention, updates and uninstall |

## Usage and cost

Tokens, cost and requests live or over the last 24 hours, 7 days, 30 days or a custom range, each compared with the period before, with a trend by model and the models ranked by usage. The Overview page also reports the cache hit rate and the net savings from caching, time-to-first-byte percentiles by model and by upstream, and what each security protection found in the period.

Measured costs, estimated costs and unpriced requests are kept apart: an estimate, such as the cost of a request whose client disconnected before the response finished, is marked as one, and requests whose model has no price are counted separately instead of being added as zero. Costs follow LiteLLM's public price data, which the gateway refreshes daily, or a custom price sheet.

## Requests and sessions

The Traffic page lists each request with its key, model, upstream, time to first byte, total time, tokens and cost as it arrives. The list can be filtered by key, upstream, failures, unpriced requests or text, and grouped into sessions, so that the requests of one task can be read together.

A request's details show the rule it matched, the group it went through, each attempt with its status and duration, and any failover to the next upstream. When the client and the upstream use different API formats, the request is converted between Anthropic Messages, OpenAI Chat Completions, OpenAI Responses and Gemini, and the fields that could not be carried over are listed. The details also include the request and response bodies and the usage the cost was calculated from. A finished request can be replayed against another upstream and the two results compared side by side.

Request and response bodies are masked before they are displayed; a secret is never shown in the interface.

## Routing and failover

Each key uses a route. A route's rules are checked in order against the model, the key, the client's API format, input tokens, `max_tokens`, the number of tools, images, extended thinking, streaming and the prompt cache, and the first rule that matches decides: it forwards the request to an upstream or a group, or refuses it with a message.

A group picks its upstreams in order, by manual choice, in rotation, by lowest latency or by lowest cost, and moves on to the next when one is unavailable. In rotation, sticky sessions keep each session on one upstream so that its prompt cache stays valid; they are on by default and can be turned off for a group. Auxiliary requests that clients send on their own, such as health checks, warm-ups and title generation, can be answered locally at no cost, passed through, or handled by the routing rules, which can send them to a lower-cost upstream.

A dry run takes a key, a model, a client format and the properties of a request, and shows where the request would go: the rule that matched, why each rule before it did not, the upstreams that would be tried and any format conversion. It sends nothing and costs nothing.

## Upstreams

API-key upstreams such as Anthropic, OpenAI, Gemini, DeepSeek or any compatible endpoint; ChatGPT and Z.ai accounts signed in from the app; relays such as OpenRouter; and local models served by Ollama or another OpenAI-compatible server. The usage limits of ChatGPT accounts and of GLM Coding Plan keys on Z.ai and BigModel are shown with their reset times.

Upstreams can connect through an outbound HTTP or SOCKS proxy, whose connection and authentication can be checked from the Upstreams page. Each upstream is billed per token or free. Prices come from the default price sheet, LiteLLM's public price data refreshed daily, or from a custom price sheet that applies a multiplier and prices for individual models on top of it.

## Security

Five protections apply to every request that passes through the gateway. They are global: the same modes and rules apply to every upstream and every key.

| Protection | What it checks | In Enforce |
|---|---|---|
| Outbound redaction | API keys, private keys, JWTs and connection-string passwords in a request before it is sent; internal addresses and domains once their rules are turned on | Replaces them with placeholders and restores them in the response |
| Tool-call inspection | Tool calls returned by the upstream, against rules for dangerous commands such as downloading and running a script | Cuts off the response, for rules set to cut off |
| Hidden characters | Unicode tag characters and bidirectional controls in what the client sends, tool results included | Refuses the request |
| Content filter | Phrases and patterns in what the client sends, tool results included, such as instructions to ignore previous instructions | Refuses the request, for rules set to refuse |
| Output limit | The length of an answer, in characters | Cuts off the answer at the limit |

Each protection is Off, Observe or Enforce. Observe detects and records matches without changing the request; it is the initial mode of every protection except the output limit, which starts Off and uses a limit of 100,000 characters once turned on. Built-in rules can be turned off one by one and custom rules added. Every match is listed in the security log with the request it came from.

## MCP servers, skills and hooks

The MCP page lists the MCP servers configured in Claude Code, Claude Desktop, Cursor, Codex, opencode, Zed, Antigravity CLI and DeepSeek Harness side by side. Remote and third-party servers are marked, and a server configured differently in two clients can be compared field by field. A server can be copied to another client or removed; the change is shown before it is written, and the original file is backed up.

The page also lists hooks and skills, and scans client configuration, skills, hooks, slash commands, subagents and project instructions for hidden characters, prompt injection, dangerous commands and overly broad permissions. The scan reports what it finds and changes no file. The files are scanned again when they change, and a new finding raises a notification.

## Client setup

Claude Code, Codex, opencode, Zed, Aider, Claude Desktop and DeepSeek Harness can be pointed at the gateway from the app. The change is shown as a diff before anything is written, the original file is backed up, only the settings that point the client at the gateway change, and the change can be restored at any time. Cursor, Continue and Antigravity CLI come with step-by-step instructions.

Claude Desktop is pointed at the gateway through its third-party inference mode. It has to be quit completely and reopened afterwards, and conversations in that mode are kept apart from the others; a Claude Desktop managed by an organization is not changed. For opencode, the models the client's key can use are written into its configuration, and the Clients page says when that list needs updating after upstreams or routes change. After Codex is restored, the sessions started while it pointed at the gateway can still be opened.

On Windows, the Clients page also lists each WSL distribution. Claude Code and Codex inside WSL can be pointed at the gateway under WSL 1, or under WSL 2 with mirrored networking; they reach it at 127.0.0.1, and the gateway keeps listening on this computer only. When WSL 2 uses NAT networking, the page can switch it to mirrored networking, which needs Windows 11 22H2 or later, and restart WSL.

## Keys

Clients connect to the gateway with gateway keys. Connecting a client creates a key for it, so that traffic, cost and limits are attributed to that client. Each key has a route, the set of models its client sees, and an optional concurrency limit. A key can be disabled, except the default key, or rotated; when a key is rotated, the new key is written into the configuration of the client that uses it.

## Menu bar and tray

On macOS, the menu bar shows today's tokens above today's cost. The numbers turn orange when a subscription quota is nearly used up and red once it has run out; the item can also show only the icon or only the numbers. The item is drawn as a bitmap because the menu bar cannot display two lines of text.

Its menu shows the gateway's state and output rate, today's requests, tokens and cost, each subscription quota with its reset time, and the requests in progress, with items to open the main window, copy the gateway address or the default key, switch connection and check for updates.

On Windows the icon sits in the notification area. Hovering over it shows the gateway's state and today's tokens and cost; a left click opens the main window, and a right click opens the same menu, with quota bars written out as text. On Linux the icon sits in the system tray. Clicking it opens the same menu, with Open ThinkWatch Lite as its first item.

## Notifications

The following raise a system notification:

- the gateway stops forwarding, cannot start or keeps exiting;
- the connection to a remote core is lost;
- a subscription quota runs out;
- an upstream's sign-in expires, an upstream rejects its credential, or a renewed credential cannot be saved to the configuration;
- an outbound proxy cannot be reached;
- an edited configuration file fails validation, or a change to the listening address does not take effect;
- a tool call matches a rule set to cut off;
- the configuration scan finds new suspicious content.

An upstream that became unreachable is listed in the app without a system notification. A notice is withdrawn once its problem is resolved. One setting decides how all of them are delivered: as system notifications, in the app only, or not at all. System notifications are native on each platform: the macOS notification center, Windows notifications and the Linux desktop's notification service.

## Interface language

The interface is available in English and Simplified Chinese. It follows the system language by default; another language can be chosen in Settings.

## Relationship to ThinkWatch Core

The gateway is implemented in ThinkWatch Core. Lite contains no routing, forwarding or accounting logic. It controls Core over a unix socket on macOS and Linux and a loopback port on Windows, or over a TCP port when it is connected to a core on a server. Every control connection is encrypted and authenticated by a handshake keyed by `listen.control.key` in `config.yaml`. See [Architecture](/docs/lite/architecture) and [Connecting to a remote core](/docs/lite/remote-core).

## License

ThinkWatch Lite is licensed under the MIT License.
