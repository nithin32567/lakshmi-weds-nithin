import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import templateImg from "@/assets/krishna-radha.webp";
import rightLeafBg from "@/assets/couple-right-leaf.webp";
import { DoodleBorder } from "./DoodleBorder";

/* ─── Butterflies (reduced to 4 for minimalism) ──────────── */

/* ─── Butterflies (entering from all directions around the card) ─ */

const BUTTERFLY_DEFS = [
  // Top-Left corner entry
  { id: 1, startOffsetX: -360, startOffsetY: -300, dx: 520, dy: 420, delay: 0.05, dur: 7.5, size: 34, hue: "#c084fc", light: "#f3e8ff" },
  { id: 2, startOffsetX: -240, startOffsetY: -380, dx: 420, dy: 460, delay: 0.6, dur: 8.2, size: 28, hue: "#f59e0b", light: "#fef3c7" },

  // Top-Right corner entry
  { id: 3, startOffsetX: 380, startOffsetY: -280, dx: -540, dy: 400, delay: 0.2, dur: 7.0, size: 38, hue: "#f43f5e", light: "#ffe4e6" },
  { id: 4, startOffsetX: 260, startOffsetY: -360, dx: -420, dy: 480, delay: 1.0, dur: 8.5, size: 26, hue: "#e879f9", light: "#fdf4ff" },

  // Bottom-Left corner entry
  { id: 5, startOffsetX: -380, startOffsetY: 260, dx: 500, dy: -420, delay: 0.35, dur: 7.2, size: 32, hue: "#38bdf8", light: "#e0f2fe" },
  { id: 6, startOffsetX: -260, startOffsetY: 350, dx: 400, dy: -500, delay: 1.3, dur: 8.8, size: 30, hue: "#a78bfa", light: "#ede9fe" },

  // Bottom-Right corner entry
  { id: 7, startOffsetX: 360, startOffsetY: 280, dx: -480, dy: -440, delay: 0.5, dur: 7.8, size: 36, hue: "#fb7185", light: "#ffe4e6" },
  { id: 8, startOffsetX: 240, startOffsetY: 380, dx: -380, dy: -520, delay: 1.6, dur: 8.4, size: 24, hue: "#2dd4bf", light: "#ccfbf1" },

  // Left Edge entry (flies across right)
  { id: 9, startOffsetX: -450, startOffsetY: -40, dx: 580, dy: -180, delay: 0.15, dur: 6.8, size: 34, hue: "#f59e0b", light: "#fef3c7" },
  { id: 10, startOffsetX: -420, startOffsetY: 120, dx: 520, dy: -280, delay: 1.1, dur: 7.6, size: 28, hue: "#818cf8", light: "#eef2ff" },

  // Right Edge entry (flies across left)
  { id: 11, startOffsetX: 450, startOffsetY: 40, dx: -580, dy: -160, delay: 0.75, dur: 7.4, size: 36, hue: "#e879f9", light: "#fdf4ff" },
  { id: 12, startOffsetX: 400, startOffsetY: -140, dx: -500, dy: 320, delay: 1.8, dur: 8.0, size: 30, hue: "#c084fc", light: "#f3e8ff" },
];

const WING_CSS = `
  @keyframes wf-l { 0%,100%{transform:rotateY(8deg) scaleX(1)} 50%{transform:rotateY(72deg) scaleX(0.35)} }
  @keyframes wf-r { 0%,100%{transform:rotateY(-8deg) scaleX(1)} 50%{transform:rotateY(-72deg) scaleX(0.35)} }
  .wf-l { animation: wf-l 0.26s ease-in-out infinite; transform-origin: right center; transform-box: fill-box; }
  .wf-r { animation: wf-r 0.26s ease-in-out infinite; transform-origin: left center; transform-box: fill-box; }
  @media (prefers-reduced-motion: reduce) { .wf-l, .wf-r { animation: none; } }
`;

