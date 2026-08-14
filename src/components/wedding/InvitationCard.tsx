"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import watercolorBg from "@/assets/watercolor-invitation-bg.png";

/* ─── Butterfly ───────────────────────────────────────────── */

const BUTTERFLY_DEFS = [
  { id: 1, dx: -220, dy: -400, delay: 0.05, dur: 6.5, size: 40, hue: "#c084fc", light: "#f3e8ff" },
  { id: 2, dx:  180, dy: -460, delay: 0.35, dur: 7,   size: 30, hue: "#a78bfa", light: "#ede9fe" },
  { id: 3, dx:  -80, dy: -500, delay: 0.6,  dur: 8,   size: 44, hue: "#e879f9", light: "#fdf4ff" },
  { id: 4, dx:  280, dy: -340, delay: 0.15, dur: 5.5, size: 26, hue: "#818cf8", light: "#eef2ff" },
  { id: 5, dx: -300, dy: -300, delay: 0.8,  dur: 7,   size: 36, hue: "#d946ef", light: "#fdf4ff" },
  { id: 6, dx:  110, dy: -540, delay: 0.45, dur: 9,   size: 38, hue: "#9333ea", light: "#f5f3ff" },
  { id: 7, dx: -130, dy: -400, delay: 1.0,  dur: 6,   size: 24, hue: "#c4b5fd", light: "#f5f3ff" },
  { id: 8, dx:  220, dy: -440, delay: 0.7,  dur: 8.5, size: 34, hue: "#a21caf", light: "#fdf4ff" },
];

const WING_CSS = `
  @keyframes wf-l { 0%,100%{transform:rotateY(0deg)} 50%{transform:rotateY(65deg)} }
  @keyframes wf-r { 0%,100%{transform:rotateY(0deg)} 50%{transform:rotateY(-65deg)} }
  @keyframes bf-sway { 0%,100%{transform:translateX(0)} 50%{transform:translateX(14px)} }
  .wf-l { animation: wf-l 0.32s ease-in-out infinite; transform-origin: right center; }
  .wf-r { animation: wf-r 0.32s ease-in-out infinite; transform-origin: left center; }
`;

function ButterflyIcon({ hue, light, size }: { hue: string; light: string; size: number }) {
  return (
    <svg width={size * 2.2} height={size * 1.4} viewBox="0 0 110 70"
      style={{ overflow: "visible", filter: `drop-shadow(0 2px 6px ${hue}88)` }}>
      <g className="wf-l">
        <ellipse cx="32" cy="24" rx="26" ry="20" fill={hue} opacity="0.85" />
        <ellipse cx="26" cy="50" rx="18" ry="13" fill={light} opacity="0.7" />
        <ellipse cx="29" cy="24" rx="13" ry="10" fill={light} opacity="0.5" />
      </g>
      <g className="wf-r">
        <ellipse cx="78" cy="24" rx="26" ry="20" fill={hue} opacity="0.85" />
        <ellipse cx="84" cy="50" rx="18" ry="13" fill={light} opacity="0.7" />
        <ellipse cx="81" cy="24" rx="13" ry="10" fill={light} opacity="0.5" />
      </g>
      <ellipse cx="55" cy="34" rx="3.5" ry="16" fill="rgba(50,20,70,0.75)" />
      <path d="M52 20 Q44 9 40 5" stroke="rgba(50,20,70,0.65)" strokeWidth="1.5" fill="none" />
      <circle cx="39" cy="4" r="2.2" fill={hue} />
      <path d="M58 20 Q66 9 70 5" stroke="rgba(50,20,70,0.65)" strokeWidth="1.5" fill="none" />
      <circle cx="71" cy="4" r="2.2" fill={hue} />
    </svg>
  );
}

