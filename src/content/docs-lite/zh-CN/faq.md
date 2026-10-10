# ThinkWatch Lite 常见问题

关于 ThinkWatch Lite 的常见问题与简要回答，适用于 2026.10.4 版本。详细说明见[功能详解](/zh-CN/docs/lite/features/)与[安装与更新](/zh-CN/docs/lite/install/)。

## ThinkWatch Lite 是什么？

ThinkWatch Lite 是一款桌面应用，在本机为 Claude Code、Codex 等 AI 客户端运行一个网关，支持 macOS、Windows 与 Linux。客户端只需接入网关一次，此后更换上游或模型都在网关中完成，不再改动客户端的配置。每个请求的去向与费用都有记录；请求离开本机之前可以把其中的凭据替换为占位符，回答中的危险工具调用可以在客户端执行之前切断。

## ThinkWatch Lite 免费吗？

免费。ThinkWatch Lite 及其网关 ThinkWatch Core 以 MIT 许可证开源，可免费使用、修改和再分发，商业或非商业用途均可。应用不需要注册账号。请求产生的费用由所发往的上游收取，例如 API 服务商或中转站。

## ThinkWatch Lite 支持哪些客户端？

ThinkWatch Lite 可以在客户端页一键接管 12 个客户端：Claude Code、Claude Desktop、Codex（含 ChatGPT 桌面版中的 Codex）、opencode、Pi、oh-my-pi、Grok Build、Qwen Code、Hermes Agent、Zed、Aider 与 DeepSeek Harness。Cursor、Continue 与 Antigravity CLI 提供逐步的配置方法，并为其创建密钥。

其他使用 Anthropic、OpenAI 或 Gemini 接口的客户端，可以填入网关地址（默认 `http://127.0.0.1:8788`）和密钥页中的一把密钥接入。

## ThinkWatch Lite 支持哪些平台？

ThinkWatch Lite 支持 macOS 12 及以上（Apple 芯片，不提供 Intel 芯片 Mac 的版本）；Windows 10 21H2 及以上（x64、ARM64，提供安装程序与绿色版）；Linux（x86_64、aarch64，以 AppImage 发布），需要 Ubuntu 22.04、Debian 12、Fedora 36 或更新的发行版。

在 Windows 上，安装在 WSL 中的 Claude Code 与 Codex 也可以接管，前提是 WSL 1，或使用 mirrored 网络模式的 WSL 2（需要 Windows 11 22H2 及以上、WSL 2.0.5 及以上）。

## ThinkWatch Lite 能使用 Claude Pro 或 Max 订阅吗？

不能。ThinkWatch Lite 不支持 Claude 订阅账号登录，网关也会拒绝配置中的 Claude 订阅登录凭据。Claude Code 被接管后，请求使用网关密钥发出，不再使用 Claude Code 中登录的订阅；在客户端页还原 Claude Code 后，它恢复使用自己的登录。

经由网关，Claude Code 可以使用 Anthropic API 密钥、Amazon Bedrock、中转站、ChatGPT 账号，或经 API 格式转换使用其他服务商的模型。

## ThinkWatch Lite 能使用中转站和 GLM、Kimi、通义千问、DeepSeek 等国产模型吗？

能。任何提供 Anthropic、OpenAI 或 Gemini 接口的服务都可以作为上游：在上游页点击「新建上游」，「服务类型」选择「自定义」，填写「接口地址」与「API 密钥」。「服务类型」中列有 DeepSeek、OpenRouter、Sub2API 与 New API / One API；Z.ai 或 BigModel 账号可以直接在应用内登录，并显示 GLM Coding Plan 的额度。

Kimi For Coding、百炼 Coding Plan 等只接受特定客户端的上游，需要在该上游的连接设置中打开「转发客户端身份」，否则请求以 ThinkWatch 的身份发出。中转站的价格与官方不同时，可以使用自定义价目表；路由规则可以改写客户端请求的模型名，此时按发出的模型名计价。

## ThinkWatch Lite 与 CC Switch 有什么区别？

CC Switch 通过改写各客户端的配置文件切换供应商，并统一管理各客户端的 MCP 服务器、提示词与技能。ThinkWatch Lite 让客户端只接入一次本机网关，由网关对每个请求进行路由、记录与计价，并可以在请求发出前替换凭据、切断回答中的危险工具调用。详细对比见 [ThinkWatch Lite 与 CC Switch 对比](/zh-CN/docs/lite/compare-cc-switch/)。

## ThinkWatch Lite 会修改客户端的配置吗？如何还原？

ThinkWatch Lite 只在客户端页接管客户端时修改它的配置，且只修改指向网关所需的设置。写入之前，页面给出完整的改动差异，并完整备份原文件。对某个客户端选择「还原…」，或选择「全部还原…」，即可写回原来的值。

