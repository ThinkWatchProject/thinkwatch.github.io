# crate 分层

Core 的 crate 分成四层。

```
tw-types · tw-protocol · tw-provider · tw-resil · tw-crypto   ← 形状由外部现实决定
tw-engine · tw-pricing · tw-redact · tw-yaml · tw-secret      ← 领域逻辑
tw-config · tw-store · tw-scan · tw-adopt · tw-observe        ← 装配
tw-gateway · tw-control                                       ← 数据面 / 控制面
```

| 层 | crate | 作用 |
| --- | --- | --- |
| 1 | `tw-types`、`tw-protocol`、`tw-provider`、`tw-resil`、`tw-crypto` | 形状由外部现实决定 |
| 2 | `tw-engine`、`tw-pricing`、`tw-redact`、`tw-yaml`、`tw-secret` | 领域逻辑 |
| 3 | `tw-config`、`tw-store`、`tw-scan`、`tw-adopt`、`tw-observe` | 装配 |
| 4 | `tw-gateway`、`tw-control` | 数据面与控制面 |

## 上面两层是共用的

上面两层对外部稳定，服务端版本直接依赖它们。

## 下面两层不共用

下面两层是单机的实现（SQLite、unix socket），**有意不共用**。单机 SQLite 和多租户 Postgres 差得太远，强行统一只会造出一个两边都别扭的抽象。

## tw-pricing 里的价目表

`crates/tw-pricing` 内嵌一份固定的价目表快照，**不会**自动更新。自动跟随上游意味着两次构建可能算出不同的价格，而「昨天的数和今天的对不上」是没法向用户解释的。快照如何更新，见[开发与测试](/zh-CN/docs/core/development)。
