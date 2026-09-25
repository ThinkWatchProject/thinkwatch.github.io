# crate 分层

ThinkWatch Core 由十六个 crate 和一个二进制 `twcore` 组成。工作区把这些 crate 分为两部分：ThinkWatch 企业版依赖的三个 crate，以及 `twcore` 所运行网关的其余 crate（ThinkWatch 企业版不使用）。第二部分再按职责分组。

```
tw-dialect · tw-guard · tw-breaker                                   ← 与 ThinkWatch 企业版共用
tw-types · tw-engine · tw-pricing · tw-yaml · tw-secret · tw-watch   ← 领域逻辑
tw-api · tw-link                                                     ← 控制面契约
tw-config · tw-store · tw-observe                                    ← 装配
tw-gateway · tw-control                                              ← 数据面 / 控制面
```

任何 crate 都不依赖排在其所在组下方的组。

| 分组 | crate | 作用 |
| --- | --- | --- |
| 与 ThinkWatch 企业版共用 | `tw-dialect` | 请求、响应与流在 Anthropic Messages、OpenAI Chat Completions、OpenAI Responses 与 Gemini 之间的转换；用量解析 |
| | `tw-guard` | 出站脱敏与还原、上游返回的工具调用审查、隐藏字符、内容过滤与输出长度限制 |
| | `tw-breaker` | 熔断器状态机 |
| 领域逻辑 | `tw-types` | 面向用户的消息：稳定的消息码、参数与英文句子 |
| | `tw-engine` | 路由规则引擎与策略组 |
| | `tw-pricing` | 公开价目表、自定义价目表，以及实测、估算、无法计价三种状态的费用 |
| | `tw-yaml` | 对 YAML 文本做最小改动，保留注释与排版 |
| | `tw-secret` | 环境变量插值、由命令提供的凭据，以及密钥遮蔽 |
| | `tw-watch` | 目录监视，一连串改动只发一次信号 |
| 控制面契约 | `tw-api` | 控制面的请求与响应类型，以及客户端 |
| | `tw-link` | 控制通道的握手与加密（Noise `NNpsk0`） |
| 装配 | `tw-config` | 配置的结构、加载与校验 |
| | `tw-store` | 基于 SQLite 与文件系统的请求历史和运行状态 |
| | `tw-observe` | 事件总线 |
| 数据面 / 控制面 | `tw-gateway` | 网关的 HTTP 服务 |
| | `tw-control` | 控制面 API，经 unix socket、Windows 回环端口与可选的远程控制端口提供 |

## 与 ThinkWatch 企业版共用

ThinkWatch 企业版只依赖第一组：格式转换与用量解析（`tw-dialect`）、各项防护（`tw-guard`）与熔断器（`tw-breaker`）。这三个 crate 只依赖彼此，`tw-dialect` 中的一项测试保证这一点；每次改动它们，CI 都会用 ThinkWatch 企业版编译一遍。只有一个产品使用的组件放在该产品自己的仓库中，不留在 Core。

## ThinkWatch Lite 使用的部分

ThinkWatch Lite 内置 Core 发布版本中的 `twcore` 二进制，并从同一 tag 编译 `tw-api`、`tw-link`、`tw-types`、`tw-yaml`、`tw-guard` 与 `tw-watch`：应用与二进制使用同一套控制面协议，两者必须出自同一个提交。

让 AI 客户端改用网关、编辑其 MCP 服务器、扫描其配置，都属于桌面应用而非 Core：这些操作修改的是应用所在机器上的文件，而这台机器不一定运行 core。Core 只负责为客户端签发专属的网关密钥。

## 单机实现

装配组以及数据面与控制面组构成单机实现：SQLite、本地控制通道与可选的远程控制端口。它们**有意不共享**：单机 SQLite 与多租户 Postgres 差异过大，统一的抽象难以同时满足两者。

## tw-pricing 中的价目表

`tw-pricing` 内嵌一份固定的公开价目表快照，使新安装的实例与无法联网的机器也能计价。运行时，控制面每天刷新一次价目表（`pricing.auto_update` 为 `false` 时不刷新），两份价目表中较新的一份用于计价。`config.yaml` 中的自定义价目表可为选用它的上游设置倍率或逐个模型的价格。

刷新价目表或修改自定义价目表，只影响此后的请求，不改变已记录的请求。每个请求都保存其费用与价格来源，事后可据此解释数字。快照的更新方式见[价目表](/zh-CN/docs/core/development#价目表)。
