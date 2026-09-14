# ThinkWatch Core

ThinkWatch Core is the shared core of the ThinkWatch AI API gateways: routing, forwarding, observability, cost accounting, and a set of data-plane guards. It is used by the desktop app, [ThinkWatch Lite](/docs/lite), and by the server edition.

## Scope of Core

Core is a set of Rust crates, not an installable application. For a runnable gateway, `bin/twcore` is a complete, self-contained gateway binary; [Quick start with twcore](/docs/core/quick-start) describes how to use it.

Both editions depend on these crates, so a change in Core affects both.

## What it does

When a client such as Claude Code or Codex is pointed at a local port, Core provides the following:

- **Rule-based routing** to different upstreams. Conditions include the model name, the client, the context length, and whether tools are present; actions include switching upstream, rewriting parameters, and rejecting the request.
- **Mid-stream failover.** Before the first byte is sent, the gateway can switch upstreams transparently. After streaming has started, it reports the failure.
- **Cost visibility.** Token usage and cache hits are priced against a snapshot table. Usage that cannot be priced is labelled *unknown* rather than assigned a fabricated figure.
- **Outbound redaction.** Secrets in a request are replaced with placeholders before they reach a relay, and restored when the model echoes them back.
- **Inbound inspection.** Tool calls returned by an upstream are checked against a rule set, and a dangerous call can be terminated mid-frame.

## Further reading

- [Quick start with twcore](/docs/core/quick-start): writing, checking, and serving a config.
- [Crate layers](/docs/core/crate-layers): how the crates are organised, and which layers are shared.
- [Development and tests](/docs/core/development): tests, the smoke script, and the rules every change must follow.

## License

ThinkWatch Core is licensed under the MIT License. The source code is available on [GitHub](https://github.com/ThinkWatchProject/ThinkWatch-Core).
