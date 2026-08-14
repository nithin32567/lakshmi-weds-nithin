/** Traditional Kerala brass lamp (nilavilakku) with a flickering flame. */
export function Nilavilakku({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 220" className={className} fill="none" aria-hidden>
      {/* ambient halo */}
      <ellipse cx="60" cy="46" rx="46" ry="56" fill="url(#halo)" className="animate-glow-pulse" />

      {/* flame */}
      <g className="animate-flame" style={{ transformOrigin: "60px 62px" }}>
        <path
          d="M60 18c8 12 12 19 12 27a12 12 0 0 1-24 0c0-8 4-15 12-27Z"
          fill="url(#flameOuter)"
        />
        <path d="M60 32c4 7 6 11 6 15a6 6 0 0 1-12 0c0-4 2-8 6-15Z" fill="#FFF6DC" fillOpacity="0.95" />
      </g>

      {/* wick + oil bowl (deepam) */}
      <path d="M57 60h6v6h-6z" fill="#6E5426" />
      <path
        d="M28 66q32-12 64 0l-6 12q-26-8-52 0Z"
        fill="url(#brassTop)"
      />
      <path d="M28 66q32-12 64 0" stroke="url(#shine)" strokeWidth="1.6" />
      {/* bowl beak tips */}
      <path d="M26 66l-9-3 9 7Z" fill="url(#brassTop)" />
      <path d="M94 66l9-3-9 7Z" fill="url(#brassTop)" />

      {/* neck rings */}
      <ellipse cx="60" cy="82" rx="15" ry="4.4" fill="url(#brass)" />
      <ellipse cx="60" cy="82" rx="15" ry="4.4" fill="url(#gloss)" />
      <rect x="55.5" y="84" width="9" height="16" fill="url(#brass)" />
      <ellipse cx="60" cy="102" rx="12" ry="3.6" fill="url(#brass)" />

      {/* mid ornamental bulb */}
      <path d="M48 104q12 14 24 0 3 12-12 16-15-4-12-16Z" fill="url(#brass)" />
      <ellipse cx="60" cy="122" rx="8" ry="2.6" fill="url(#brassDark)" />

      {/* stem */}
      <rect x="56" y="124" width="8" height="30" fill="url(#brass)" />
      <rect x="58.4" y="124" width="1.8" height="30" fill="#F2DCA9" fillOpacity="0.45" />
      <ellipse cx="60" cy="140" rx="10" ry="3" fill="url(#brass)" />

      {/* flared base */}
      <path d="M30 186q30-40 60 0Z" fill="url(#brass)" />
      <path d="M30 186q30-40 60 0" stroke="url(#shine)" strokeWidth="1.2" fill="none" />
      <ellipse cx="60" cy="187" rx="34" ry="7" fill="url(#brassTop)" />
      <ellipse cx="60" cy="192" rx="28" ry="5.2" fill="url(#brassDark)" />
      <ellipse cx="60" cy="187" rx="34" ry="7" fill="url(#gloss)" />

      {/* reflected pool of light */}
      <ellipse cx="60" cy="200" rx="40" ry="6" fill="url(#pool)" />

      <defs>
        <linearGradient id="brass" x1="44" y1="60" x2="78" y2="190">
          <stop stopColor="#8A6B33" />
          <stop offset="0.28" stopColor="#E7CB92" />
          <stop offset="0.5" stopColor="#FBEFCF" />
          <stop offset="0.72" stopColor="#C5A059" />
          <stop offset="1" stopColor="#6F5527" />
        </linearGradient>
        <linearGradient id="brassTop" x1="20" y1="62" x2="100" y2="80">
          <stop stopColor="#9A7838" />
          <stop offset="0.35" stopColor="#F0DAA8" />
          <stop offset="0.6" stopColor="#C5A059" />
          <stop offset="1" stopColor="#7A5C2B" />
        </linearGradient>
        <linearGradient id="brassDark" x1="30" y1="185" x2="90" y2="196">
          <stop stopColor="#5E4720" />
          <stop offset="0.5" stopColor="#9C7B38" />
          <stop offset="1" stopColor="#4E3A19" />
        </linearGradient>
        <linearGradient id="gloss" x1="26" y1="76" x2="94" y2="90">
          <stop stopColor="#FFF8E4" stopOpacity="0.5" />
          <stop offset="0.4" stopColor="#FFF8E4" stopOpacity="0" />
          <stop offset="1" stopColor="#FFF8E4" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="shine" x1="24" y1="64" x2="96" y2="70">
          <stop stopColor="#FFF3D0" stopOpacity="0.1" />
          <stop offset="0.5" stopColor="#FFF8E6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#FFF3D0" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="flameOuter" cx="0.5" cy="0.78">
          <stop stopColor="#FFF8E2" />
          <stop offset="0.45" stopColor="#F7CE68" />
          <stop offset="1" stopColor="#E0842A" stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id="halo" cx="0.5" cy="0.5">
          <stop stopColor="#F5C860" stopOpacity="0.38" />
          <stop offset="0.55" stopColor="#F5C860" stopOpacity="0.12" />
          <stop offset="1" stopColor="#F5C860" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pool" cx="0.5" cy="0.5">
          <stop stopColor="#F5C860" stopOpacity="0.28" />
          <stop offset="1" stopColor="#F5C860" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
