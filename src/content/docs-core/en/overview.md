# ThinkWatch Core

ThinkWatch Core is the gateway engine of the ThinkWatch products: a set of MIT-licensed Rust crates and `twcore`, a self-contained AI API gateway binary. `twcore` is the gateway inside the desktop app, [ThinkWatch Lite](/docs/lite), and also runs on its own as a systemd service on a Linux server. ThinkWatch Enterprise depends on three of the crates: `tw-dialect`, `tw-guard` and `tw-breaker`.

## Scope of Core

Core is a set of crates and one binary, not a desktop application. On a desktop, `twcore` comes with ThinkWatch Lite and is not installed separately. On a server, a single command installs it as a service, and ThinkWatch Lite on macOS, Windows or Linux connects to it; see [Server deployment](/docs/core/server-deployment). [Quick start with twcore](/docs/core/quick-start) covers the prebuilt binaries, building from source and a first configuration.

A change in Core reaches every product that uses it, so each change follows the rules in [Development and tests](/docs/core/development).

## What it does

Clients such as Claude Code and Codex send their requests to the gateway, and Core provides the following:

- **Rule-based routing.** Rules match on the model, the gateway key, the input size, the presence of tools or images and other properties of a request, and send it to an upstream or a group, rewrite its parameters or refuse it. When the client and the upstream use different API formats, the request is converted between Anthropic Messages, OpenAI Chat Completions, OpenAI Responses and Gemini.
- **Failover before the first byte.** Until the first byte reaches the client, a failing upstream is replaced by the next one without the client noticing. After that point, the failure is reported. A circuit breaker keeps requests away from an upstream that keeps failing.
- **Cost accounting.** Token usage and cache hits are priced from a public price table, which the control plane refreshes daily, or from a price sheet in the configuration. Each request records its cost and where the price came from. Estimated amounts are marked as such, and usage that cannot be priced is labelled *unknown* rather than given an invented figure.
- **Outbound redaction.** Credentials in a request are replaced with placeholders before the request leaves, and restored when the model echoes them back.
- **Tool-call inspection.** Tool calls returned by an upstream are checked against a rule set, and a dangerous call can be cut off mid-stream. With checks for hidden characters, content rules and an output limit, these form five guards, each set to `off`, `observe` or `enforce`.
- **An encrypted control plane.** The desktop app and `twcore` commands reach core over a local socket (a loopback port on Windows) and, when it is enabled, a remote control port. Every control connection starts with a Noise handshake keyed by `listen.control.key`; there are no certificates.

## Further reading

- [Quick start with twcore](/docs/core/quick-start): getting the binary, writing and checking a configuration, and pointing a client at the gateway.
- [Server deployment](/docs/core/server-deployment): running `twcore` as a systemd service on Linux and connecting ThinkWatch Lite to it.
- [Configuration reference](/docs/core/configuration): every field of `config.yaml`.
- [Crate layers](/docs/core/crate-layers): how the crates are grouped, and which of them each product uses.
- [Development and tests](/docs/core/development): tests, the smoke script, releases, and the rules every change follows.

## License

ThinkWatch Core is licensed under the MIT License. The source code is available on [GitHub](https://github.com/ThinkWatchProject/ThinkWatch-Core).