function FloatingButterfly({
  startX, startY, dx, dy, delay, dur, size, hue, light,
}: {
  startX: number; startY: number; dx: number; dy: number;
  delay: number; dur: number; size: number; hue: string; light: string;
}) {
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

/* ─── Shared watercolor card bg ──────────────────────────── */
function CardBg() {
  return (
    <img src={watercolorBg} alt="" aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      style={{ objectPosition: "center center", opacity: 0.82, mixBlendMode: "multiply" }} />
  );
}

/* ─── Left panel — names ─────────────────────────────────── */
function NamesPanel({ mobile }: { mobile?: boolean }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ padding: mobile ? "28px 20px" : "44px 44px" }}>
      <CardBg />
      <div className="relative z-10 flex flex-col items-center w-full"
        style={{ gap: mobile ? "7px" : "10px" }}>

        <p className="font-bold uppercase tracking-widest"
          style={{ color: "#6b5b8e", fontFamily: "'Outfit',sans-serif", fontSize: mobile ? "0.6rem" : "0.72rem" }}>
          ✦ Save the Date ✦
        </p>

        <div className="w-[55%] h-px"
          style={{ background: "linear-gradient(90deg,transparent,#9b7fc0,transparent)" }} />

        <p style={{ color: "#5a4a7a", fontFamily: "'Chilanka',cursive", fontSize: mobile ? "0.9rem" : "1rem" }}>
          ചിങ്ങത്തിൽ
        </p>
        <h2 className="font-black m-0"
          style={{ color: "#5a4a7a", fontFamily: "'Chilanka',cursive", fontSize: mobile ? "1.1rem" : "1.3rem" }}>
          താലികെട്ട്
        </h2>

        {/* Bride */}
        <h1 className="leading-none w-full"
          style={{
            fontFamily: "'Chilanka',cursive",
            fontSize: mobile ? "clamp(2.2rem,14vw,3rem)" : "clamp(2rem,11cqw,3.6rem)",
            background: "linear-gradient(135deg,#7b4fa6 20%,#b06bcc 60%,#8b5ab3 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: "drop-shadow(0 2px 8px rgba(130,90,180,0.28))",
            margin: "2px 0",
          }}>
          ലക്ഷ്മി
        </h1>

        {/* Ampersand */}
        <div className="flex items-center w-[75%]" style={{ gap: "8px" }}>
          <div className="flex-1 h-px"
            style={{ background: "linear-gradient(90deg,transparent,rgba(155,127,192,0.5))" }} />
          <span style={{
            fontFamily: "'Cormorant Garamond',Georgia,serif",
            fontSize: mobile ? "clamp(1.4rem,7vw,2rem)" : "clamp(1.4rem,6cqw,2.2rem)",
            color: "#9b7fc0", lineHeight: 1,
          }}>&amp;</span>
          <div className="flex-1 h-px"
            style={{ background: "linear-gradient(90deg,rgba(155,127,192,0.5),transparent)" }} />
        </div>

        {/* Groom */}
        <h1 className="leading-none w-full"
          style={{
            fontFamily: "'Chilanka',cursive",
            fontSize: mobile ? "clamp(2.2rem,14vw,3rem)" : "clamp(2rem,11cqw,3.6rem)",
            background: "linear-gradient(135deg,#7b4fa6 20%,#b06bcc 60%,#8b5ab3 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            filter: "drop-shadow(0 2px 8px rgba(130,90,180,0.28))",
            margin: "2px 0",
          }}>
          നിതിൻ
        </h1>
      </div>
    </div>
  );
}

