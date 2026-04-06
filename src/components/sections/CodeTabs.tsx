import { useState } from "react";

export type Snippet = {
  id: string;
  label: string;
  /** Pre-highlighted HTML from shiki (server-rendered at build time). */
  html: string;
  /** Raw source for copy-to-clipboard. */
  raw: string;
};

export default function CodeTabs({ snippets }: { snippets: Snippet[] }) {
  const [active, setActive] = useState(snippets[0].id);
  const [copied, setCopied] = useState(false);
  const current = snippets.find((s) => s.id === active)!;

  const onCopy = async () => {
    await navigator.clipboard.writeText(current.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/80 overflow-hidden backdrop-blur-sm">
      {/* Tab bar */}
      <div className="flex items-center border-b border-white/10 bg-black/40">
        <div role="tablist" className="flex gap-1 p-2 overflow-x-auto flex-1">
          {snippets.map((s) => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                role="tab"
                aria-selected={isActive}
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
          aria-label="Copy code"
          className="text-xs text-[var(--color-muted)] hover:text-white px-4 py-2 border-l border-white/10 transition-colors"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* Code body — Shiki HTML rendered as-is */}
      <div
        className="shiki-host text-sm leading-relaxed font-mono overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: current.html }}
      />
    </div>
  );
}
