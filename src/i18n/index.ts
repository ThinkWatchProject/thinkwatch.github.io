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
      how: "How it works",
      features: "Features",
      mcp: "MCP",
      console: "Console",
      pricing: "Pricing",
      quickstart: "Quick start",
      docs: "Docs",
      changelog: "Changelog",
      githubShort: "GitHub →",
    },

    hero: {
      badge: (v: string) => `v${v} — now in public preview`,
      titleA: "The secure gateway",
      titleB: "for ",
      titleHighlight: "all your AI traffic",
      sub: "ThinkWatch is the single control plane through which every model request and every MCP tool call must flow. Authenticated, authorized, rate-limited, logged, and accounted for.",
      ctaPrimary: "Get started in 30s",
      stack: ["Rust + Axum", "2 MB distroless", "OpenAI · Anthropic · Gemini · Bedrock", "BSL 1.1"],
      stats: [
        { value: "2 MB", label: "Distroless image" },
        { value: "3+1", label: "API formats" },
        { value: "Per-user", label: "MCP OAuth" },
        { value: "Rust", label: "One binary" },
      ],
      live: {
        label: "LIVE",
        reqPerSec: "req/s",
        tokensPerMin: "tokens/min",
      },
    },

    compatible: {
      label: "Drop-in compatible with",
    },

    problem: {
      eyebrow: "The Problem",
      title: "AI is everywhere. Governance is ",
      titleHighlight: "nowhere",
      sub: "As AI agents proliferate across engineering teams, organizations face a growing governance challenge that gets worse every quarter.",
      pains: [
        { icon: "🔑", title: "Keys scattered everywhere", body: "Hardcoded in .env files, shared in Slack, rotated never. One leaked key drains your monthly budget overnight." },
        { icon: "👁", title: "Zero visibility", body: "Who used which model? How many tokens? Against which project? Nobody knows until the bill arrives." },
        { icon: "🛡", title: "No access control", body: "Every developer has direct access to every model and every MCP tool. There is no least-privilege story." },
        { icon: "📜", title: "Compliance gaps", body: "No audit trail for AI-assisted code generation or data access. Legal and security cannot answer basic questions." },
        { icon: "💸", title: "Cost surprises", body: "Monthly AI bills nobody can explain or attribute. Budget overruns are discovered weeks after the fact." },
      ],
      footer: ["ThinkWatch solves all of this with a ", "single deployment", "."],
    },

    how: {
      eyebrow: "How it works",
      title: "Every AI request flows through ",
      titleHighlight: "one gateway",
      sub: "Drop-in replacement for the OpenAI and Anthropic SDKs. Your agents keep their existing code — they just point at ThinkWatch instead.",
      callersLabel: "Callers",
      upstreamsLabel: "Upstreams",
      gatewayPort: "Gateway :3000",
      gatewayName: "ThinkWatch",
      gatewayTagline: "AI API + MCP proxy",
      pipelineLabel: "Inside the request lifecycle",
      pipeline: [
        { step: "01", label: "Authenticate", body: "Virtual `tw-` API key validated against PG, scoped to user/team/project." },
        { step: "02", label: "Authorize", body: "Custom RBAC checks model/tool access against the caller's role, scoped to their team if applicable." },
        { step: "03", label: "Rate-limit", body: "Sliding-window RPM/TPM enforced via Redis, per key or per user." },
        { step: "04", label: "Route & convert", body: "Provider selected; request format converted (Anthropic ⇄ OpenAI ⇄ Bedrock ⇄ Gemini)." },
        { step: "05", label: "Stream & meter", body: "SSE forwarded with zero overhead; tokens counted in real-time." },
        { step: "06", label: "Audit", body: "Every call written to ClickHouse and optionally forwarded to your SIEM." },
      ],
    },

    features: {
      eyebrow: "Features",
      title: "Gateway, MCP proxy, RBAC, analytics — ",
      titleHighlight: "in one binary",
      sub: "ThinkWatch is one Rust binary backed by PostgreSQL, Redis, and ClickHouse. No microservice sprawl, no glue code — every concern handled by the same control plane.",
      modules: [
        {
          id: "ai-gateway",
          label: "AI API Gateway",
          tagline: "One port. Every model. Drop-in compatible.",
          bullets: [
            { title: "Multi-format proxy", body: "OpenAI Chat Completions, Anthropic Messages, and OpenAI Responses APIs on a single port — drop-in for Cursor, Continue, Cline, Claude Code, and the official SDKs." },
            { title: "Multi-provider routing", body: "OpenAI, Anthropic, Google Gemini, Azure OpenAI, AWS Bedrock, or any OpenAI-compatible endpoint. Format conversion is automatic." },
            { title: "Virtual API keys", body: "Issue scoped tw- keys per team, project, or developer. Revoke in one click. Plaintext shown exactly once; SHA-256 hashes at rest." },
            { title: "Rate limits & budget caps", body: "Sliding-window RPM/TPM enforced via Redis per key, user, or team. Hard budget caps fail closed — the gateway blocks requests the moment a limit is exhausted, no silent overruns. Spend alerts fire before the cap is hit." },
            { title: "Real-time cost tracking", body: "Per-model pricing with budget alerts and team attribution. SSE pass-through with zero-overhead token counting." },
            { title: "Management API & OpenAPI", body: "Provision API keys, users, and providers programmatically. A full OpenAPI spec ships alongside the gateway — integrate key lifecycle into CI pipelines, Terraform, or your own tooling without ever touching the console." },
          ],
        },
        {
          id: "mcp-gateway",
          label: "MCP Gateway",
          tagline: "Per-user OAuth. One paste to onboard. Audit every call.",
          bullets: [
            { title: "Per-user upstream credentials", body: "Every developer authenticates as themselves to GitHub, Linear, Slack — via OAuth or PAT — no shared service account muddying the upstream audit trail. The same MCP endpoint serves Alice's Linear data and Bob's, scoped per (user, account_label) end to end." },
            { title: "One-paste OAuth onboarding", body: "Paste an MCP server URL — ThinkWatch handles Dynamic Client Registration, the auth probe, and the OAuth callback. No manual app registration in seventeen developer portals. 401/403 from anonymous probes is treated as auth-required, not a failure." },
            { title: "MCP Store + curated templates", body: "A built-in registry of bilingual templates for popular MCP servers, Linear OAuth seeded out of the box. Click Install, paste OAuth client credentials at install time, the wizard does the rest. Display labels make multi-install (personal + work GitHub) unambiguous." },
            { title: "Tool-level RBAC + per-user catalogs", body: "Control exactly which roles can invoke which tools. Per-user tool catalogs let different users see different tools based on their upstream permissions — Viewers don't accidentally get write access to your prod database via MCP." },
            { title: "Test before you commit", body: "Per-credential Test Connection on the /connections page verifies your OAuth/PAT actually works against the upstream server. The auth-mode-aware edit form refuses to save the wrong fields. Tool-call and install errors surface actionable, end-user-friendly messages." },
            { title: "Audit + cache, scoped properly", body: "Every tool invocation logged with caller, parameters, and response in ClickHouse. The MCP response cache is scoped to (user, account_label) — OAuth/PAT data never leaks across users or accounts. SSRF protection, rate limits, and structured audit on every gateway hop." },
          ],
        },
        {
          id: "security",
          label: "Security & Compliance",
          tagline: "Defense in depth, by default.",
          bullets: [
            { title: "Dual-port architecture", body: "Gateway (:3000, public-facing) and console (:3001, internal-only) on separate ports. Only the gateway should be reachable from the internet." },
            { title: "Custom roles + SSO/OIDC", body: "Built-in system roles plus unlimited custom roles in a unified table. Clone from any existing role, edit permissions in CodeMirror, and audit the full history of who changed what. Assign roles at the team level for multi-tenant isolation. Plug into Zitadel, Okta, Azure AD, or any OIDC provider." },
            { title: "AES-256-GCM at rest", body: "Provider API keys and secrets encrypted at rest. Virtual API keys stored as SHA-256 hashes; plaintext shown exactly once." },
            { title: "HttpOnly cookie sessions", body: "Access and refresh tokens live in HttpOnly cookies — zero JavaScript surface. XSS cannot exfiltrate them. The refresh endpoint binds each token to the originating client IP, so a stolen cookie cannot be replayed from a different network." },
            { title: "Content filtering & PII redaction", body: "Block requests matching custom deny-lists or auto-redact PII patterns before they reach upstream providers. Per-rule action (block / redact / log) with live preview in the console." },
            { title: "Distroless containers", body: "2 MB runtime image, no shell, minimal attack surface. JWT entropy enforced at startup; soft-delete with 30-day purge." },
          ],
        },
        {
          id: "observability",
          label: "Observability",
          tagline: "Know exactly what your AI is doing.",
          bullets: [
            { title: "Prometheus metrics", body: "GET /metrics on the gateway port: gateway_requests_total, gateway_tokens_total, circuit_breaker_state, and more." },
            { title: "ClickHouse audit logs", body: "SQL-queryable audit logs across all API calls and tool invocations, stored in ClickHouse for high-performance columnar analytics." },
            { title: "Multi-channel forwarding", body: "UDP/TCP Syslog (RFC 5424), Kafka, and HTTP webhooks — route audit events to any SIEM, data lake, or alerting pipeline." },
            { title: "Health & readiness", body: "/health/live, /health/ready (with PG + Redis checks), and /api/health with detailed latency and pool statistics." },
            { title: "Unified log explorer", body: "Search across audit, gateway, MCP, access, and platform logs from a single page. Click any cell to filter on it, use -key:value to exclude, and the full query state is persisted in the URL." },
            { title: "Live dashboard", body: "The console overview streams real-time stats over a persistent WebSocket — request rates, error counts, token spend, and upstream health update without a page refresh." },
          ],
        },
        {
          id: "teams",
          label: "Teams",
          tagline: "Every business unit behind its own boundary.",
          bullets: [
            { title: "Team workspaces", body: "Create teams, invite members, and let each unit operate with full isolation — its own analytics view, its own user list, and its own API key namespace." },
            { title: "Scoped API keys", body: "Virtual tw- keys are issued within a team scope. A key that belongs to team A cannot consume team B's budget or appear in team B's logs." },
            { title: "Team-level role assignments", body: "The same user can be a Developer in team A and a Viewer in team B. Roles granted at the team scope apply only within that team — no global over-privilege." },
            { title: "Per-team cost attribution", body: "Dashboard metrics, token spend, and request counts are sliced by team out of the box. No post-processing or log correlation required to see who spent what." },
            { title: "Per-team spending limits", body: "Rate limits and budget caps can be scoped to a team. Each unit stays within its own quota — overruns in one team do not affect any other." },
          ],
        },
      ],
    },

    mcpAdvantage: {
      eyebrow: "MCP, the way it should be",
      title: "Built for the team — ",
      titleHighlight: "not for one person",
      sub: "Most MCP gateways were designed for a single user with a single shared service account. ThinkWatch was designed for organizations where every developer needs to authenticate upstream as themselves, every tool call needs to be audited back to a real person, and the whole thing needs to live inside your network.",
      tableTitle: "How ThinkWatch's MCP gateway compares",
      tableNote: "SaaS gateways = Composio, Smithery, Pulse MCP and similar hosted offerings. DIY = mcp-proxy or homegrown shims.",
      legendShared: "shared account",
      legendPartial: "partial",
      legendLimited: "limited",
      legendHostedOnly: "hosted-only",
      legendSaas: "SaaS-only",
      legendVaries: "varies",
      legendEnglish: "English-only",
      legendProprietary: "proprietary",
      legendOss: "OSS",
      columns: ["Capability", "ThinkWatch", "SaaS gateways", "DIY mcp-proxy"],
      rows: [
        { label: "Per-user upstream OAuth (no shared service account)", values: ["yes", "shared", "no"] },
        { label: "One-paste onboarding via Dynamic Client Registration", values: ["yes", "partial", "no"] },
        { label: "Tool-level RBAC + per-user tool catalogs", values: ["yes", "limited", "no"] },
        { label: "Full audit trail in ClickHouse (queryable, forwardable)", values: ["yes", "hosted-only", "no"] },
        { label: "Response cache scoped per (user, account_label)", values: ["yes", "n/a", "no"] },
        { label: "Self-hosted, single Rust binary, distroless", values: ["yes", "saas", "varies"] },
        { label: "Bilingual UI out of the box (English + 中文)", values: ["yes", "english", "no"] },
        { label: "BSL 1.1 — free for non-prod & small prod", values: ["yes", "proprietary", "oss"] },
      ],
      cardsTitle: "What this unlocks",
      cards: [
        { title: "Each developer is themselves upstream", body: "Per-user OAuth means GitHub issues are created by Alice, Linear tickets are assigned to Bob — not to a faceless mcp-bot service account. Audit trails work end-to-end: from the IDE, through ThinkWatch, into the upstream system." },
        { title: "One paste, not seventeen portals", body: "Dynamic Client Registration handles the OAuth handshake. Paste the server URL, click Allow on the consent page — you're connected. No app registration, no copying client_id/secret across browser tabs." },
        { title: "Tools are gated like APIs", body: "Tool-level RBAC plus per-user tool catalogs. Each user sees only the tools their role and their upstream account can actually use. The Viewer role doesn't accidentally get write access to production via an MCP tool." },
        { title: "Lives entirely on your network", body: "ThinkWatch is one self-hosted Rust binary backed by Postgres, Redis, and ClickHouse. No SaaS lock-in, no MCP traffic leaving your perimeter, no quarterly invoice surprise from a vendor that's seen your prompts." },
      ],
    },

    live: {
      eyebrow: "The Console",
      title: "Every token. Every key. ",
      titleHighlight: "Every call",
      sub: "Real-time observability over every AI request flowing through your organization. The panels below are live React components — not screenshots — rendering with mock data so you can see what the console feels like.",
      overview: "Overview · MTD",
      logs: "Unified log explorer",
      health: "Upstream health",
      rate: "Sliding-window rate limit",
    },

    quickstart: {
      eyebrow: "Quick start",
      title: "Up and running in ",
      titleHighlight: "under a minute",
      sub: "Self-host with Docker Compose for a single-node deployment, or use the Helm chart for production Kubernetes. Either way, four commands and you have a working gateway.",
      pointAt: "Then point your client at the gateway",
      footer: "Zero code changes required — just swap the base URL and use a virtual ",
      footerSuffix: " key.",
      steps: [
        { title: "Start infrastructure", body: "Bring up PostgreSQL, Redis, and ClickHouse via Docker Compose." },
        { title: "Start the gateway", body: "Both ports come up: 3000 (gateway) and 3001 (console API)." },
        { title: "Start the console UI", body: "Vite dev server on :5173 with hot reload." },
        { title: "Run the setup wizard", body: "Create the super_admin account and add your first provider." },
      ],
    },

    license: {
      eyebrow: "License",
      title: "Source-available. ",
      titleHighlight: "Free for most teams",
      sub: "ThinkWatch is licensed under the Business Source License 1.1. Non-production use is free forever, and production use is free up to generous monthly thresholds — only commercial above that.",
      mostTeams: "Most teams",
      footnote: ["\"Billable Token\" and \"MCP Tool Call\" definitions, the tiering model, and the changeover to GPL-2.0-or-later are all detailed in ", "LICENSING.md", "."],
      tiers: [
        {
          name: "Non-production",
          price: "Free",
          priceNote: "forever",
          audience: "Development, staging, evaluation, internal demos.",
          features: ["Unlimited tokens", "Unlimited MCP tool calls", "All gateway features", "All security features", "Community support"],
          ctaLabel: "Self-host now",
        },
        {
          name: "Production · Free Tier",
          price: "Free",
          priceNote: "up to thresholds",
          audience: "Small teams running production workloads.",
          features: ["Up to 10,000,000 billable tokens / month", "Up to 10,000 MCP tool calls / month", "All features included", "BSL 1.1 license", "Auto-converts to GPL-2.0-or-later after change date"],
          ctaLabel: "Read the license",
        },
        {
          name: "Production · Commercial",
          price: "Tiered",
          priceNote: "by usage",
          audience: "Organizations exceeding the free thresholds.",
          features: ["Above 10M tokens or 10K MCP calls per UTC month", "Commercial license required", "Priced by usage tiers", "Priority support available", "Custom deployment guidance"],
          ctaLabel: "Contact sales",
        },
      ],
    },

    star: {
      eyebrow: "Community",
      title: "Watch the project ",
      titleHighlight: "grow",
      sub: "ThinkWatch is open development. Star the repo to follow releases and shape the roadmap.",
      cta: "Star on GitHub",
    },

    footer: {
      tagline: "The single gateway through which all AI access must flow. Authenticated, authorized, rate-limited, logged, and accounted for.",
      product: "Product",
      resources: "Resources",
      copyright: "Source-available under BSL 1.1.",
      builtWith: "Built with Astro · Deployed on GitHub Pages",
    },

    notFound: {
      title: "404 — Page not found · ThinkWatch",
      description: "The page you were looking for could not be found.",
      headline: "This route was not authorized.",
      sub: "The page you were looking for does not exist — or was rate-limited, audited, and dropped at the gateway.",
      home: "← Back to home",
      changelog: "View changelog",
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
      how: "工作原理",
      features: "功能特性",
      mcp: "MCP",
      console: "控制台",
      pricing: "定价",
      quickstart: "快速开始",
      docs: "文档",
      changelog: "更新日志",
      githubShort: "GitHub →",
    },

    hero: {
      badge: (v: string) => `v${v} — 公开预览`,
      titleA: "面向所有 AI 流量",
      titleB: "的",
      titleHighlight: "安全网关",
      sub: "ThinkWatch 是企业内所有模型请求与 MCP 工具调用的唯一控制平面。每一次访问都被认证、授权、限流、记录和计费。",
      ctaPrimary: "30 秒上手",
      stack: ["Rust + Axum", "2 MB Distroless", "OpenAI · Anthropic · Gemini · Bedrock", "BSL 1.1"],
      stats: [
        { value: "2 MB", label: "Distroless 镜像" },
        { value: "3+1", label: "API 格式" },
        { value: "Per-user", label: "MCP OAuth" },
        { value: "Rust", label: "单一二进制" },
      ],
      live: {
        label: "实时",
        reqPerSec: "req/s",
        tokensPerMin: "tokens/min",
      },
    },

    compatible: {
      label: "原生兼容",
    },

    problem: {
      eyebrow: "当下的困境",
      title: "AI 无处不在，治理却",
      titleHighlight: "无人问津",
      sub: "随着 AI Agent 在工程团队中爆发，组织面临日益严峻的治理挑战，每个季度都更糟糕。",
      pains: [
        { icon: "🔑", title: "密钥四散", body: "硬编码在 .env、在 Slack 里互传、从未轮换。一把泄露的密钥能在一夜之间烧光当月预算。" },
        { icon: "👁", title: "毫无可见性", body: "谁用了哪个模型？消耗多少 token？归到哪个项目？账单到了才知道。" },
        { icon: "🛡", title: "无访问控制", body: "每位工程师都能直连任意模型和任意 MCP 工具，根本谈不上最小权限。" },
        { icon: "📜", title: "合规盲区", body: "AI 辅助代码生成和数据访问没有任何审计轨迹，法务和安全团队连最基本的问题都答不上来。" },
        { icon: "💸", title: "成本爆雷", body: "每月 AI 账单没人能解释、没人能归因。预算超支几周之后才被发现。" },
      ],
      footer: ["ThinkWatch 用", "一次部署", "解决所有这些问题。"],
    },

    how: {
      eyebrow: "工作原理",
      title: "所有 AI 请求都流经",
      titleHighlight: "同一道网关",
      sub: "OpenAI 和 Anthropic SDK 的零侵入替代品。你的 Agent 完全不需要改代码，只要把 base URL 指向 ThinkWatch。",
      callersLabel: "调用方",
      upstreamsLabel: "上游模型",
      gatewayPort: "网关 :3000",
      gatewayName: "ThinkWatch",
      gatewayTagline: "AI API + MCP 统一代理",
      pipelineLabel: "请求生命周期内部",
      pipeline: [
        { step: "01", label: "身份认证", body: "虚拟 `tw-` API 密钥校验到 PostgreSQL，限定到用户/团队/项目级别。" },
        { step: "02", label: "权限授权", body: "自定义 RBAC 根据调用方角色检查模型与工具的访问权限，如有团队上下文则在团队粒度内校验。" },
        { step: "03", label: "限流", body: "Redis 实现的滑动窗口 RPM/TPM 限制，可按密钥或按用户。" },
        { step: "04", label: "路由与转换", body: "选择 Provider 并自动转换请求格式（Anthropic ⇄ OpenAI ⇄ Bedrock ⇄ Gemini）。" },
        { step: "05", label: "流式转发与计量", body: "SSE 零开销转发，token 实时计数。" },
        { step: "06", label: "审计", body: "每次调用写入 ClickHouse，可选转发到你的 SIEM。" },
      ],
    },

    features: {
      eyebrow: "功能特性",
      title: "网关、MCP 代理、RBAC、分析 —— ",
      titleHighlight: "全在一个二进制里",
      sub: "ThinkWatch 是一个 Rust 二进制，依赖 PostgreSQL、Redis、ClickHouse。没有微服务大杂烩，没有粘合代码 —— 所有职责都在同一个控制平面里处理。",
      modules: [
        {
          id: "ai-gateway",
          label: "AI API 网关",
          tagline: "一个端口，所有模型，零侵入接入。",
          bullets: [
            { title: "多格式代理", body: "OpenAI Chat Completions、Anthropic Messages、OpenAI Responses 三种 API 在同一端口提供 —— Cursor、Continue、Cline、Claude Code 以及官方 SDK 都可零修改接入。" },
            { title: "多 Provider 路由", body: "OpenAI、Anthropic、Google Gemini、Azure OpenAI、AWS Bedrock，或任何 OpenAI 兼容端点，请求格式自动转换。" },
            { title: "虚拟 API 密钥", body: "按团队、项目或开发者签发限定范围的 tw- 密钥，一键吊销。明文仅展示一次；存储为 SHA-256 哈希。" },
            { title: "限流与预算上限", body: "基于 Redis 的滑动窗口 RPM/TPM 限制，可按密钥、用户或团队设置。硬性预算上限采用 fail-closed 机制——一旦额度耗尽，网关立即拦截请求，无任何静默超支。支持在触顶前触发消费预警。" },
            { title: "实时成本追踪", body: "按模型计价，含预算告警与团队归因。SSE 零开销转发，token 实时计数。" },
            { title: "管理 API 与 OpenAPI 文档", body: "通过程序化接口管理 API 密钥、用户和 Provider。网关附带完整 OpenAPI 规范，可将密钥生命周期集成到 CI 流水线、Terraform 或自有工具链，无需打开控制台。" },
          ],
        },
        {
          id: "mcp-gateway",
          label: "MCP 网关",
          tagline: "按用户 OAuth · 一键接入 · 全量审计。",
          bullets: [
            { title: "按用户的上游凭证", body: "每位开发者以自己的身份登录 GitHub、Linear、Slack —— 通过 OAuth 或 PAT —— 不再用共享服务账号污染上游审计轨迹。同一个 MCP 端点为 Alice 和 Bob 提供各自的 Linear 数据，全程按 (user, account_label) 严格隔离。" },
            { title: "一键 OAuth 接入", body: "粘贴一个 MCP 服务器 URL —— ThinkWatch 自动完成 Dynamic Client Registration、鉴权探测和 OAuth 回调。无需在十七个开发者门户里手动注册应用。匿名探测的 401/403 被正确识别为「需要鉴权」而非「失败」。" },
            { title: "MCP Store + 模板市场", body: "内置双语模板注册表，覆盖主流 MCP 服务器，开箱即包含 Linear OAuth 模板。点击安装、安装时粘贴 OAuth 客户端凭证，向导处理其余流程。Display Label 让多次安装（个人 + 工作 GitHub）一目了然。" },
            { title: "工具级 RBAC + 用户工具目录", body: "精准控制哪些角色可以调用哪些工具。按用户的工具目录让不同用户根据其上游权限看到不同工具集 —— Viewer 角色不会因为 MCP 工具而意外获得生产数据库写入权。" },
            { title: "提交前先测试", body: "/connections 页面提供逐凭证 Test Connection，验证你的 OAuth/PAT 真正能连上上游服务器。鉴权模式感知的编辑表单拒绝保存错误字段。工具调用与安装失败的错误信息对终端用户可读、可执行。" },
            { title: "审计与缓存，正确隔离", body: "每一次工具调用都记录调用方、参数、响应到 ClickHouse。MCP 响应缓存按 (user, account_label) 维度隔离 —— OAuth/PAT 数据绝不跨用户或账号串扰。SSRF 防护、限流、结构化审计在每一跳都启用。" },
          ],
        },
        {
          id: "security",
          label: "安全与合规",
          tagline: "默认即纵深防御。",
          bullets: [
            { title: "双端口架构", body: "网关（:3000，对外）与控制台（:3001，对内）分离。只有网关应当对公网暴露。" },
            { title: "自定义角色 + SSO/OIDC", body: "内置系统角色与不限数量的自定义角色统一管理。可从任意现有角色克隆为起点，在 CodeMirror 中编辑权限，并审计完整的变更历史。角色可在团队粒度授权，实现多租户隔离。支持对接 Zitadel、Okta、Azure AD 或任意 OIDC Provider。" },
            { title: "AES-256-GCM 静态加密", body: "Provider API Key 与机密信息静态加密。虚拟密钥以 SHA-256 哈希存储，明文只展示一次。" },
            { title: "HttpOnly Cookie 会话", body: "访问令牌和刷新令牌均存储在 HttpOnly Cookie 中——JavaScript 完全无法读取。XSS 攻击无法窃取会话。刷新端点将每个令牌绑定到来源客户端 IP，被盗 Cookie 无法跨网络重放。" },
            { title: "内容过滤与 PII 脱敏", body: "在请求到达上游 Provider 之前，拦截匹配自定义禁止列表的内容，或自动脱敏 PII 字段。每条规则可独立配置动作（拦截 / 脱敏 / 仅记录），控制台提供实时预览。" },
            { title: "Distroless 容器", body: "2 MB 运行时镜像，无 shell，攻击面最小化。启动时强制 JWT 熵校验；软删除 30 天后自动清理。" },
          ],
        },
        {
          id: "observability",
          label: "可观测性",
          tagline: "清楚地知道你的 AI 在做什么。",
          bullets: [
            { title: "Prometheus 指标", body: "网关端口的 GET /metrics 暴露 gateway_requests_total、gateway_tokens_total、circuit_breaker_state 等指标。" },
            { title: "ClickHouse 审计日志", body: "所有 API 调用与工具调用的审计日志可 SQL 查询，存储于 ClickHouse 列式 OLAP 数据库以获得高性能。" },
            { title: "多通道转发", body: "UDP/TCP Syslog（RFC 5424）、Kafka、HTTP Webhook —— 把审计事件转发到任意 SIEM、数据湖或告警系统。" },
            { title: "健康与就绪", body: "/health/live、/health/ready（含 PG + Redis 检查）以及 /api/health 提供详细延迟与连接池统计。" },
            { title: "统一日志检索", body: "在同一页面搜索审计、网关、MCP、访问、平台等所有日志。点击任意单元格即可筛选，用 -key:value 排除指定条件，查询状态完整持久化到 URL。" },
            { title: "实时看板", body: "控制台总览通过持久 WebSocket 实时推送统计数据——请求速率、错误数、Token 消耗和上游健康状态，无需刷新页面。" },
          ],
        },
        {
          id: "teams",
          label: "团队",
          tagline: "每个业务单元，都在独立边界内运行。",
          bullets: [
            { title: "团队工作区", body: "创建团队、邀请成员，每个业务单元拥有完全隔离的环境——独立的分析看板、独立的用户列表、独立的 API 密钥命名空间。" },
            { title: "团队范围密钥", body: "虚拟 tw- 密钥可在团队范围内签发。A 团队的密钥无法消耗 B 团队的预算，也不会出现在 B 团队的日志中。" },
            { title: "团队级角色授权", body: "同一用户可在 A 团队担任 Developer、在 B 团队担任 Viewer。在团队粒度授予的角色仅在该团队内生效，不产生全局越权。" },
            { title: "按团队成本归因", body: "看板指标、Token 消耗和请求数开箱即按团队分切，无需事后处理或关联日志即可清晰看出各团队花了多少。" },
            { title: "按团队限额", body: "限流规则和预算上限可绑定到团队。每个业务单元在自己的配额内独立运行，一个团队超限不影响其他团队。" },
          ],
        },
      ],
    },

    mcpAdvantage: {
      eyebrow: "MCP 应有的样子",
      title: "为团队而生 —— ",
      titleHighlight: "而不是为单个用户",
      sub: "市面上大多数 MCP 网关都是为「单用户 + 单一共享服务账号」的场景设计的。ThinkWatch 从一开始就为组织而生：每位开发者以自己的身份连接上游、每一次工具调用都可追溯到具体的人、整套系统完全部署在你自己的网络内。",
      tableTitle: "ThinkWatch MCP 网关 vs 同类方案",
      tableNote: "SaaS 网关 = Composio、Smithery、Pulse MCP 等托管服务。DIY = mcp-proxy 或自研中转脚本。",
      legendShared: "共享账号",
      legendPartial: "部分支持",
      legendLimited: "受限",
      legendHostedOnly: "仅托管版",
      legendSaas: "仅 SaaS",
      legendVaries: "因方案而异",
      legendEnglish: "仅英文",
      legendProprietary: "闭源",
      legendOss: "开源",
      columns: ["能力", "ThinkWatch", "SaaS 网关", "DIY mcp-proxy"],
      rows: [
        { label: "按用户的上游 OAuth（无共享服务账号）", values: ["yes", "shared", "no"] },
        { label: "Dynamic Client Registration 一键接入", values: ["yes", "partial", "no"] },
        { label: "工具级 RBAC + 用户工具目录", values: ["yes", "limited", "no"] },
        { label: "ClickHouse 全量审计（可查询、可转发）", values: ["yes", "hosted-only", "no"] },
        { label: "响应缓存按 (user, account_label) 隔离", values: ["yes", "n/a", "no"] },
        { label: "可自托管，单一 Rust 二进制（distroless）", values: ["yes", "saas", "varies"] },
        { label: "开箱即用的中英双语界面", values: ["yes", "english", "no"] },
        { label: "BSL 1.1 —— 非生产与小规模生产免费", values: ["yes", "proprietary", "oss"] },
      ],
      cardsTitle: "这给你带来什么",
      cards: [
        { title: "每位开发者，在上游就是他自己", body: "按用户的 OAuth 意味着 GitHub Issue 由 Alice 创建、Linear 工单分配给 Bob —— 而不是统一挂在某个面目模糊的 mcp-bot 服务账号下。审计轨迹端到端贯通：从 IDE，经 ThinkWatch，进入上游系统。" },
        { title: "一次粘贴，告别十七个门户", body: "Dynamic Client Registration 自动完成 OAuth 握手。粘贴服务器 URL，在授权页点击 Allow —— 连接完成。不需要注册应用、不需要在浏览器标签间反复复制 client_id/secret。" },
        { title: "工具像 API 一样被治理", body: "工具级 RBAC + 按用户的工具目录。每位用户只看到自己角色 + 上游账号实际可用的工具子集。Viewer 角色绝不会因为 MCP 工具而意外获得生产环境的写入权限。" },
        { title: "全部运行在你的网络内", body: "ThinkWatch 是一个可自托管的 Rust 二进制，背后是 Postgres + Redis + ClickHouse。没有 SaaS 锁定，没有 MCP 流量出本地边界，也没有「看过你 prompt 的供应商」每季度寄来的账单。" },
      ],
    },

    live: {
      eyebrow: "管理控制台",
      title: "每一个 token、每一把密钥、",
      titleHighlight: "每一次调用",
      sub: "对组织内每一个 AI 请求的实时可观测性。下面这些面板是真正的 React 组件 —— 不是截图 —— 用模拟数据渲染，让你直观感受控制台。",
      overview: "总览 · 当月",
      logs: "统一日志检索",
      health: "上游健康",
      rate: "滑动窗口限流",
    },

    quickstart: {
      eyebrow: "快速开始",
      title: "",
      titleHighlight: "一分钟内",
      sub: "用 Docker Compose 单节点自托管，或用 Helm Chart 上生产 Kubernetes。无论哪种方式，4 条命令就能跑起来。",
      pointAt: "然后把客户端指向网关",
      footer: "无需修改任何代码 —— 只需替换 base URL 并使用虚拟 ",
      footerSuffix: " 密钥。",
      steps: [
        { title: "启动基础设施", body: "通过 Docker Compose 拉起 PostgreSQL、Redis、ClickHouse。" },
        { title: "启动网关", body: "两个端口同时启动：3000（网关）与 3001（控制台 API）。" },
        { title: "启动控制台 UI", body: "Vite 开发服务器跑在 :5173，支持热重载。" },
        { title: "运行初始化向导", body: "创建超级管理员账号并添加第一个 Provider。" },
      ],
    },

    license: {
      eyebrow: "授权",
      title: "源码开放。",
      titleHighlight: "对绝大多数团队免费",
      sub: "ThinkWatch 采用 Business Source License 1.1。非生产环境永久免费；生产环境在每月慷慨阈值内同样免费 —— 超出才需商业授权。",
      mostTeams: "适合大多数团队",
      footnote: ["「计费 Token」和「MCP 工具调用」的定义、阶梯计费模型，以及到 GPL-2.0-or-later 的转换条款，详见 ", "LICENSING.md", "。"],
      tiers: [
        {
          name: "非生产环境",
          price: "免费",
          priceNote: "永久",
          audience: "开发、预发、评估、内部演示。",
          features: ["Token 不限量", "MCP 工具调用不限量", "全部网关功能", "全部安全功能", "社区支持"],
          ctaLabel: "立即自托管",
        },
        {
          name: "生产环境 · 免费层",
          price: "免费",
          priceNote: "阈值内",
          audience: "运行生产负载的小团队。",
          features: ["每月最多 10,000,000 计费 Token", "每月最多 10,000 次 MCP 工具调用", "全部功能包含", "BSL 1.1 授权", "Change Date 后自动转为 GPL-2.0-or-later"],
          ctaLabel: "阅读授权条款",
        },
        {
          name: "生产环境 · 商业",
          price: "阶梯",
          priceNote: "按用量",
          audience: "超出免费阈值的组织。",
          features: ["每 UTC 月超过 1000 万 Token 或 1 万次 MCP 调用", "需要商业授权", "按用量阶梯计费", "可选优先支持", "定制部署咨询"],
          ctaLabel: "联系销售",
        },
      ],
    },

    star: {
      eyebrow: "社区",
      title: "见证项目",
      titleHighlight: "成长",
      sub: "ThinkWatch 开放开发。Star 仓库以追踪发布动态并共同塑造路线图。",
      cta: "在 GitHub 上 Star",
    },

    footer: {
      tagline: "所有 AI 访问的唯一通行网关。每一次都被认证、授权、限流、记录、计费。",
      product: "产品",
      resources: "资源",
      copyright: "源码可获取，BSL 1.1 授权。",
      builtWith: "由 Astro 构建 · 部署于 GitHub Pages",
    },

    notFound: {
      title: "404 — 页面未找到 · ThinkWatch",
      description: "你访问的页面不存在。",
      headline: "此路由未被授权。",
      sub: "你访问的页面不存在 —— 或者它在网关处被限流、审计并丢弃了。",
      home: "← 返回首页",
      changelog: "查看更新日志",
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