/* ─── Right panel — details ──────────────────────────────── */
function DetailsPanel({ mobile }: { mobile?: boolean }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ padding: mobile ? "28px 20px" : "36px 40px" }}>
      <CardBg />
      <div className="relative z-10 flex flex-col items-center w-full"
        style={{ gap: mobile ? "9px" : "12px" }}>

        <p className="tracking-widest uppercase"
          style={{ color: "#6b5b8e", fontFamily: "'Outfit',sans-serif", fontSize: mobile ? "0.6rem" : "0.7rem" }}>
          INVITE YOU TO JOIN THEM
        </p>
        <p className="tracking-widest uppercase"
          style={{ color: "#8878a8", fontFamily: "'Outfit',sans-serif", fontSize: mobile ? "0.55rem" : "0.62rem" }}>
          AT THE CELEBRATION OF THEIR MARRIAGE
        </p>

        {/* Date block */}
        <div className="flex items-stretch w-full"
          style={{
            border: "1.5px solid rgba(155,127,192,0.5)", borderRadius: 8,
            overflow: "hidden", background: "rgba(255,255,255,0.45)", marginTop: 4,
          }}>
          <div className="flex flex-col items-center justify-center flex-1"
            style={{ padding: "9px 6px" }}>
            <span className="font-bold tracking-widest uppercase"
              style={{ color: "#6b5b8e", fontFamily: "'Outfit',sans-serif", fontSize: "0.62rem" }}>
              Saturday
            </span>
            <span style={{ color: "#8878a8", fontFamily: "'Outfit',sans-serif", fontSize: "0.56rem" }}>
              10:00 – 11:00 AM
            </span>
          </div>
          <div className="w-px self-stretch"
            style={{ background: "rgba(155,127,192,0.4)" }} />
          <div className="flex items-center justify-center"
            style={{
              padding: "9px 12px",
              background: "linear-gradient(135deg,rgba(155,127,192,0.18),rgba(180,150,220,0.25))",
            }}>
            <span style={{
              fontSize: mobile ? "clamp(1.5rem,9vw,2.2rem)" : "clamp(1.5rem,7cqw,2.4rem)",
              color: "#7b4fa6", fontFamily: "'Cormorant Garamond',Georgia,serif",
              lineHeight: 1, fontWeight: 900,
            }}>12</span>
          </div>
          <div className="w-px self-stretch"
            style={{ background: "rgba(155,127,192,0.4)" }} />
          <div className="flex flex-col items-center justify-center flex-1"
            style={{ padding: "9px 6px" }}>
            <span className="font-bold tracking-widest uppercase"
              style={{ color: "#6b5b8e", fontFamily: "'Outfit',sans-serif", fontSize: "0.62rem" }}>
              September
            </span>
            <span style={{ color: "#8878a8", fontFamily: "'Outfit',sans-serif", fontSize: "0.56rem" }}>
              2026
            </span>
          </div>
        </div>

        {/* Malayalam info */}
        <div className="space-y-1 text-center"
          style={{ color: "#5a4a7a", fontFamily: "'Chilanka',cursive", fontSize: mobile ? "0.78rem" : "0.86rem" }}>
          <p>1202 ചിങ്ങം 27</p>
          <p>ശുഭമുഹൂർത്തത്തിൽ വിവാഹിതരാകുന്നു</p>
        </div>

        <div className="w-[58%] h-px"
          style={{ background: "linear-gradient(90deg,transparent,#9b7fc0,transparent)" }} />

        {/* Venue */}
        <div className="space-y-1 text-center"
          style={{ color: "#6b5b8e", fontFamily: "'Chilanka',cursive", fontSize: mobile ? "0.78rem" : "0.86rem" }}>
          <p className="uppercase tracking-widest"
            style={{ fontFamily: "'Outfit',sans-serif", color: "#8878a8", fontSize: "0.56rem" }}>
            Venue
          </p>
          <p>കല്യാണമണ്ഡപം, കൊച്ചി</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Card crease shadows ─────────────────────────────────── */
const creaseR = (
  <div className="absolute top-0 right-0 w-5 h-full pointer-events-none"
    style={{ background: "linear-gradient(to left,rgba(100,80,140,0.1),transparent)" }} />
);
const creaseL = (
  <div className="absolute top-0 left-0 w-5 h-full pointer-events-none"
    style={{ background: "linear-gradient(to right,rgba(100,80,140,0.1),transparent)" }} />
);
const creaseB = (
  <div className="absolute bottom-0 left-0 w-full h-5 pointer-events-none"
    style={{ background: "linear-gradient(to top,rgba(100,80,140,0.09),transparent)" }} />
);
const creaseT = (
  <div className="absolute top-0 left-0 w-full h-5 pointer-events-none"
    style={{ background: "linear-gradient(to bottom,rgba(100,80,140,0.09),transparent)" }} />
);

/* ─── Main ────────────────────────────────────────────────── */

