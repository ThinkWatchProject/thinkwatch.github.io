# 让 Codex 使用 Claude、Gemini 或只提供 Chat Completions 的中转

ThinkWatch Lite 把 Codex 接到本机的网关上，网关接收 OpenAI Responses API，这也是 Codex 对自定义服务商使用的唯一格式。网关在 Responses 与上游的格式之间双向转换请求和回答：Claude 用 Anthropic Messages，Gemini 用 Google Gemini，只提供 OpenAI Chat Completions 的中转用 Chat Completions。使用哪个模型，在 Codex 的配置中指定，或由路由规则改写。

## 准备

- 已[安装](/zh-CN/docs/lite/install/) ThinkWatch Lite。
- Codex 已至少运行过一次：Codex 命令行，或 ChatGPT 桌面版中的 Codex 均可。
- Anthropic、Google Gemini 或中转站的 API 密钥。

## 步骤

1. 在「上游」页点击「新建上游」，在第一步「服务类型」中选择服务，选定后直接进入「连接」：Claude 选「Anthropic」，Gemini 选「Google Gemini」，接口地址和接口协议会自动填入。中转站在「平台与中转」中选择对应的服务，其他中转站选「自定义」。「OpenRouter」自动填入地址和接口协议；选「Sub2API」「New API / One API」或「自定义」时，「接口地址」填中转站的 Base URL（不含 `/chat/completions` 等接口路径），「接口协议」选「OpenAI Chat Completions」；例如 GLM 选「自定义」，填 `https://api.z.ai/api/paas/v4`，GLM Coding Plan 填 `…/api/coding/paas/v4`。以自带版本号结尾的地址（如 `/v4`、火山方舟的 `/api/v3`），自 ThinkWatch Lite 2026.10.5 起按原样使用。填写「API 密钥」，点击「下一步」，同时检测连接。中转站不提供模型列表或没有列全时，在「模型」一节末尾的输入框中逐个填写缺少的模型 ID 并回车。再点击「下一步」，然后点击「创建」。
2. 在「客户端」页 Codex 一行点击「接管…」。对话框列出对 `~/.codex/config.toml` 的修改：

   | 字段 | 写入 |
   |---|---|
   | `model_provider` | `thinkwatch` |
   | `model_providers.thinkwatch.base_url` | 带 `/v1` 的网关地址，默认为 `http://127.0.0.1:8788/v1` |
   | `model_providers.thinkwatch.wire_api` | `responses` |
   | `model_providers.thinkwatch.experimental_bearer_token` | 新密钥 `codex` |
   | `model_providers.thinkwatch.http_headers` | `X-ThinkWatch-Client = "codex"` |
   | 同一表中的 `name`、`requires_openai_auth`、`supports_websockets` | `ThinkWatch`、`false`、`false` |

   点击「接管」，然后重新打开终端。ChatGPT 桌面版读取同一份配置文件，重新启动后生效。
3. 指定模型。接管不修改 `model`，Codex 仍会请求原来的模型。可以任选一种做法：
   - 在 `~/.codex/config.toml` 开头、第一个 `[表名]` 之前写入 `model = "<模型 ID>"`；只用一次时，运行时加 `-c model=<模型 ID>`。
   - 保留 Codex 的模型名并改写：在「路由」页打开 `default` 路由，点击「添加规则」，加入条件「模型」`gpt-*` 和「密钥」`codex`，「命中后」选「转发」，「转发至」选该上游，在「改写参数」的「模型改为」中填入目标模型 ID。点击「添加」，再点击「保存」。

## 说明

- **Codex 的内置模型表。**Codex 把自家模型的元数据（上下文窗口等）编在程序里。它不认识的模型，例如 Claude 或 Gemini 的模型，按兜底元数据运行，上下文窗口为 272,000 token，并提示「Model metadata for `<模型>` not found. Defaulting to fallback metadata; this can degrade performance and cause issues.」。模型的上下文窗口更小时，可在 `config.toml` 中用 `model_context_window` 设定 Codex 采用的窗口。网关的模型列表不会出现在 Codex 的模型选择中，因为 Codex 要求的是它自己格式的模型目录。
- **格式转换。**请求和流式回答双向转换。「流量」页把这类请求标为「已转换」，目标格式无法承载的字段被丢弃，并在请求详情中列出。网页搜索这类服务端工具只能由所属的服务商执行，转换时被丢弃。Codex 的 `wire_api` 只支持 `responses`，只提供 Chat Completions 的中转正是靠这一转换才能使用。
- **工具、历史与压缩。**自 ThinkWatch Lite 2026.10.11 起，Codex 声明的所有工具都会发给上游，包括写在输入中而不在 `tools` 里的工具，工具调用按 Codex 给出的名称返回。历史中的本地 shell 调用、工具搜索和推理强度的变更同样会转换。长会话的上下文压缩可以正常进行：由上游写出摘要，Codex 把它作为压缩结果保存，并在之后的请求中带回。OpenAI 加密的压缩结果无法由其他上游读取，带有这类内容的请求会被拒绝，并说明原因。Codex 在对话中途加入的指令留在原位，系统提示词因此每轮保持不变，提示缓存持续命中。
- **凭据。**`requires_openai_auth = false` 使 Codex 用自己的网关密钥连接网关，不发送 OpenAI 密钥或 ChatGPT 令牌。应用内登录的 ChatGPT 账号仍可同时作为 OpenAI 模型的上游：每个请求都交给模型列表中有所请求模型的上游。
- **会话。**接管前后的会话在 Codex 中分开显示。运行 `codex resume <会话 ID> -c model_provider=thinkwatch` 可以通过网关继续之前的会话。「还原…」之后，接管期间的会话仍可打开，此时直连 OpenAI。
- **费用。**改写过模型名的请求按实际发出的模型计价。Codex 不标注提示缓存断点，因此发往 Anthropic Messages 格式的上游，或 Bedrock 上 AWS 列为支持提示缓存的 Claude 模型（Claude 3.5 Sonnet v2、Claude 3.7 Sonnet 以及 Claude 4.5 起的模型）时，网关在工具、系统提示词和最后两轮用户消息处标注，每一轮都能读取上一轮写入的缓存。Bedrock 上更早的 Claude 模型（如 Sonnet 4）不标注；上游拒绝这些标注时，网关去掉标注重新发送一次。缓存写入与读取按价目表的缓存单价计费；Anthropic 的缓存写入比输入贵 25%，读取为输入的十分之一。

相关文档：[功能详解](/zh-CN/docs/lite/features/)、[让 Claude Code 使用 GLM、DeepSeek 或 Kimi](/zh-CN/docs/lite/claude-code-other-models/)、[安装与更新](/zh-CN/docs/lite/install/)。
