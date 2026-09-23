# ThinkWatch Lite

ThinkWatch Lite is a desktop app that runs a local AI API gateway from the macOS menu bar or the Windows notification area. It supervises [ThinkWatch Core](/docs/core) and displays its configuration, traffic and cost.

Claude Code, Codex CLI and other clients of the Anthropic, OpenAI and Gemini APIs send their requests to the gateway, and Lite shows what each request cost, which upstream served it and why, and what was sent along with it.

> It runs on macOS 12 or later on Apple Silicon and on Windows 10 or later on x64 or ARM64, is [installed](/docs/lite/install) with Homebrew, a disk image or the Windows installer, and updates itself.

## Usage and cost

Tokens, cost and requests over any period, broken down by model, with the cache hit rate, the net savings from caching and latency percentiles per model.

Measured costs, estimated costs and unpriced requests are reported separately and never added together; usage served by a subscription upstream is counted apart from billed usage. Every request records the price sheet and the date of the prices it was costed with — figures computed from price lists of different dates are not directly comparable.

## Routing and failover

Routing rules send requests to an upstream or a group of upstreams by model, key, token count, tools, images and other properties. Every request records the rule it matched, the group it went through and each attempt with its status and duration.

A dry run evaluates the rules for a given request and shows where it would go, which rules did not match and for what reason. It sends nothing and costs nothing.

## Upstreams

API keys, a ChatGPT account signed in from the app (with its usage limits and reset times), relays such as OpenRouter, and local models.

When a client and an upstream speak different API formats, requests are converted between Anthropic Messages, OpenAI Chat Completions, OpenAI Responses and Gemini, and the fields that cannot be carried over are listed. Upstreams can be reached through an outbound proxy and priced with a custom price sheet.

## Security

- **Outbound redaction** replaces keys, private keys and connection strings before a request leaves for an untrusted upstream, and restores them in the response.
- **Tool-call inspection** cuts off the response stream when an upstream returns a tool call carrying a command that would grant code execution.
- **Config scan** checks client configuration files (skills, hooks, MCP servers) for hidden characters, injected instructions and dangerous commands.

Each runs in Off, Observe or Enforce mode, and all three start in Observe. The Findings page collects the scan results and compares each upstream's last 24 hours with the 30 days before.

Request and response bodies are masked before they are displayed; a secret is never shown in the interface.

## Client setup

Claude Code, Codex CLI, opencode, Zed and Aider can be pointed at the gateway from the app. The change is shown as a diff before anything is written, the original file is backed up, only the endpoint and key fields change, and the change can be restored at any time. Cursor, Continue and Gemini CLI come with step-by-step instructions.

## Menu bar and notifications

The menu bar shows today's cost and the output rate; for a subscription account it shows the quota used and the time until it resets instead. The item is rendered as a bitmap because the menu bar cannot display two lines of text.

On Windows the icon sits in the notification area. Hovering over it shows the gateway's state and today's tokens and cost; a left click opens the main window, and a right click opens the same menu, with quota bars written out as text. Notifications are native Windows notifications.

System notifications report when the gateway stops forwarding, an upstream becomes unreachable, a subscription quota runs out or a credential stops working. One setting decides how all of them are delivered: as a system notification, in the app only, or not at all.

## Interface language

The interface is available in Simplified Chinese and English. It follows the system language by default; another language can be chosen in Settings.

## Relationship to ThinkWatch Core

The gateway is implemented in ThinkWatch Core. Lite contains no routing, forwarding or accounting logic and communicates with Core over a unix socket on macOS and a loopback port on Windows, both carrying a per-launch credential. See [Architecture](/docs/lite/architecture).

## License

ThinkWatch Lite is licensed under the MIT License.
