# Quick start with twcore

ThinkWatch Core is a set of crates, not an installable application. `bin/twcore` is a complete, self-contained gateway binary, and it is the recommended way to observe Core's behaviour.

## Write, check, and serve a config

Run the following commands in a checkout of the [ThinkWatch Core repository](https://github.com/ThinkWatchProject/ThinkWatch-Core):

```bash
cargo run -p twcore -- init     # write a commented config.yaml
cargo run -p twcore -- check    # validate without starting
cargo run -p twcore -- serve    # start the gateway and control plane
```

- **`init`** writes a commented `config.yaml`.
- **`check`** validates the config without starting anything.
- **`serve`** starts the gateway and the control plane.

## Connecting a client

Point a client such as Claude Code or Codex at the local port. Core then routes each request according to the configured rules, fails over between upstreams, prices usage against its snapshot table, redacts secrets in outbound requests, and inspects tool calls in responses. Each capability is described in the [Overview](/docs/core#what-it-does).

Step-by-step configuration for individual clients is not yet documented.
