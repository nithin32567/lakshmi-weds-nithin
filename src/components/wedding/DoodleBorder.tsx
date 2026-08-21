import { useEffect, useState } from "react";

/* ── Keyframes injected once ─────────────────────────────── */
const DOODLE_CSS = `
/* Wind gust → lean → gravity droop → spring back */
@keyframes wind-flower {
  0%   { transform: rotate(0deg) translateX(0); }
  15%  { transform: rotate(var(--wind-lean, 12deg)) translateX(var(--wind-push, 3px)); }
  30%  { transform: rotate(var(--wind-peak, 18deg)) translateX(var(--wind-push2, 5px)); }
  45%  { transform: rotate(var(--wind-droop, 14deg)) translateX(var(--wind-push, 3px)) translateY(2px); }
  60%  { transform: rotate(var(--wind-rebound, -6deg)) translateX(-1px); }
  75%  { transform: rotate(var(--wind-settle, -3deg)) translateX(0); }
  85%  { transform: rotate(2deg) translateX(1px); }
  100% { transform: rotate(0deg) translateX(0); }
}

@keyframes vine-draw {
  from { stroke-dashoffset: 200; }
  to   { stroke-dashoffset: 0; }
}
@keyframes wind-streak {
  0%   { transform: translateX(-20px) scaleX(0); opacity: 0; }
  20%  { opacity: var(--streak-opacity, 0.18); transform: translateX(0) scaleX(0.6); }
  60%  { opacity: var(--streak-opacity, 0.18); transform: translateX(var(--streak-travel, 80px)) scaleX(1); }
  100% { opacity: 0; transform: translateX(var(--streak-travel2, 140px)) scaleX(0.3); }
}
`;

/* ── SVG doodle flower ───────────────────────────────────── */
function DoodleFlower({
  x, y, size, color, delay, swayDeg,
}: {
  x: string; y: string; size: number; color: string; delay: number; swayDeg: number;
}) {
  const petals = 5;
  const stemBaseY = parseFloat(y) + size * 1.6;
  return (
    <g
      style={{
        /* Pivot at stem base so the whole flower leans like wind is pushing the top */
        transformOrigin: `${x}px ${stemBaseY}px`,
        ["--wind-lean" as string]: `${swayDeg * 1.5}deg`,
        ["--wind-peak" as string]: `${swayDeg * 2.2}deg`,
        ["--wind-droop" as string]: `${swayDeg * 1.8}deg`,
        ["--wind-rebound" as string]: `${-swayDeg * 0.8}deg`,
        ["--wind-settle" as string]: `${-swayDeg * 0.4}deg`,
        ["--wind-push" as string]: `${swayDeg * 0.5}px`,
        ["--wind-push2" as string]: `${swayDeg * 0.8}px`,
        animation: `wind-flower ${3 + delay * 0.8}s cubic-bezier(0.4, 0, 0.2, 1) infinite ${delay}s`,
      } as React.CSSProperties}
    >
      {/* stem */}
      <line
        x1={x} y1={y}
        x2={x} y2={String(stemBaseY)}
        stroke="#1a5c2a" strokeWidth="1.2" strokeLinecap="round"
        opacity="0.6"
        style={{ filter: "url(#doodleRough)" }}
      />
      {/* petals */}
      {Array.from({ length: petals }, (_, i) => {
        const angle = (i / petals) * 360;
        const px = parseFloat(x) + Math.cos((angle * Math.PI) / 180) * size * 0.5;
        const py = parseFloat(y) + Math.sin((angle * Math.PI) / 180) * size * 0.5;
        return (
          <ellipse
            key={i}
            cx={px} cy={py}
            rx={size * 0.38} ry={size * 0.22}
            fill={color} fillOpacity="0.55"
            stroke={color} strokeWidth="0.7" strokeOpacity="0.8"
            transform={`rotate(${angle} ${px} ${py})`}
            style={{ filter: "url(#doodleRough)" }}
          />
        );
      })}
      {/* center */}
      <circle
        cx={x} cy={y} r={size * 0.18}
        fill="#eab308" fillOpacity="0.7"
        stroke="#b8860b" strokeWidth="0.6"
      />
    </g>
  );
}

