import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";

type Frame = {
  kind: "prompt" | "stream" | "info";
  text: string;
};

const script: Frame[] = [
  {
    kind: "prompt",
    text: 'curl https://gateway.your-org.com/v1/chat/completions \\\n     -H "Authorization: Bearer tw-prod-aH3k...." \\\n     -d \'{"model":"claude-sonnet-4-5","stream":true,"messages":[...]}\'',
  },
  { kind: "info", text: "▸ auth ok · key=tw-prod-aH3k · user=alice@acme · rate 14/100" },
  { kind: "info", text: "▸ route → anthropic · convert openai→messages · cb=Closed" },
  {
    kind: "stream",
    text: "[streamed model response]",
  },
  { kind: "info", text: "▸ done · 2.4s · in=187 out=842 tokens · cost=$0.0153 · audit-id=01HQ9F..." },
];

function useTypewriter(active: boolean) {
  const [out, setOut] = useState<{ kind: Frame["kind"]; text: string }[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;

    async function run() {
      const acc: { kind: Frame["kind"]; text: string }[] = [];
      for (const f of script) {
        acc.push({ kind: f.kind, text: "" });
        const idx = acc.length - 1;
        const speed = f.kind === "stream" ? 18 : f.kind === "prompt" ? 8 : 6;
        // Progress by elapsed time rather than one timer per character, so the
        // text types at the intended pace even when the main thread is busy
        // (for example while the 3D hero is rendering on a slow GPU).
        const start = performance.now();
        let shown = 0;
        while (shown < f.text.length) {
          if (cancelled) return;
          await new Promise((r) => setTimeout(r, 16));
          const next = Math.min(f.text.length, Math.max(shown + 1, Math.floor((performance.now() - start) / speed)));
          if (next !== shown) {
            shown = next;
            acc[idx] = { kind: f.kind, text: f.text.slice(0, shown) };
            setOut([...acc]);
          }
        }
        await new Promise((r) => setTimeout(r, 350));
      }
      if (!cancelled) setDone(true);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return { out, done };
}

export default function Terminal({ sampleLabel = "Sample" }: { sampleLabel?: string }) {
  const [ref, inView] = useInView<HTMLDivElement>("0px");
  const { out, done } = useTypewriter(inView);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl border border-white/10 bg-black/70 backdrop-blur-md overflow-hidden shadow-2xl shadow-cyan-500/10"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
        <span className="ml-3 text-[10px] text-[var(--color-dim)] font-mono">~ alice@laptop · zsh</span>
        <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-[var(--color-accent)]">{sampleLabel}</span>
      </div>

      {/* Body */}
      <div className="p-5 font-mono text-[12.5px] leading-relaxed min-h-[280px]">
        {out.map((f, i) => (
          <div key={i} className="mb-2">
            {f.kind === "prompt" && (
              <pre className="text-[var(--color-text)] whitespace-pre-wrap">
                <span className="text-[var(--color-brand-1)]">$</span> {f.text}
              </pre>
            )}
            {f.kind === "info" && (
              <div className="text-[var(--color-muted)]">{f.text}</div>
            )}
            {f.kind === "stream" && (
              <div className="text-[var(--color-brand-2)]">{f.text}</div>
            )}
          </div>
        ))}
        {!done && (
          <span className="inline-block w-2 h-4 align-middle bg-[var(--color-brand-1)] animate-pulse" />
        )}
      </div>
    </div>
  );
}