function ButterflyIcon({ hue, light, size }: { hue: string; light: string; size: number }) {
  const gid = `${hue.replace("#", "")}-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
      style={{ overflow: "visible", filter: "drop-shadow(0 4px 8px rgb(0 0 0 / 0.18))" }}
    >
      <defs>
        <radialGradient id={`w-${gid}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={light} />
          <stop offset="70%" stopColor={hue} stopOpacity="0.95" />
          <stop offset="100%" stopColor={hue} />
        </radialGradient>
      </defs>

      {/* left wings */}
      <g className="wf-l">
        <path
          d="M31 30C24 14 12 8 6 14c-6 6-1 20 9 25 6 3 12 2 16-3z"
          fill={`url(#w-${gid})`}
          opacity="0.95"
        />
        <path
          d="M31 33C25 44 16 52 10 48c-5-3-4-12 3-17 6-4 13-4 18 2z"
          fill={`url(#w-${gid})`}
          opacity="0.8"
        />
        <circle cx="16" cy="22" r="2.6" fill={light} opacity="0.85" />
      </g>

      {/* right wings */}
      <g className="wf-r">
        <path
          d="M33 30C40 14 52 8 58 14c6 6 1 20-9 25-6 3-12 2-16-3z"
          fill={`url(#w-${gid})`}
          opacity="0.95"
        />
        <path
          d="M33 33C39 44 48 52 54 48c5-3 4-12-3-17-6-4-13-4-18 2z"
          fill={`url(#w-${gid})`}
          opacity="0.8"
        />
        <circle cx="48" cy="22" r="2.6" fill={light} opacity="0.85" />
      </g>

      {/* body + antennae */}
      <ellipse cx="32" cy="34" rx="1.9" ry="12" fill="#3b2a4a" />
      <circle cx="32" cy="22" r="2.4" fill="#3b2a4a" />
      <path d="M32 21C30 16 27 13 24 12" stroke="#3b2a4a" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M32 21C34 16 37 13 40 12" stroke="#3b2a4a" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function FloatingButterfly({
  centerX,
  centerY,
  startOffsetX,
  startOffsetY,
  dx,
  dy,
  delay,
  dur,
  size,
  hue,
  light,
}: {
  centerX: number;
  centerY: number;
  startOffsetX: number;
  startOffsetY: number;
  dx: number;
  dy: number;
  delay: number;
  dur: number;
  size: number;
  hue: string;
  light: string;
}) {
  const startX = centerX + startOffsetX;
  const startY = centerY + startOffsetY;

  return (
    <motion.div
      initial={{ x: startX, y: startY, opacity: 0, scale: 0.3 }}
      animate={{
        x: [startX, startX + dx * 0.45 + (dy > 0 ? 35 : -35), startX + dx],
        y: [startY, startY + dy * 0.55 + (dx > 0 ? -45 : 45), startY + dy],
        opacity: [0, 0.95, 0.9, 0],
        scale: [0.3, 1.05, 0.95, 0.6],
        rotate: [0, dx > 0 ? 18 : -18, dx > 0 ? -12 : 12],
      }}
      transition={{ duration: dur, delay, ease: "easeInOut", times: [0, 0.3, 0.7, 1] }}
      style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 60, willChange: "transform" }}
    >
      <motion.div
        animate={{ x: [0, 18, -14, 0], y: [0, -8, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ButterflyIcon hue={hue} light={light} size={size} />
      </motion.div>
    </motion.div>
  );
}

/* ─── Minimal ornamental divider ─────────────────────────── */

function OrnamentalDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-700/40" />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M8 1L9.5 6.5L15 8L9.5 9.5L8 15L6.5 9.5L1 8L6.5 6.5L8 1Z"
          fill="currentColor"
          className="text-amber-700/50"
        />
      </svg>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-700/40" />
    </div>
  );
}

/* ─── Subtle corner ornament ─────────────────────────────── */

function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const rotations = { tl: "rotate(0)", tr: "rotate(90deg)", bl: "rotate(-90deg)", br: "rotate(180deg)" };
  const positions = {
    tl: "top-3 left-3",
    tr: "top-3 right-3",
    bl: "bottom-3 left-3",
    br: "bottom-3 right-3",
  };
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={`pointer-events-none absolute ${positions[position]} opacity-40`}
      style={{ transform: rotations[position] }}
    >
      <path
        d="M2 2C2 2 8 2 14 8C20 14 20 20 20 20"
        stroke="currentColor"
        strokeWidth="0.8"
        className="text-amber-800"
      />
      <path
        d="M2 2C2 2 2 8 8 14C14 20 20 20 20 20"
        stroke="currentColor"
        strokeWidth="0.8"
        className="text-amber-800"
      />
      <circle cx="2" cy="2" r="1.5" fill="currentColor" className="text-amber-700/60" />
    </svg>
  );
}

/* ─── Panels ──────────────────────────────────────────────── */

/* Warm ivory card surface */
const panelSurface: React.CSSProperties = {
  background: "linear-gradient(145deg, #faf7f2 0%, #f5f0e8 40%, #ede7db 100%)",
  transformStyle: "preserve-3d",
  backfaceVisibility: "hidden",
};

