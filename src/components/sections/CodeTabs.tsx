import { useState } from "react";

type Snippet = {
  id: string;
  label: string;
  language: string;
  code: string;
};

const snippets: Snippet[] = [
  {
    id: "curl",
    label: "cURL",
    language: "bash",
    code: `curl https://gateway.your-org.com/v1/chat/completions \\
  -H "Authorization: Bearer tw-prod-xxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello"}],
    "stream": true
  }'`,
  },
  {
    id: "openai",
    label: "OpenAI SDK",
    language: "python",
    code: `from openai import OpenAI

client = OpenAI(
    base_url="https://gateway.your-org.com/v1",
    api_key="tw-prod-xxxxxxxxxxxxxxxxx",
)

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}],
    stream=True,
)
for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")`,
  },
  {
    id: "anthropic",
    label: "Anthropic SDK",
    language: "python",
    code: `from anthropic import Anthropic

client = Anthropic(
    base_url="https://gateway.your-org.com",
    api_key="tw-prod-xxxxxxxxxxxxxxxxx",
)

with client.messages.stream(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
) as stream:
    for text in stream.text_stream:
        print(text, end="")`,
  },
  {
    id: "claude-code",
    label: "Claude Code",
    language: "bash",
    code: `# ~/.config/claude-code/settings.json
{
  "anthropicBaseUrl": "https://gateway.your-org.com",
  "anthropicApiKey": "tw-prod-xxxxxxxxxxxxxxxxx"
}

# Or via environment
export ANTHROPIC_BASE_URL=https://gateway.your-org.com
export ANTHROPIC_API_KEY=tw-prod-xxxxxxxxxxxxxxxxx`,
  },
  {
    id: "cursor",
    label: "Cursor",
    language: "json",
    code: `// Cursor → Settings → Models → OpenAI API Key
{
  "openai.apiKey": "tw-prod-xxxxxxxxxxxxxxxxx",
  "openai.baseUrl": "https://gateway.your-org.com/v1"
}

// Cursor will auto-discover the available models
// from /v1/models on the gateway.`,
  },
];

// Minimal token-based highlighting
function highlight(code: string, lang: string) {
  const keywords =
    /\b(import|from|with|as|for|in|return|def|class|const|let|var|function|export|if|else|true|false|null|new|stream|max_tokens|model|messages|role|content)\b/g;
  const strings = /(["'`])(?:\\.|(?!\1).)*\1/g;
  const numbers = /\b\d+\b/g;
  const comments = lang === "bash" ? /#.*$/gm : /\/\/.*$|#.*$/gm;
  const flags = /(--?[a-zA-Z][\w-]*)/g;

  // Apply in reverse order — strings/comments first, then keywords
  const placeholders: string[] = [];
  const stash = (s: string) => {
    placeholders.push(s);
    return `\u0000${placeholders.length - 1}\u0000`;
  };

  let out = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(comments, (m) => stash(`<span class="text-[#6b7280] italic">${m}</span>`))
    .replace(strings, (m) => stash(`<span class="text-[#86efac]">${m}</span>`))
    .replace(numbers, (m) => `<span class="text-[#fbbf24]">${m}</span>`)
    .replace(keywords, `<span class="text-[#c4b5fd]">$1</span>`)
    .replace(flags, `<span class="text-[#67e8f9]">$1</span>`);

  out = out.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[Number(i)]);
  return out;
}

export default function CodeTabs() {
  const [active, setActive] = useState(snippets[0].id);
  const [copied, setCopied] = useState(false);
  const current = snippets.find((s) => s.id === active)!;

  const onCopy = async () => {
    await navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/80 overflow-hidden backdrop-blur-sm">
      {/* Tab bar */}
      <div className="flex items-center border-b border-white/10 bg-black/40">
        <div className="flex gap-1 p-2 overflow-x-auto flex-1 scrollbar-none">
          {snippets.map((s) => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-white/[0.08] text-white"
                    : "text-[var(--color-muted)] hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        <button
          onClick={onCopy}
          className="text-xs text-[var(--color-muted)] hover:text-white px-4 py-2 border-l border-white/10 transition-colors"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Code body */}
      <pre className="p-5 md:p-6 overflow-x-auto text-sm leading-relaxed font-mono">
        <code
          className="text-[var(--color-text)]"
          dangerouslySetInnerHTML={{ __html: highlight(current.code, current.language) }}
        />
      </pre>
    </div>
  );
}
