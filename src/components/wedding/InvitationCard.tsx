"use client";

import { motion, useInView, useAnimation } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import watercolorBg from "@/assets/watercolor-invitation-bg.png";

/* ─── Butterfly ───────────────────────────────────────────── */

const BUTTERFLY_DEFS = [
  { id: 1, dx: -260, dy: -480, delay: 0.05, dur: 6.5, size: 48, hue: "#c084fc", light: "#f3e8ff" },
  { id: 2, dx: 220, dy: -520, delay: 0.35, dur: 7, size: 36, hue: "#a78bfa", light: "#ede9fe" },
  { id: 3, dx: -90, dy: -580, delay: 0.6, dur: 8, size: 52, hue: "#e879f9", light: "#fdf4ff" },
  { id: 4, dx: 340, dy: -400, delay: 0.15, dur: 5.5, size: 32, hue: "#818cf8", light: "#eef2ff" },
  { id: 5, dx: -380, dy: -340, delay: 0.8, dur: 7, size: 42, hue: "#d946ef", light: "#fdf4ff" },
  { id: 6, dx: 130, dy: -620, delay: 0.45, dur: 9, size: 46, hue: "#9333ea", light: "#f5f3ff" },
  { id: 7, dx: -160, dy: -460, delay: 1.0, dur: 6, size: 30, hue: "#c4b5fd", light: "#f5f3ff" },
  { id: 8, dx: 280, dy: -500, delay: 0.7, dur: 8.5, size: 40, hue: "#a21caf", light: "#fdf4ff" },
];

/* Wing-flap CSS injected once */
const WING_CSS = `
  @keyframes wf-l { 0%,100%{transform:rotateY(0deg)} 50%{transform:rotateY(65deg)} }
  @keyframes wf-r { 0%,100%{transform:rotateY(0deg)} 50%{transform:rotateY(-65deg)} }
  @keyframes bf-sway { 0%,100%{transform:translateX(0)} 50%{transform:translateX(18px)} }
  .wf-l { animation: wf-l 0.32s ease-in-out infinite; transform-origin: right center; }
  .wf-r { animation: wf-r 0.32s ease-in-out infinite; transform-origin: left center; }
`;

function ButterflyIcon({ hue, light, size }: { hue: string; light: string; size: number }) {
  const w = size * 2.2;
  const h = size * 1.4;
  return (
    <svg width={w} height={h} viewBox="0 0 110 70" style={{ overflow: "visible", filter: `drop-shadow(0 2px 6px ${hue}88)` }}>
      {/* Left wings */}
      <g className="wf-l">
        <ellipse cx="32" cy="24" rx="26" ry="20" fill={hue} opacity="0.85" />
        <ellipse cx="26" cy="50" rx="18" ry="13" fill={light} opacity="0.7" />
        <ellipse cx="29" cy="24" rx="13" ry="10" fill={light} opacity="0.5" />
      </g>
      {/* Right wings */}
      <g className="wf-r">
        <ellipse cx="78" cy="24" rx="26" ry="20" fill={hue} opacity="0.85" />
        <ellipse cx="84" cy="50" rx="18" ry="13" fill={light} opacity="0.7" />
        <ellipse cx="81" cy="24" rx="13" ry="10" fill={light} opacity="0.5" />
      </g>
      {/* Body */}
      <ellipse cx="55" cy="34" rx="3.5" ry="16" fill="rgba(50,20,70,0.75)" />
      {/* Antennae */}
      <path d="M52 20 Q44 9 40 5" stroke="rgba(50,20,70,0.65)" strokeWidth="1.5" fill="none" />
      <circle cx="39" cy="4" r="2.2" fill={hue} />
      <path d="M58 20 Q66 9 70 5" stroke="rgba(50,20,70,0.65)" strokeWidth="1.5" fill="none" />
      <circle cx="71" cy="4" r="2.2" fill={hue} />
    </svg>
  );
}

