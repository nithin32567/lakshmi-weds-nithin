/** Traditional Kerala brass lamp with a flickering flame. */
export function Nilavilakku({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 140" className={className} fill="none" aria-hidden>
      <g className="animate-flame" style={{ transformOrigin: "40px 44px" }}>
        <ellipse cx="40" cy="34" rx="6" ry="12" fill="url(#flameGrad)" />
        <ellipse cx="40" cy="38" rx="2.6" ry="6" fill="#FFF3D0" fillOpacity="0.9" />
      </g>
      <ellipse cx="40" cy="30" rx="18" ry="24" fill="url(#glowGrad)" className="animate-glow-pulse" />
      <path d="M22 50 Q40 42 58 50 L52 58 Q40 54 28 58 Z" fill="url(#brass)" />
      <rect x="37" y="58" width="6" height="42" fill="url(#brass)" />
      <ellipse cx="40" cy="62" rx="11" ry="3.4" fill="url(#brass)" />
      <ellipse cx="40" cy="78" rx="8" ry="2.8" fill="url(#brass)" />
      <path d="M18 118 Q40 96 62 118 Z" fill="url(#brass)" />
      <ellipse cx="40" cy="120" rx="24" ry="5" fill="url(#brass)" />
      <ellipse cx="40" cy="124" rx="18" ry="3.4" fill="#8A6B33" fillOpacity="0.8" />
      <defs>
        <linearGradient id="brass" x1="18" y1="42" x2="62" y2="126">
          <stop stopColor="#E3C489" />
          <stop offset="0.5" stopColor="#C5A059" />
          <stop offset="1" stopColor="#8A6B33" />
        </linearGradient>
        <radialGradient id="flameGrad" cx="0.5" cy="0.7">
          <stop stopColor="#FFF6DA" />
          <stop offset="0.55" stopColor="#F5C860" />
          <stop offset="1" stopColor="#E08A2A" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="0.5" cy="0.5">
          <stop stopColor="#F5C860" stopOpacity="0.45" />
          <stop offset="1" stopColor="#F5C860" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
