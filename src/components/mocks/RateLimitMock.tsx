import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";

const BUCKETS = 30;
const LIMIT = 100;

function genBucket(seed: number, base: number) {
  seed = (seed * 9301 + 49297) % 233280;
  const r = seed / 233280;
  return Math.max(0, Math.round(base + (r - 0.4) * 35));
}

export default function RateLimitMock() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const [buckets, setBuckets] = useState<number[]>(() => {
    const arr: number[] = [];
    for (let i = 0; i < BUCKETS; i++) {
      arr.push(genBucket(i * 13 + 5, 60));
    }
    return arr;
  });

  useEffect(() => {
    if (!inView) return;
    let s = 9;
    const id = setInterval(() => {
      s += 11;
      setBuckets((prev) => {
        const next = prev.slice(1);
        const last = prev[prev.length - 1] ?? 60;
        next.push(genBucket(s, last));
        return next;
      });
    }, 700);
    return () => clearInterval(id);
  }, [inView]);

  const sum = buckets.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / buckets.length);
  const last = buckets[buckets.length - 1];

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/80 backdrop-blur-sm p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold tracking-tight">Rate limit · sliding window</div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-dim)] mt-1">tw-prod-aH3k · 100 RPM</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono tabular-nums font-semibold text-white">
            {last}<span className="text-[var(--color-dim)] text-base"> / {LIMIT}</span>
          </div>
          <div className="text-[10px] text-[var(--color-muted)]">current bucket</div>
        </div>
      </div>

      {/* Bucket bars */}
      <div className="flex items-end gap-[3px] h-24">
        {buckets.map((b, i) => {
          const pct = Math.min(100, (b / LIMIT) * 100);
          const over = b > LIMIT * 0.9;
          return (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-sm transition-all duration-500"
                style={{
                  height: `${pct}%`,
                  background: over
                    ? "linear-gradient(180deg, #F472B6, #A78BFA)"
                    : "linear-gradient(180deg, #22D3EE, #A78BFA)",
                  opacity: 0.4 + (i / buckets.length) * 0.6,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div className="mt-5 grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-center">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-dim)]">Avg / min</div>
          <div className="font-mono text-sm text-white tabular-nums mt-0.5">{avg}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-dim)]">Window</div>
          <div className="font-mono text-sm text-white tabular-nums mt-0.5">{BUCKETS}s</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--color-dim)]">Headroom</div>
          <div className="font-mono text-sm text-emerald-300 tabular-nums mt-0.5">{LIMIT - last}</div>
        </div>
      </div>
    </div>
  );
}