function FloatingButterfly({
  startX, startY, dx, dy, delay, dur, size, hue, light,
}: { startX: number; startY: number; dx: number; dy: number; delay: number; dur: number; size: number; hue: string; light: string }) {
  return (
    <motion.div
      initial={{ x: startX, y: startY, opacity: 0, scale: 0.2, rotate: 0 }}
      animate={{
        x: [startX, startX + dx * 0.4, startX + dx],
        y: [startY, startY + dy * 0.5, startY + dy],
        opacity: [0, 1, 1, 0],
        scale: [0.2, 1, 0.85],
        rotate: [0, dx > 0 ? 12 : -12, dx > 0 ? -8 : 8],
      }}
      transition={{ duration: dur, delay, ease: "easeInOut", times: [0, 0.3, 1] }}
      style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 9999 }}
    >
      <div style={{ animation: `bf-sway ${dur * 0.6}s ease-in-out infinite`, animationDelay: `${delay}s` }}>
        <ButterflyIcon hue={hue} light={light} size={size} />
      </div>
    </motion.div>
  );
}

/* ─── Panel content ───────────────────────────────────────── */

function LeftPanel() {
  return (
    /* @container — cqw now based on this panel's width (~450px) */
    <div className="@container relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden" style={{ padding: "44px 44px" }}>
      {/* Watercolor BG – left half */}
      <img
        src={watercolorBg} alt="" aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ objectPosition: "center center", opacity: 0.82, mixBlendMode: "multiply" }}
      />
      <div className="relative z-10 flex flex-col items-center w-full" style={{ gap: "10px" }}>
        <p className="font-bold tracking-[0.28em] uppercase"
          style={{ color: "#6b5b8e", fontFamily: "'Outfit',sans-serif", fontSize: "0.72rem", letterSpacing: "0.28em" }}>
          ✦ Save the Date ✦
        </p>
        <div className="w-[60%] h-px" style={{ background: "linear-gradient(90deg,transparent,#9b7fc0,transparent)" }} />
        <p style={{ color: "#5a4a7a", fontFamily: "'Chilanka',cursive", fontSize: "1rem" }}>ചിങ്ങത്തിൽ</p>
        <h2 className="font-black" style={{ color: "#5a4a7a", fontFamily: "'Chilanka',cursive", fontSize: "1.3rem", margin: 0 }}>താലികെട്ട്</h2>

        {/* Bride name */}
        <h1
          className="leading-none w-full text-center"
          style={{
            fontFamily: "'Chilanka',cursive",
            fontSize: "clamp(2rem,18cqw,3.8rem)",
            background: "linear-gradient(135deg,#7b4fa6 20%,#b06bcc 60%,#8b5ab3 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: "drop-shadow(0 2px 8px rgba(130,90,180,0.3))",
            margin: "4px 0",
          }}>
          ലക്ഷ്മി
        </h1>

        {/* Ampersand divider */}
        <div className="flex items-center w-[75%]" style={{ gap: "10px" }}>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(155,127,192,0.5))" }} />
          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: "clamp(1.4rem,8cqw,2.2rem)", color: "#9b7fc0", lineHeight: 1 }}>&amp;</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(155,127,192,0.5),transparent)" }} />
        </div>

        {/* Groom name */}
        <h1
          className="leading-none w-full text-center"
          style={{
            fontFamily: "'Chilanka',cursive",
            fontSize: "clamp(2rem,18cqw,3.8rem)",
            background: "linear-gradient(135deg,#7b4fa6 20%,#b06bcc 60%,#8b5ab3 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: "drop-shadow(0 2px 8px rgba(130,90,180,0.3))",
            margin: "4px 0",
          }}>
          നിതിൻ
        </h1>
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    /* @container — cqw now based on this panel's width (~450px) */
    <div className="@container relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden" style={{ padding: "40px 36px" }}>
      {/* Watercolor BG – right half */}
      <img
        src={watercolorBg} alt="" aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ objectPosition: "center center", opacity: 0.82, mixBlendMode: "multiply" }}
      />
      <div className="relative z-10 flex flex-col items-center w-full" style={{ gap: "12px" }}>
        <p className="tracking-[0.2em] uppercase"
          style={{ color: "#6b5b8e", fontFamily: "'Outfit',sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em" }}>
          INVITE YOU TO JOIN THEM
        </p>
        <p className="tracking-[0.15em] uppercase"
          style={{ color: "#8878a8", fontFamily: "'Outfit',sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em" }}>
          AT THE CELEBRATION OF THEIR MARRIAGE
        </p>

        {/* Date block — full width of the content area */}
        <div className="flex items-stretch w-full"
          style={{ border: "1.5px solid rgba(155,127,192,0.5)", borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.45)", marginTop: 4 }}>
          <div className="flex flex-col items-center justify-center flex-1" style={{ padding: "10px 8px" }}>
            <span className="font-bold tracking-widest uppercase" style={{ color: "#6b5b8e", fontFamily: "'Outfit',sans-serif", fontSize: "0.7rem" }}>Saturday</span>
            <span style={{ color: "#8878a8", fontFamily: "'Outfit',sans-serif", fontSize: "0.62rem" }}>10:00 – 11:00 AM</span>
          </div>
          <div className="w-px self-stretch" style={{ background: "rgba(155,127,192,0.4)" }} />
          <div className="flex items-center justify-center" style={{ padding: "10px 16px", background: "linear-gradient(135deg,rgba(155,127,192,0.18),rgba(180,150,220,0.25))" }}>
            <span style={{ fontSize: "clamp(1.6rem,10cqw,2.6rem)", color: "#7b4fa6", fontFamily: "'Cormorant Garamond',Georgia,serif", lineHeight: 1, fontWeight: 900 }}>12</span>
          </div>
          <div className="w-px self-stretch" style={{ background: "rgba(155,127,192,0.4)" }} />
          <div className="flex flex-col items-center justify-center flex-1" style={{ padding: "10px 8px" }}>
            <span className="font-bold tracking-widest uppercase" style={{ color: "#6b5b8e", fontFamily: "'Outfit',sans-serif", fontSize: "0.7rem" }}>September</span>
            <span style={{ color: "#8878a8", fontFamily: "'Outfit',sans-serif", fontSize: "0.62rem" }}>2026</span>
          </div>
        </div>

        {/* Malayalam info */}
        <div className="space-y-1 text-center" style={{ color: "#5a4a7a", fontFamily: "'Chilanka',cursive", fontSize: "0.88rem" }}>
          <p>1202 ചിങ്ങം 27</p>
          <p>ശുഭമുഹൂർത്തത്തിൽ വിവാഹിതരാകുന്നു</p>
        </div>

        <div className="w-[60%] h-px" style={{ background: "linear-gradient(90deg,transparent,#9b7fc0,transparent)" }} />

        {/* Venue */}
        <div className="space-y-1 text-center" style={{ color: "#6b5b8e", fontFamily: "'Chilanka',cursive", fontSize: "0.88rem" }}>
          <p className="uppercase tracking-widest" style={{ fontFamily: "'Outfit',sans-serif", color: "#8878a8", letterSpacing: "0.2em", fontSize: "0.65rem" }}>Venue</p>
          <p>കല്യാണമണ്ഡപം, കൊച്ചി</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────── */

export function InvitationCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-120px" });
  const [opened, setOpened] = useState(false);
  const [butterflies, setButterflies] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setOpened(true), 200);
    const t2 = setTimeout(() => {
      if (cardRef.current) {
        const r = cardRef.current.getBoundingClientRect();
        setButterflies({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      }
    }, 900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isInView]);

  const foldTransition = { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <section
      id="invitation"
      ref={sectionRef}
      className="relative flex justify-center items-center py-16 md:py-24 overflow-visible"
      style={{ background: "linear-gradient(160deg,#e8e4f0 0%,#f0ede8 50%,#e4eae4 100%)" }}
    >
      {/* Inject wing-flap CSS */}
      <style>{WING_CSS}</style>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: "radial-gradient(ellipse 60% 40% at 20% 30%,rgba(250,150,210,0.25) 0%,transparent 70%),radial-gradient(ellipse 250% 35% at 80% 70%,rgba(250,190,160,0.2) 0%,transparent 70%)" }} />

      {/* ── Butterflies portal ── */}
      {mounted && butterflies && createPortal(
        <>
          {BUTTERFLY_DEFS.map(b => (
            <FloatingButterfly
              key={b.id}
              startX={butterflies.x - (b.size * 1.1)}
              startY={butterflies.y - (b.size * 0.7)}
              dx={b.dx} dy={b.dy}
              delay={b.delay} dur={b.dur}
              size={b.size} hue={b.hue} light={b.light}
            />
          ))}
        </>,
        document.body
      )}

      {/* ── Folded Card ── */}
      <div
        ref={cardRef}
        className="relative w-[92%] max-w-[900px] @container"
        style={{ perspective: "1600px", perspectiveOrigin: "50% 50%" }}
      >
        {/* Outer glow */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: "0 60px 140px -40px rgba(100,80,140,0.35)",
            opacity: opened ? 1 : 0,
            transition: "opacity 1.2s ease",
          }} />

        {/* Two-panel fold wrapper */}
        <div className="flex" style={{ transformStyle: "preserve-3d" }}>

          {/* ─ LEFT PANEL ─ */}
          <motion.div
            animate={{ rotateY: opened ? 0 : -88 }}
            transition={foldTransition}
            className="w-1/2 rounded-l-2xl overflow-hidden"
            style={{
              transformOrigin: "right center",
              transformStyle: "preserve-3d",
              background: "rgba(255,255,255,0.88)",
              boxShadow: opened ? "-8px 0 40px -8px rgba(100,80,140,0.15)" : "none",
              minHeight: "780px",
              /* Crease shadow on right edge */
              borderRight: "1px solid rgba(155,127,192,0.3)",
            }}
          >
            <LeftPanel />
            {/* Inner crease gradient */}
            <div className="absolute top-0 right-0 w-6 h-full pointer-events-none"
              style={{ background: "linear-gradient(to left,rgba(100,80,140,0.12),transparent)" }} />
          </motion.div>

          {/* ─ RIGHT PANEL ─ */}
          <motion.div
            animate={{ rotateY: opened ? 0 : 88 }}
            transition={foldTransition}
            className="w-1/2 rounded-r-2xl overflow-hidden"
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              background: "rgba(255,255,255,0.88)",
              boxShadow: opened ? "8px 0 40px -8px rgba(100,80,140,0.15)" : "none",
              minHeight: "680px",
            }}
          >
            <RightPanel />
            {/* Inner crease gradient */}
            <div className="absolute top-0 left-0 w-6 h-full pointer-events-none"
              style={{ background: "linear-gradient(to right,rgba(100,80,140,0.12),transparent)" }} />
          </motion.div>

          {/* Center crease line */}
          <div
            className="absolute top-0 bottom-0 left-1/2 w-px pointer-events-none z-20"
            style={{
              background: "linear-gradient(to bottom,transparent 2%,rgba(155,127,192,0.5) 20%,rgba(155,127,192,0.4) 80%,transparent 98%)",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>

      {/* Closed-state hint text */}
      {!opened && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
          className="absolute bottom-6 text-[0.8rem] tracking-widest uppercase"
          style={{ color: "#9b7fc0", fontFamily: "'Outfit',sans-serif" }}
        >
          scroll to open ↓
        </motion.p>
      )}
    </section>
  );
}
