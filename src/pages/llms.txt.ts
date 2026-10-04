// /llms.txt: a plain-text map of the site for language models and the AI search
// engines that read it (https://llmstxt.org). The facts are short and stated
// once; each documentation entry links to its page. /llms-full.txt carries the
// full text of the ThinkWatch Lite and ThinkWatch Core documentation.
import type { APIContext } from "astro";
import { docHref, getProduct, type ProductId } from "~/content/docs/_meta";

function docList(id: ProductId, site: URL): string {
  return getProduct(id)
    .docs.filter((d) => d.locales.includes("en"))
    .map((d) => {
      const url = new URL(docHref("en", id, d), site).href.replace(/\/?$/, "/");
      return d.summary?.en ? `- [${d.label.en}](${url}): ${d.summary.en}` : `- [${d.label.en}](${url})`;
    })
    .join("\n");
}

export function GET(context: APIContext) {
  const site = context.site!;
  const at = (path: string) => new URL(path, site).href;
  const body = `# ThinkWatch

> AI gateways that route, inspect and meter model requests and MCP tool calls. ThinkWatch Lite is an MIT-licensed desktop app that runs a local gateway for Claude Code, Codex and other AI clients; ThinkWatch Enterprise is a self-hosted gateway for organizations; ThinkWatch Core is the MIT-licensed gateway engine both are built on.

## ThinkWatch Lite

ThinkWatch Lite runs a local AI API gateway on macOS (Apple silicon), Windows (x64, ARM64) and Linux (AppImage). Source: https://github.com/ThinkWatchProject/ThinkWatch-Lite (MIT).

- Connects twelve clients to the gateway in one step, showing the change and backing up the original file: Claude Code, Claude Desktop, Codex (including the Codex in the ChatGPT desktop app), opencode, Zed, Aider, DeepSeek Harness, Pi, oh-my-pi, Grok Build, Qwen Code and Hermes Agent. Cursor, Continue and Antigravity CLI have manual setup steps.
- After that, upstreams and models change inside the gateway; client configuration files are not edited again and clients do not restart.
- Converts between the Anthropic Messages, OpenAI Chat Completions, OpenAI Responses and Gemini APIs, so Claude Code can use GPT or Gemini models and Codex can use upstreams that only offer Chat Completions.
- Upstreams: API keys for Anthropic, OpenAI, Gemini, DeepSeek, Amazon Bedrock and any compatible API, relays such as OpenRouter, local models such as Ollama, and ChatGPT or Z.ai accounts signed in from the app.
- Routing rules match on model, token count, tools, images and extended thinking, and can rewrite the model name. Strategy groups: in order (failover), round robin with session affinity, lowest latency, lowest cost, manual selection.
- Every request records its cost, tokens, cache hits, time to first token, generation speed, the rule it matched, each upstream it tried, and the full request and response.
- Before a request leaves, API keys, tokens, private keys, ID numbers and card numbers can be replaced with placeholders, so a relay does not receive them. Tool calls that download and run code or send out credentials can be cut off mid-stream. MCP servers, skills and hooks are scanned.
- Claude Pro and Max subscriptions cannot be used through the gateway; Claude Code needs an API key or a relay.
- Install on macOS: \`brew install --cask thinkwatchproject/tap/thinkwatch-lite\`. Downloads for every platform: ${at("/lite/#install")}

- [ThinkWatch Lite product page](${at("/lite/")})
${docList("lite", site)}

## ThinkWatch Core

The gateway engine shared by ThinkWatch Lite and ThinkWatch Enterprise: Rust crates and the twcore binary, which also runs on its own on a Linux server that ThinkWatch Lite manages remotely. Source: https://github.com/ThinkWatchProject/ThinkWatch-Core (MIT).

- [ThinkWatch Core product page](${at("/core/")})
${docList("core", site)}

## ThinkWatch Enterprise

A self-hosted AI API and MCP gateway for organizations, with a web console: single sign-on through OIDC, role-based access, virtual API keys, per-user MCP identity, limits and budgets, and audit logs. Deployed with Docker Compose or Kubernetes. Source: https://github.com/ThinkWatchProject/ThinkWatch (Business Source License 1.1).

- [ThinkWatch Enterprise product page](${at("/thinkwatch/")})
${docList("thinkwatch", site)}

## Optional

- [Pricing and licensing](${at("/pricing/")})
- [Changelog](${at("/changelog/")}): release notes of all three products
- [Full text of the Lite and Core documentation](${at("/llms-full.txt")})
- [Simplified Chinese site](${at("/zh-CN/")})
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
