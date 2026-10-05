# 让 Codex 使用 Claude、Gemini 或只提供 Chat Completions 的中转

ThinkWatch Lite 把 Codex 接到本机的网关上，网关接收 OpenAI Responses API，这也是 Codex 对自定义服务商使用的唯一格式。网关在 Responses 与上游的格式之间双向转换请求和回答：Claude 用 Anthropic Messages，Gemini 用 Google Gemini，只提供 OpenAI Chat Completions 的中转用 Chat Completions。使用哪个模型，在 Codex 的配置中指定，或由路由规则改写。

## 准备

- 已[安装](/zh-CN/docs/lite/install/) ThinkWatch Lite。
- Codex 已至少运行过一次：Codex 命令行，或 ChatGPT 桌面版中的 Codex 均可。
- Anthropic、Google Gemini 或中转站的 API 密钥。

## 步骤

1. 在「上游」页点击「新建上游」，选择「服务类型」：Claude 选「Anthropic」，Gemini 选「Google Gemini」，接口地址和接口协议会自动填入。中转站选「自定义」，「接口地址」填它的 Base URL（不含 `/chat/completions` 等接口路径），「接口协议」选「OpenAI Chat Completions」；例如 GLM 填 `https://api.z.ai/api/paas/v4`，GLM Coding Plan 填 `…/api/coding/paas/v4`。以自带版本号结尾的地址（如 `/v4`、火山方舟的 `/api/v3`），自 ThinkWatch Lite 2026.10.5 起按原样使用。填写「API 密钥」，点击「检测连接」，再点击「下一步」。中转站不提供模型列表时，在「手动清单」中每行填写一个模型 ID。再点击「下一步」，然后点击「创建」。
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
- **凭据。**`requires_openai_auth = false` 使 Codex 用自己的网关密钥连接网关，不发送 OpenAI 密钥或 ChatGPT 令牌。应用内登录的 ChatGPT 账号仍可同时作为 OpenAI 模型的上游：每个请求都交给模型列表中有所请求模型的上游。
- **会话。**接管前后的会话在 Codex 中分开显示。运行 `codex resume <会话 ID> -c model_provider=thinkwatch` 可以通过网关继续之前的会话。「还原…」之后，接管期间的会话仍可打开，此时直连 OpenAI。
- **费用。**改写过模型名的请求按实际发出的模型计价。

相关文档：[功能详解](/zh-CN/docs/lite/features/)、[让 Claude Code 使用 GLM、DeepSeek 或 Kimi](/zh-CN/docs/lite/claude-code-other-models/)、[安装与更新](/zh-CN/docs/lite/install/)。
