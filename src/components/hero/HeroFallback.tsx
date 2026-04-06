/**
 * Static visual shown:
 *   - during SSR / before HeroScene hydrates
 *   - when prefers-reduced-motion is set
 *   - when WebGL is unsupported
 * Pure SVG + CSS — no JS, no canvas, < 2 kB.
 */
export default function HeroFallback() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 800 600"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="hf-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#A78BFA" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hf-orb-l" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hf-orb-r" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hf-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Aurora orbs */}
        <circle cx="160" cy="300" r="220" fill="url(#hf-orb-l)" />
        <circle cx="640" cy="300" r="220" fill="url(#hf-orb-r)" />

        {/* Center core */}
        <circle cx="400" cy="300" r="140" fill="url(#hf-core)" />

        {/* Wireframe ring (rotated octagon) */}
        <g transform="translate(400 300)" fill="none" strokeLinecap="round">
          <polygon
            points="100,0 70,70 0,100 -70,70 -100,0 -70,-70 0,-100 70,-70"
            stroke="#22D3EE"
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
          <polygon
            points="130,0 92,92 0,130 -92,92 -130,0 -92,-92 0,-130 92,-92"
            stroke="#A78BFA"
            strokeOpacity="0.35"
            strokeWidth="1"
            transform="rotate(22.5)"
          />
        </g>

        {/* Flow lines (left → core → right) */}
        {[-60, -20, 20, 60].map((y) => (
          <line
            key={y}
            x1="40"
            x2="760"
            y1={300 + y}
            y2={300 + y}
            stroke="url(#hf-line)"
            strokeWidth="1"
            strokeDasharray="2 6"
            opacity="0.55"
          />
        ))}
      </svg>
    </div>
  );
}
