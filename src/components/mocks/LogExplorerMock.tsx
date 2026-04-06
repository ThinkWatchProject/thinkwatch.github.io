import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";

type Status = 200 | 401 | 429 | 500;

type LogRow = {
  id: number;
  ts: string;
  user: string;
  key: string;
  model: string;
  tokens: number;
  status: Status;
  ms: number;
};

const users = ["alice@acme", "bob@acme", "carol@acme", "ci-bot", "dan@acme", "eve@acme"];
const keys = ["tw-prod-aH3k", "tw-dev-9xQz", "tw-ci-bWp2", "tw-prod-Lm4n", "tw-stg-Yt7r"];
const models = [
  "gpt-4o",
  "gpt-4o-mini",
  "claude-sonnet-4-5",
  "claude-haiku-4-5",
  "gemini-2.0-flash",
  "claude-opus-4-6",
];

let counter = 1000;
function makeRow(seed: number): LogRow {
  const r = (n: number) => {
    seed = (seed * 9301 + 49297 + n) % 233280;
    return seed / 233280;
  };
  const status: Status = r(1) > 0.94 ? (r(2) > 0.6 ? 429 : r(3) > 0.5 ? 500 : 401) : 200;
  return {
    id: counter++,
    ts: new Date().toISOString().slice(11, 19),
    user: users[Math.floor(r(4) * users.length)],
    key: keys[Math.floor(r(5) * keys.length)],
    model: models[Math.floor(r(6) * models.length)],
    tokens: Math.floor(r(7) * 4500) + 120,
    status,
    ms: Math.floor(r(8) * 800) + 80,
  };
}

const STATUS_COLOR: Record<Status, string> = {
  200: "text-emerald-300 bg-emerald-500/10",
  401: "text-pink-300 bg-pink-500/10",
  429: "text-amber-300 bg-amber-500/10",
  500: "text-red-300 bg-red-500/10",
};

export default function LogExplorerMock() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [rows, setRows] = useState<LogRow[]>(() =>
    Array.from({ length: 8 }, (_, i) => makeRow(i * 17 + 3)),
  );

  useEffect(() => {
    if (!inView) return;
    let seed = Date.now() % 9999;
    const id = setInterval(() => {
      seed += 7;
      setRows((prev) => [makeRow(seed), ...prev].slice(0, 8));
    }, 1400);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/80 overflow-hidden backdrop-blur-sm">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/40">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
        </div>
        <div className="flex-1 flex items-center gap-2 text-xs font-mono text-[var(--color-muted)]">
          <span className="text-[var(--color-brand-1)]">›</span>
          <span>status:200 model:claude-* tokens:&gt;500</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          live
        </div>
      </div>

      {/* Column headers */}
      <div className="hidden md:grid grid-cols-[80px_1fr_120px_1fr_80px_60px_70px] gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-[var(--color-dim)] border-b border-white/5">
        <div>time</div>
        <div>user</div>
        <div>key</div>
        <div>model</div>
        <div className="text-right">tokens</div>
        <div className="text-right">ms</div>
        <div className="text-right">status</div>
      </div>

      {/* Rows */}
      <div className="font-mono text-xs">
        {rows.map((r, i) => (
          <div
            key={r.id}
            className="md:grid hidden grid-cols-[80px_1fr_120px_1fr_80px_60px_70px] gap-3 px-4 py-2.5 border-b border-white/5 hover:bg-white/[0.02] animate-[slideIn_400ms_ease-out]"
            style={{ opacity: 1 - i * 0.05 }}
          >
            <div className="text-[var(--color-dim)]">{r.ts}</div>
            <div className="text-white truncate">{r.user}</div>
            <div className="text-[var(--color-brand-1)] truncate">{r.key}</div>
            <div className="text-[var(--color-brand-2)] truncate">{r.model}</div>
            <div className="text-right text-[var(--color-text)] tabular-nums">{r.tokens.toLocaleString()}</div>
            <div className="text-right text-[var(--color-muted)] tabular-nums">{r.ms}</div>
            <div className="text-right">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLOR[r.status]}`}>
                {r.status}
              </span>
            </div>
          </div>
        ))}

        {/* Mobile compact view */}
        {rows.map((r) => (
          <div key={`m-${r.id}`} className="md:hidden flex items-center justify-between px-4 py-2.5 border-b border-white/5">
            <div className="min-w-0">
              <div className="text-white truncate">{r.user}</div>
              <div className="text-[var(--color-dim)] text-[10px]">{r.model} · {r.tokens}t</div>
            </div>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLOR[r.status]}`}>
              {r.status}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
