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
function fmtTime(d: Date): string {
  return [d.getHours(), d.getMinutes(), d.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

function makeRow(seed: number, when: Date = new Date()): LogRow {
  const r = (n: number) => {
    seed = (seed * 9301 + 49297 + n) % 233280;
    return seed / 233280;
  };
  const status: Status = r(1) > 0.94 ? (r(2) > 0.6 ? 429 : r(3) > 0.5 ? 500 : 401) : 200;
  return {
    id: counter++,
    ts: fmtTime(when),
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

// Stable seed values used for SSR + first paint so React's hydration doesn't mismatch.
// Real timestamps are filled in on the client in a useEffect after mount.
const PLACEHOLDER_TS = "--:--:--";

export default function LogExplorerMock() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [rows, setRows] = useState<LogRow[]>(() =>
    Array.from({ length: 14 }, (_, i) => ({
      ...makeRow(i * 17 + 3, new Date(0)),
      ts: PLACEHOLDER_TS,
    })),
  );

  // After hydration, replace the seeded rows with ones whose timestamps span
  // the last ~30 seconds so the panel doesn't open on a wall of identical times.
  useEffect(() => {
    const now = Date.now();
    setRows(
      Array.from({ length: 14 }, (_, i) => {
        const when = new Date(now - i * 2200);
        return makeRow(i * 17 + 3, when);
      }),
    );
  }, []);

  useEffect(() => {
    if (!inView) return;
    let seed = Date.now() % 9999;
    const id = setInterval(() => {
      seed += 7;
      setRows((prev) => [makeRow(seed), ...prev].slice(0, 14));
    }, 1400);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/80 overflow-hidden backdrop-blur-sm h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-b border-white/10 bg-black/40">
        <div className="hidden sm:flex gap-1.5 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2 text-xs font-mono text-[var(--color-muted)]">
          <span className="text-[var(--color-brand-1)] shrink-0">›</span>
          <span className="truncate">status:200 model:claude-*</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-emerald-300 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          live
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid gap-3 px-4 py-2 text-[10px] uppercase tracking-wider text-[var(--color-dim)] border-b border-white/5
          grid-cols-[1fr_auto_56px] sm:grid-cols-[60px_1fr_1fr_56px_60px] lg:grid-cols-[70px_1fr_110px_1fr_70px_50px_56px]"
      >
        <div className="hidden sm:block">time</div>
        <div>user</div>
        <div className="hidden lg:block">key</div>
        <div className="hidden sm:block">model</div>
        <div className="hidden sm:block text-right">tokens</div>
        <div className="hidden lg:block text-right">ms</div>
        <div className="text-right">status</div>
      </div>

      {/* Rows */}
      <ul className="font-mono text-xs flex-1" aria-live="polite" aria-label="Live audit log feed">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className="grid gap-3 px-4 py-2.5 border-b border-white/5 hover:bg-white/[0.02] animate-[slideIn_400ms_ease-out]
              grid-cols-[1fr_auto_56px] sm:grid-cols-[60px_1fr_1fr_56px_60px] lg:grid-cols-[70px_1fr_110px_1fr_70px_50px_56px]"
            style={{ opacity: 1 - i * 0.04 }}
          >
            <div className="hidden sm:block text-[var(--color-dim)]">{r.ts}</div>
            <div className="text-white truncate">{r.user}</div>
            <div className="hidden lg:block text-[var(--color-brand-1)] truncate">{r.key}</div>
            <div className="hidden sm:block text-[var(--color-brand-2)] truncate">{r.model}</div>
            <div className="hidden sm:block text-right text-[var(--color-text)] tabular-nums">
              {r.tokens.toLocaleString()}
            </div>
            <div className="hidden lg:block text-right text-[var(--color-muted)] tabular-nums">{r.ms}</div>

            {/* Compact: visible only at < sm — collapses model + tokens onto user line */}
            <div className="sm:hidden text-[10px] text-[var(--color-dim)] truncate">
              {r.model} · {r.tokens}t
            </div>

            <div className="text-right">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${STATUS_COLOR[r.status]}`}>
                {r.status}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
