# Crate layers

ThinkWatch Core consists of sixteen crates and one binary, `twcore`. The workspace divides the crates in two: the three that ThinkWatch Enterprise depends on, and the crates of the gateway that `twcore` runs, which ThinkWatch Enterprise does not use. Within the second part, the crates are grouped by role.

```
tw-dialect · tw-guard · tw-breaker                                   ← shared with ThinkWatch Enterprise
tw-types · tw-engine · tw-pricing · tw-yaml · tw-secret · tw-watch   ← domain logic
tw-api · tw-link                                                     ← control-plane contract
tw-config · tw-store · tw-observe                                    ← assembly
tw-gateway · tw-control                                              ← data plane / control plane
```

No crate depends on a group below its own.

| Group | Crate | Role |
| --- | --- | --- |
| Shared with ThinkWatch Enterprise | `tw-dialect` | Conversion of requests, responses and streams between Anthropic Messages, OpenAI Chat Completions, OpenAI Responses and Gemini; usage parsing |
| | `tw-guard` | Outbound redaction and restoration, inspection of the tool calls an upstream returns, hidden characters, content filtering and the output length limit |
| | `tw-breaker` | The circuit-breaker state machine |
| Domain logic | `tw-types` | Messages for people: a stable code, its arguments and the English sentence |
| | `tw-engine` | The routing rule engine and strategy groups |
| | `tw-pricing` | The public price table, price sheets, and cost in three states: measured, estimated and unpriced |
| | `tw-yaml` | Minimal edits to YAML text that keep comments and layout |
| | `tw-secret` | Environment variable interpolation, credentials from commands, and secret masking |
| | `tw-watch` | Directory watching with one signal per burst of changes |
| Control-plane contract | `tw-api` | Request and response types of the control plane, and a client |
| | `tw-link` | The handshake and encryption of the control channel (Noise `NNpsk0`) |
| Assembly | `tw-config` | Configuration schema, loading and validation |
| | `tw-store` | Request history and runtime state on SQLite and the file system |
| | `tw-observe` | The event bus |
| Data plane / control plane | `tw-gateway` | The gateway's HTTP server |
| | `tw-control` | The control-plane API over a unix socket, a loopback port on Windows, and the optional remote control port |

## Shared with ThinkWatch Enterprise

ThinkWatch Enterprise depends on the first group and nothing else: format conversion and usage parsing (`tw-dialect`), the guards (`tw-guard`) and the circuit breaker (`tw-breaker`). These three depend only on each other, which a test in `tw-dialect` enforces, and CI builds ThinkWatch Enterprise against every change to them. A component that only one product uses lives in that product's repository rather than in Core.

## Used by ThinkWatch Lite

ThinkWatch Lite bundles the `twcore` binary of a Core release and compiles `tw-api`, `tw-link`, `tw-types`, `tw-yaml`, `tw-guard` and `tw-watch` from the same tag: the app and the binary speak one control-plane protocol, so both have to come from one commit.

Configuring AI clients to use the gateway, editing their MCP servers and scanning their configuration are part of the desktop app, not of Core. They change files on the machine the app runs on, which need not be the machine that runs core. Core only issues a client its own gateway key.

## The single-machine implementation

The assembly group and the data plane and control plane form the single-machine implementation: SQLite, the local control channel and the optional remote control port. They are intentionally **not** shared. Single-machine SQLite and multi-tenant Postgres differ too much for one abstraction to serve both.

## Prices in tw-pricing

`tw-pricing` embeds a pinned snapshot of a public price table, so that a fresh installation and a machine without network access can price requests. At runtime, the control plane refreshes the table once a day unless `pricing.auto_update` is `false`, and whichever copy is newer prices requests. Price sheets in `config.yaml` apply a multiplier, or prices per model, to the upstreams that select them.

A refresh or an edited price sheet changes the price of later requests, never of those already recorded. Each request stores its cost and where the price came from, so a figure can be explained afterwards. See [The price list](/docs/core/development#the-price-list) for how the snapshot is updated.