删除应用之前应先在「设置 › 完全卸载」中卸载，它会还原所有已接管的客户端：直接把应用移到废纸篓，或直接删除 AppImage、绿色版文件夹，都不会还原客户端的配置。

## ThinkWatch Lite 的数据保存在哪里？会连接哪些地址？

配置、密钥与请求记录都保存在本机：macOS 与 Linux 在 `~/.thinkwatch`，Windows 安装版在 `%APPDATA%\ThinkWatch`，Windows 绿色版在程序旁边的 `data\` 文件夹。网关默认只监听本机 `127.0.0.1` 的 8788 端口。

除了转发请求时连接所配置的上游，ThinkWatch Lite 还会连接 GitHub 检查更新，并每天更新一次 LiteLLM 公开的价目表。登录 ChatGPT 或 Z.ai 账号时会打开它们的授权页面；只有配置了远程 core 时才会连接远程 core。

## ThinkWatch Lite 会收集使用数据吗？

不会。ThinkWatch Lite 不含任何统计或遥测代码，不向项目发送任何使用情况。检查更新时从项目的 GitHub release 页面下载一份很小的版本清单，GitHub 会像对待其他下载一样计入下载次数；在「设置 › 关于」中关闭「自动检查新版本」即可停止自动检查。「设置 › 关于」中生成的诊断包保存在本机，其中的密钥与地址已脱敏，只有在用户主动提供时才会离开本机。

## ThinkWatch Lite 的安装包为什么没有签名？如何校验？

ThinkWatch Lite 未经 Apple 注册开发者签名，Windows 版本也未经代码签名，因此首次打开需要多一步操作。通过 Homebrew 安装时，cask 会自动移除 macOS 的隔离属性；从磁盘映像安装时，执行 `xattr -dr com.apple.quarantine "/Applications/ThinkWatch Lite.app"`，或在首次打开被拒绝后，于「系统设置 › 隐私与安全性」中点击「仍要打开」。Windows 上 SmartScreen 显示警告时，依次点击「更多信息」「仍要运行」。

[release 页面](https://github.com/ThinkWatchProject/ThinkWatch-Lite/releases/latest)上的每个文件旁都附有 `.sha256` 文件，macOS 上用 `shasum -a 256 -c`、Linux 上用 `sha256sum -c` 校验，Windows 上与 `Get-FileHash` 的输出核对。应用内更新下载的文件用编译进应用的公钥验签；源代码也可以在本机自行构建。

## 在 ThinkWatch Lite 中切换上游会丢失 Codex 的会话吗？

不会。ThinkWatch Lite 只写入一次 Codex 的配置，其中的 model provider 名为 `thinkwatch`，指向网关；此后更换上游都在网关中进行，每个会话记录的 provider 不变，仍留在 Codex 的会话列表中。接管之前的会话单独显示，可以用 `codex resume <会话 ID> -c model_provider=thinkwatch` 通过网关继续。

对话中途换到另一个上游时，前一个账号封存的推理内容新上游无法读取。新上游因此拒绝请求时，网关去掉这部分封存的推理并重发一次，对话中的消息与工具调用都保留，对话得以继续。

## ThinkWatch Lite 能部署在服务器上吗？

网关可以。ThinkWatch Core 以 systemd 服务运行在 Linux 上（x86_64 或 aarch64，glibc 2.35 及以上，例如 Ubuntu 22.04、Debian 12）。桌面应用在「设置 › 连接」中选择「添加远程连接」即可连接它，控制通道经 Noise 握手加密和认证，连接后显示该服务器的流量、费用与配置。其他机器上的客户端需手动填入服务器的网关地址和一把网关密钥。详见[服务器部署](/zh-CN/docs/core/server-deployment/)与[连接远程 core](/zh-CN/docs/lite/remote-core/)。

## ThinkWatch Lite 如何更新和卸载？

ThinkWatch Lite 启动两分钟后检查一次新版本，此后每天检查一次。从 release 页面下载安装的，点击一次即可完成更新：应用校验下载的文件，等待进行中的请求结束后重新启动。通过 Homebrew 安装的，改用 Homebrew 更新：`brew update && brew upgrade --cask thinkwatch-lite`。

卸载时先在「设置 › 完全卸载」中卸载，它会还原已接管的客户端、取消开机启动，并可同时删除数据目录；之后在 macOS 上把应用移到废纸篓，在 Linux 上删除 AppImage，在 Windows 绿色版上删除整个文件夹。Windows 安装版也可以通过系统卸载，卸载程序会先完成同样的还原。

相关文档：[功能详解](/zh-CN/docs/lite/features/)、[安装与更新](/zh-CN/docs/lite/install/)、[ThinkWatch Lite 与 CC Switch 对比](/zh-CN/docs/lite/compare-cc-switch/)、[连接远程 core](/zh-CN/docs/lite/remote-core/)。
