# ThinkWatch Lite 与 CC Switch 对比

CC Switch 与 ThinkWatch Lite 都用于把 Claude Code、Codex 等 AI 编程客户端接到不同的服务商，两者都采用 MIT 许可证。CC Switch 通过改写各客户端的配置文件切换供应商，另有可选的本地代理；ThinkWatch Lite 让客户端只接入一次本机网关，此后的切换、路由与记录都在网关中完成，发出前可以替换请求中的凭据，回答中的危险工具调用可以被切断。

## 做法的区别

CC Switch 把供应商保存在自己的数据库中。启用一个供应商时，把它的地址和密钥写入客户端的配置，例如 Claude Code 的 `~/.claude/settings.json` 中的 `env.ANTHROPIC_BASE_URL`，或 Codex 的 `~/.codex/auth.json` 与 `config.toml`。Claude Code 无需重启即可生效，其他多数客户端需要重启客户端或终端。

它的本地代理模式（手册中称为「路由」）适用于 Claude Code、Codex、Gemini CLI 与 Grok Build。为某个客户端开启后，CC Switch 把该客户端的配置改为指向本地代理（默认 `http://127.0.0.1:15721`）；此后在代理内切换供应商，不需要重启客户端；关闭代理时还原配置。代理请求日志、故障转移与格式转换都需要这一模式。

ThinkWatch Lite 在本机运行网关 ThinkWatch Core。在客户端页把每个客户端接管一次：给出完整的改动差异，备份原文件，并为该客户端分配单独的密钥。此后更换上游、调整路由规则与故障转移都在网关中进行，不再改动客户端的配置。

## 对比

表中的「—」表示该产品的文档中没有描述这项功能。

| | CC Switch | ThinkWatch Lite |
|---|---|---|
| 客户端 | Claude Code、Claude Desktop、Codex、Gemini CLI、Grok Build、OpenCode、OpenClaw、Hermes Agent、Pi、MiniMax Code | 一键接管：Claude Code、Claude Desktop、Codex（含 ChatGPT 桌面版中的 Codex）、opencode、Pi、oh-my-pi、Grok Build、Qwen Code、Hermes Agent、Zed、Aider、DeepSeek Harness；提供配置方法：Cursor、Continue、Antigravity CLI |
| 添加供应商 | 50 余个供应商预设；`ccswitch://` 链接可导入供应商、MCP 服务器、提示词与技能 | 服务类型中列有 Anthropic、OpenAI、Google Gemini、Amazon Bedrock、DeepSeek 与 Ollama，也可填写任何兼容接口；中转站或服务商可通过 `thinkwatch://import` 链接预填一个上游 |
| 路由 | 代理模式下，每个客户端的请求发往它当前的供应商；可按供应商映射模型 | 每把密钥的规则按顺序匹配模型、API 格式、输入 token、工具、图片、扩展思考等条件；规则可以改写模型 |
| 故障转移 | 按优先级排列的故障转移队列，带熔断（代理模式） | 回答开始之前尝试失败时，转到策略组中的下一个上游；同一会话默认保持在同一个上游 |
| 负载均衡 | — | 策略组：按顺序、手动选择、轮询、延迟最低、费用最低 |
| API 格式转换 | 代理模式下：Claude Code 接 OpenAI Chat Completions 或 Responses 的供应商；Codex 接 Chat Completions 或 Anthropic Messages 的供应商 | 在 Anthropic Messages、OpenAI Chat Completions、OpenAI Responses 与 Gemini 之间转换 |
| 用量与费用 | 请求数、token、缓存命中率与估算费用，数据来自代理日志或客户端的会话日志；自定义价格，可选从 models.dev 同步价格；显示订阅额度与余额 | 按区间、模型、上游统计 token、费用与请求数；价格取自每天更新的 LiteLLM 价目表或自定义价目表；估算部分单独标出，无法计价的请求单独计数 |
| 请求详情 | 供应商、模型、token、费用、耗时与状态；可查看请求参数、响应摘要与错误信息 | 命中的规则、每一次尝试及其状态、请求与响应正文、费用；可全文搜索；可在另一个上游重放 |
| 出站脱敏与工具调用审查 | — | 请求发出前把 API 密钥、私钥、身份证号与银行卡号替换为占位符；回答中含下载并执行代码、外发凭据等工具调用时切断响应。两项出厂均为「观察」，只记录、不改动 |
| MCP 与技能 | 统一的 MCP 服务器列表，同步到选定的客户端；从 GitHub 仓库或 ZIP 文件安装技能 | 并排列出 13 个客户端的 MCP 服务器，其中 4 个可复制或移除；列出技能与钩子；扫描隐藏字符、提示注入、危险命令与过宽权限 |
| 提示词 | 提示词预设写入 `CLAUDE.md`、`AGENTS.md` 或 `GEMINI.md` | — |
| 会话 | 读取客户端自己的会话文件；可搜索、在终端中恢复、删除 | 把经过网关的请求归为会话，按轮还原对话 |
| 订阅账号 | 通过其反向代理使用 ChatGPT（Codex OAuth）、GitHub Copilot 与 xAI 账号 | ChatGPT 与 Z.ai / BigModel 账号作为上游登录；不支持 Claude Pro 或 Max 订阅登录 |
| 服务器与远程 | —（代理可监听 `0.0.0.0` 供局域网访问；供应商数据可通过 Dropbox、OneDrive、iCloud 或 WebDAV 在设备间同步） | 网关以 systemd 服务运行在 Linux 服务器上，由桌面应用经加密的控制通道管理 |
| 平台 | Windows 10 及以上；macOS 12 及以上（Intel 与 Apple 芯片，已签名并经 Apple 公证）；Linux（deb、rpm、AppImage） | macOS 12 及以上（Apple 芯片）；Windows 10 21H2 及以上（x64、ARM64）；Linux（x86_64、aarch64，AppImage）；未经 Apple 或微软签名 |
| 许可证 | MIT | MIT |

