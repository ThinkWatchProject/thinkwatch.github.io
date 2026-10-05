# 让 Claude Code 使用 GLM、DeepSeek 或 Kimi

ThinkWatch Lite 把 Claude Code 接到本机的网关上，网关再把每个请求转发给提供所请求模型的上游。使用 GLM、DeepSeek 或 Kimi 的模型有两种做法：在 Claude Code 中直接使用模型名（`/model`，或 `settings.json` 中的模型变量），或者用路由规则把 Claude 的模型名改写为目标模型。这三个服务商都提供兼容 Anthropic 接口的地址，Claude Code 的请求无需格式转换即可发出。

## 准备

- 已[安装](/zh-CN/docs/lite/install/) ThinkWatch Lite；Claude Code 已至少运行过一次。
- 服务商的 API 密钥。GLM 也可以改用开通了 GLM Coding Plan 的 Z.ai 或 BigModel 账号在应用内登录。
- Claude Pro / Max 订阅登录不能作为上游；接管之后，Claude Code 改用网关密钥。

## 步骤

1. 在「上游」页点击「新建上游」，选择「服务类型」：
   - 「DeepSeek」：自动填入 `https://api.deepseek.com/anthropic` 和接口协议，再填写「API 密钥」。
   - GLM（API 密钥）：选「自定义」，「接口地址」填 `https://open.bigmodel.cn/api/anthropic` 或 `https://api.z.ai/api/anthropic`，「接口协议」选「Anthropic Messages」，再填写「API 密钥」。
   - GLM（账号登录）：选「Z.ai / BigModel 账号」，在「账号归属」中选择站点，勾选「已阅读上述说明，继续登录」，点击「登录」并在浏览器中完成授权。应用在该账号中创建一把名为 `thinkwatch` 的 API 密钥，并写入上游。
   - Kimi：选「自定义」，「接口地址」填 Kimi 文档给出的兼容 Anthropic 接口的地址，「接口协议」选「Anthropic Messages」。Kimi For Coding 还需打开「转发客户端身份」。

   「检测连接」验证地址与凭据并获取模型列表，不产生费用。之后点击两次「下一步」，再点击「创建」。
2. 在「客户端」页 Claude Code 一行点击「接管…」。对话框列出 `~/.claude/settings.json` 中要修改的字段：`env.ANTHROPIC_BASE_URL`、`env.ANTHROPIC_AUTH_TOKEN`（新密钥 `claude-code`）和 `env.CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY`。点击「接管」。
3. 选择指定模型的方式：
   - **直接使用模型名。**在 Claude Code 中输入 `/model <模型 ID>` 即切换到该模型，也可以用 `claude --model <模型 ID>` 启动。要让 Claude Code 的模型别名对应到该模型，在 `~/.claude/settings.json` 的 `env` 中加入以下变量；其中 Haiku 一项也用于后台任务。

     ```json
     "ANTHROPIC_DEFAULT_OPUS_MODEL": "<模型 ID>",
     "ANTHROPIC_DEFAULT_SONNET_MODEL": "<模型 ID>",
     "ANTHROPIC_DEFAULT_HAIKU_MODEL": "<模型 ID>"
     ```

     这种做法不需要路由规则：默认路由会跳过模型列表中没有该模型的上游。
   - **改写模型名。**在「路由」页打开 `default` 路由，点击「添加规则」。通过「添加条件」加入「模型」`claude-*`，再加入「密钥」`claude-code`，使其他客户端不受影响。「命中后」选「转发」，「转发至」选该上游，在「改写参数」的「模型改为」中填入目标模型 ID。点击「添加」，再点击「保存」。Claude Code 中显示的仍是 Claude 的模型名。

## 说明

- **格式转换。**Claude Code 发出的是 Anthropic Messages；接口协议同为 Anthropic Messages 时，请求按原格式发出，网关只去掉 `metadata.user_id` 等身份字段。只有上游使用其他格式时才会转换，例如兼容 OpenAI 的地址配合接口协议 OpenAI Chat Completions：此时「流量」页把该请求标为「已转换」，请求详情列出被丢弃的字段。网页搜索是服务端工具，无法转换，这类请求不会发往此类上游。「自动识别」认不出这三个服务商的地址，会按客户端的原格式转发，对 Claude Code 可用，对 Codex 这类使用其他格式的客户端则不可用。
- **转发客户端身份**默认关闭，上游看到的是 ThinkWatch 的 User-Agent，不带客户端身份。Kimi For Coding、百炼 Coding Plan 等上游只接受特定客户端；打开开关后，上游收到 Claude Code 自己的 User-Agent、`x-app` 等身份请求头和请求体中的身份字段，均为原值。
- **GLM Coding Plan。**地址在 `api.z.ai` 或 `open.bigmodel.cn` 上的上游，无论应用内登录还是手动填写密钥，都在「额度 / 计费」列和菜单栏（或托盘菜单）中显示 5 小时与每周额度，积分制套餐另外显示剩余积分。
- **`/model` 列表**只显示名称含 `claude` 或 `anthropic` 的网关模型；其他模型需要输入名称，或用 `ANTHROPIC_CUSTOM_MODEL_OPTION` 加入一项。
- **费用。**改写过模型名的请求按实际发出的模型计价。
- **「还原…」**只恢复应用写入的字段，手动加入的模型变量仍留在 `settings.json` 中。

相关文档：[功能详解](/zh-CN/docs/lite/features/)、[让 Codex 使用 Claude、Gemini 或只提供 Chat Completions 的中转](/zh-CN/docs/lite/codex-other-models/)、[让 Claude Desktop 使用第三方模型](/zh-CN/docs/lite/claude-desktop-third-party-models/)。