function NamesPanel({ opened }: { opened?: boolean }) {
  return (
    <div
      className="relative flex h-full flex-col items-center justify-center overflow-hidden px-2 py-8 text-center sm:px-12 sm:py-16"
    >
      {/* Doodle art border with animated flowers & leaves */}
      <DoodleBorder active={opened} />

      {/* Subtle radial warmth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(212, 175, 120, 0.08), transparent 70%)",
        }}
      />

      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      <div className="relative flex flex-col items-center">
        <p className="font-body text-[0.6rem] uppercase tracking-[0.4em] text-amber-900/60 sm:text-[0.7rem]">
          ✦ Save the Date ✦
        </p>

        <OrnamentalDivider className="my-4" />

        {/* Krishna-Radha illustration */}
        <div className="my-4 w-32 sm:my-4 sm:w-48 md:w-52">
          <img
            src={templateImg}
            alt="Krishna and Radha"
            className="h-auto w-full rounded-lg object-contain scale-150"
            loading="lazy"
            style={{
              filter: "drop-shadow(0 6px 16px rgba(30,15,5,0.18))",
            }}
          />
        </div>

        <p className="font-malayalam text-[0.7rem] text-amber-950/60 sm:text-sm">ചിങ്ങത്തിൽ</p>
        <p className="font-malayalam text-[0.8rem] font-semibold tracking-wide text-amber-950/75 sm:text-lg">
          താലികെട്ട്
        </p>

        <h2 className="mt-3 font-hand text-[2rem] leading-[1.1] text-amber-900 sm:mt-4 sm:text-5xl md:text-6xl">
      നിതിൻ     
        </h2>

        <div className="my-2 flex items-center justify-center gap-2 sm:my-2 sm:gap-3">
          <span className="h-px w-6 bg-amber-700/30 sm:w-8" />
          <span className="font-display text-xl italic text-amber-700/60 sm:text-2xl">&amp;</span>
          <span className="h-px w-6 bg-amber-700/30 sm:w-8" />
        </div>

        <h2 className="font-hand text-[2rem] leading-[1.1] text-amber-900 sm:text-5xl md:text-6xl">
          ലക്ഷ്മി
        </h2>

        <OrnamentalDivider className="mt-5" />
      </div>
    </div>
  );
}

function DetailsPanel({ opened }: { opened?: boolean }) {
  return (
    <div
      className="relative flex h-full flex-col items-center justify-center overflow-hidden px-2 py-8 text-center sm:px-12 sm:py-20"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${rightLeafBg})` }}
      />
      {/* Yellow overlay with bright base to keep details readable */}
      <div className="absolute inset-0 bg-black0" />
      <div className="absolute inset-0 bg-[#faf7f2]/25" />

      {/* Doodle art border with animated flowers & leaves */}
      <DoodleBorder active={opened} />

      {/* Subtle radial warmth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 50%, rgba(212, 175, 120, 0.08), transparent 15%)",
        }}
      />

      <CornerOrnament position="tl" />
      <CornerOrnament position="tr" />
      <CornerOrnament position="bl" />
      <CornerOrnament position="br" />

      <div className="relative w-full max-w-xs sm:max-w-sm">
        <p className="font-body text-xs uppercase tracking-[0.25em] text-ivory/90 sm:text-sm">
          Together with our families
        </p>
        <p className="mt-2 font-body text-[0.65rem] uppercase tracking-[0.2em] text-ivory/70 sm:text-xs">
          we invite you to share the joy of our beautiful beginning
        </p>

        <p className="mt-8 font-malayalam text-sm text-gold-light sm:text-base">1202 ചിങ്ങം 27</p>
        <p className="mt-2 font-malayalam text-xs leading-relaxed text-ivory/80 sm:text-sm">
          ശുഭമുഹൂർത്തത്തിൽ വിവാഹിതരാകുന്നു
        </p>

        <OrnamentalDivider className="my-6 sm:my-8" />

        <p className="font-body text-[0.65rem] uppercase tracking-[0.3em] text-gold-light/90 sm:text-xs">
          Venue
        </p>
        <p className="mt-2 font-body text-sm leading-relaxed text-ivory/90 sm:text-base">
          Sri Chathan Master Memorial Community Hall,
          <br />
          V.R. Puram, Chalakudy
        </p>
      </div>

      {/* Date grid */}
      <div className="mx-auto mt-8 grid w-full grid-cols-[1fr_auto_1fr] items-center rounded-md border border-white/10 bg-black/40 backdrop-blur-md sm:mt-10">
        <div className="px-2 py-3 sm:px-4 sm:py-4">
          <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory sm:text-sm">
            Saturday
          </p>
          <p className="mt-1.5 text-[0.6rem] text-ivory/70 sm:text-xs">11:00 AM – 12:00 PM</p>
        </div>
        <div className="flex h-full items-center border-x border-white/10 px-4 py-3 sm:px-6 sm:py-4">
          <span className="font-display text-4xl font-semibold text-gold-light sm:text-5xl">12</span>
        </div>
        <div className="px-2 py-3 sm:px-4 sm:py-4">
          <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-ivory sm:text-sm">
            September
          </p>
          <p className="mt-1.5 text-[0.6rem] text-ivory/70 sm:text-xs">2026</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Spine / crease shadow ──────────────────────────────── */

const crease = (dir: "l" | "r" | "t" | "b") => {
  const map = {
    l: "absolute inset-y-0 left-0 w-8 bg-gradient-to-r sm:w-12",
    r: "absolute inset-y-0 right-0 w-8 bg-gradient-to-l sm:w-12",
    t: "absolute inset-x-0 top-0 h-8 bg-gradient-to-b sm:h-12",
    b: "absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t sm:h-12",
  } as const;
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${map[dir]} from-teak/15 to-transparent`}
    />
  );
};

