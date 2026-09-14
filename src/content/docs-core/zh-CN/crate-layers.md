# crate 分层

Core 的 crate 分为四层。

```
tw-types · tw-protocol · tw-provider · tw-resil · tw-crypto   ← 由外部约束决定
tw-engine · tw-pricing · tw-redact · tw-yaml · tw-secret      ← 领域逻辑
tw-config · tw-store · tw-scan · tw-adopt · tw-observe        ← 装配
tw-gateway · tw-control                                       ← 数据面 / 控制面
```

| 层 | crate | 作用 |
| --- | --- | --- |
| 1 | `tw-types`、`tw-protocol`、`tw-provider`、`tw-resil`、`tw-crypto` | 由外部约束决定 |
| 2 | `tw-engine`、`tw-pricing`、`tw-redact`、`tw-yaml`、`tw-secret` | 领域逻辑 |
| 3 | `tw-config`、`tw-store`、`tw-scan`、`tw-adopt`、`tw-observe` | 装配 |
| 4 | `tw-gateway`、`tw-control` | 数据面与控制面 |

## 共享层

上面两层相对外部约束保持稳定，服务端版本直接依赖这两层。

## 非共享层

下面两层为单机实现（SQLite、unix socket），**有意不共享**。单机 SQLite 与多租户 Postgres 差异过大，统一的抽象难以同时满足两者。

## tw-pricing 中的价目表

`crates/tw-pricing` 内嵌一份固定的价目表快照，**不会**自动更新。若自动跟随上游，两次构建可能计算出不同的价格，而前后两天数字不一致的情况无法向用户解释。快照的更新方式见[开发与测试](/zh-CN/docs/core/development)。
