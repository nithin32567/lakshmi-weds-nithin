import { useEffect, useState } from "react";

/* ── Keyframes ───────────────────────────────────────────── */
const DOODLE_CSS = `
/* All animations controlled by parent --play-state variable */
[style*="--play-state"] *,
[style*="--play-state"] {
  animation-play-state: var(--play-state, paused) !important;
}

/* Vine grows by revealing stroke via dashoffset */
@keyframes vine-grow {
  from { stroke-dashoffset: var(--vine-len, 800); }
  to   { stroke-dashoffset: 0; }
}

/* Flower blooms: scale from tiny bud to full petals */
@keyframes flower-bloom {
  0%   { transform: scale(0.1); opacity: 0; }
  40%  { transform: scale(0.4); opacity: 0.6; }
  70%  { transform: scale(1.1); opacity: 0.9; }
  85%  { transform: scale(0.95); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* Leaf unfurls from the vine */
@keyframes leaf-unfurl {
  0%   { transform: scale(0) rotate(var(--leaf-rot, -30deg)); opacity: 0; }
  50%  { transform: scale(0.7) rotate(calc(var(--leaf-rot, -30deg) * 0.5)); opacity: 0.7; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

/* Gentle wind sway for flowers and leaves */
@keyframes gentle-sway {
  0%, 100% { transform: rotate(0deg); }
  25%  { transform: rotate(var(--sway-amount, 4deg)); }
  75%  { transform: rotate(calc(var(--sway-amount, 4deg) * -0.6)); }
}

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

/* Wind streaks */
@keyframes wind-streak {
  0%   { transform: translateX(-20px) scaleX(0); opacity: 0; }
  20%  { opacity: var(--streak-opacity, 0.18); transform: translateX(0) scaleX(0.6); }
  60%  { opacity: var(--streak-opacity, 0.18); transform: translateX(var(--streak-travel, 80px)) scaleX(1); }
  100% { opacity: 0; transform: translateX(var(--streak-travel2, 140px)) scaleX(0.3); }
}
`;

/* ── Corner Wind-Swaying Doodle Flower ─────────────────── */
function DoodleCornerFlower({
  x, y, size, color, delay, swayDeg,
}: {
  x: number; y: number; size: number; color: string; delay: number; swayDeg: number;
}) {
  const petals = 5;
  const stemBaseY = y + size * 1.5;
  return (
    <g
      style={{
        transformOrigin: `${x}px ${stemBaseY}px`,
        ["--wind-lean" as string]: `${swayDeg * 1.8}deg`,
        ["--wind-peak" as string]: `${swayDeg * 2.5}deg`,
        ["--wind-droop" as string]: `${swayDeg * 2.0}deg`,
        ["--wind-rebound" as string]: `${-swayDeg * 0.9}deg`,
        ["--wind-settle" as string]: `${-swayDeg * 0.4}deg`,
        ["--wind-push" as string]: `${swayDeg * 0.6}px`,
        ["--wind-push2" as string]: `${swayDeg * 1.0}px`,
        animation: `flower-bloom 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both,
                    wind-flower ${3 + delay * 0.6}s cubic-bezier(0.4, 0, 0.2, 1) infinite ${delay + 0.9}s`,
      } as React.CSSProperties}
    >
      {/* Doodle Stem */}
      <path
        d={`M${x},${y} Q${x + (swayDeg > 0 ? 3 : -3)},${y + size * 0.75} ${x},${stemBaseY}`}
        stroke="#1a5c2a" strokeWidth="1.3" strokeLinecap="round" opacity="0.7"
        style={{ filter: "url(#doodleRough)" }}
      />
      {/* Petals */}
      {Array.from({ length: petals }, (_, i) => {
        const angle = (i / petals) * 360;
        const px = x + Math.cos((angle * Math.PI) / 180) * size * 0.48;
        const py = y + Math.sin((angle * Math.PI) / 180) * size * 0.48;
        return (
          <ellipse
            key={i}
            cx={px} cy={py}
            rx={size * 0.4} ry={size * 0.24}
            fill={color} fillOpacity="0.65"
            stroke={color} strokeWidth="0.8" strokeOpacity="0.9"
            transform={`rotate(${angle} ${px} ${py})`}
            style={{ filter: "url(#doodleRough)" }}
          />
        );
      })}
      {/* Center */}
      <circle
        cx={x} cy={y} r={size * 0.2}
        fill="#f59e0b" fillOpacity="0.9"
        stroke="#b8860b" strokeWidth="0.7"
      />
    </g>
  );
}

