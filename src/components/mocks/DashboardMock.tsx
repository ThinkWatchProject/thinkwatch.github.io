import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";

function useCounter(target: number, active: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

const fmtCompact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const fmtUsd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
const fmtInt = new Intl.NumberFormat("en-US");

// Deterministic sparkline data so SSR + hydration agree
function sparkPoints(seed: number, n = 24) {
  const out: number[] = [];
  let v = 50;
  for (let i = 0; i < n; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const r = seed / 233280;
    v += (r - 0.45) * 12;
    v = Math.max(10, Math.min(95, v));
    out.push(v);
  }
  return out;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 220;
  const h = 50;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const step = w / (data.length - 1);
  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - ((d - min) / range) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const id = `spark-${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12 overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Stat = {
  label: string;
  value: number;
  format: (v: number) => string;
  delta: string;
  color: string;
  spark: number[];
};

const stats: Stat[] = [
  {
    label: "Tokens used (MTD)",
    value: 8_420_137,
    format: (v) => fmtCompact.format(v),
    delta: "+12.4%",
    color: "#22D3EE",
    spark: sparkPoints(7),
  },
  {
    label: "Cost (MTD)",
    value: 1287.42,
    format: (v) => fmtUsd.format(v),
    delta: "+8.1%",
    color: "#A78BFA",
    spark: sparkPoints(13),
  },
  {
    label: "Active API keys",
    value: 47,
    format: (v) => fmtInt.format(Math.round(v)),
    delta: "+3",
    color: "#F472B6",
    spark: sparkPoints(21),
  },
  {
    label: "Requests / min",
    value: 1342,
    format: (v) => fmtInt.format(Math.round(v)),
    delta: "live",
    color: "#67E8F9",
    spark: sparkPoints(33),
  },
];

export default function DashboardMock() {
  const [ref, inView] = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <StatCard key={s.label} stat={s} active={inView} />
      ))}
    </div>
  );
}

function StatCard({ stat, active }: { stat: Stat; active: boolean }) {
  const v = useCounter(stat.value, active);
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--color-surface)]/80 p-5 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="text-xs text-[var(--color-muted)]">{stat.label}</div>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium"
          style={{ color: stat.color, background: `${stat.color}15` }}
        >
          {stat.delta}
        </span>
      </div>

      <div className="text-2xl font-semibold tracking-tight tabular-nums font-mono">
        {stat.format(v)}
      </div>

      <div className="mt-2">
        <Sparkline data={stat.spark} color={stat.color} />
      </div>
    </div>
  );
}
