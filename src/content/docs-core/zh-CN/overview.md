# ThinkWatch Core

ThinkWatch Core 是 ThinkWatch AI API 网关的共享核心，提供路由、转发、可观测性、成本核算以及一组数据面防护。桌面应用 [ThinkWatch Lite](/zh-CN/docs/lite) 与服务端版本均使用它。

## Core 的定位

Core 是一组 Rust crate，而非可安装的应用。如需可运行的网关，`bin/twcore` 是一个完整且可独立运行的网关二进制，用法见 [twcore 快速入门](/zh-CN/docs/core/quick-start)。

两个版本均依赖这些 crate，因此 Core 中的改动会同时影响两者。

## 功能

将客户端（如 Claude Code、Codex）指向本地端口后，Core 提供以下功能：

- **按规则路由**至不同上游。匹配条件包括模型名、客户端、上下文长度及是否携带工具；动作包括切换上游、改写参数或拒绝请求。
- **流式故障转移。** 首字节发出之前，网关可透明切换上游；流式传输开始之后，网关报告故障情况。
- **成本可见。** token 用量与缓存命中按内置价目表快照计价。无法计价的部分标记为「未知」，不会填入虚构的数值。
- **出站脱敏。** 请求发往中转站之前，其中的密钥替换为占位符；模型回显时再恢复原值。
- **入站审查。** 上游返回的工具调用按规则集审查，高危调用可在当前帧中止。

## 后续阅读

- [twcore 快速入门](/zh-CN/docs/core/quick-start)：生成、校验并启动配置。
- [crate 分层](/zh-CN/docs/core/crate-layers)：crate 的组织方式，以及哪些层共享。
- [开发与测试](/zh-CN/docs/core/development)：测试、冒烟脚本，以及改动必须遵守的规则。

## 许可证

ThinkWatch Core 采用 MIT 许可证，源码托管于 [GitHub](https://github.com/ThinkWatchProject/ThinkWatch-Core)。
