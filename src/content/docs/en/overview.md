# ThinkWatch Enterprise

ThinkWatch Enterprise is a self-hosted AI API and MCP gateway for organizations. Every model request and every MCP tool call passes through one gateway, where it is authenticated against the organization's identity provider, checked against limits and budgets, inspected by security guards, priced, and written to the audit log. It plays the role for AI access that a bastion host plays for server access.

> It is [deployed](/docs/deployment-guide) with Docker Compose or the Kubernetes Helm chart. Clients only need to reach the gateway on port 3000; the console on port 3001 serves the management UI and admin API and belongs behind a VPN or firewall.

## Highlights

- **MCP tool calls run as the real user.** Each user connects their own GitHub, Notion, Linear, Slack or Atlassian account, so the upstream's own audit log shows who acted. Each tool can be granted per role and per API key.
- **Security guards on every request.** Credentials and personal information can be replaced with placeholders before a request goes upstream and restored in the answer, and a dangerous tool call in a model response can be cut off before the client runs it. A content filter can refuse prompt injection or delete hidden characters from what the caller sends; every guard ships in observe mode, which only records.
- **Identity from the organization's directory.** Sign-in works through any OIDC provider, with optional TOTP. Five built-in roles and custom roles decide who may use which models, tools and admin pages.
- **One key for AI and MCP.** `tw-` virtual keys can be scoped to the AI gateway, the MCP gateway or both. Keys are stored only as hashes and rotate with a grace period.
- **Rate limits and budgets.** Sliding windows from one minute to one week limit requests or tokens, and daily, weekly or monthly budgets cap spending. Both attach to users, API keys or roles.
- **Cost accounting that finance can use.** Spend is reported by model, user, provider and cost center, with CSV chargeback reports. A month-end forecast comes with it.
- **Audit trail in ClickHouse.** Every model request and tool call is recorded with user, parameters, response, latency and errors. Events can be forwarded to a SIEM over Syslog, Kafka or signed webhooks.
- **One endpoint for every client.** OpenAI Chat Completions, OpenAI Responses, Anthropic Messages and Gemini requests are served on one port and converted to whatever the upstream speaks. Routing spreads traffic by weight, latency or health, and a circuit breaker takes failing upstreams out of rotation.

## Reading order

1. [Architecture](/docs/architecture): the dual-port model, the request lifecycle and the data flow.
2. [Deployment Guide](/docs/deployment-guide): Docker Compose, the Helm chart, TLS and production hardening.
3. [Configuration](/docs/configuration): environment variables and system settings.
4. [Security](/docs/security): authentication, encryption, RBAC and the hardening checklist.

ThinkWatch Enterprise is source-available under the Business Source License 1.1: free for non-production use, and free in production up to monthly thresholds. See [Pricing](/pricing).
