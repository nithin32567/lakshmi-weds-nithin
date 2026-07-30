// /** Traditional Kerala brass lamp with a flickering flame. */
// export function Nilavilakku({ className = "" }: { className?: string }) {
//   return (
//     <svg viewBox="0 0 80 140" className={className} fill="none" aria-hidden>
//       <g className="animate-flame" style={{ transformOrigin: "40px 44px" }}>
//         <ellipse cx="40" cy="34" rx="6" ry="12" fill="url(#flameGrad)" />
//         <ellipse cx="40" cy="38" rx="2.6" ry="6" fill="#FFF3D0" fillOpacity="0.9" />
//       </g>
//       <ellipse cx="40" cy="30" rx="18" ry="24" fill="url(#glowGrad)" className="animate-glow-pulse" />
//       <path d="M22 50 Q40 42 58 50 L52 58 Q40 54 28 58 Z" fill="url(#brass)" />
//       <rect x="37" y="58" width="6" height="42" fill="url(#brass)" />
//       <ellipse cx="40" cy="62" rx="11" ry="3.4" fill="url(#brass)" />
//       <ellipse cx="40" cy="78" rx="8" ry="2.8" fill="url(#brass)" />
//       <path d="M18 118 Q40 96 62 118 Z" fill="url(#brass)" />
//       <ellipse cx="40" cy="120" rx="24" ry="5" fill="url(#brass)" />
//       <ellipse cx="40" cy="124" rx="18" ry="3.4" fill="#8A6B33" fillOpacity="0.8" />
//       <defs>
//         <linearGradient id="brass" x1="18" y1="42" x2="62" y2="126">
//           <stop stopColor="#E3C489" />
//           <stop offset="0.5" stopColor="#C5A059" />
//           <stop offset="1" stopColor="#8A6B33" />
//         </linearGradient>
//         <radialGradient id="flameGrad" cx="0.5" cy="0.7">
//           <stop stopColor="#FFF6DA" />
//           <stop offset="0.55" stopColor="#F5C860" />
//           <stop offset="1" stopColor="#E08A2A" stopOpacity="0.35" />
//         </radialGradient>
//         <radialGradient id="glowGrad" cx="0.5" cy="0.5">
//           <stop stopColor="#F5C860" stopOpacity="0.45" />
//           <stop offset="1" stopColor="#F5C860" stopOpacity="0" />
//         </radialGradient>
//       </defs>
//     </svg>
//   );
// }

import React from "react";

