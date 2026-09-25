# ThinkWatch Core

ThinkWatch Core 是 ThinkWatch 各产品共用的网关引擎，由一组采用 MIT 许可证的 Rust crate 和独立运行的 AI API 网关二进制 `twcore` 组成。`twcore` 是桌面应用 [ThinkWatch Lite](/zh-CN/docs/lite) 内置的网关，也可以作为 systemd 服务独立运行在 Linux 服务器上。ThinkWatch 企业版依赖其中的三个 crate：`tw-dialect`、`tw-guard` 与 `tw-breaker`。

## Core 的定位

Core 是一组 crate 和一个二进制，而非桌面应用。在桌面上，`twcore` 随 ThinkWatch Lite 提供，无需单独安装；在服务器上，一条命令即可将其安装为服务，再由 macOS、Windows 或 Linux 上的 ThinkWatch Lite 连接，见[服务器部署](/zh-CN/docs/core/server-deployment)。预编译二进制、从源码构建与初始配置见 [twcore 快速入门](/zh-CN/docs/core/quick-start)。

Core 中的改动会影响所有使用它的产品，因此每个改动都须遵守[开发与测试](/zh-CN/docs/core/development)中的规则。

## 功能

Claude Code、Codex 等客户端把请求发往网关后，Core 提供以下功能：

- **按规则路由。** 规则按模型、网关密钥、输入规模、是否携带工具或图片等请求属性匹配，将请求发往某个上游或策略组、改写其参数，或拒绝请求。客户端与上游的接口格式不同时，请求在 Anthropic Messages、OpenAI Chat Completions、OpenAI Responses 与 Gemini 之间转换。
- **流式故障转移。** 首字节到达客户端之前，出错的上游由下一个上游替换，客户端无从察觉；此后发生的故障如实报告。熔断器使持续出错的上游暂不接收请求。
- **费用核算。** token 用量与缓存命中按公开价目表计价（控制面每天刷新一次），或按配置中的价目表计价；每个请求都记录费用及价格来源。估算的金额另行标注，无法计价的用量标记为「未知」，不会填入虚构的数值。
- **出站脱敏。** 请求发出之前，其中的凭据替换为占位符；模型回显时再恢复原值。
- **工具调用审查。** 上游返回的工具调用按规则集审查，高危调用可在流式传输中途截断。它与隐藏字符检查、内容规则和输出长度限制合为五项防护，每项可设为 `off`、`observe` 或 `enforce`。
- **加密的控制面。** 桌面应用与 `twcore` 命令通过本地 socket（Windows 上为回环端口）连接 core，开启后也可经远程控制端口连接。每条控制连接都先以 `listen.control.key` 完成 Noise 握手，不使用证书。

## 后续阅读

- [twcore 快速入门](/zh-CN/docs/core/quick-start)：获取二进制，生成并校验配置，将客户端指向网关。
- [服务器部署](/zh-CN/docs/core/server-deployment)：在 Linux 上以 systemd 服务运行 `twcore`，并由 ThinkWatch Lite 连接。
- [配置手册](/zh-CN/docs/core/configuration)：`config.yaml` 的每个字段。
- [crate 分层](/zh-CN/docs/core/crate-layers)：crate 的分组方式，以及各产品分别使用哪些 crate。
- [开发与测试](/zh-CN/docs/core/development)：测试、冒烟脚本、发布流程，以及每个改动都须遵守的规则。

## 许可证

ThinkWatch Core 采用 MIT 许可证，源码托管于 [GitHub](https://github.com/ThinkWatchProject/ThinkWatch-Core)。
