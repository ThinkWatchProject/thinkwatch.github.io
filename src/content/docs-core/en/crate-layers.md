# Crate layers

Core's crates are organised into four layers.

```
tw-types · tw-protocol · tw-provider · tw-resil · tw-crypto   ← defined by external constraints
tw-engine · tw-pricing · tw-redact · tw-yaml · tw-secret      ← domain logic
tw-config · tw-store · tw-scan · tw-adopt · tw-observe        ← assembly
tw-gateway · tw-control                                       ← data plane / control plane
```

| Layer | Crates | Role |
| --- | --- | --- |
| 1 | `tw-types`, `tw-protocol`, `tw-provider`, `tw-resil`, `tw-crypto` | Defined by external constraints |
| 2 | `tw-engine`, `tw-pricing`, `tw-redact`, `tw-yaml`, `tw-secret` | Domain logic |
| 3 | `tw-config`, `tw-store`, `tw-scan`, `tw-adopt`, `tw-observe` | Assembly |
| 4 | `tw-gateway`, `tw-control` | Data plane and control plane |

## Shared layers

The top two layers remain stable with respect to external constraints. The server edition depends on them directly.

## Unshared layers

The bottom two layers form the single-machine implementation, built on SQLite and a unix socket, and are intentionally **not** shared. Single-machine SQLite and multi-tenant Postgres differ too much for one abstraction to serve both.

## Price list in tw-pricing

`crates/tw-pricing` embeds a pinned price snapshot that is not updated automatically. Tracking upstream automatically would allow two builds to compute different prices, and a discrepancy between one day's figures and the next could not be explained to users. See [Development and tests](/docs/core/development#the-price-list) for the snapshot update procedure.