/** Traditional Kerala brass lamp (Nilavilakku) with realistic 3D textures & flickering flames */
export function Nilavilakku({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 160 240"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* CSS Animations for organic flame flickering & ambient lighting */}
        <style>{`
          @keyframes flameFlicker {
            0%, 100% { transform: scale(1) rotate(0deg) translateY(0px); opacity: 0.96; }
            20% { transform: scale(1.04, 0.94) rotate(-1.5deg) translateY(-0.5px); opacity: 1; }
            40% { transform: scale(0.95, 1.05) rotate(1deg) translateY(0.5px); opacity: 0.92; }
            60% { transform: scale(1.03, 0.97) rotate(-0.8deg) translateY(-0.2px); opacity: 0.98; }
            80% { transform: scale(0.97, 1.02) rotate(1.2deg) translateY(0.3px); opacity: 0.94; }
          }
          @keyframes glowPulse {
            0%, 100% { transform: scale(1); opacity: 0.55; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
          .flame-main {
            animation: flameFlicker 1.6s ease-in-out infinite alternate;
            transform-origin: 80px 84px;
          }
          .flame-side-left {
            animation: flameFlicker 1.3s ease-in-out infinite alternate-reverse;
            transform-origin: 23px 81px;
          }
          .flame-side-right {
            animation: flameFlicker 1.5s ease-in-out infinite alternate;
            transform-origin: 137px 81px;
          }
          .glow-pulse {
            animation: glowPulse 2.2s ease-in-out infinite;
            transform-origin: 80px 60px;
          }
        `}</style>

        {/* Dynamic Brass Metallic Gradient */}
        <linearGradient id="brassGleam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4A330B" />
          <stop offset="15%" stopColor="#8F6B28" />
          <stop offset="32%" stopColor="#D8B25C" />
          <stop offset="50%" stopColor="#FFF2BF" />
          <stop offset="68%" stopColor="#C69B3D" />
          <stop offset="85%" stopColor="#78551B" />
          <stop offset="100%" stopColor="#3B2606" />
        </linearGradient>

        {/* Brass Shadow Gradient for Under-curves */}
        <linearGradient id="brassShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B88E35" />
          <stop offset="100%" stopColor="#2A1A03" />
        </linearGradient>

        {/* Oil Pool Radial Gradient */}
        <radialGradient id="oilGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8A560B" />
          <stop offset="70%" stopColor="#472A02" />
          <stop offset="100%" stopColor="#211200" />
        </radialGradient>

        {/* Flame Outer Gradient */}
        <radialGradient id="flameOuter" cx="50%" cy="80%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#FFEA79" />
          <stop offset="58%" stopColor="#FF9100" />
          <stop offset="88%" stopColor="#E64A19" />
          <stop offset="100%" stopColor="#BF360C" stopOpacity="0" />
        </radialGradient>

        {/* Flame Core Gradient */}
        <radialGradient id="flameCore" cx="50%" cy="70%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#FFF59D" />
          <stop offset="100%" stopColor="#FFB74D" />
        </radialGradient>

        {/* Warm Ambient Glow */}
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC107" stopOpacity="0.65" />
          <stop offset="40%" stopColor="#FF9800" stopOpacity="0.3" />
          <stop offset="80%" stopColor="#E65100" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#E65100" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* AMBIENT GLOW BEHIND THE LAMP */}
      <circle cx="80" cy="65" r="55" fill="url(#lampGlow)" className="glow-pulse" />

      {/* 1. PEDESTAL / BASE (പീഠം) */}
      <ellipse cx="80" cy="225" rx="58" ry="11" fill="url(#brassGleam)" />
      <ellipse cx="80" cy="223" rx="58" ry="9" fill="url(#brassShadow)" />

      {/* Base Stepped Layers */}
      <path d="M 22 223 C 22 208, 138 208, 138 223 L 126 205 C 126 195, 34 195, 34 205 Z" fill="url(#brassGleam)" />
      <ellipse cx="80" cy="205" rx="46" ry="7" fill="url(#brassGleam)" />

      <path d="M 38 205 C 38 195, 122 195, 122 205 L 110 188 C 110 182, 50 182, 50 188 Z" fill="url(#brassGleam)" />
      <ellipse cx="80" cy="188" rx="30" ry="5" fill="url(#brassGleam)" />

      {/* 2. STEM (തണ്ട്) */}
      <ellipse cx="80" cy="182" rx="22" ry="4.5" fill="url(#brassGleam)" />
      <path d="M 62 182 L 66 152 L 94 152 L 98 182 Z" fill="url(#brassGleam)" />

      {/* Stem Central Ornate Bead (മൊട്ട് / കിണ്ണം) */}
      <ellipse cx="80" cy="152" rx="22" ry="6" fill="url(#brassGleam)" />
      <ellipse cx="80" cy="144" rx="27" ry="8" fill="url(#brassGleam)" />
      <ellipse cx="80" cy="136" rx="21" ry="5" fill="url(#brassGleam)" />

      {/* Upper Stem Pillar */}
      <path d="M 65 136 L 61 106 L 99 106 L 95 136 Z" fill="url(#brassGleam)" />
      <ellipse cx="80" cy="106" rx="23" ry="5" fill="url(#brassGleam)" />

      {/* 3. MAIN OIL BOWL (തട്ട്) */}
      {/* Bowl Base Support */}
      <path d="M 57 106 C 57 117, 103 117, 103 106 L 118 94 C 118 108, 42 108, 42 94 Z" fill="url(#brassShadow)" />

      {/* Outer Bowl Body */}
      <path d="M 20 92 C 20 122, 140 122, 140 92 Z" fill="url(#brassGleam)" />
      {/* Outer Rim Lip */}
      <ellipse cx="80" cy="92" rx="60" ry="12" fill="url(#brassGleam)" />
      {/* Inner Cavity */}
      <ellipse cx="80" cy="91" rx="54" ry="10" fill="#2A1A03" />
      {/* Oil Surface */}
      <ellipse cx="80" cy="92.5" rx="51" ry="8.5" fill="url(#oilGrad)" />

      {/* 4. CENTRAL CROWN / SPIRE (മുകുളം) */}
      <ellipse cx="80" cy="90" rx="14" ry="4" fill="url(#brassGleam)" />
      <path d="M 70 90 L 73 66 L 87 66 L 90 90 Z" fill="url(#brassGleam)" />
      <ellipse cx="80" cy="66" rx="10" ry="3" fill="url(#brassGleam)" />
      
      {/* Lotus Bud Top */}
      <path d="M 80 44 C 72 53, 71 63, 80 66 C 89 63, 88 53, 80 44 Z" fill="url(#brassGleam)" />
      <path d="M 80 40 L 82.5 45 L 77.5 45 Z" fill="#FFF2BF" />

      {/* 5. WICKS & FLAMES (അഞ്ചു തിരികൾ) */}

      {/* Left Wick & Flame */}
      <path d="M 32 91 Q 25 87 23 81" stroke="#F5E6C8" strokeWidth="2.5" strokeLinecap="round" />
      <g className="flame-side-left">
        <path d="M 23 81 C 18 74, 18 68, 23 62 C 28 68, 28 74, 23 81 Z" fill="url(#flameOuter)" />
        <path d="M 23 80 C 20 75, 20 71, 23 67 C 26 71, 26 75, 23 80 Z" fill="url(#flameCore)" />
      </g>

      {/* Center-Left Wick & Flame */}
      <path d="M 52 94 Q 48 89 46 83" stroke="#F5E6C8" strokeWidth="2.5" strokeLinecap="round" />
      <g className="flame-main" style={{ transformOrigin: "46px 83px" }}>
        <path d="M 46 83 C 40 75, 40 67, 46 60 C 52 67, 52 75, 46 83 Z" fill="url(#flameOuter)" />
        <path d="M 46 82 C 42 76, 42 70, 46 65 C 50 70, 50 76, 46 82 Z" fill="url(#flameCore)" />
      </g>

      {/* CENTER FRONT MAIN WICK & FLAME (പ്രധാന തിരിയും ദീപവും) */}
      <path d="M 80 96 L 80 87" stroke="#EFE3C3" strokeWidth="3" strokeLinecap="round" />
      <path d="M 80 88 L 80 84" stroke="#222222" strokeWidth="2" strokeLinecap="round" />
      <g className="flame-main">
        {/* Main Flame Outer */}
        <path d="M 80 84 C 70 73, 70 60, 80 50 C 90 60, 90 73, 80 84 Z" fill="url(#flameOuter)" />
        {/* Inner Bright Core */}
        <path d="M 80 83 C 74 74, 74 65, 80 58 C 86 65, 86 74, 80 83 Z" fill="url(#flameCore)" />
        {/* Hot White Base Center */}
        <ellipse cx="80" cy="78" rx="2.5" ry="4" fill="#FFFFFF" opacity="0.95" />
      </g>

      {/* Center-Right Wick & Flame */}
      <path d="M 108 94 Q 112 89 114 83" stroke="#F5E6C8" strokeWidth="2.5" strokeLinecap="round" />
      <g className="flame-main" style={{ transformOrigin: "114px 83px" }}>
        <path d="M 114 83 C 108 75, 108 67, 114 60 C 120 67, 120 75, 114 83 Z" fill="url(#flameOuter)" />
        <path d="M 114 82 C 110 76, 110 70, 114 65 C 118 70, 118 76, 114 82 Z" fill="url(#flameCore)" />
      </g>

      {/* Right Wick & Flame */}
      <path d="M 128 91 Q 135 87 137 81" stroke="#F5E6C8" strokeWidth="2.5" strokeLinecap="round" />
      <g className="flame-side-right">
        <path d="M 137 81 C 132 74, 132 68, 137 62 C 142 68, 142 74, 137 81 Z" fill="url(#flameOuter)" />
        <path d="M 137 80 C 134 75, 134 71, 137 67 C 140 71, 140 75, 137 80 Z" fill="url(#flameCore)" />
      </g>
    </svg>
  );
}