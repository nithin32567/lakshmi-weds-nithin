import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import templateImg from "@/assets/krishna-radha.png";
import bgImage from "@/assets/bg-3.jpg";
import rightLeafBg from "@/assets/couple-right-leaf.jpg";
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
      className="relative flex h-full min-h-[32rem] flex-col items-center justify-center overflow-hidden px-8 py-12 text-center sm:min-h-[36rem] sm:px-12 sm:py-16 md:min-h-[38rem]"
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
        <div className="my-4 w-40 sm:w-48 md:w-52">
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

        <p className="font-malayalam text-sm text-amber-950/60">ചിങ്ങത്തിൽ</p>
        <p className="font-malayalam text-base font-semibold tracking-wide text-amber-950/75 sm:text-lg">
          താലികെട്ട്
        </p>

        <h2 className="mt-4 font-hand text-[2.5rem] leading-[1.1] text-amber-900 sm:text-5xl md:text-6xl">
          ലക്ഷ്മി
        </h2>

        <div className="my-2 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-amber-700/30" />
          <span className="font-display text-xl italic text-amber-700/60 sm:text-2xl">&amp;</span>
          <span className="h-px w-8 bg-amber-700/30" />
        </div>

        <h2 className="font-hand text-[2.5rem] leading-[1.1] text-amber-900 sm:text-5xl md:text-6xl">
          നിതിൻ
        </h2>

        <OrnamentalDivider className="mt-5" />
      </div>
    </div>
  );
}