## 如何选择

- **CC Switch**：只需要在几个供应商之间快速切换、希望从预设开始配置、需要统一管理多个客户端的 MCP 服务器、提示词与技能时，CC Switch 更直接。
- **ThinkWatch Lite**：需要按请求查看费用与去向、按规则路由、避免请求中的凭据落到中转站手中，或需要在服务器上运行网关时，适合 ThinkWatch Lite。

## 同时使用

两者都会写入 Claude Code 的接口地址（`~/.claude/settings.json` 中的 `env.ANTHROPIC_BASE_URL`）以及 Codex 的 `~/.codex/config.toml`。两者同时接管同一个客户端时会相互覆盖：最后一次写入决定客户端的请求发往哪里，而各自的还原会写回自己改动之前保存的值。

每个客户端只交给其中一个管理时，两者可以并存，例如由 CC Switch 管理 ThinkWatch Lite 不接管的 Gemini CLI 或 OpenClaw，由 ThinkWatch Lite 接管 Claude Code 与 Codex。把一个客户端从 CC Switch 转给 ThinkWatch Lite 时，先在 CC Switch 中关闭该客户端的代理，并停止在 CC Switch 中切换它的供应商，再到客户端页接管；转回时，先在客户端页还原。

## 说明

- 关于 CC Switch 的内容据 CC Switch 2026 年 10 月的文档，即 v3.20.4 的 README、用户手册与发布说明（[farion1231/cc-switch](https://github.com/farion1231/cc-switch)），之后的版本可能有所变化。
- 关于 ThinkWatch Lite 的内容适用于 2026.10.4 版本。

相关文档：[功能详解](/zh-CN/docs/lite/features/)、[安装与更新](/zh-CN/docs/lite/install/)、[连接远程 core](/zh-CN/docs/lite/remote-core/)、[常见问题](/zh-CN/docs/lite/faq/)。
