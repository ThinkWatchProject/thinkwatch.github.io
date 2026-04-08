import { useState } from "react";

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
        className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none snap-x snap-mandatory"
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
              className={`relative shrink-0 snap-start px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "text-white bg-white/[0.06]"
                  : "text-[var(--color-muted)] hover:text-white"
              }`}
            >
              {m.label}
              {isActive && (
                <span className="absolute inset-x-3 -bottom-[17px] h-px bg-gradient-to-r from-[var(--color-brand-1)] to-[var(--color-brand-2)]" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-10 mb-8 max-w-2xl">
        <p className="text-2xl md:text-3xl font-semibold tracking-tight text-gradient">
          {current.tagline}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {current.bullets.map((b, i) => (
          <div
            key={b.title}
            className="rounded-xl border border-white/10 bg-[var(--color-surface)]/60 p-6 hover:border-white/25 transition-colors animate-[fadeUp_400ms_ease-out_both]"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start gap-3">
              <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-1)] shrink-0" />
              <div>
                <h4 className="font-semibold tracking-tight mb-1.5">{b.title}</h4>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{b.body}</p>
              </div>
            </div>
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
