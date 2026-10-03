# ThinkWatch 企业版

ThinkWatch 企业版是面向组织自托管的 AI API 与 MCP 网关。组织内的每一次模型请求和 MCP 工具调用都经过同一个网关：以组织的身份系统认证，按限流与预算检查，经安全防护审查，核算费用并写入审计日志。它在 AI 访问中的作用，相当于堡垒机在服务器访问中的作用。

> 可用 Docker Compose 或 Kubernetes Helm Chart [部署](/zh-CN/docs/deployment-guide)。客户端只需访问网关端口 3000；控制台端口 3001 提供管理界面与管理 API，应置于 VPN 或防火墙之后。

## 要点

- **MCP 工具调用以真实用户身份执行。** 每位用户连接自己的 GitHub、Notion、Linear、Slack、Atlassian 等账号，上游自身的审计日志因此能记录到具体操作人。每个工具可以按角色和按 API Key 授权。
- **每个请求都经过安全防护。** 凭据和个人信息可在请求发往上游前替换为占位符，并在回答中还原；模型返回的危险工具调用可在客户端执行前切断。内容过滤可拒绝提示词注入，或删除调用方发送内容中的隐藏字符；各项防护出厂为观察档，只记录。
- **身份来自组织目录。** 登录可对接任意 OIDC 提供商，并可启用 TOTP 两步验证。五个内置角色与自定义角色决定每个人可用的模型、工具和管理页面。
- **AI 与 MCP 共用一把密钥。** `tw-` 虚拟密钥可限定用于 AI 网关、MCP 网关或两者。密钥只以哈希形式保存，轮换时保留宽限期。
- **限流与预算。** 一分钟到一周的滑动窗口限制请求数或 token 数，按日、周、月的预算控制总用量。两者均可设置在用户、API Key 或角色上。
- **可用于财务核算的费用统计。** 费用按模型、用户、上游和成本中心汇总，可导出 CSV 分摊报表。月末费用另有预测。
- **审计记录存入 ClickHouse。** 每一次模型请求和工具调用都记录用户、参数、响应、延迟与错误。审计事件可通过 Syslog、Kafka 或签名 Webhook 转发至 SIEM。
- **所有客户端共用一个入口。** OpenAI Chat Completions、OpenAI Responses、Anthropic Messages 与 Gemini 请求在同一端口提供，并转换为上游所用的格式。路由按权重、延迟或健康状况分配流量，熔断器将持续出错的上游移出轮转。

## 阅读顺序

1. [架构设计](/zh-CN/docs/architecture)：双端口模型、请求生命周期与数据流。
2. [部署指南](/zh-CN/docs/deployment-guide)：Docker Compose、Helm Chart、TLS 与生产环境加固。
3. [配置说明](/zh-CN/docs/configuration)：环境变量与系统设置。
4. [安全模型](/zh-CN/docs/security)：认证、加密、RBAC 与加固清单。

ThinkWatch 企业版在 Business Source License 1.1 下源码开放：非生产环境免费，生产环境在月度阈值以内免费，详见[定价](/zh-CN/pricing)。