function DetailsPanel({ opened }: { opened?: boolean }) {
  return (
    <div
      className="relative flex h-full min-h-[32rem] flex-col items-center justify-center overflow-hidden px-8 py-16 text-center sm:min-h-[36rem] sm:px-12 sm:py-20 md:min-h-[38rem]"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${rightLeafBg})` }}
      />
      {/* Yellow overlay with bright base to keep details readable */}
      <div className="absolute inset-0 bg-yellow-200/10" />
      <div className="absolute inset-0 bg-[#faf7f2]/55" />

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

      <div className="relative w-full max-w-xs sm:max-w-sm">
        <p className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-amber-900/70 sm:text-xs">
          Invite you to join them
        </p>
        <p className="mt-1 font-body text-[0.55rem] uppercase tracking-[0.24em] text-amber-800/50 sm:text-[0.7rem]">
          at the celebration of their marriage
        </p>

        {/* Date grid */}
        <div className="mx-auto mt-8 grid w-full grid-cols-[1fr_auto_1fr] items-center rounded-md border border-amber-800/15 bg-white/40 backdrop-blur-sm">
          <div className="px-3 py-3">
            <p className="font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-amber-950 sm:text-xs">
              Saturday
            </p>
            <p className="mt-1 text-[0.55rem] text-amber-800/60 sm:text-[0.7rem]">11:00 AM – 12:00 PM</p>
          </div>
          <div className="flex h-full items-center border-x border-amber-800/15 px-5 py-3">
            <span className="font-display text-3xl font-semibold text-amber-900 sm:text-4xl">12</span>
          </div>
          <div className="px-3 py-3">
            <p className="font-body text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-amber-950 sm:text-xs">
              September
            </p>
            <p className="mt-1 text-[0.55rem] text-amber-800/60 sm:text-[0.7rem]">2026</p>
          </div>
        </div>

        <p className="mt-6 font-malayalam text-xs text-amber-950/65 sm:text-sm">1202 ചിങ്ങം 27</p>
        <p className="mt-1 font-malayalam text-[0.7rem] leading-relaxed text-amber-900/50 sm:text-xs">
          ശുഭമുഹൂർത്തത്തിൽ വിവാഹിതരാകുന്നു
        </p>

        <OrnamentalDivider className="my-6" />

        <p className="font-body text-[0.55rem] uppercase tracking-[0.3em] text-amber-800/60 sm:text-[0.65rem]">
          Venue
        </p>
        <p className="mt-1 font-malayalam text-xs text-amber-950/70 sm:text-sm">
          കല്യാണമണ്ഡപം, കൊച്ചി
        </p>
      </div>
    </div>
  );
}

/* ─── Spine / crease shadow ──────────────────────────────── */

const crease = (dir: "l" | "r" | "t" | "b") => {
  const map = {
    l: "absolute inset-y-0 left-0 w-6 bg-gradient-to-r",
    r: "absolute inset-y-0 right-0 w-6 bg-gradient-to-l",
    t: "absolute inset-x-0 top-0 h-6 bg-gradient-to-b",
    b: "absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t",
  } as const;
  return (
    <div
      aria-hidden
      className={`pointer-events-none ${map[dir]} from-amber-950/10 to-transparent`}
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

  useEffect(() => setMounted(true), []);

  /* Open when the section is scrolled into view using high-performance IntersectionObserver */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let openTimer: ReturnType<typeof setTimeout> | null = null;
    let butterflyTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          openTimer = setTimeout(() => setOpened(true), 350);
          butterflyTimer = setTimeout(() => {
            const r = cardRef.current?.getBoundingClientRect();
            if (r) setButterflies({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }, 1100);
        } else {
          if (openTimer) clearTimeout(openTimer);
          if (butterflyTimer) clearTimeout(butterflyTimer);
          openTimer = null;
          butterflyTimer = null;
          setOpened(false);
          setButterflies(null);
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (openTimer) clearTimeout(openTimer);
      if (butterflyTimer) clearTimeout(butterflyTimer);
    };
  }, []);

  /* Realistic book-fold transition */
  const openTransition = {
    duration: 1.6,
    ease: [0.16, 1, 0.3, 1] as const,
  };
  const closeTransition = {
    duration: 1.2,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  return (
    <section
      id="invitation"
      ref={sectionRef}
      className="relative overflow-hidden bg-black py-14 sm:py-20 md:py-28"
    >
      <style>{WING_CSS}</style>

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 40%, rgb(196 181 253 / 0.25), transparent 70%)",
        }}
      />

      {/* Background Image Overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${bgImage})` }}
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
        className="relative mx-auto w-full px-0 sm:w-[min(92vw,34rem)] sm:px-0 md:w-[min(92vw,58rem)]"
        style={{ perspective: "1800px" }}
      >
        {/* Soft shadow underneath */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-8 bottom-1 h-12 rounded-[50%] blur-2xl"
          style={{ background: "rgba(40, 20, 10, 0.25)" }}
        />

        {/* ─── Mobile — vertical top/bottom fold ──────────── */}
        <div
          className="relative overflow-hidden rounded-none shadow-[0_30px_70px_-30px_rgba(30,15,5,0.5)] sm:rounded-xl md:hidden"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Top panel — Names — folds upward like a greeting card */}
          <motion.div
            initial={{ rotateX: -92, opacity: 0 }}
            animate={
              opened
                ? { rotateX: 0, opacity: 1 }
                : { rotateX: -92, opacity: 0 }
            }
            transition={opened ? openTransition : closeTransition}
            className="relative origin-bottom"
            style={panelSurface}
          >
            <NamesPanel opened={opened} />
            {crease("b")}
          </motion.div>

          {/* Center crease line */}
          <div aria-hidden className="h-px w-full bg-amber-800/20" />

          {/* Bottom panel — Details — folds downward */}
          <motion.div
            initial={{ rotateX: 92, opacity: 0 }}
            animate={
              opened
                ? { rotateX: 0, opacity: 1 }
                : { rotateX: 92, opacity: 0 }
            }
            transition={
              opened
                ? { ...openTransition, delay: 0.15 }
                : closeTransition
            }
            className="relative origin-top"
            style={panelSurface}
          >
            <DetailsPanel opened={opened} />
            {crease("t")}
          </motion.div>
        </div>

        {/* ─── Desktop — realistic left/right book fold ───── */}
        <div
          className="relative hidden overflow-hidden rounded-xl md:grid md:grid-cols-2"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Left leaf — Names — swings from right edge like a real book cover */}
          <motion.div
            initial={{ rotateY: 92, opacity: 0 }}
            animate={
              opened
                ? { rotateY: 0, opacity: 1 }
                : { rotateY: 92, opacity: 0 }
            }
            transition={opened ? openTransition : closeTransition}
            className="relative origin-right"
            style={{
              ...panelSurface,
              boxShadow: opened
                ? "inset -4px 0 12px -4px rgba(40,20,10,0.12)"
                : "none",
            }}
          >
            <NamesPanel opened={opened} />
            {crease("r")}
          </motion.div>

          {/* Right leaf — Details — swings from left edge */}
          <motion.div
            initial={{ rotateY: -92, opacity: 0 }}
            animate={
              opened
                ? { rotateY: 0, opacity: 1 }
                : { rotateY: -92, opacity: 0 }
            }
            transition={
              opened
                ? { ...openTransition, delay: 0.12 }
                : { ...closeTransition, delay: 0.06 }
            }
            className="relative origin-left"
            style={{
              ...panelSurface,
              boxShadow: opened
                ? "inset 4px 0 12px -4px rgba(40,20,10,0.12)"
                : "none",
            }}
          >
            <DetailsPanel opened={opened} />
            {crease("l")}
          </motion.div>

          {/* Spine shadow — the center fold line */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-1/2 z-10 -translate-x-1/2"
            style={{
              width: "6px",
              background:
                "linear-gradient(90deg, rgba(40,20,10,0.08), rgba(40,20,10,0.14), rgba(40,20,10,0.08))",
            }}
          />

          {/* Soft drop shadow behind card */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl"
            animate={
              opened
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.96 }
            }
            transition={opened ? openTransition : closeTransition}
            style={{
              boxShadow:
                "0 40px 100px -30px rgba(30,15,5,0.45), 0 15px 40px -15px rgba(30,15,5,0.2)",
            }}
          />
        </div>


      </div>

      {/* Scroll hint */}
      {!opened && (
        <p className="relative mt-8 text-center text-[0.6rem] uppercase tracking-[0.35em] text-ivory/70">
          scroll to open ↓
        </p>
      )}
    </section>
  );
}