/* ── Visible wind streaks blowing across ─────────────────── */
function WindStreaks() {
  const [streaks, setStreaks] = useState<
    Array<{ id: number; top: number; width: number; dur: number; delay: number; opacity: number; travel: number }>
  >([]);

  useEffect(() => {
    setStreaks(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        top: 12 + Math.random() * 76,
        width: 40 + Math.random() * 60,
        dur: 3 + Math.random() * 3,
        delay: Math.random() * 5,
        opacity: 0.08 + Math.random() * 0.12,
        travel: 60 + Math.random() * 80,
      })),
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {streaks.map((s) => (
        <div
          key={s.id}
          className="absolute left-0 h-px rounded-full"
          style={{
            top: `${s.top}%`,
            width: `${s.width}px`,
            background: `linear-gradient(90deg, transparent, rgba(180,200,160,${s.opacity}), rgba(160,185,140,${s.opacity * 0.6}), transparent)`,
            ["--streak-opacity" as string]: String(s.opacity),
            ["--streak-travel" as string]: `${s.travel}px`,
            ["--streak-travel2" as string]: `${s.travel * 1.6}px`,
            animation: `wind-streak ${s.dur}s ease-in-out infinite ${s.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}


/* ── Vine border (all four sides) ────────────────────────── */
function VineBorder() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 400 600"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <defs>
        <filter id="doodleRough">
          <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" result="turb" />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="1.5" />
        </filter>
      </defs>

      {/* Top vine */}
      <path
        d="M0,18 C60,8 120,22 200,12 C280,2 340,20 400,14"
        stroke="#1e5c2e" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"
        strokeDasharray="200" style={{ animation: "vine-draw 3s ease forwards" }}
      />
      {/* Top tiny leaves */}
    
      {/* Left vine */}
      <path
        d="M14,0 C8,80 22,160 12,240 C4,320 18,400 10,480 C6,520 16,560 12,600"
        stroke="#1e5c2e" strokeWidth="1.4" strokeLinecap="round" opacity="0.45"
        strokeDasharray="200" style={{ animation: "vine-draw 4s ease 0.3s forwards" }}
      />

      {/* Right vine */}
      <path
        d="M388,0 C394,90 382,180 390,270 C396,360 384,450 392,540 C388,570 394,585 390,600"
        stroke="#1e5c2e" strokeWidth="1.4" strokeLinecap="round" opacity="0.45"
        strokeDasharray="200" style={{ animation: "vine-draw 4s ease 0.6s forwards" }}
      />

      {/* Corner flowers - wind-swaying */}
      <DoodleFlower x="24" y="36" size={14} color="#e879a0" delay={0} swayDeg={5} />
      <DoodleFlower x="376" y="32" size={12} color="#d4a0c8" delay={0.8} swayDeg={4} />
      <DoodleFlower x="20" y="564" size={13} color="#e8a878" delay={0.4} swayDeg={6} />
      <DoodleFlower x="380" y="568" size={11} color="#e879a0" delay={1.2} swayDeg={4} />

      {/* Midway accent flowers */}
      <DoodleFlower x="10" y="300" size={10} color="#c8a0d4" delay={1.5} swayDeg={3} />
      <DoodleFlower x="390" y="280" size={9} color="#e8a878" delay={2} swayDeg={5} />

      {/* Tiny dot accents along edges */}
      {[30, 90, 150, 210, 310, 370].map((cx) => (
        <circle key={`t-${cx}`} cx={cx} cy={6 + Math.sin(cx) * 4} r="1.5" fill="#eab308" opacity="0.3" />
      ))}
      {[30, 100, 170, 240, 330, 380].map((cx) => (
        <circle key={`b-${cx}`} cx={cx} cy={594 + Math.sin(cx) * 3} r="1.5" fill="#eab308" opacity="0.3" />
      ))}
    </svg>
  );
}

/* ── Main export ─────────────────────────────────────────── */
export function DoodleBorder() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <style>{DOODLE_CSS}</style>
      <VineBorder />
      <WindStreaks />
    </div>
  );
}
