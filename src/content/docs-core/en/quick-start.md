# Quick start with twcore

ThinkWatch Core is a set of crates, not an application you install. If you want something that runs, `bin/twcore` is a complete, self-contained gateway binary, and it is the thing to run when you want to see behaviour.

## Write, check, and serve a config

From a checkout of the [ThinkWatch Core repository](https://github.com/ThinkWatchProject/ThinkWatch-Core):

```bash
cargo run -p twcore -- init     # write a commented config.yaml
cargo run -p twcore -- check    # validate only, don't start
cargo run -p twcore -- serve    # start the gateway and control plane
```

- **`init`** writes a commented `config.yaml`.
- **`check`** validates the config without starting anything.
- **`serve`** starts the gateway and the control plane.

## Point a client at it

Point a client such as Claude Code or Codex at the local port. From there, Core routes each request by your rules, fails over between upstreams, prices usage against its snapshot table, redacts secrets on the way out, and inspects tool calls on the way back. [Overview](/docs/core#what-it-does) describes each of these.

Step-by-step setup for individual clients is not documented yet.
