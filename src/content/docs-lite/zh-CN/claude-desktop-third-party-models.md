# 让 Claude Desktop 使用第三方模型

ThinkWatch Lite 通过 Claude Desktop 官方的第三方推理模式接入，把本机的网关设为推理提供方。Claude Desktop 只接受形如 Claude 的模型名，因此由一条路由规则把这些名称改写为实际服务请求的模型，可以是 GLM、DeepSeek、Kimi 或其他任何上游的模型。由组织统一管理的 Claude Desktop 不做修改。

## 准备

- 已[安装](/zh-CN/docs/lite/install/) ThinkWatch Lite；Claude Desktop（macOS 或 Windows）已至少打开过一次。第三方推理模式不需要 Anthropic 账号。
- 已在「上游」页添加提供该模型的上游。GLM、DeepSeek 与 Kimi 的添加方法见[让 Claude Code 使用 GLM、DeepSeek 或 Kimi](/zh-CN/docs/lite/claude-code-other-models/)。

## 步骤

1. 在「客户端」页 Claude Desktop 一行点击「接管…」。对话框列出四个文件，macOS 上位于 `~/Library/Application Support`；Windows 上 `Claude-3p` 位于 `%LOCALAPPDATA%`，`Claude` 位于 `%APPDATA%`。

   | 文件 | 改动 |
   |---|---|
   | `Claude-3p/configLibrary/7477a7c4-1ce0-4d3a-9b1e-7477a7c40001.json` | 名为 ThinkWatch 的一份配置：`inferenceProvider` 为 `gateway`、网关地址、以 `x-api-key` 方式发送的密钥、`chatTabEnabled`，以及模型列表 `inferenceModels` |
   | `Claude-3p/configLibrary/_meta.json` | 登记 ThinkWatch 这一项，并把 `appliedId` 指向它；其他配置保持不变 |
   | `Claude-3p/claude_desktop_config.json` | 只把 `deploymentMode` 设为 `3p` |
   | `Claude/claude_desktop_config.json` | 把 `deploymentMode` 设为 `3p`；其中的 MCP 服务器保持不变 |

   `inferenceModels` 写入网关模型中名称形如 Claude 的那些：`claude-` 之后紧跟 `sonnet`、`opus`、`haiku` 或 `fable` 及版本号。一个都没有时，说明中会写明将写入 `claude-sonnet-5`，并给出一条示例规则。点击「接管」。
2. 在「路由」页打开 `default` 路由，点击「添加规则」。通过「添加条件」加入「模型」`claude-*` 和「密钥」`claude-desktop`（接管对话框中写明的密钥）。「命中后」选「转发」，「转发至」选该上游，在「改写参数」的「模型改为」中填入目标模型 ID。点击「添加」，再点击「保存」。
3. 完全退出 Claude Desktop 再重新打开。打开时如出现登录页，在登录页选择通过网关继续，只需一次。

## 说明

- **由组织统一管理。**托管配置优先于本机的一切设置：macOS 上是 `/Library/Managed Preferences` 下的 `com.anthropic.claudefordesktop.plist`，Windows 上是 `HKLM` 或 `HKCU` 下的注册表项 `SOFTWARE\Policies\Claude`。此时「客户端」页不提供「接管…」，详情中显示「这台电脑的 Claude Desktop 由组织统一管理」。
- **模型列表。**`inferenceModels` 在接管时写入，之后不提示更新。网关上的模型变化后，先「还原…」再重新接管即可刷新。
- **云服务商配置。**Claude Desktop 原本通过另一份配置使用 Amazon Bedrock、Google Cloud Agent Platform 或 Microsoft Foundry 时，对话框会说明：接管期间改用 ThinkWatch 的配置，还原时切回原配置。原配置为 Bedrock 时，还提供「新建 Bedrock 上游…」，按原来的设置预填。
- **对话与联网搜索。**该模式下的对话与原有对话分开保存。联网搜索不经过网关，需要另外配置。
- **「还原…」**把两个文件中的 `deploymentMode` 改回原值，从 `_meta.json` 中摘掉 ThinkWatch 这一项；接管前使用的配置仍在时，`appliedId` 指回它；并删除 ThinkWatch 的那份配置。
- **配置检查。**在 Claude Desktop 中换用了其他配置时，详情显示「Claude Desktop 中正在使用的是另一份配置」；`deploymentMode` 不是 `3p` 时，显示「Claude Desktop 可能仍以原有模式启动」。
- **手动配置。**同样的设置也可以在 Claude Desktop 中完成：依次打开 Help → Troubleshooting → Enable Developer Mode，然后打开 Developer → Configure Third-Party Inference；选择网关作为提供方，填入网关地址和密钥，鉴权方式设为 `x-api-key`，点击 Apply Changes。
- **费用。**改写过模型名的请求按实际发出的模型计价。

相关文档：[功能详解](/zh-CN/docs/lite/features/)、[让 Claude Code 使用 GLM、DeepSeek 或 Kimi](/zh-CN/docs/lite/claude-code-other-models/)、[安装与更新](/zh-CN/docs/lite/install/)。
