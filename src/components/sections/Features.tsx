import { useState } from "react";
import { spanClass } from "~/lib/grid";

export type FeatureModule = {
  id: string;
  label: string;
  tagline: string;
  bullets: { title: string; body: string }[];
};

export default function Features({ modules }: { modules: readonly FeatureModule[] }) {
  const [active, setActive] = useState(modules[0].id);
  const current = modules.find((m) => m.id === active) ?? modules[0];

  return (
    <div className="mt-14">
      <div
        role="tablist"
        className="inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-white/[0.14] bg-[var(--color-surface)] p-1 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {modules.map((m) => {
          const isActive = m.id === active;
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(m.id)}
              className={`relative shrink-0 snap-start px-4 py-2 rounded-[9px] text-sm font-medium transition-all ${
                isActive
                  ? "text-white bg-[var(--color-surface-2)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]"
                  : "text-[var(--color-muted)] hover:text-white"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="mt-10 mb-8 max-w-3xl">
        <p className="text-2xl md:text-3xl font-semibold tracking-tight text-gradient [text-wrap:balance]">
          {current.tagline}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
        {current.bullets.map((b, i) => (
          <div
            key={b.title}
            className={`group nx-tile p-6  animate-[fadeUp_400ms_ease-out_both] ${spanClass(i, current.bullets.length)}`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-1)] shadow-[0_0_10px_var(--color-brand-1)] group-hover:scale-110 transition-transform" />
              <span className="font-mono text-[11px] tracking-[0.12em] text-[var(--color-dim)]">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <h4 className="font-semibold tracking-tight mb-1.5">{b.title}</h4>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed">{b.body}</p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