/* ── Small red vine flower ───────────────────────────────── */
function VineFlower({
  cx, cy, r, delay, swayDelay,
}: {
  cx: number; cy: number; r: number; delay: number; swayDelay: number;
}) {
  const petalCount = 5;
  return (
    <g
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        animation: `flower-bloom 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s both,
                    gentle-sway ${3 + swayDelay}s ease-in-out ${delay + 1}s infinite`,
        ["--sway-amount" as string]: `${3 + Math.random() * 4}deg`,
      } as React.CSSProperties}
    >
      {/* Petals */}
      {Array.from({ length: petalCount }, (_, i) => {
        const angle = (i / petalCount) * 360;
        const px = cx + Math.cos((angle * Math.PI) / 180) * r * 0.45;
        const py = cy + Math.sin((angle * Math.PI) / 180) * r * 0.45;
        return (
          <ellipse
            key={i}
            cx={px} cy={py}
            rx={r * 0.42} ry={r * 0.24}
            fill="#dc2626" fillOpacity="0.7"
            stroke="#b91c1c" strokeWidth="0.4"
            transform={`rotate(${angle} ${px} ${py})`}
          />
        );
      })}
      {/* Flower center */}
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#fbbf24" fillOpacity="0.85" stroke="#d97706" strokeWidth="0.3" />
    </g>
  );
}