export function InvitationCard() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" });

  const [opened,      setOpened]      = useState(false);
  const [butterflies, setButterflies] = useState<{ x: number; y: number } | null>(null);
  const [mounted,     setMounted]     = useState(false);

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

  const T = { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const };
  const panelBase: React.CSSProperties = {
    background: "rgba(255,255,255,0.9)",
    transformStyle: "preserve-3d",
  };

  return (
    <section
      id="invitation"
      ref={sectionRef}
      className="relative flex justify-center items-center py-10 sm:py-16 md:py-24 overflow-visible"
      style={{ background: "linear-gradient(160deg,#e8e4f0 0%,#f0ede8 50%,#e4eae4 100%)" }}
    >
      <style>{WING_CSS}</style>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden
        style={{ background: "radial-gradient(ellipse 60% 40% at 20% 30%,rgba(180,150,210,0.22) 0%,transparent 70%),radial-gradient(ellipse 50% 35% at 80% 70%,rgba(150,190,160,0.18) 0%,transparent 70%)" }} />

      {/* Butterflies */}
      {mounted && butterflies && createPortal(
        <>
          {BUTTERFLY_DEFS.map(b => (
            <FloatingButterfly key={b.id}
              startX={butterflies.x - b.size}
              startY={butterflies.y - b.size * 0.7}
              dx={b.dx} dy={b.dy} delay={b.delay} dur={b.dur}
              size={b.size} hue={b.hue} light={b.light}
            />
          ))}
        </>,
        document.body
      )}

      {/* Card wrapper */}
      <div ref={cardRef} className="relative w-[94%] max-w-[900px]"
        style={{ perspective: "1600px", perspectiveOrigin: "50% 50%" }}>

        {/* Drop shadow glow */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: "0 50px 130px -40px rgba(100,80,140,0.35)",
            opacity: opened ? 1 : 0, transition: "opacity 1.2s ease",
          }} />

        {/* ═══════════════════════════════════════
            DESKTOP  (≥ md)  — left / right fold
            Rendered always; CSS hides on mobile
            ═══════════════════════════════════════ */}
        <div className="hidden md:flex" style={{ transformStyle: "preserve-3d" }}>

          {/* Left panel */}
          <motion.div
            animate={{ rotateY: opened ? 0 : -88 }}
            transition={T}
            className="w-1/2 rounded-l-2xl overflow-hidden relative"
            style={{ ...panelBase, transformOrigin: "right center", minHeight: 660,
              borderRight: "1px solid rgba(155,127,192,0.28)" }}
          >
            <NamesPanel mobile={false} />
            {creaseR}
          </motion.div>

          {/* Right panel */}
          <motion.div
            animate={{ rotateY: opened ? 0 : 88 }}
            transition={T}
            className="w-1/2 rounded-r-2xl overflow-hidden relative"
            style={{ ...panelBase, transformOrigin: "left center", minHeight: 660 }}
          >
            <DetailsPanel mobile={false} />
            {creaseL}
          </motion.div>

          {/* Centre crease */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px pointer-events-none z-20"
            style={{
              transform: "translateX(-50%)",
              background: "linear-gradient(to bottom,transparent 2%,rgba(155,127,192,0.5) 20%,rgba(155,127,192,0.4) 80%,transparent 98%)",
            }} />
        </div>

        {/* ═══════════════════════════════════════
            MOBILE  (< md)  — top / bottom fold
            Rendered always; CSS hides on desktop
            ═══════════════════════════════════════ */}
        <div className="flex flex-col md:hidden" style={{ transformStyle: "preserve-3d" }}>

          {/* Top panel — names */}
          <motion.div
            animate={{ rotateX: opened ? 0 : -88 }}
            transition={T}
            className="w-full rounded-t-2xl overflow-hidden relative"
            style={{ ...panelBase, transformOrigin: "bottom center", minHeight: 320,
              borderBottom: "1px solid rgba(155,127,192,0.28)" }}
          >
            <NamesPanel mobile />
            {creaseB}
          </motion.div>

          {/* Horizontal crease */}
          <div className="absolute left-0 right-0 h-px pointer-events-none z-20"
            style={{
              top: "50%",
              background: "linear-gradient(to right,transparent 2%,rgba(155,127,192,0.5) 20%,rgba(155,127,192,0.4) 80%,transparent 98%)",
            }} />

          {/* Bottom panel — details */}
          <motion.div
            animate={{ rotateX: opened ? 0 : 88 }}
            transition={T}
            className="w-full rounded-b-2xl overflow-hidden relative"
            style={{ ...panelBase, transformOrigin: "top center", minHeight: 320 }}
          >
            <DetailsPanel mobile />
            {creaseT}
          </motion.div>
        </div>
      </div>

      {!opened && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 0.55 }}
          className="absolute bottom-4 text-[0.7rem] tracking-widest uppercase"
          style={{ color: "#9b7fc0", fontFamily: "'Outfit',sans-serif" }}
        >
          scroll to open ↓
        </motion.p>
      )}
    </section>
  );
}
