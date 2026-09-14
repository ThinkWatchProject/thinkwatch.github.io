# ThinkWatch Core

ThinkWatch Core is the shared core of a local AI API gateway: routing, forwarding, observability, cost accounting, and a set of data-plane guards. It is used by both the desktop app, [ThinkWatch Lite](/docs/lite), and the server edition.

## What Core is, and is not

Core is not an application you install. It is a set of Rust crates. If you want something that runs, `bin/twcore` is a complete, self-contained gateway binary; [Quick start with twcore](/docs/core/quick-start) shows how to use it.

Because both editions depend on these crates, a change in Core reaches both.

## What it does

Point a client (Claude Code, Codex, and friends) at a local port, and Core will:

- **Route by rule** to different upstreams. Conditions can be the model name, the client, the context length, or whether tools are present; actions are switching upstream, rewriting parameters, or refusing outright.
- **Fail over mid-flight.** Before the first byte, an upstream can be swapped transparently. After it, the only honest thing left is to report what happened.
- **Make cost visible.** Token usage and cache hits are priced against a snapshot table. What cannot be priced is labelled *unknown* rather than given an invented number.
- **Redact outbound.** Secrets in a request are replaced with placeholders before they reach a relay, and restored when the model echoes them back.
- **Inspect inbound.** Tool calls returned by an upstream are checked against a rule set, and a dangerous one can be cut off mid-frame.

## Where to go next

- [Quick start with twcore](/docs/core/quick-start): write, check, and serve a config.
- [Crate layers](/docs/core/crate-layers): how the crates are organised, and which layers are shared.
- [Development and tests](/docs/core/development): tests, the smoke script, and the rules a change must keep.

## License

ThinkWatch Core is MIT licensed. The source is on [GitHub](https://github.com/ThinkWatchProject/ThinkWatch-Core).
