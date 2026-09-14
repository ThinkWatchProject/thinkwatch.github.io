# Crate layers

Core's crates are arranged in four layers.

```
tw-types · tw-protocol · tw-provider · tw-resil · tw-crypto   ← shape fixed by the outside world
tw-engine · tw-pricing · tw-redact · tw-yaml · tw-secret      ← domain logic
tw-config · tw-store · tw-scan · tw-adopt · tw-observe        ← assembly
tw-gateway · tw-control                                       ← data plane / control plane
```

| Layer | Crates | Role |
| --- | --- | --- |
| 1 | `tw-types`, `tw-protocol`, `tw-provider`, `tw-resil`, `tw-crypto` | Shape fixed by the outside world |
| 2 | `tw-engine`, `tw-pricing`, `tw-redact`, `tw-yaml`, `tw-secret` | Domain logic |
| 3 | `tw-config`, `tw-store`, `tw-scan`, `tw-adopt`, `tw-observe` | Assembly |
| 4 | `tw-gateway`, `tw-control` | Data plane and control plane |

## The top two layers are shared

The top two layers are stable against external reality. The server edition depends on them directly.

## The bottom two layers are not

The bottom two layers are the single-machine implementation, built on SQLite and a unix socket, and they are deliberately **not** shared. Single-machine SQLite and multi-tenant Postgres are different enough that forcing one abstraction over both would serve neither.

## The price list in tw-pricing

`crates/tw-pricing` embeds a pinned price snapshot, and it is not auto-updated. Following upstream automatically would mean two builds could compute different prices, and "yesterday's number doesn't match today's" cannot be explained to a user. See [Development and tests](/docs/core/development#the-price-list) for how the snapshot is updated.
