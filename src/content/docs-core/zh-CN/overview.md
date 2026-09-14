# ThinkWatch Core

ThinkWatch Core 是一个本地 AI API 网关的共用核心层：路由、转发、观测、计价，以及一组数据面的安全守卫。桌面版 [ThinkWatch Lite](/zh-CN/docs/lite) 和服务端版本都用它。

## Core 是什么，不是什么

Core 不是一个装上就能用的应用，它是一组 Rust crate。想要跑得起来的东西，`bin/twcore` 是一个完整的、可独立运行的网关二进制；用法见[用 twcore 快速上手](/zh-CN/docs/core/quick-start)。

两个版本都依赖这些 crate，所以 Core 里的一处改动会同时影响两边。

## 它做什么

把客户端（Claude Code、Codex 之类）指向本地的一个端口，然后 Core 会：

- **按规则路由**到不同上游。条件可以是模型名、客户端、上下文长度、有没有工具调用；动作是换上游、改参数，或者直接拒绝。
- **流式故障转移。** 首字节之前可以透明地换一家上游；首字节之后，唯一诚实的做法是如实报告发生了什么。
- **看得见成本。** token 用量、缓存命中，按内置价目表快照计价。算不出价钱的明确标「未知」，而不是编一个数字。
- **出站脱敏。** 发给中转站之前，把请求里的密钥换成占位符；模型回显时再换回来。
- **入站审查。** 上游返回的工具调用过一遍规则，高危的可以在那一帧上切断。

## 接下来

- [用 twcore 快速上手](/zh-CN/docs/core/quick-start)：生成、校验并启动一份配置。
- [crate 分层](/zh-CN/docs/core/crate-layers)：crate 如何组织，哪些层是共用的。
- [开发与测试](/zh-CN/docs/core/development)：测试、冒烟脚本，以及改动必须守住的规则。

## 许可

ThinkWatch Core 采用 MIT 许可，源码在 [GitHub](https://github.com/ThinkWatchProject/ThinkWatch-Core)。
