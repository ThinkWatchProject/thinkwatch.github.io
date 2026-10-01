// Single source of truth for all translatable copy.
// Add new strings here, then reference via `t(lang).section.key`.

export type Lang = "en" | "zh-CN";

const dict = {
  en: {
    common: {
      getStarted: "Get started",
      githubLink: "View on GitHub →",
      copy: "Copy",
      copied: "Copied ✓",
      skipToContent: "Skip to content",
    },

    nav: {
      thinkwatch: "Enterprise",
      lite: "Lite",
      core: "Core",
      pricing: "Pricing",
      how: "How it works",
      features: "Features",
      mcp: "MCP",
      console: "Console",
      quickstart: "Quick start",
      docs: "Docs",
      changelog: "Changelog",
      githubShort: "GitHub →",
    },


    compatible: {
      label: "Drop-in compatible with",
    },

    problem: {
      eyebrow: "Challenges",
      title: "AI adoption without ",
      titleHighlight: "governance",
      sub: "As AI agents are adopted across engineering teams, organizations face increasing governance requirements.",
      pains: [
        { icon: "key", title: "Unmanaged API keys", body: "Keys are hardcoded in .env files, shared over chat, and rarely rotated." },
        { icon: "eye", title: "Limited visibility", body: "No record of which user called which model, how many tokens were consumed, or at what cost." },
        { icon: "shield", title: "No access control", body: "Every developer has direct access to every model and MCP tool." },
        { icon: "audit", title: "Compliance gaps", body: "AI-assisted code generation and data access leave no audit trail." },
        { icon: "cost", title: "Unattributed costs", body: "Monthly AI spend cannot be explained or attributed to users or teams." },
      ],
      footer: ["ThinkWatch addresses these issues with a ", "single deployment", "."],
    },

    how: {
      eyebrow: "How it works",
      title: "All AI requests pass through ",
      titleHighlight: "a single gateway",
      sub: "A drop-in replacement for the OpenAI and Anthropic SDKs. Agents keep their existing code and change only the base URL to point at ThinkWatch.",
      callersLabel: "Callers",
      upstreamsLabel: "Upstreams",
      gatewayPort: "Gateway :3000",
      gatewayName: "ThinkWatch",
      gatewayTagline: "AI API + MCP proxy",
      pipelineLabel: "Inside the request lifecycle",
      pipeline: [
        { step: "01", label: "Authenticate", body: "The `tw-` API key is looked up in PostgreSQL by its hash and identifies the user it belongs to." },
        { step: "02", label: "Authorize", body: "The models and MCP tools allowed come from the user's roles, including roles inherited from teams, narrowed by the key's own allowlist." },
        { step: "03", label: "Rate-limit", body: "Request-count limits for the user and the key are checked in Redis sliding windows, and a request is refused once a budget is used up." },
        { step: "04", label: "Route & convert", body: "Provider selected; request format converted (Anthropic ⇄ OpenAI ⇄ Bedrock ⇄ Gemini)." },
        { step: "05", label: "Stream & meter", body: "The response streams back to the client as it arrives; token usage is read from it and priced." },
        { step: "06", label: "Audit", body: "Every call written to ClickHouse and optionally forwarded to a SIEM." },
      ],
    },

    features: {
      eyebrow: "Features",
      title: "Gateway, MCP proxy, RBAC, and analytics ",
      titleHighlight: "in one binary",
      sub: "The gateway, the MCP proxy, and the admin API run as a single Rust binary backed by PostgreSQL, Redis, and ClickHouse, without separate microservices or glue code.",
      modules: [
        {
          id: "ai-gateway",
          label: "AI API Gateway",
          tagline: "A single port for all supported models, with drop-in compatibility.",
          bullets: [
            { title: "Multi-format proxy", body: "OpenAI Chat Completions, OpenAI Responses, Anthropic Messages, and Gemini APIs on a single port. Cursor, Continue, Cline, Claude Code, and the official SDKs connect by changing only the base URL." },
            { title: "Per-model routing: automatic or manual", body: "Each model has its own routing setting. Automatic modes weight upstreams by latency, by success rate, or by both combined (the default); manual mode splits traffic by fixed weights set on a drag bar. A circuit breaker takes failing upstreams out of rotation, a request that fails with a retryable error is sent to another upstream, and the console shows live health for every route." },
            { title: "Multiple providers and a model-level kill switch", body: "OpenAI, Anthropic, Google Gemini, Azure OpenAI, AWS Bedrock, or any OpenAI-compatible endpoint, with automatic format conversion. A single model can be paused without disabling the whole provider, and every request log records the upstream model that actually served the request." },
            { title: "Virtual API keys", body: "Each tw- key belongs to one user and can be limited to the AI gateway, the MCP gateway, the admin API, or any combination, and tagged with a cost center. Keys support expiry, inactivity timeouts, and rotation with a grace period in which the old key keeps working; revoked and disabled keys are listed on a separate tab. The plaintext is shown once, and only a hash is stored." },
            { title: "Rate limits & budgets", body: "Sliding windows from one minute to one week limit requests or tokens, and daily, weekly, or monthly budgets cap token use, weighted per model. Both attach to users, API keys, or roles and apply to MCP tool calls as well as model requests. Request counts are checked before a request; tokens and budgets are counted after the response, and once a budget is used up further requests are refused. If Redis is unavailable, limits are skipped by default; a setting makes the gateway refuse requests instead." },
            { title: "Cost reporting", body: "Each request is priced from a platform-wide per-token price and per-model weights. Spend is reported by model, user, provider, and cost center and can be filtered by team, with CSV chargeback reports and a month-end forecast. Budget alerts at 50%, 80%, 95%, and 100% are written to the audit log once per period." },
            { title: "Management API & OpenAPI", body: "API keys, users, providers, and settings can be managed through the admin API, using a tw- key that is allowed to call it. An OpenAPI specification describes the endpoints, so scripts and CI pipelines can manage key lifecycles without the console." },
          ],
        },
        {
          id: "mcp-gateway",
          label: "MCP Gateway",
          tagline: "Per-user OAuth, single-step onboarding, and audit logging for every call.",
          bullets: [
            { title: "Per-user upstream credentials", body: "Each developer connects GitHub, Notion, Linear, Slack, or Atlassian under their own identity through OAuth or a personal token, so the upstream audit trail is not obscured by a shared service account. The same MCP endpoint serves each user's data with that user's own credentials." },
            { title: "OAuth onboarding from a server URL", body: "When an MCP server URL is pasted, ThinkWatch discovers its OAuth endpoints and, where the upstream supports Dynamic Client Registration, registers itself, with no manual app registration in each developer portal. A 401 or 403 response to an anonymous probe is treated as a sign that sign-in is required rather than as a failure." },
            { title: "MCP Store templates", body: "The MCP Store ships 37 ready-made templates for common MCP servers, among them GitHub, Notion, Atlassian, and Stripe. Installing a template fills in the server address and sign-in method. A user can connect several accounts to one server, such as personal and work GitHub, and pin each API key to one of them." },
            { title: "Tool-level RBAC and per-user catalogs", body: "Roles and API keys decide which MCP tools can be listed and called, down to a single tool or all tools of one server. Each user's tool list reflects what their own upstream account can access." },
            { title: "Connection testing", body: "Each connected account on the Connections page can be tested against the upstream server, and a newly saved personal token is verified as soon as it is saved." },
            { title: "Scoped audit logging and caching", body: "Every tool call is logged in ClickHouse with caller, arguments, and result. Responses from servers that use per-user credentials are cached per user and per account, never shared. Server addresses that point to private or loopback networks are rejected, and rate limits apply to tool calls." },
            { title: "Streamed tool results", body: "Clients that accept event streams on tools/call receive each upstream event, including progress notifications and the final result, as it arrives. Other clients receive a single JSON response. In both cases the audit record holds the full sequence of events." },
          ],
        },
        {
          id: "security",
          label: "Security & Compliance",
          tagline: "Defense in depth by default.",
          bullets: [
            { title: "Dual-port architecture", body: "Gateway (:3000, public-facing) and console (:3001, internal-only) on separate ports. Only the gateway should be reachable from the internet." },
            { title: "Custom roles and SSO/OIDC", body: "Five built-in roles, from Super Admin to Viewer, and any number of custom roles. A new role can start from an existing one, its policy can be edited as JSON in the console, and every change is kept in the role's history. A role can also be granted for a single team. Sign-in works with Zitadel, Okta, Azure AD, or any OIDC provider, with optional TOTP." },
            { title: "AES-256-GCM at rest", body: "Provider keys, MCP tokens, and other upstream secrets are encrypted at rest with AES-256-GCM. Virtual API keys are stored as HMAC-SHA256 hashes, and the plaintext is shown only once." },
            { title: "HttpOnly cookie sessions", body: "Access and refresh tokens are stored in HttpOnly cookies, which JavaScript cannot read. Each console session also signs its requests with a key bound to the IP address it signed in from, so a stolen cookie cannot be replayed from a different network." },
            { title: "Content filtering & PII redaction", body: "Deny rules check the caller's messages, including built-in rules for common prompt-injection phrases, and each rule blocks, warns, or logs. PII such as email addresses, phone numbers, and card numbers is replaced with placeholders before a request goes upstream and restored in the answer. Rules and patterns can be tried out in the console." },
            { title: "Distroless containers", body: "The server image holds one statically linked binary on a distroless base, with no shell. The server refuses to start with a JWT secret shorter than 32 characters, and deleted users, keys, and providers are purged after 30 days." },
            { title: "Model allowlists on every API", body: "A request may use only the models allowed by both the API key's allowlist and the user's roles. The same check applies to OpenAI Chat Completions, OpenAI Responses, Anthropic Messages, and Gemini requests, so no API bypasses it." },
          ],
        },
        {
          id: "observability",
          label: "Observability",
          tagline: "Metrics, audit logs, and real-time monitoring for AI traffic.",
          bullets: [
            { title: "Prometheus metrics", body: "When a metrics token is configured, the console port serves /metrics behind bearer authentication, with counters for rate-limit and budget refusals, cache hits, audit pipeline health, and more." },
            { title: "ClickHouse audit logs", body: "Logs of all API calls and tool calls are stored in ClickHouse, a columnar database, where they can be queried with SQL." },
            { title: "Multi-channel forwarding", body: "UDP/TCP Syslog (RFC 5424), Kafka through a REST proxy, and HTTP webhooks with optional HMAC signatures route audit events to any SIEM, data lake, or alerting pipeline." },
            { title: "Health & readiness", body: "/health/live, /health/ready (which checks PostgreSQL, Redis, ClickHouse, and at least one active provider), and /api/health with per-dependency latency and connection-pool statistics." },
            { title: "Unified log explorer", body: "Search audit, gateway, MCP, access, and application logs from a single page. Each cell offers buttons to filter on or exclude its value, -key:value excludes a value in the query, and the query is kept in the URL." },
            { title: "Live dashboard", body: "The console overview receives live data over a WebSocket: requests per minute, each provider's latency, success rate, and circuit-breaker state, the most active users, and the latest requests, without a page refresh." },
            { title: "Full-body audit capture", body: "By default, request and response bodies of gateway calls, and the arguments and results of MCP tool calls, are stored in ClickHouse with each log row, compressed and kept for their own retention period. PII redaction before storage can be turned on. Bodies above the inline size limit are moved to S3-compatible storage such as MinIO or the bundled RustFS. Auditors read bodies in the log detail panel or search across them; access requires the separate logs:read_bodies permission." },
          ],
        },
        {
          id: "teams",
          label: "Teams",
          tagline: "Users grouped into teams for delegated administration and reporting.",
          bullets: [
            { title: "Teams and members", body: "Administrators create teams and add users to them. A user can belong to several teams." },
            { title: "Team-scoped roles", body: "A role can be granted to a user for one team only. Its team permissions, such as managing members and reading usage and cost analytics, then cover that team alone, and it grants no administrative rights over platform-wide resources such as providers, models, MCP servers, settings, or roles. The built-in Team Manager role is intended for this." },
            { title: "Roles inherited from a team", body: "A role can also be assigned to a team as a whole, and every member of the team receives it." },
            { title: "Analytics by team", body: "Usage and cost analytics can be filtered by team. A user whose analytics permission is granted for specific teams sees only the members of those teams." },
          ],
        },
      ],
    },

    mcpAdvantage: {
      eyebrow: "MCP gateway",
      title: "Built for organizations, ",
      titleHighlight: "not single users",
      sub: "Most MCP gateways are designed for a single user with one shared service account. ThinkWatch is designed for organizations in which each developer authenticates upstream under their own identity, each tool call is audited back to a specific person, and the entire system runs inside the organization's network.",
      tableTitle: "MCP gateway comparison",
      tableNote: "SaaS gateways = hosted MCP gateways, where traffic leaves your network and upstream access is typically shared. DIY = mcp-proxy or homegrown shims. Individual products vary; check the one you are evaluating.",
      legendShared: "shared account",
      legendPartial: "partial",
      legendLimited: "limited",
      legendHostedOnly: "hosted-only",
      legendSaas: "SaaS-only",
      legendVaries: "varies",
      legendEnglish: "English-only",
      legendProprietary: "varies by vendor",
      legendOss: "OSS",
      columns: ["Capability", "ThinkWatch", "SaaS gateways", "DIY mcp-proxy"],
      rows: [
        { label: "Per-user upstream OAuth (no shared service account)", values: ["yes", "shared", "no"] },
        { label: "Onboarding from a server URL via Dynamic Client Registration", values: ["yes", "partial", "no"] },
        { label: "Tool-level RBAC and per-user tool catalogs", values: ["yes", "limited", "no"] },
        { label: "Full audit trail in ClickHouse (queryable, forwardable)", values: ["yes", "hosted-only", "no"] },
        { label: "Response cache kept separate per user and account", values: ["yes", "n/a", "no"] },
        { label: "Self-hosted, single Rust binary, distroless", values: ["yes", "saas", "varies"] },
        { label: "Bilingual UI out of the box (English + 中文)", values: ["yes", "english", "no"] },
        { label: "BSL 1.1: free for non-production and small production use", values: ["yes", "proprietary", "oss"] },
      ],
      cardsTitle: "Capabilities",
      cards: [
        { title: "Per-user upstream identity", body: "With per-user OAuth, GitHub issues are created by Alice and Linear tickets are assigned to Bob, rather than to a shared mcp-bot service account. Audit trails extend end to end, from the IDE through ThinkWatch to the upstream system." },
        { title: "Onboarding through Dynamic Client Registration", body: "For upstreams that support Dynamic Client Registration, the OAuth handshake runs automatically. The connection is established once the server URL is pasted and access is approved on the consent page, with no app registration or manual copying of client_id and secret." },
        { title: "Access control for tools", body: "Tool-level RBAC and per-user tool catalogs ensure that each user sees only the tools permitted by their role and upstream account. A role can be limited to specific tools, such as read-only ones." },
        { title: "Fully self-hosted", body: "ThinkWatch runs on the organization's own infrastructure as a single Rust binary backed by Postgres, Redis, and ClickHouse. There is no SaaS lock-in, and MCP traffic goes from ThinkWatch directly to the upstream servers, without a third-party gateway service in between." },
      ],
    },

    live: {
      eyebrow: "Console",
      title: "Visibility into every ",
      titleHighlight: "token, key, and call",
      sub: "Real-time observability for AI requests across an organization. The panels below are React components rendered with mock data, not screenshots, and illustrate the console interface.",
      overview: "Overview · MTD",
      logs: "Unified log explorer",
      health: "Upstream health",
      rate: "Sliding-window rate limit",
    },

    quickstart: {
      eyebrow: "Quick start",
      title: "Run it from source in ",
      titleHighlight: "four steps",
      titleEnd: ".",
      sub: "These are the development steps from the ThinkWatch README. For production, the deployment guide covers Docker Compose, Kubernetes with Helm, SSL, and production hardening.",
      deployLink: "Deployment guide",
      pointAt: "Point the client at the gateway",
      footer: "Drop-in replacement: change the base URL and use a virtual ",
      footerSuffix: " key.",
      steps: [
        { title: "Start infrastructure", body: "Brings up PostgreSQL, Redis, ClickHouse, and the other development services with Docker Compose." },
        { title: "Generate dev secrets and start the backend", body: "Writes .env from .env.example with random secrets, then starts the gateway (:3000) and the console (:3001)." },
        { title: "Start the web console", body: "Installs dependencies and starts the Vite dev server." },
        { title: "Finish the setup wizard", body: "Create the Super Admin account and set the site name; the wizard then issues a first API key." },
      ],
    },


    footer: {
      tagline: "A gateway between AI clients and the models they call.",
      product: "Products",
      resources: "Resources",
      licensing: "ThinkWatch Enterprise is licensed under BSL 1.1. ThinkWatch Lite and ThinkWatch Core are licensed under MIT.",
      copyright: "",
      builtWith: "Built with Astro · Deployed on GitHub Pages",
    },

    notFound: {
      title: "404: Page not found · ThinkWatch",
      description: "The page you were looking for could not be found.",
      headline: "Page not found",
      sub: "The link may be out of date, or the page may have moved. The links below lead to the main sections of the site.",
      home: "Home",
      thinkwatch: "ThinkWatch Enterprise",
      lite: "ThinkWatch Lite",
      core: "ThinkWatch Core",
      docs: "Docs",
      linksLabel: "Other pages",
    },
  },

  "zh-CN": {
    common: {
      getStarted: "立即开始",
      githubLink: "查看 GitHub →",
      copy: "复制",
      copied: "已复制 ✓",
      skipToContent: "跳转到正文",
    },

    nav: {
      thinkwatch: "企业版",
      lite: "Lite",
      core: "Core",
      pricing: "定价",
      how: "工作原理",
      features: "功能特性",
      mcp: "MCP",
      console: "控制台",
      quickstart: "快速开始",
      docs: "文档",
      changelog: "更新日志",
      githubShort: "GitHub →",
    },


    compatible: {
      label: "原生兼容",
    },

    problem: {
      eyebrow: "面临的挑战",
      title: "缺少治理的 ",
      titleHighlight: "AI 使用",
      sub: "随着 AI Agent 在工程团队中广泛使用，组织面临日益增加的治理需求。",
      pains: [
        { icon: "key", title: "密钥分散管理", body: "密钥硬编码于 .env 文件、通过聊天工具传递，且很少轮换。" },
        { icon: "eye", title: "缺乏可见性", body: "无法得知谁调用了哪个模型、消耗了多少 token、产生了多少成本。" },
        { icon: "shield", title: "缺少访问控制", body: "每位开发者均可直接访问所有模型与 MCP 工具。" },
        { icon: "audit", title: "合规缺口", body: "AI 辅助代码生成与数据访问缺少审计日志。" },
        { icon: "cost", title: "成本无法归属", body: "每月的 AI 支出无法解释，也无法归属到具体用户或团队。" },
      ],
      footer: ["ThinkWatch 通过", "单次部署", "解决上述问题。"],
    },

    how: {
      eyebrow: "工作原理",
      title: "所有 AI 请求均经由",
      titleHighlight: "统一网关",
      sub: "可直接替换 OpenAI 与 Anthropic SDK 的接入方式。Agent 无需修改现有代码，只需将 base URL 指向 ThinkWatch。",
      callersLabel: "调用方",
      upstreamsLabel: "上游模型",
      gatewayPort: "网关 :3000",
      gatewayName: "ThinkWatch",
      gatewayTagline: "AI API + MCP 统一代理",
      pipelineLabel: "请求生命周期内部",
      pipeline: [
        { step: "01", label: "身份认证", body: "按哈希在 PostgreSQL 中查找 `tw-` API 密钥，确定其所属用户。" },
        { step: "02", label: "权限授权", body: "可用的模型与 MCP 工具由用户的角色决定（包括从团队继承的角色），并按密钥自身的白名单进一步收窄。" },
        { step: "03", label: "限流", body: "在 Redis 滑动窗口中检查用户与密钥的请求次数限制；预算用尽后请求会被拒绝。" },
        { step: "04", label: "路由与转换", body: "选择 Provider 并自动转换请求格式（Anthropic ⇄ OpenAI ⇄ Bedrock ⇄ Gemini）。" },
        { step: "05", label: "流式返回与计量", body: "响应边到达边返回给客户端，同时从中读取 token 用量并计算费用。" },
        { step: "06", label: "审计", body: "每次调用写入 ClickHouse，并可选择转发至 SIEM。" },
      ],
    },

    features: {
      eyebrow: "功能特性",
      title: "网关、MCP 代理、RBAC 与分析",
      titleHighlight: "集成于单一二进制",
      sub: "网关、MCP 代理与管理 API 由同一个 Rust 二进制程序提供，依赖 PostgreSQL、Redis 与 ClickHouse，无需拆分微服务或编写粘合代码。",
      modules: [
        {
          id: "ai-gateway",
          label: "AI API 网关",
          tagline: "单一端口接入所有支持的模型，可直接替换现有接入。",
          bullets: [
            { title: "多格式代理", body: "OpenAI Chat Completions、OpenAI Responses、Anthropic Messages 与 Gemini 四种 API 在同一端口提供。Cursor、Continue、Cline、Claude Code 及官方 SDK 只需更换 base URL 即可接入。" },
            { title: "按模型路由：自动或手动", body: "每个模型有独立的路由设置。自动模式按延迟、成功率或两者结合（默认）为上游分配权重；手动模式通过拖拽流量条按固定比例分配。熔断器将故障上游移出轮换，因可重试错误而失败的请求会转发到其他上游，控制台展示每条路由的实时健康状态。" },
            { title: "多 Provider 与模型级开关", body: "OpenAI、Anthropic、Google Gemini、Azure OpenAI、AWS Bedrock，或任意 OpenAI 兼容端点，请求格式自动转换。可在不停用整个 Provider 的前提下暂停单个模型；每条请求日志均记录实际提供服务的上游模型。" },
            { title: "虚拟 API 密钥", body: "每把 tw- 密钥归属于一位用户，可限定用于 AI 网关、MCP 网关、管理 API 或其任意组合，并可标注成本中心。密钥支持到期时间、闲置超时，以及带宽限期的轮换（宽限期内旧密钥仍可使用）；已吊销和已停用的密钥列在单独的分页中。明文仅展示一次，只存储哈希。" },
            { title: "限流与预算", body: "滑动窗口（1 分钟至 1 周）限制请求数或 token 数，按日、周或月设置的预算限制 token 用量（按模型加权）。两者均可设置在用户、API 密钥或角色上，同时作用于模型请求与 MCP 工具调用。请求数在请求前检查；token 与预算在响应后计入，预算用尽后的请求会被拒绝。Redis 不可用时默认不做限制，也可设置为直接拒绝请求。" },
            { title: "成本核算", body: "每个请求按平台统一的 token 单价与各模型的权重计价。费用可按模型、用户、Provider 与成本中心汇总，并可按团队筛选，支持导出 CSV 分摊报表和月末预测。预算用量达到 50%、80%、95%、100% 时，每个周期各在审计日志中记录一次预警。" },
            { title: "管理 API 与 OpenAPI 文档", body: "API 密钥、用户、Provider 与各项设置均可通过管理 API 管理，使用获准调用管理 API 的 tw- 密钥即可。OpenAPI 规范描述了各个接口，脚本与 CI 流水线无需控制台即可管理密钥的生命周期。" },
          ],
        },
        {
          id: "mcp-gateway",
          label: "MCP 网关",
          tagline: "按用户 OAuth、一键接入与全量审计。",
          bullets: [
            { title: "按用户的上游凭证", body: "每位开发者通过 OAuth 或个人令牌，以本人身份连接 GitHub、Notion、Linear、Slack 或 Atlassian，上游审计轨迹不会因共享服务账号而失真。同一个 MCP 端点使用每位用户自己的凭证，为其提供各自的数据。" },
            { title: "粘贴服务器 URL 完成 OAuth 接入", body: "粘贴 MCP 服务器 URL 后，ThinkWatch 自动发现其 OAuth 端点；上游支持 Dynamic Client Registration 时自动完成注册，无需在各开发者门户中手动注册应用。匿名探测返回的 401 或 403 被识别为「需要登录」，而非「失败」。" },
            { title: "MCP Store 模板", body: "MCP Store 内置 37 个常用 MCP 服务器模板，包括 GitHub、Notion、Atlassian、Stripe 等。安装模板时自动填入服务器地址与登录方式。同一用户可为一个服务器连接多个账号（如个人与工作 GitHub），并为每把 API 密钥指定其中一个。" },
            { title: "工具级 RBAC 与用户工具目录", body: "由角色和 API 密钥决定可列出、可调用的 MCP 工具，粒度可细至单个工具或某一服务器的全部工具。每位用户看到的工具列表取决于其本人上游账号的可用范围。" },
            { title: "连接测试", body: "「连接」页面中每个已连接的账号均可针对上游服务器进行测试；新保存的个人令牌会在保存时立即验证。" },
            { title: "审计与缓存隔离", body: "每一次工具调用的调用方、参数与结果均记录到 ClickHouse。使用按用户凭证的服务器，其响应按用户和账号分别缓存，互不共享。指向内网或回环地址的服务器地址会被拒绝，工具调用同样受限流约束。" },
            { title: "工具结果流式返回", body: "在 tools/call 上接受事件流的客户端，会在上游事件到达时逐条收到，包括进度通知与最终结果；其他客户端收到一次性的 JSON 响应。两种方式下，审计记录均保存完整的事件序列。" },
          ],
        },
        {
          id: "security",
          label: "安全与合规",
          tagline: "默认启用纵深防御。",
          bullets: [
            { title: "双端口架构", body: "网关（:3000，对外）与控制台（:3001，对内）分离。只有网关应当对公网暴露。" },
            { title: "自定义角色 + SSO/OIDC", body: "内置从超级管理员到只读用户共五个角色，并可创建任意数量的自定义角色。新角色可从现有角色复制起步，权限策略可在控制台中以 JSON 编辑，每次修改都保留在角色的变更历史中。角色也可仅针对某一团队授予。登录支持 Zitadel、Okta、Azure AD 或任意 OIDC Provider，可选 TOTP 二次验证。" },
            { title: "AES-256-GCM 静态加密", body: "Provider 密钥、MCP 令牌及其他上游凭据以 AES-256-GCM 加密存储。虚拟 API 密钥以 HMAC-SHA256 哈希存储，明文只展示一次。" },
            { title: "HttpOnly Cookie 会话", body: "访问令牌和刷新令牌均存储在 HttpOnly Cookie 中，JavaScript 无法读取。每个控制台会话还会用一把绑定登录时 IP 地址的密钥为请求签名，被盗的 Cookie 无法在其他网络中重放。" },
            { title: "内容过滤与 PII 脱敏", body: "禁止规则检查调用方发送的消息，内置常见提示词注入短语的规则，每条规则可设为拦截、警告或仅记录。邮箱、电话号码、银行卡号等 PII 在请求发往上游前替换为占位符，并在回答中还原。规则与匹配模式可在控制台中试用。" },
            { title: "Distroless 容器", body: "服务端镜像只包含一个静态链接的二进制程序，基于 distroless 基础镜像，不含 shell。JWT 密钥短于 32 个字符时服务端拒绝启动；已删除的用户、密钥与 Provider 在 30 天后彻底清除。" },
            { title: "模型白名单覆盖全部 API", body: "请求只能使用同时被 API 密钥白名单与用户角色允许的模型。该检查对 OpenAI Chat Completions、OpenAI Responses、Anthropic Messages 与 Gemini 请求一致生效，任何 API 均无法绕过。" },
          ],
        },
        {
          id: "observability",
          label: "可观测性",
          tagline: "面向 AI 流量的指标、审计日志与实时监控。",
          bullets: [
            { title: "Prometheus 指标", body: "配置指标令牌后，控制台端口提供需 Bearer 认证的 /metrics，包含限流与预算拒绝、缓存命中、审计管线健康等计数器。" },
            { title: "ClickHouse 审计日志", body: "所有 API 调用与工具调用的日志存储于列式数据库 ClickHouse，可直接用 SQL 查询。" },
            { title: "多通道转发", body: "UDP/TCP Syslog（RFC 5424）、经 REST 代理的 Kafka，以及可选 HMAC 签名的 HTTP Webhook，可将审计事件转发至任意 SIEM、数据湖或告警系统。" },
            { title: "健康与就绪", body: "/health/live、/health/ready（检查 PostgreSQL、Redis、ClickHouse 以及至少一个启用的 Provider），以及提供各依赖延迟与连接池统计的 /api/health。" },
            { title: "统一日志检索", body: "在同一页面搜索审计、网关、MCP、访问与应用日志。每个单元格提供按其值筛选或排除的按钮，查询中可用 -key:value 排除指定值，查询条件保存在 URL 中。" },
            { title: "实时看板", body: "控制台总览通过 WebSocket 接收实时数据：每分钟请求数，各 Provider 的延迟、成功率与熔断状态，最活跃的用户以及最新请求，无需刷新页面。" },
            { title: "全量请求 / 响应体审计", body: "默认情况下，网关调用的请求体与响应体、MCP 工具调用的参数与结果，随每条日志一并存入 ClickHouse，压缩存储并单独设置保留期限。可开启写入前 PII 脱敏。超过内联大小上限的内容转存到 S3 兼容存储，如 MinIO 或内置的 RustFS。审计员可在日志详情面板中查看，也可跨日志搜索；查看需要单独的 logs:read_bodies 权限。" },
          ],
        },
        {
          id: "teams",
          label: "团队",
          tagline: "将用户编入团队，用于分级管理与统计。",
          bullets: [
            { title: "团队与成员", body: "管理员创建团队并将用户加入团队。一位用户可同时属于多个团队。" },
            { title: "团队范围角色", body: "角色可仅针对某一团队授予用户。其团队权限（如管理成员、查看用量与费用统计）仅覆盖该团队，且不授予对 Provider、模型、MCP 服务器、设置、角色等平台级资源的任何管理权限。内置的团队管理员角色即为此设计。" },
            { title: "从团队继承的角色", body: "角色也可整体分配给团队，团队中的每位成员都会获得该角色。" },
            { title: "按团队统计", body: "用量与费用统计可按团队筛选。统计权限仅针对特定团队授予的用户，只能看到这些团队的成员。" },
          ],
        },
      ],
    },

    mcpAdvantage: {
      eyebrow: "MCP 网关",
      title: "为组织设计，",
      titleHighlight: "而非单一用户",
      sub: "大多数 MCP 网关面向「单一用户 + 共享服务账号」的场景设计。ThinkWatch 面向组织设计：每位开发者以本人身份连接上游，每一次工具调用均可追溯到具体用户，整套系统部署在组织自有网络内。",
      tableTitle: "MCP 网关方案对比",
      tableNote: "SaaS 网关 = 托管式 MCP 网关：流量出网，上游访问通常是共享的。DIY = mcp-proxy 或自研中转脚本。各家产品不同，请以你正在评估的那一款为准。",
      legendShared: "共享账号",
      legendPartial: "部分支持",
      legendLimited: "受限",
      legendHostedOnly: "仅托管版",
      legendSaas: "仅 SaaS",
      legendVaries: "因方案而异",
      legendEnglish: "仅英文",
      legendProprietary: "因产品而异",
      legendOss: "开源",
      columns: ["能力", "ThinkWatch", "SaaS 网关", "DIY mcp-proxy"],
      rows: [
        { label: "按用户的上游 OAuth（无共享服务账号）", values: ["yes", "shared", "no"] },
        { label: "粘贴服务器 URL，经 Dynamic Client Registration 接入", values: ["yes", "partial", "no"] },
        { label: "工具级 RBAC 与用户工具目录", values: ["yes", "limited", "no"] },
        { label: "ClickHouse 全量审计（可查询、可转发）", values: ["yes", "hosted-only", "no"] },
        { label: "响应缓存按用户和账号分别存放", values: ["yes", "n/a", "no"] },
        { label: "可自托管，单一 Rust 二进制（distroless）", values: ["yes", "saas", "varies"] },
        { label: "开箱即用的中英双语界面", values: ["yes", "english", "no"] },
        { label: "BSL 1.1：非生产与小规模生产环境免费", values: ["yes", "proprietary", "oss"] },
      ],
      cardsTitle: "核心能力",
      cards: [
        { title: "按用户的上游身份", body: "按用户的 OAuth 使 GitHub Issue 由 Alice 创建、Linear 工单分配给 Bob，而非统一归属于 mcp-bot 服务账号。审计轨迹端到端贯通：从 IDE 经由 ThinkWatch 直至上游系统。" },
        { title: "基于 Dynamic Client Registration 的接入", body: "对支持 Dynamic Client Registration 的上游，OAuth 握手自动完成。粘贴服务器 URL 并在授权页确认后即可完成连接，无需注册应用，也无需手动复制 client_id/secret。" },
        { title: "工具访问控制", body: "工具级 RBAC 与按用户的工具目录，确保每位用户仅能看到其角色与上游账号实际可用的工具。角色可限定为只能使用指定的工具，例如只读工具。" },
        { title: "完全自托管", body: "ThinkWatch 以单一 Rust 二进制程序运行在组织自有的基础设施上，依赖 Postgres、Redis 与 ClickHouse。无 SaaS 锁定，MCP 流量由 ThinkWatch 直接发往上游服务器，中间不经过第三方网关服务。" },
      ],
    },

    live: {
      eyebrow: "管理控制台",
      title: "token、密钥与调用的",
      titleHighlight: "实时可观测性",
      sub: "对组织内 AI 请求的实时可观测。以下面板为使用模拟数据渲染的 React 组件，并非截图，用于展示控制台界面。",
      overview: "总览 · 当月",
      logs: "统一日志检索",
      health: "上游健康",
      rate: "滑动窗口限流",
    },

    quickstart: {
      eyebrow: "快速开始",
      title: "通过",
      titleHighlight: "四个步骤",
      titleEnd: "从源码运行",
      sub: "以下是 ThinkWatch README 中的开发步骤。生产部署请参阅部署指南，涵盖 Docker Compose、Kubernetes Helm、SSL 与生产加固。",
      deployLink: "部署指南",
      pointAt: "将客户端指向网关",
      footer: "可直接替换：更换 base URL，并使用虚拟 ",
      footerSuffix: " 密钥。",
      steps: [
        { title: "启动基础设施", body: "通过 Docker Compose 启动 PostgreSQL、Redis、ClickHouse 以及其他开发依赖服务。" },
        { title: "生成开发密钥并启动后端", body: "从 .env.example 派生 .env 并填入随机密钥，然后启动网关（:3000）和控制台（:3001）。" },
        { title: "启动 Web 控制台", body: "安装依赖并启动 Vite 开发服务器。" },
        { title: "完成设置向导", body: "创建超级管理员账号并设置站点名称，向导随后签发第一把 API 密钥。" },
      ],
    },


    footer: {
      tagline: "位于 AI 客户端与模型之间的网关。",
      product: "产品",
      resources: "资源",
      licensing: "ThinkWatch 企业版采用 BSL 1.1 许可证。ThinkWatch Lite 与 ThinkWatch Core 采用 MIT 许可证。",
      copyright: "",
      builtWith: "由 Astro 构建 · 部署于 GitHub Pages",
    },

    notFound: {
      title: "404：页面未找到 · ThinkWatch",
      description: "所访问的页面不存在。",
      headline: "页面不存在",
      sub: "链接可能已失效，或页面已被移动。可通过以下链接访问网站的主要页面。",
      home: "首页",
      thinkwatch: "ThinkWatch 企业版",
      lite: "ThinkWatch Lite",
      core: "ThinkWatch Core",
      docs: "文档",
      linksLabel: "其他页面",
    },
  },
} as const;

export function t(lang: Lang | string | undefined) {
  const key: Lang = lang === "zh-CN" ? "zh-CN" : "en";
  return dict[key];
}

export function getLang(astro: { currentLocale?: string }): Lang {
  return astro.currentLocale === "zh-CN" ? "zh-CN" : "en";
}

export function localePath(lang: Lang, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === "en") return clean;
  return `/zh-CN${clean === "/" ? "" : clean}`;
}