/* ─── Main ────────────────────────────────────────────────── */

export function InvitationCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [opened, setOpened] = useState(false);
  const [butterflies, setButterflies] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!inView) return;
    
    if (reduce) {
      setOpened(true);
      const r = cardRef.current?.getBoundingClientRect();
      if (r) setButterflies({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      return;
    }

    const t = setTimeout(() => setOpened(true), 100);
    const b = setTimeout(() => {
      const r = cardRef.current?.getBoundingClientRect();
      if (r) setButterflies({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }, 600);

    return () => {
      clearTimeout(t);
      clearTimeout(b);
    };
  }, [inView, reduce]);

  const T = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      id="invitation"
      ref={sectionRef}
      className="relative overflow-hidden bg-teak-deep px-3 py-14 sm:px-6 sm:py-20 md:py-28"
    >
      <style>{WING_CSS}</style>

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(65% 50% at 50% 30%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 70%)",
        }}
      />

      {/* Butterflies */}
      {mounted &&
        butterflies &&
        createPortal(
          <>
            {BUTTERFLY_DEFS.map((b) => (
              <FloatingButterfly
                key={b.id}
                centerX={butterflies.x}
                centerY={butterflies.y}
                {...b}
              />
            ))}
          </>,
          document.body,
        )}

      <div
        ref={cardRef}
        className="relative mx-auto w-full max-w-[30rem] md:max-w-[52rem]"
        style={{ perspective: "1600px" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-5 bottom-1 h-12 rounded-[50%] bg-black/55 blur-2xl"
        />

        {/* Mobile — top / bottom fold */}
        <div
          className="relative grid auto-rows-fr overflow-hidden rounded-[1.1rem] shadow-[0_40px_90px_-40px_rgb(0_0_0/0.85)] ring-1 ring-gold/35 md:hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            initial={{ rotateX: -94, opacity: 0 }}
            animate={opened ? { rotateX: 0, opacity: 1 } : {}}
            transition={T}
            className="relative h-full w-full origin-bottom"
            style={panelSurface}
          >
            <NamesPanel opened={opened} />
            {crease("b")}
          </motion.div>

          <motion.div
            initial={{ rotateX: 94, opacity: 0 }}
            animate={opened ? { rotateX: 0, opacity: 1 } : {}}
            transition={{ ...T, delay: 0.18 }}
            className="relative h-full w-full origin-top"
            style={panelSurface}
          >
            <DetailsPanel opened={opened} />
            {crease("t")}
          </motion.div>

          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-px -translate-y-1/2 bg-gold/40" />
        </div>

        {/* Desktop — left / right book fold */}
        <div
          className="relative hidden overflow-hidden rounded-[1.1rem] shadow-[0_50px_110px_-45px_rgb(0_0_0/0.9)] ring-1 ring-gold/35 md:grid md:grid-cols-2"
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={opened ? { rotateY: 0, opacity: 1 } : {}}
            transition={T}
            className="relative h-full w-full origin-right"
            style={panelSurface}
          >
            <NamesPanel opened={opened} />
            {crease("r")}
          </motion.div>

          <motion.div
            initial={{ rotateY: -90, opacity: 0 }}
            animate={opened ? { rotateY: 0, opacity: 1 } : {}}
            transition={{ ...T, delay: 0.14 }}
            className="relative h-full w-full origin-left"
            style={panelSurface}
          >
            <DetailsPanel opened={opened} />
            {crease("l")}
          </motion.div>

          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gold/45"
          />
        </div>
      </div>

      {!opened && (
        <p className="relative mt-8 text-center font-body text-[0.6rem] uppercase tracking-[0.35em] text-ivory/60">
          scroll to open ↓
        </p>
      )}
    </section>
  );
}