/* ── Small vine leaf ─────────────────────────────────────── */
function VineLeaf({
  cx, cy, size, rot, delay,
}: {
  cx: number; cy: number; size: number; rot: number; delay: number;
}) {
  return (
    <g
      style={{
        transformOrigin: `${cx}px ${cy}px`,
        ["--leaf-rot" as string]: `${rot}deg`,
        animation: `leaf-unfurl 0.8s ease-out ${delay}s both,
                    gentle-sway ${3.5 + Math.random() * 2}s ease-in-out ${delay + 0.8}s infinite`,
        ["--sway-amount" as string]: `${2 + Math.random() * 3}deg`,
      } as React.CSSProperties}
    >
      <path
        d={`M${cx},${cy}
            C${cx + size * 0.3},${cy - size * 0.7}
             ${cx + size * 0.8},${cy - size * 0.6}
             ${cx + size},${cy}
            C${cx + size * 0.8},${cy + size * 0.4}
             ${cx + size * 0.3},${cy + size * 0.4}
             ${cx},${cy}Z`}
        fill="#1a6e2e" fillOpacity="0.55"
        stroke="#145a24" strokeWidth="0.5"
        transform={`rotate(${rot} ${cx} ${cy})`}
      />
      {/* Midrib vein */}
      <line
        x1={cx} y1={cy}
        x2={cx + size * 0.85} y2={cy}
        stroke="#145a24" strokeWidth="0.35" strokeOpacity="0.5"
        transform={`rotate(${rot} ${cx} ${cy})`}
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

/* ── Curly vine border with flowers & leaves ─────────────── */
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

      {/* ─── Left curly vine ─────────────────────────── */}
      <path
        d="M18,0 C12,30 24,50 14,80 C4,110 22,130 16,160
           C10,190 26,210 18,240 C10,270 24,290 16,320
           C8,350 22,370 14,400 C6,430 20,450 14,480
           C8,510 22,530 16,560 C10,580 20,595 14,600"
        stroke="#1e6b30" strokeWidth="1.6" strokeLinecap="round" opacity="0.55"
        strokeDasharray="900"
        style={{ ["--vine-len" as string]: "900", animation: "vine-grow 3s ease-out forwards" } as React.CSSProperties}
      />
      {/* Left curly tendrils */}
      <path d="M14,60 C4,50 -2,42 6,35" stroke="#2d8a42" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"
        strokeDasharray="40" style={{ ["--vine-len" as string]: "40", animation: "vine-grow 1s ease-out 1s both" } as React.CSSProperties} />
      <path d="M18,180 C8,170 2,158 10,150" stroke="#2d8a42" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"
        strokeDasharray="40" style={{ ["--vine-len" as string]: "40", animation: "vine-grow 1s ease-out 1.5s both" } as React.CSSProperties} />
      <path d="M14,320 C4,310 -2,298 8,290" stroke="#2d8a42" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"
        strokeDasharray="40" style={{ ["--vine-len" as string]: "40", animation: "vine-grow 1s ease-out 2s both" } as React.CSSProperties} />
      <path d="M14,470 C4,460 0,448 8,440" stroke="#2d8a42" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"
        strokeDasharray="40" style={{ ["--vine-len" as string]: "40", animation: "vine-grow 1s ease-out 2.5s both" } as React.CSSProperties} />

      {/* Left flowers (red, blooming) */}
      <VineFlower cx={14} cy={80} r={7} delay={1.2} swayDelay={0} />
      <VineFlower cx={18} cy={240} r={6} delay={1.8} swayDelay={0.5} />
      <VineFlower cx={14} cy={400} r={7} delay={2.4} swayDelay={1} />
      <VineFlower cx={16} cy={560} r={5.5} delay={2.8} swayDelay={0.3} />

      {/* Left leaves */}
      <VineLeaf cx={20} cy={50} size={10} rot={-40} delay={1.0} />
      <VineLeaf cx={8} cy={130} size={8} rot={45} delay={1.4} />
      <VineLeaf cx={22} cy={200} size={9} rot={-35} delay={1.7} />
      <VineLeaf cx={10} cy={290} size={10} rot={50} delay={2.0} />
      <VineLeaf cx={20} cy={360} size={8} rot={-45} delay={2.3} />
      <VineLeaf cx={8} cy={440} size={9} rot={40} delay={2.6} />
      <VineLeaf cx={20} cy={520} size={8} rot={-30} delay={2.9} />

      {/* ─── Right curly vine ────────────────────────── */}
      <path
        d="M382,0 C388,30 376,50 386,80 C396,110 378,130 384,160
           C390,190 374,210 382,240 C390,270 376,290 384,320
           C392,350 378,370 386,400 C394,430 380,450 386,480
           C392,510 378,530 384,560 C390,580 380,595 386,600"
        stroke="#1e6b30" strokeWidth="1.6" strokeLinecap="round" opacity="0.55"
        strokeDasharray="900"
        style={{ ["--vine-len" as string]: "900", animation: "vine-grow 3s ease-out 0.5s both" } as React.CSSProperties}
      />
      {/* Right curly tendrils */}
      <path d="M386,100 C396,90 402,78 394,70" stroke="#2d8a42" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"
        strokeDasharray="40" style={{ ["--vine-len" as string]: "40", animation: "vine-grow 1s ease-out 1.8s both" } as React.CSSProperties} />
      <path d="M382,260 C392,250 398,238 390,230" stroke="#2d8a42" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"
        strokeDasharray="40" style={{ ["--vine-len" as string]: "40", animation: "vine-grow 1s ease-out 2.2s both" } as React.CSSProperties} />
      <path d="M386,420 C396,410 402,398 394,390" stroke="#2d8a42" strokeWidth="0.8" strokeLinecap="round" opacity="0.4"
        strokeDasharray="40" style={{ ["--vine-len" as string]: "40", animation: "vine-grow 1s ease-out 2.6s both" } as React.CSSProperties} />

      {/* Right flowers (red, blooming) */}
      <VineFlower cx={386} cy={80} r={6.5} delay={1.5} swayDelay={0.2} />
      <VineFlower cx={382} cy={240} r={7} delay={2.0} swayDelay={0.8} />
      <VineFlower cx={386} cy={400} r={6} delay={2.5} swayDelay={0.4} />
      <VineFlower cx={384} cy={560} r={5.5} delay={3.0} swayDelay={1.2} />

      {/* Right leaves */}
      <VineLeaf cx={380} cy={50} size={-10} rot={40} delay={1.3} />
      <VineLeaf cx={392} cy={150} size={-8} rot={-45} delay={1.6} />
      <VineLeaf cx={378} cy={200} size={-9} rot={35} delay={1.9} />
      <VineLeaf cx={390} cy={300} size={-10} rot={-50} delay={2.2} />
      <VineLeaf cx={380} cy={360} size={-8} rot={45} delay={2.5} />
      <VineLeaf cx={392} cy={450} size={-9} rot={-40} delay={2.8} />
      <VineLeaf cx={380} cy={520} size={-8} rot={30} delay={3.1} />

      {/* ─── Top curly vine ──────────────────────────── */}
      <path
        d="M0,16 C30,10 50,22 80,14 C110,6 130,20 160,12
           C190,4 210,18 240,10 C270,4 290,16 320,10
           C350,4 370,18 400,12"
        stroke="#1e6b30" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"
        strokeDasharray="500"
        style={{ ["--vine-len" as string]: "500", animation: "vine-grow 2.5s ease-out 0.3s both" } as React.CSSProperties}
      />
      {/* Top tendrils */}
      <path d="M80,14 C75,4 82,-2 90,6" stroke="#2d8a42" strokeWidth="0.7" strokeLinecap="round" opacity="0.35"
        strokeDasharray="30" style={{ ["--vine-len" as string]: "30", animation: "vine-grow 0.8s ease-out 1.5s both" } as React.CSSProperties} />
      <path d="M240,10 C235,0 242,-6 250,4" stroke="#2d8a42" strokeWidth="0.7" strokeLinecap="round" opacity="0.35"
        strokeDasharray="30" style={{ ["--vine-len" as string]: "30", animation: "vine-grow 0.8s ease-out 2s both" } as React.CSSProperties} />

      {/* Top flowers */}
      <VineFlower cx={80} cy={14} r={5.5} delay={1.3} swayDelay={0.3} />
      <VineFlower cx={200} cy={14} r={6} delay={1.7} swayDelay={0.7} />
      <VineFlower cx={320} cy={10} r={5.5} delay={2.1} swayDelay={1.1} />

      {/* Top leaves */}
      <VineLeaf cx={50} cy={18} size={7} rot={-25} delay={1.1} />
      <VineLeaf cx={140} cy={14} size={6} rot={30} delay={1.5} />
      <VineLeaf cx={270} cy={8} size={7} rot={-20} delay={1.9} />
      <VineLeaf cx={360} cy={16} size={6} rot={25} delay={2.3} />

      {/* ─── Bottom curly vine ───────────────────────── */}
      <path
        d="M0,586 C30,592 50,580 80,588 C110,596 130,582 160,590
           C190,598 210,584 240,592 C270,598 290,586 320,592
           C350,598 370,584 400,590"
        stroke="#1e6b30" strokeWidth="1.4" strokeLinecap="round" opacity="0.5"
        strokeDasharray="500"
        style={{ ["--vine-len" as string]: "500", animation: "vine-grow 2.5s ease-out 0.8s both" } as React.CSSProperties}
      />
      {/* Bottom tendrils */}
      <path d="M160,590 C155,600 162,606 170,598" stroke="#2d8a42" strokeWidth="0.7" strokeLinecap="round" opacity="0.35"
        strokeDasharray="30" style={{ ["--vine-len" as string]: "30", animation: "vine-grow 0.8s ease-out 2.2s both" } as React.CSSProperties} />

      {/* Bottom flowers */}
      <VineFlower cx={120} cy={588} r={5.5} delay={1.8} swayDelay={0.5} />
      <VineFlower cx={280} cy={590} r={6} delay={2.3} swayDelay={0.9} />

      {/* Bottom leaves */}
      <VineLeaf cx={60} cy={586} size={7} rot={150} delay={1.6} />
      <VineLeaf cx={200} cy={590} size={6} rot={-155} delay={2.0} />
      <VineLeaf cx={340} cy={588} size={7} rot={160} delay={2.5} />

      {/* ─── 4 CORNERS DOODLE FLOWER CLUSTERS (WIND SWAYING) ─── */}
      {/* Top-Left Corner Cluster */}
      <DoodleCornerFlower x={24} y={30} size={15} color="#e879a0" delay={0.2} swayDeg={6} />
      <DoodleCornerFlower x={44} y={22} size={12} color="#d4a0c8" delay={0.5} swayDeg={4} />
      <DoodleCornerFlower x={22} y={54} size={13} color="#f43f5e" delay={0.8} swayDeg={5} />
      <DoodleCornerFlower x={52} y={44} size={10} color="#fb7185" delay={1.1} swayDeg={3} />

      {/* Top-Right Corner Cluster */}
      <DoodleCornerFlower x={376} y={30} size={15} color="#e879a0" delay={0.4} swayDeg={-5} />
      <DoodleCornerFlower x={356} y={22} size={12} color="#d4a0c8" delay={0.7} swayDeg={-4} />
      <DoodleCornerFlower x={378} y={54} size={13} color="#f43f5e" delay={1.0} swayDeg={-6} />
      <DoodleCornerFlower x={348} y={44} size={10} color="#fb7185" delay={1.3} swayDeg={-3} />

      {/* Bottom-Left Corner Cluster */}
      <DoodleCornerFlower x={24} y={570} size={15} color="#e879a0" delay={0.6} swayDeg={6} />
      <DoodleCornerFlower x={44} y={578} size={12} color="#e8a878" delay={0.9} swayDeg={4} />
      <DoodleCornerFlower x={22} y={546} size={13} color="#f43f5e" delay={1.2} swayDeg={5} />
      <DoodleCornerFlower x={52} y={556} size={10} color="#d4a0c8" delay={1.5} swayDeg={3} />

      {/* Bottom-Right Corner Cluster */}
      <DoodleCornerFlower x={376} y={570} size={15} color="#e879a0" delay={0.8} swayDeg={-6} />
      <DoodleCornerFlower x={356} y={578} size={12} color="#e8a878" delay={1.1} swayDeg={-4} />
      <DoodleCornerFlower x={378} y={546} size={13} color="#f43f5e" delay={1.4} swayDeg={-5} />
      <DoodleCornerFlower x={348} y={556} size={10} color="#d4a0c8" delay={1.7} swayDeg={-3} />
    </svg>
  );
}

/* ── Main export ─────────────────────────────────────────── */
export function DoodleBorder({ active = false }: { active?: boolean }) {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (active) {
      setAnimKey((prev) => prev + 1);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div
      key={animKey}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden
      style={{ ["--play-state" as string]: "running" } as React.CSSProperties}
    >
      <style>{DOODLE_CSS}</style>
      <VineBorder />
      <WindStreaks />
    </div>
  );
}
