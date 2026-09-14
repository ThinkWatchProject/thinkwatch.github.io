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
      thinkwatch: "ThinkWatch",
      lite: "Lite",
      core: "Core",
      license: "License",
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
      badge: (v: string) => `v${v} · public preview`,
      titleA: "The secure gateway",
      titleB: "for ",
      titleHighlight: "all AI traffic",
      sub: "ThinkWatch is the single control plane through which all model requests and MCP tool calls pass. Each request is authenticated, authorized, rate-limited, logged, and metered.",
      ctaPrimary: "Quick start",
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
        { step: "01", label: "Authenticate", body: "Virtual `tw-` API key validated against PG, scoped to user/team/project." },
        { step: "02", label: "Authorize", body: "Custom RBAC checks model/tool access against the caller's role, scoped to their team if applicable." },
        { step: "03", label: "Rate-limit", body: "Sliding-window RPM/TPM enforced via Redis, per key or per user." },
        { step: "04", label: "Route & convert", body: "Provider selected; request format converted (Anthropic ⇄ OpenAI ⇄ Bedrock ⇄ Gemini)." },
        { step: "05", label: "Stream & meter", body: "SSE forwarded with zero overhead; tokens counted in real-time." },
        { step: "06", label: "Audit", body: "Every call written to ClickHouse and optionally forwarded to a SIEM." },
      ],
    },

    features: {
      eyebrow: "Features",
      title: "Gateway, MCP proxy, RBAC, and analytics ",
      titleHighlight: "in one binary",
      sub: "ThinkWatch is a single Rust binary backed by PostgreSQL, Redis, and ClickHouse. All functions are handled by one control plane, without separate microservices or glue code.",
      modules: [
        {
          id: "ai-gateway",
          label: "AI API Gateway",
          tagline: "A single port for all supported models, with drop-in compatibility.",
          bullets: [
            { title: "Multi-format proxy", body: "OpenAI Chat Completions, Anthropic Messages, and OpenAI Responses APIs on a single port, compatible with Cursor, Continue, Cline, Claude Code, and the official SDKs without modification." },
            { title: "Per-model routing: automatic or manual", body: "Each registered model gets its own routing config: an Auto mode (latency-cost, balanced, latency-only) and a Manual mode with a drag-to-redistribute traffic bar. Health-aware failover drops unhealthy peers via the circuit breaker; the decision log captures provider chosen, why, and any fallback for every request." },
            { title: "Multiple providers and a model-level kill switch", body: "OpenAI, Anthropic, Google Gemini, Azure OpenAI, AWS Bedrock, or any OpenAI-compatible endpoint, with automatic format conversion. A single model can be paused without disabling the whole provider, and every gateway_logs row records the actual upstream_model for unambiguous post-incident review." },
            { title: "Virtual API keys", body: "Issue scoped tw- keys per team, project, or developer. Keys can be revoked in one click; revoked keys are listed in a separate archive tab. Re-rotation is blocked during the grace window so that an emergency rotation cannot interrupt traffic. Plaintext is shown exactly once; SHA-256 hashes are stored at rest." },
            { title: "Rate limits & budget caps", body: "Sliding-window RPM/TPM limits are enforced via Redis per key, user, or team. A pre-call budget check rejects requests once a cap is exhausted, before any upstream tokens are consumed. Hard budget caps fail closed; spend alerts trigger at 50 / 80 / 95 / 100%." },
            { title: "Real-time cost tracking", body: "Per-model pricing with budget alerts and team attribution. SSE pass-through with zero-overhead token counting." },
            { title: "Management API & OpenAPI", body: "API keys, users, and providers can be provisioned programmatically. A full OpenAPI specification ships with the gateway, so key lifecycle management can be integrated into CI pipelines, Terraform, or internal tooling without using the console." },
          ],
        },
        {
          id: "mcp-gateway",
          label: "MCP Gateway",
          tagline: "Per-user OAuth, single-step onboarding, and audit logging for every call.",
          bullets: [
            { title: "Per-user upstream credentials", body: "Each developer authenticates to GitHub, Linear, and Slack under their own identity via OAuth or PAT, so the upstream audit trail is not obscured by a shared service account. The same MCP endpoint serves Alice's Linear data and Bob's, scoped per (user, account_label) end to end." },
            { title: "OAuth onboarding from a server URL", body: "When an MCP server URL is pasted, ThinkWatch handles Dynamic Client Registration, the auth probe, and the OAuth callback, with no manual app registration in each developer portal. A 401/403 response to an anonymous probe is treated as auth-required rather than as a failure." },
            { title: "MCP Store and curated templates", body: "A built-in registry of bilingual templates for popular MCP servers, with a Linear OAuth template included by default. Select Install and enter OAuth client credentials at install time; the wizard completes the remaining steps. Display labels distinguish multiple installations, such as personal and work GitHub accounts." },
            { title: "Tool-level RBAC and per-user catalogs", body: "Controls which roles can invoke which tools. Per-user tool catalogs show each user the tools permitted by their upstream permissions, so the Viewer role cannot gain write access to a production database through MCP." },
            { title: "Connection testing", body: "Test Connection on the /connections page verifies each OAuth or PAT credential against the upstream server. The edit form validates fields according to the auth mode and rejects invalid ones. Tool-call and installation errors are reported with actionable messages for end users." },
            { title: "Scoped audit logging and caching", body: "Every tool invocation is logged with caller, parameters, and response in ClickHouse. The MCP response cache is scoped to (user, account_label), so OAuth/PAT data is never shared across users or accounts. SSRF protection, rate limits, and structured audit apply to every gateway hop." },
            { title: "Downstream SSE streaming", body: "Clients that send Accept: text/event-stream on tools/call receive each upstream event, including notifications/progress, partial results, and the final response, as a discrete SSE event. JSON-only clients receive the buffered response. In both cases the audit row records the full event timeline." },
          ],
        },
        {
          id: "security",
          label: "Security & Compliance",
          tagline: "Defense in depth by default.",
          bullets: [
            { title: "Dual-port architecture", body: "Gateway (:3000, public-facing) and console (:3001, internal-only) on separate ports. Only the gateway should be reachable from the internet." },
            { title: "Custom roles and SSO/OIDC", body: "Built-in system roles and unlimited custom roles are managed in a unified table. Roles can be cloned from any existing role, with permissions edited in CodeMirror and a full audit history of changes. Roles can be assigned at the team level for multi-tenant isolation. Integrates with Zitadel, Okta, Azure AD, or any OIDC provider." },
            { title: "AES-256-GCM at rest", body: "Provider API keys and secrets encrypted at rest. Virtual API keys stored as SHA-256 hashes; plaintext shown exactly once." },
            { title: "HttpOnly cookie sessions", body: "Access and refresh tokens are stored in HttpOnly cookies and are not accessible to JavaScript, which prevents exfiltration through XSS. The refresh endpoint binds each token to the originating client IP, so a stolen cookie cannot be replayed from a different network." },
            { title: "Content filtering & PII redaction", body: "Requests matching custom deny-lists can be blocked, or PII patterns redacted automatically, before they reach upstream providers. Each rule has its own action (block / redact / log), with a live preview in the console." },
            { title: "Distroless containers", body: "2 MB runtime image, no shell, minimal attack surface. JWT entropy enforced at startup; soft-delete with 30-day purge." },
            { title: "allowed_models on every API surface", body: "The per-API-key allowed_models list is enforced uniformly across OpenAI Chat Completions, Anthropic Messages, and OpenAI Responses, so no API surface bypasses the model allowlist. The same enforcement is part of the shared lifecycle pipeline, so future surfaces inherit it automatically." },
          ],
        },
        {
          id: "observability",
          label: "Observability",
          tagline: "Metrics, audit logs, and real-time monitoring for AI traffic.",
          bullets: [
            { title: "Prometheus metrics", body: "GET /metrics on the gateway port: gateway_requests_total, gateway_tokens_total, circuit_breaker_state, and more." },
            { title: "ClickHouse audit logs", body: "SQL-queryable audit logs across all API calls and tool invocations, stored in ClickHouse for high-performance columnar analytics." },
            { title: "Multi-channel forwarding", body: "UDP/TCP Syslog (RFC 5424), Kafka, and HTTP webhooks for routing audit events to any SIEM, data lake, or alerting pipeline." },
            { title: "Health & readiness", body: "/health/live, /health/ready (with PG + Redis checks), and /api/health with detailed latency and pool statistics." },
            { title: "Unified log explorer", body: "Search across audit, gateway, MCP, access, and platform logs from a single page. Selecting any cell filters on its value, -key:value excludes a value, and the full query state is persisted in the URL." },
            { title: "Live dashboard", body: "The console overview streams real-time stats over a persistent WebSocket. Request rates, error counts, token spend, and upstream health update without a page refresh." },
            { title: "Full-body audit capture", body: "Every gateway and MCP call persists request + response bodies (and tool_arguments + tool_result on MCP) into ClickHouse alongside the metadata row, with ZSTD compression, per-column TTL, and at-write PII redaction. Oversize payloads transparently offload to S3 / MinIO / the bundled RustFS; auditors query them via the body viewer in the logs detail panel or run cross-row substring search backed by a bloom-filter index. Gated by a separate audit:read_bodies permission." },
          ],
        },
        {
          id: "teams",
          label: "Teams",
          tagline: "Isolation boundaries for each business unit.",
          bullets: [
            { title: "Team workspaces", body: "Teams can be created and members invited. Each unit operates in full isolation, with its own analytics view, user list, and API key namespace." },
            { title: "Scoped API keys", body: "Virtual tw- keys are issued within a team scope. A key that belongs to team A cannot consume team B's budget or appear in team B's logs." },
            { title: "Team-level role assignments", body: "The same user can be a Developer in team A and a Viewer in team B. Roles granted at the team scope apply only within that team and grant no global privileges." },
            { title: "Per-team cost attribution", body: "Dashboard metrics, token spend, and request counts are broken down by team by default. Spend per team is available without post-processing or log correlation." },
            { title: "Per-team spending limits", body: "Rate limits and budget caps can be scoped to a team. Each unit operates within its own quota; overruns in one team do not affect other teams." },
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
        { label: "Tool-level RBAC and per-user tool catalogs", values: ["yes", "limited", "no"] },
        { label: "Full audit trail in ClickHouse (queryable, forwardable)", values: ["yes", "hosted-only", "no"] },
        { label: "Response cache scoped per (user, account_label)", values: ["yes", "n/a", "no"] },
        { label: "Self-hosted, single Rust binary, distroless", values: ["yes", "saas", "varies"] },
        { label: "Bilingual UI out of the box (English + 中文)", values: ["yes", "english", "no"] },
        { label: "BSL 1.1: free for non-production and small production use", values: ["yes", "proprietary", "oss"] },
      ],
      cardsTitle: "Capabilities",
      cards: [
        { title: "Per-user upstream identity", body: "With per-user OAuth, GitHub issues are created by Alice and Linear tickets are assigned to Bob, rather than to a shared mcp-bot service account. Audit trails extend end to end, from the IDE through ThinkWatch to the upstream system." },
        { title: "Onboarding through Dynamic Client Registration", body: "Dynamic Client Registration performs the OAuth handshake. The connection is established once the server URL is pasted and access is approved on the consent page, with no app registration or manual copying of client_id and secret." },
        { title: "Access control for tools", body: "Tool-level RBAC and per-user tool catalogs ensure that each user sees only the tools permitted by their role and upstream account. The Viewer role cannot gain write access to production through an MCP tool." },
        { title: "Fully self-hosted", body: "ThinkWatch is a single self-hosted Rust binary backed by Postgres, Redis, and ClickHouse. There is no SaaS lock-in, and MCP traffic does not leave the network perimeter." },
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
        { title: "Finish the setup wizard", body: "Create the super_admin account, configure the site, and optionally add the first provider and API key." },
      ],
    },

    license: {
      eyebrow: "License",
      title: "Source-available, ",
      titleHighlight: "with a free production tier",
      sub: "ThinkWatch is licensed under the Business Source License 1.1. Non-production use is free without time limit, and production use is free up to monthly thresholds; a commercial license is required above them.",
      mostTeams: "Most teams",
      footnote: ["\"Billable Token\" and \"MCP Tool Call\" definitions, the tiering model, and the changeover to GPL-2.0-or-later are all detailed in ", "LICENSING.md", "."],
      tiers: [
        {
          name: "Non-production",
          price: "Free",
          priceNote: "forever",
          audience: "Development, staging, evaluation, internal demos.",
          features: ["Unlimited tokens", "Unlimited MCP tool calls", "All gateway features", "All security features", "Community support"],
          ctaLabel: "Self-host",
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
      title: "Project ",
      titleHighlight: "activity",
      sub: "ThinkWatch is developed in the open. Star the repository to follow releases and contribute to the roadmap.",
      cta: "Star on GitHub",
    },

    footer: {
      tagline: "A gateway between AI clients and the models they call.",
      product: "Products",
      resources: "Resources",
      licensing: "ThinkWatch is licensed under BSL 1.1. ThinkWatch Lite and ThinkWatch Core are licensed under MIT.",
      copyright: "",
      builtWith: "Built with Astro · Deployed on GitHub Pages",
    },

    notFound: {
      title: "404: Page not found · ThinkWatch",
      description: "The page you were looking for could not be found.",
      headline: "Page not found",
      sub: "The link may be out of date, or the page may have moved. The links below lead to the main sections of the site.",
      home: "Home",
      thinkwatch: "ThinkWatch",
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
      thinkwatch: "ThinkWatch",
      lite: "Lite",
      core: "Core",
      license: "许可证",
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
      badge: (v: string) => `v${v} · 公开预览`,
      titleA: "面向所有 AI 流量",
      titleB: "的",
      titleHighlight: "安全网关",
      sub: "ThinkWatch 是组织内所有模型请求与 MCP 工具调用的统一控制平面。每一次访问均经过认证、授权、限流、记录与计量。",
      ctaPrimary: "快速开始",
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
        { step: "01", label: "身份认证", body: "在 PostgreSQL 中校验虚拟 `tw-` API 密钥，范围限定到用户/团队/项目级别。" },
        { step: "02", label: "权限授权", body: "自定义 RBAC 根据调用方角色检查模型与工具的访问权限，如有团队上下文则在团队粒度内校验。" },
        { step: "03", label: "限流", body: "Redis 实现的滑动窗口 RPM/TPM 限制，可按密钥或按用户。" },
        { step: "04", label: "路由与转换", body: "选择 Provider 并自动转换请求格式（Anthropic ⇄ OpenAI ⇄ Bedrock ⇄ Gemini）。" },
        { step: "05", label: "流式转发与计量", body: "SSE 零开销转发，token 实时计数。" },
        { step: "06", label: "审计", body: "每次调用写入 ClickHouse，并可选择转发至 SIEM。" },
      ],
    },

    features: {
      eyebrow: "功能特性",
      title: "网关、MCP 代理、RBAC 与分析",
      titleHighlight: "集成于单一二进制",
      sub: "ThinkWatch 是单一 Rust 二进制程序，依赖 PostgreSQL、Redis 与 ClickHouse。所有功能由同一控制平面处理，无需拆分微服务或编写粘合代码。",
      modules: [
        {
          id: "ai-gateway",
          label: "AI API 网关",
          tagline: "单一端口接入所有支持的模型，可直接替换现有接入。",
          bullets: [
            { title: "多格式代理", body: "OpenAI Chat Completions、Anthropic Messages、OpenAI Responses 三种 API 在同一端口提供，Cursor、Continue、Cline、Claude Code 及官方 SDK 无需修改即可接入。" },
            { title: "按模型路由：自动或手动", body: "每个已注册模型都有独立的路由配置：Auto 模式（latency-cost / balanced / latency-only）或 Manual 模式（拖拽式流量分配条）。健康感知的故障转移通过熔断器自动剔除不健康节点；决策日志为每个请求记录所选 Provider、原因以及任何回退方案。" },
            { title: "多 Provider 与模型级开关", body: "OpenAI、Anthropic、Google Gemini、Azure OpenAI、AWS Bedrock，或任意 OpenAI 兼容端点，请求格式自动转换。可在不影响整个 Provider 的前提下暂停单个模型；每行 gateway_logs 均记录实际的 upstream_model，确保事故复盘准确无歧义。" },
            { title: "虚拟 API 密钥", body: "按团队、项目或开发者签发限定范围的 tw- 密钥，支持一键吊销，已吊销的密钥归入独立的归档分页。轮换宽限期内禁止再次轮换，避免应急轮换导致流量中断。明文仅展示一次，存储为 SHA-256 哈希。" },
            { title: "限流与预算上限", body: "基于 Redis 的滑动窗口 RPM/TPM 限制，可按密钥、用户或团队设置。Pre-call 预算检查在请求送达上游之前拒绝已超出上限的调用，避免上游 token 在事后扣账前被消耗。硬性预算上限采用 fail-closed 策略；消费达到 50 / 80 / 95 / 100% 时触发预警。" },
            { title: "实时成本追踪", body: "按模型计价，含预算告警与团队归因。SSE 零开销转发，token 实时计数。" },
            { title: "管理 API 与 OpenAPI 文档", body: "通过程序化接口管理 API 密钥、用户和 Provider。网关附带完整 OpenAPI 规范，可将密钥生命周期集成到 CI 流水线、Terraform 或自有工具链，无需使用控制台。" },
          ],
        },
        {
          id: "mcp-gateway",
          label: "MCP 网关",
          tagline: "按用户 OAuth、一键接入与全量审计。",
          bullets: [
            { title: "按用户的上游凭证", body: "每位开发者通过 OAuth 或 PAT 以本人身份访问 GitHub、Linear、Slack，上游审计轨迹不会因共享服务账号而失真。同一个 MCP 端点为 Alice 和 Bob 提供各自的 Linear 数据，全程按 (user, account_label) 严格隔离。" },
            { title: "一键 OAuth 接入", body: "粘贴 MCP 服务器 URL 后，ThinkWatch 自动完成 Dynamic Client Registration、鉴权探测与 OAuth 回调，无需在各开发者门户中手动注册应用。匿名探测返回的 401/403 被识别为「需要鉴权」，而非「失败」。" },
            { title: "MCP Store 与模板市场", body: "内置双语模板注册表，覆盖主流 MCP 服务器，开箱即包含 Linear OAuth 模板。点击安装并填入 OAuth 客户端凭证后，由向导完成其余流程。Display Label 用于区分多次安装（如个人与工作 GitHub 账号）。" },
            { title: "工具级 RBAC 与用户工具目录", body: "精确控制各角色可调用的工具。按用户的工具目录根据上游权限向不同用户展示不同的工具集，Viewer 角色无法通过 MCP 工具获得生产数据库的写入权限。" },
            { title: "连接测试", body: "/connections 页面为每个凭证提供 Test Connection，用于验证 OAuth/PAT 能否连接上游服务器。编辑表单根据鉴权模式校验字段，拒绝保存错误字段。工具调用或安装失败时，向终端用户返回清晰、可操作的错误信息。" },
            { title: "审计与缓存隔离", body: "每一次工具调用的调用方、参数与响应均记录到 ClickHouse。MCP 响应缓存按 (user, account_label) 维度隔离，OAuth/PAT 数据不会跨用户或账号共享。每一跳均启用 SSRF 防护、限流与结构化审计。" },
            { title: "下游 SSE 流式响应", body: "客户端在 tools/call 上声明 Accept: text/event-stream 即可逐事件接收上游响应，notifications/progress、中间结果与最终结果均作为独立 SSE 事件下发。仅支持 JSON 的客户端仍接收缓冲格式。两种方式下，审计行均完整记录事件时间线。" },
          ],
        },
        {
          id: "security",
          label: "安全与合规",
          tagline: "默认启用纵深防御。",
          bullets: [
            { title: "双端口架构", body: "网关（:3000，对外）与控制台（:3001，对内）分离。只有网关应当对公网暴露。" },
            { title: "自定义角色 + SSO/OIDC", body: "内置系统角色与不限数量的自定义角色统一管理。可从任意现有角色克隆为起点，在 CodeMirror 中编辑权限，并审计完整的变更历史。角色可在团队粒度授权，实现多租户隔离。支持对接 Zitadel、Okta、Azure AD 或任意 OIDC Provider。" },
            { title: "AES-256-GCM 静态加密", body: "Provider API Key 与机密信息静态加密。虚拟密钥以 SHA-256 哈希存储，明文只展示一次。" },
            { title: "HttpOnly Cookie 会话", body: "访问令牌和刷新令牌均存储在 HttpOnly Cookie 中，JavaScript 无法读取，XSS 攻击无法窃取会话。刷新端点将每个令牌绑定到来源客户端 IP，被盗 Cookie 无法跨网络重放。" },
            { title: "内容过滤与 PII 脱敏", body: "在请求到达上游 Provider 之前，拦截匹配自定义禁止列表的内容，或自动脱敏 PII 字段。每条规则可独立配置动作（拦截 / 脱敏 / 仅记录），控制台提供实时预览。" },
            { title: "Distroless 容器", body: "2 MB 运行时镜像，无 shell，攻击面最小化。启动时强制 JWT 熵校验；软删除 30 天后自动清理。" },
            { title: "allowed_models 在全部 API 表面生效", body: "每个 API 密钥的 allowed_models 白名单在 OpenAI Chat Completions、Anthropic Messages、OpenAI Responses 三个 API 表面一致生效，任何 API 表面均无法绕过模型白名单。该机制已接入共享生命周期管线，未来新增的表面将自动继承。" },
          ],
        },
        {
          id: "observability",
          label: "可观测性",
          tagline: "面向 AI 流量的指标、审计日志与实时监控。",
          bullets: [
            { title: "Prometheus 指标", body: "网关端口的 GET /metrics 暴露 gateway_requests_total、gateway_tokens_total、circuit_breaker_state 等指标。" },
            { title: "ClickHouse 审计日志", body: "所有 API 调用与工具调用的审计日志可 SQL 查询，存储于 ClickHouse 列式 OLAP 数据库以获得高性能。" },
            { title: "多通道转发", body: "UDP/TCP Syslog（RFC 5424）、Kafka、HTTP Webhook，可将审计事件转发至任意 SIEM、数据湖或告警系统。" },
            { title: "健康与就绪", body: "/health/live、/health/ready（含 PG + Redis 检查）以及 /api/health 提供详细延迟与连接池统计。" },
            { title: "统一日志检索", body: "在同一页面搜索审计、网关、MCP、访问、平台等所有日志。点击任意单元格即可筛选，用 -key:value 排除指定条件，查询状态完整持久化到 URL。" },
            { title: "实时看板", body: "控制台总览通过持久 WebSocket 实时推送统计数据，请求速率、错误数、token 消耗和上游健康状态无需刷新页面即可更新。" },
            { title: "全量请求 / 响应体审计", body: "每一次 Gateway 和 MCP 调用都将 request_body / response_body（以及 MCP 的 tool_arguments / tool_result）和元数据一同写入 ClickHouse，启用 ZSTD 压缩、按列 TTL，并支持落盘前 PII 脱敏。超大载荷透明卸载到 S3 / MinIO / 内置 RustFS；审计员通过日志详情面板的「Body Viewer」查看，或用基于布隆过滤器索引的子串搜索跨行检索。访问由独立的 audit:read_bodies 权限控制。" },
          ],
        },
        {
          id: "teams",
          label: "团队",
          tagline: "为每个业务单元提供独立的隔离边界。",
          bullets: [
            { title: "团队工作区", body: "创建团队、邀请成员，每个业务单元拥有完全隔离的环境，包括独立的分析看板、用户列表与 API 密钥命名空间。" },
            { title: "团队范围密钥", body: "虚拟 tw- 密钥可在团队范围内签发。A 团队的密钥无法消耗 B 团队的预算，也不会出现在 B 团队的日志中。" },
            { title: "团队级角色授权", body: "同一用户可在 A 团队担任 Developer、在 B 团队担任 Viewer。在团队粒度授予的角色仅在该团队内生效，不产生全局越权。" },
            { title: "按团队成本归因", body: "看板指标、token 消耗和请求数默认按团队划分，无需事后处理或关联日志即可查看各团队的支出。" },
            { title: "按团队限额", body: "限流规则和预算上限可绑定到团队。每个业务单元在自己的配额内独立运行，一个团队超限不影响其他团队。" },
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
        { label: "工具级 RBAC 与用户工具目录", values: ["yes", "limited", "no"] },
        { label: "ClickHouse 全量审计（可查询、可转发）", values: ["yes", "hosted-only", "no"] },
        { label: "响应缓存按 (user, account_label) 隔离", values: ["yes", "n/a", "no"] },
        { label: "可自托管，单一 Rust 二进制（distroless）", values: ["yes", "saas", "varies"] },
        { label: "开箱即用的中英双语界面", values: ["yes", "english", "no"] },
        { label: "BSL 1.1：非生产与小规模生产环境免费", values: ["yes", "proprietary", "oss"] },
      ],
      cardsTitle: "核心能力",
      cards: [
        { title: "按用户的上游身份", body: "按用户的 OAuth 使 GitHub Issue 由 Alice 创建、Linear 工单分配给 Bob，而非统一归属于 mcp-bot 服务账号。审计轨迹端到端贯通：从 IDE 经由 ThinkWatch 直至上游系统。" },
        { title: "基于 Dynamic Client Registration 的接入", body: "Dynamic Client Registration 自动完成 OAuth 握手。粘贴服务器 URL 并在授权页确认后即可完成连接，无需注册应用，也无需手动复制 client_id/secret。" },
        { title: "工具访问控制", body: "工具级 RBAC 与按用户的工具目录，确保每位用户仅能看到其角色与上游账号实际可用的工具。Viewer 角色无法通过 MCP 工具获得生产环境的写入权限。" },
        { title: "完全自托管", body: "ThinkWatch 是可自托管的单一 Rust 二进制程序，依赖 Postgres、Redis 与 ClickHouse。无 SaaS 锁定，MCP 流量不离开组织网络边界。" },
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
        { title: "完成设置向导", body: "创建超级管理员账号、配置站点，并可选添加第一个 Provider 和 API Key。" },
      ],
    },

    license: {
      eyebrow: "许可证",
      title: "源码可用，",
      titleHighlight: "提供生产环境免费额度",
      sub: "ThinkWatch 采用 Business Source License 1.1。非生产环境永久免费；生产环境在每月阈值内同样免费，超出阈值需获取商业许可证。",
      mostTeams: "适合大多数团队",
      footnote: ["「计费 token」和「MCP 工具调用」的定义、阶梯计费模型，以及到 GPL-2.0-or-later 的转换条款，详见 ", "LICENSING.md", "。"],
      tiers: [
        {
          name: "非生产环境",
          price: "免费",
          priceNote: "永久",
          audience: "开发、预发、评估、内部演示。",
          features: ["token 不限量", "MCP 工具调用不限量", "全部网关功能", "全部安全功能", "社区支持"],
          ctaLabel: "自托管部署",
        },
        {
          name: "生产环境 · 免费层",
          price: "免费",
          priceNote: "阈值内",
          audience: "运行生产负载的小团队。",
          features: ["每月最多 10,000,000 计费 token", "每月最多 10,000 次 MCP 工具调用", "包含全部功能", "BSL 1.1 许可证", "Change Date 后自动转为 GPL-2.0-or-later"],
          ctaLabel: "阅读许可证条款",
        },
        {
          name: "生产环境 · 商业",
          price: "阶梯",
          priceNote: "按用量",
          audience: "超出免费阈值的组织。",
          features: ["每 UTC 月超过 1000 万 token 或 1 万次 MCP 调用", "需要商业许可证", "按用量阶梯计费", "可选优先支持", "定制部署咨询"],
          ctaLabel: "联系销售",
        },
      ],
    },

    star: {
      eyebrow: "社区",
      title: "项目",
      titleHighlight: "动态",
      sub: "ThinkWatch 采用开放开发模式。Star 仓库即可关注版本发布，并参与路线图讨论。",
      cta: "在 GitHub 上 Star",
    },

    footer: {
      tagline: "位于 AI 客户端与模型之间的网关。",
      product: "产品",
      resources: "资源",
      licensing: "ThinkWatch 采用 BSL 1.1 许可证。ThinkWatch Lite 与 ThinkWatch Core 采用 MIT 许可证。",
      copyright: "",
      builtWith: "由 Astro 构建 · 部署于 GitHub Pages",
    },

    notFound: {
      title: "404：页面未找到 · ThinkWatch",
      description: "所访问的页面不存在。",
      headline: "页面不存在",
      sub: "链接可能已失效，或页面已被移动。可通过以下链接访问网站的主要页面。",
      home: "首页",
      thinkwatch: "ThinkWatch",
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
