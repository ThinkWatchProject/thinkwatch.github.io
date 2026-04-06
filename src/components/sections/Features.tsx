import { useState } from "react";

type Module = {
  id: string;
  label: string;
  tagline: string;
  bullets: { title: string; body: string }[];
};

const modules: Module[] = [
  {
    id: "ai-gateway",
    label: "AI API Gateway",
    tagline: "One port. Every model. Drop-in compatible.",
    bullets: [
      {
        title: "Multi-format proxy",
        body: "OpenAI Chat Completions, Anthropic Messages, and OpenAI Responses APIs on a single port — drop-in for Cursor, Continue, Cline, Claude Code, and the official SDKs.",
      },
      {
        title: "Multi-provider routing",
        body: "OpenAI, Anthropic, Google Gemini, Azure OpenAI, AWS Bedrock, or any OpenAI-compatible endpoint. Format conversion is automatic.",
      },
      {
        title: "Virtual API keys",
        body: "Issue scoped tw- keys per team, project, or developer. Revoke in one click. Plaintext shown exactly once; SHA-256 hashes at rest.",
      },
      {
        title: "Sliding-window rate limits",
        body: "RPM and TPM enforced via Redis, per key or per user. Circuit breaker (Closed/Open/HalfOpen) and exponential-backoff retries built in.",
      },
      {
        title: "Real-time cost tracking",
        body: "Per-model pricing with budget alerts and team attribution. SSE pass-through with zero-overhead token counting.",
      },
    ],
  },
  {
    id: "mcp-gateway",
    label: "MCP Gateway",
    tagline: "Aggregate every MCP tool behind one endpoint.",
    bullets: [
      {
        title: "Centralized tool proxy",
        body: "One MCP endpoint that aggregates tools from all upstream servers. No more scattering MCP configs across editors.",
      },
      {
        title: "Namespace isolation",
        body: "github__create_issue, postgres__query — no tool name collisions, ever, even across hundreds of upstream servers.",
      },
      {
        title: "Tool-level RBAC",
        body: "Control exactly which users or roles can invoke which tools. Combine with the 5-tier RBAC model for least-privilege access.",
      },
      {
        title: "Connection pooling & health",
        body: "Automatic reconnection, background health checks, and per-server status surfaced in the console.",
      },
      {
        title: "Full audit trail",
        body: "Every tool invocation logged with caller, parameters, and response — queryable in ClickHouse.",
      },
    ],
  },
  {
    id: "security",
    label: "Security & Compliance",
    tagline: "Defense in depth, by default.",
    bullets: [
      {
        title: "Dual-port architecture",
        body: "Gateway (:3000, public-facing) and console (:3001, internal-only) on separate ports. Only the gateway should be reachable from the internet.",
      },
      {
        title: "5-tier RBAC + SSO/OIDC",
        body: "Super Admin, Admin, Team Manager, Developer, Viewer. Plug into Zitadel, Okta, Azure AD, or any OIDC provider.",
      },
      {
        title: "AES-256-GCM at rest",
        body: "Provider API keys and secrets encrypted at rest. Virtual API keys stored as SHA-256 hashes; plaintext shown exactly once.",
      },
      {
        title: "Hardened HTTP layer",
        body: "CSP headers, X-Frame-Options, CORS whitelist, request timeouts. Admin sessions bound to client IP — stolen tokens cannot be replayed.",
      },
      {
        title: "Distroless containers",
        body: "2 MB runtime image, no shell, minimal attack surface. JWT entropy enforced at startup; soft-delete with 30-day purge.",
      },
    ],
  },
  {
    id: "observability",
    label: "Observability",
    tagline: "Know exactly what your AI is doing.",
    bullets: [
      {
        title: "Prometheus metrics",
        body: "GET /metrics on the gateway port: gateway_requests_total, gateway_tokens_total, circuit_breaker_state, and more.",
      },
      {
        title: "ClickHouse audit logs",
        body: "SQL-queryable audit logs across all API calls and tool invocations, stored in ClickHouse for high-performance columnar analytics.",
      },
      {
        title: "Multi-channel forwarding",
        body: "UDP/TCP Syslog (RFC 5424), Kafka, and HTTP webhooks — route audit events to any SIEM, data lake, or alerting pipeline.",
      },
      {
        title: "Health & readiness",
        body: "/health/live, /health/ready (with PG + Redis checks), and /api/health with detailed latency and pool statistics.",
      },
      {
        title: "Unified log explorer",
        body: "Search across audit, gateway, MCP, access, and platform logs from a single page with structured query syntax.",
      },
    ],
  },
];

export default function Features() {
  const [active, setActive] = useState(modules[0].id);
  const current = modules.find((m) => m.id === active)!;

  return (
    <div className="mt-14">
      {/* Tab strip */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {modules.map((m) => {
          const isActive = m.id === active;
          return (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "text-white bg-white/[0.06]"
                  : "text-[var(--color-muted)] hover:text-white"
              }`}
            >
              {m.label}
              {isActive && (
                <span className="absolute inset-x-3 -bottom-[17px] h-px bg-gradient-to-r from-[var(--color-brand-1)] to-[var(--color-brand-2)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tagline */}
      <div className="mt-10 mb-8 max-w-2xl">
        <p className="text-2xl md:text-3xl font-semibold tracking-tight text-gradient">
          {current.tagline}
        </p>
      </div>

      {/* Bullets grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {current.bullets.map((b, i) => (
          <div
            key={b.title}
            className="rounded-xl border border-white/10 bg-[var(--color-surface)]/60 p-6 hover:border-white/25 transition-colors animate-[fadeUp_400ms_ease-out_both]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-1)] shrink-0" />
              <div>
                <h4 className="font-semibold tracking-tight mb-1.5">{b.title}</h4>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{b.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
