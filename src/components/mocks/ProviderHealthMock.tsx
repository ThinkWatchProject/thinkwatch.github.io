import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";

type Provider = {
  name: string;
  region: string;
  status: "ok" | "degraded" | "down";
  latencyMs: number;
  successPct: number;
  cb: "Closed" | "HalfOpen" | "Open";
};

const seed: Provider[] = [
  { name: "OpenAI",          region: "us-east",   status: "ok",       latencyMs: 412, successPct: 99.8, cb: "Closed" },
  { name: "Anthropic",       region: "us-west",   status: "ok",       latencyMs: 538, successPct: 99.6, cb: "Closed" },
  { name: "Google Gemini",   region: "us-central",status: "ok",       latencyMs: 297, successPct: 99.9, cb: "Closed" },
  { name: "Azure OpenAI",    region: "eastus2",   status: "degraded", latencyMs: 1240, successPct: 96.2, cb: "HalfOpen" },
  { name: "AWS Bedrock",     region: "us-east-1", status: "ok",       latencyMs: 624, successPct: 99.4, cb: "Closed" },
];

const STATUS_DOT: Record<Provider["status"], string> = {
  ok: "bg-emerald-400",
  degraded: "bg-amber-400",
  down: "bg-red-400",
};
const STATUS_LABEL: Record<Provider["status"], string> = {
  ok: "Healthy",
  degraded: "Degraded",
  down: "Down",
};
const CB_COLOR: Record<Provider["cb"], string> = {
  Closed: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  HalfOpen: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  Open: "text-red-300 bg-red-500/10 border-red-500/20",
};

function jitter(base: number, pct: number, r: number) {
  const d = base * pct;
  return Math.max(50, base + (r - 0.5) * 2 * d);
}

export default function ProviderHealthMock() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [rows, setRows] = useState<Provider[]>(seed);

  useEffect(() => {
    if (!inView) return;
    let s = 17;
    const id = setInterval(() => {
      setRows((prev) =>
        prev.map((p, i) => {
          s = (s * 9301 + 49297 + i * 31) % 233280;
          const r = s / 233280;
          return { ...p, latencyMs: Math.round(jitter(p.latencyMs, 0.18, r)) };
        }),
      );
    }, 1500);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/30">
        <div className="text-sm font-semibold tracking-tight">Provider health</div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          monitoring
        </div>
      </div>

      <ul>
        {rows.map((p) => {
          const latencyBar = Math.min(100, (p.latencyMs / 1500) * 100);
          return (
            <li key={p.name} className="px-5 py-4 border-b border-white/5 last:border-b-0">
              <div className="flex items-center gap-3 mb-2.5">
                <span className={`w-2 h-2 rounded-full ${STATUS_DOT[p.status]}`}>
                  <span className={`block w-2 h-2 rounded-full ${STATUS_DOT[p.status]} animate-ping opacity-60`} />
                </span>
                <span className="font-mono text-sm text-white">{p.name}</span>
                <span className="text-[10px] text-[var(--color-dim)] font-mono">{p.region}</span>
                <span className="ml-auto text-xs text-[var(--color-muted)]">{STATUS_LABEL[p.status]}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${CB_COLOR[p.cb]}`}>
                  CB:{p.cb}
                </span>
              </div>

              <div className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${latencyBar}%`,
                      background:
                        p.status === "degraded"
                          ? "linear-gradient(90deg, #FBBF24, #F472B6)"
                          : "linear-gradient(90deg, #22D3EE, #A78BFA)",
                    }}
                  />
                </div>
                <span className="text-xs font-mono tabular-nums text-[var(--color-text)]">
                  {p.latencyMs} ms
                </span>
                <span className="text-xs font-mono tabular-nums text-[var(--color-muted)] w-12 text-right">
                  {p.successPct}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
