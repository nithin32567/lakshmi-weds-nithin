import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sparkles, Volume2, VolumeX, ArrowRight } from "lucide-react";
import { ParticleField } from "@/components/wedding/ParticleField";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface EnvelopeIntroProps {
  children?: React.ReactNode;
  onComplete?: () => void;
}

/**
 * Web Audio API helper for procedural wax seal snap & pop sound effect.
 */
function playProceduralWaxSnap(soundEnabled: boolean) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // High frequency snap crackle
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.15));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 1800;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Low deep wooden/wax thud pop
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(240, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);

    oscGain.gain.setValueAtTime(0.4, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.start();
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // Graceful fallback
  }
}

/**
 * Senior UI/UX Master 3D Envelope Extraction & Expansion
 * Layering Specification:
 *   - Envelope Back: z-index 1
 *   - Website Card: z-index 2 (starts inside pocket, jumps to 10 in Phase 3 fly-out)
 *   - Envelope Front Pocket: z-index 3 (covers lower half of card)
 *   - Envelope Top Flap: z-index 4 (top cover with heart seal, drops to z-index 0 on fold)
 *   - Heart Seal: z-index 5
 *
 * Animation Physics Sequence:
 *   - Phase 1: Unseal & 3D Flap Open (~1.2s, power2.inOut)
 *   - Phase 2: Paper Extraction (~2.0s, power1.inOut friction ease)
 *   - Phase 3: Fly-Out & Fullscreen Expansion (~2.5s, power2.out screen lock)
 */
export function EnvelopeIntro({ children, onComplete }: EnvelopeIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const topFlapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardShineRef = useRef<HTMLDivElement>(null);
  const parchmentCoverRef = useRef<HTMLDivElement>(null);
  const waxSealRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const particlesGroupRef = useRef<HTMLDivElement>(null);
  const hintTextRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [isOpening, setIsOpening] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fragments, setFragments] = useState<
    Array<{ id: number; x: number; y: number; z: number; rx: number; ry: number; rz: number; scale: number }>
  >([]);

  useEffect(() => {
    const frags = Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 80 + Math.random() * 120;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        z: (Math.random() - 0.2) * 180,
        rx: (Math.random() - 0.5) * 720,
        ry: (Math.random() - 0.5) * 720,
        rz: (Math.random() - 0.5) * 720,
        scale: 0.4 + Math.random() * 0.6,
      };
    });
    setFragments(frags);
  }, []);

  // Strict page scroll locking during envelope sequence
  useEffect(() => {
    if (!isCompleted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCompleted]);

  // Reduced motion fallback
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.style.overflow = "";
      setIsCompleted(true);
      if (onComplete) onComplete();
    }
  }, [onComplete]);

  // Subtle gyroscopic tilt tracking cursor in idle phase
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isOpening || isCompleted || !envelopeRef.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateY = (mouseX / (rect.width / 2)) * 12;
      const rotateX = -(mouseY / (rect.height / 2)) * 12;

      gsap.to(envelopeRef.current, {
        rotateX,
        rotateY,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    [isOpening, isCompleted]
  );

  const handleMouseLeave = useCallback(() => {
    if (isOpening || isCompleted || !envelopeRef.current) return;
    gsap.to(envelopeRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }, [isOpening, isCompleted]);

  // Master GSAP Animation Timeline
  const { contextSafe } = useGSAP({ scope: containerRef });

  const triggerOpen = contextSafe(() => {
    if (isOpening || isCompleted) return;
    setIsOpening(true);

    playProceduralWaxSnap(soundEnabled);

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setIsCompleted(true);
        if (onComplete) onComplete();
      },
    });

    // 0.0s: Reset tilt flush to center
    tl.to(
      envelopeRef.current,
      {
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      0
    );

    // Fade out bottom instruction hint
    if (hintTextRef.current) {
      tl.to(hintTextRef.current, { opacity: 0, y: 12, duration: 0.3 }, 0);
    }

    // Unseal: Heart seal peel & 3D shatter explosion
    if (waxSealRef.current) {
      tl.to(
        waxSealRef.current,
        { scale: 1.35, rotateZ: -12, duration: 0.15, ease: "power2.out" },
        0.08
      ).to(
        waxSealRef.current,
        { opacity: 0, scale: 0.15, rotateZ: 25, duration: 0.22, ease: "power3.in" },
        0.23
      );
    }

    if (shockwaveRef.current) {
      tl.fromTo(
        shockwaveRef.current,
        { opacity: 0.9, scale: 0.5 },
        { opacity: 0, scale: 3.5, duration: 0.6, ease: "power2.out" },
        0.2
      );
    }

    if (particlesGroupRef.current) {
      const particleEls = particlesGroupRef.current.children;
      tl.to(
        particleEls,
        {
          x: (i) => fragments[i]?.x || 0,
          y: (i) => fragments[i]?.y || 0,
          z: (i) => fragments[i]?.z || 0,
          rotateX: (i) => fragments[i]?.rx || 0,
          rotateY: (i) => fragments[i]?.ry || 0,
          rotateZ: (i) => fragments[i]?.rz || 0,
          opacity: 0,
          scale: 0,
          duration: 0.75,
          stagger: 0.01,
          ease: "power3.out",
        },
        0.2
      );
    }

    // ==========================================
    // PHASE 1: Unseal & Open Top Flap (1.2s, power2.inOut)
    // ==========================================
    if (topFlapRef.current) {
      tl.to(
        topFlapRef.current,
        {
          rotateX: -180,
          duration: 1.2,
          ease: "power2.inOut",
        },
        0.3
      );

      // Halfway through fold (at ~0.9s), drop top flap z-index to 0 so it rests behind Envelope Back (z-index: 1)
      tl.set(topFlapRef.current, { zIndex: 0 }, 0.9);
    }

    // ==========================================
    // PHASE 2: Paper Extraction (2.0s, power1.inOut paper friction)
    // ==========================================
    if (cardRef.current) {
      tl.to(
        cardRef.current,
        {
          y: "-105%",
          z: 40,
          duration: 2.0,
          ease: "power1.inOut",
        },
        1.5
      );
    }

    // Light reflection sheen across paper surface during extraction
    if (cardShineRef.current) {
      tl.fromTo(
        cardShineRef.current,
        { x: "-120%" },
        { x: "220%", duration: 1.8, ease: "power2.inOut" },
        1.7
      );
    }

    // ==========================================
    // PHASE 3: Fly-Out & Fullscreen Expansion (2.5s, power2.out)
    // ==========================================
    if (cardRef.current) {
      // 1. Instantly jump z-index to 10 (above Envelope Front Pocket z-index: 3 and all envelope parts)
      tl.set(cardRef.current, { zIndex: 10 }, 3.5);

      // 2. Scale & expand card smoothly to fill 100vw x 100vh with power2.out decelerating curve
      tl.to(
        cardRef.current,
        {
          position: "fixed",
          top: "0px",
          left: "0px",
          x: "0%",
          y: "0%",
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
          borderRadius: "0px",
          boxShadow: "none",
          rotateX: 0,
          rotateY: 0,
          z: 0,
          duration: 2.5,
          ease: "power2.out",
        },
        3.5
      );
    }

    // Envelope body recedes & blurs into deep background
    if (envelopeRef.current) {
      tl.to(
        envelopeRef.current,
        {
          z: -900,
          scale: 0.35,
          opacity: 0,
          filter: "blur(25px)",
          duration: 1.8,
          ease: "power2.inOut",
        },
        3.5
      );
    }

    // Parchment Cover Overlay smoothly fades out to reveal live website content
    if (parchmentCoverRef.current) {
      tl.to(
        parchmentCoverRef.current,
        {
          opacity: 0,
          duration: 1.6,
          ease: "power2.inOut",
        },
        3.7
      );
    }

    // Dark stage overlay fades out
    if (overlayRef.current) {
      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut",
        },
        4.8
      );
    }
  });

  const handleSkip = useCallback(() => {
    document.body.style.overflow = "";
    setIsCompleted(true);
    if (onComplete) onComplete();
  }, [onComplete]);

  if (isCompleted) {
    return <div className="relative w-full min-h-screen">{children}</div>;
  }

  return (
    <div className="relative w-full min-h-screen">
      {/* Fixed Fullscreen 3D Intro Stage */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[300] select-none overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 110% 100% at 50% 45%, #182238 0%, #0d1526 60%, #060914 100%)",
        }}
      >
        {/* Dynamic Canvas Floating Golden Embers */}
        <ParticleField density={95} />

        {/* Falling Kerala Wedding Flowers */}
        <FallingFlowers />

        {/* Floating Gold Sparkles */}
        <AmbientSparkles />

        {/* Top Controls */}
        <div className="absolute top-6 right-6 z-[350] flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-slate-900/60 text-amber-200/80 backdrop-blur-md transition-all hover:scale-105 hover:border-amber-400 hover:text-amber-300"
            title={soundEnabled ? "Mute audio" : "Enable audio"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="group flex items-center gap-2 rounded-full border border-amber-500/30 bg-slate-900/60 px-4 py-2 text-xs font-medium tracking-wider text-amber-200/90 backdrop-blur-md transition-all hover:scale-105 hover:border-amber-400 hover:bg-slate-900/80 hover:text-amber-100"
          >
            <span>Skip Intro</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* 3D Stage Container with overflow visible for unclipped extraction */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex h-full w-full items-center justify-center p-4 overflow-visible"
          style={{ perspective: "1200px" }}
        >
          {/* Header Greeting */}
          <div className="absolute top-8 left-1/2 z-10 -translate-x-1/2 text-center sm:top-12">
            <p className="font-display text-xs italic tracking-[0.25em] text-amber-200/80 uppercase sm:text-sm">
              You have received a wedding invitation
            </p>
            <h2 className="mt-1 font-display text-lg font-light tracking-[0.15em] text-amber-100/95 sm:text-xl">
              Nithin &amp; Lakshmi
            </h2>
          </div>

          {/* Master 3D Envelope Assembly */}
          <div
            ref={envelopeRef}
            className="relative select-none overflow-visible"
            style={{
              width: "min(92vw, 450px)",
              height: "min(62vw, 295px)",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {/* ==========================================
                1. ENVELOPE BACK PANEL (z-index: 1)
               ========================================== */}
            <div
              className="absolute inset-0 overflow-hidden rounded-md border border-amber-500/40"
              style={{
                zIndex: 1,
                background:
                  "linear-gradient(155deg, #faf7f2 0%, #f3ece0 50%, #e8decb 100%)",
                boxShadow:
                  "0 30px 80px -10px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 10px 25px rgba(197,160,89,0.15)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Kasavu Gold Woven Silk Inner Lining */}
              <KasavuLiningPattern />

              {/* Inner Cavity Depth Shadow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  boxShadow: "inset 0 16px 35px rgba(140, 110, 50, 0.3)",
                }}
              />
            </div>

            {/* ==========================================
                2. WEBSITE CARD COMPONENT (z-index: 2, jumps to 10 in Phase 3)
               ========================================== */}
            <div
              ref={cardRef}
              className="absolute inset-x-[3%] bottom-[3%] h-[94%] overflow-hidden rounded-lg bg-[#0d1526]"
              style={{
                zIndex: 2,
                transformStyle: "preserve-3d",
                boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
                willChange: "transform, width, height, top, left, border-radius, z-index",
              }}
            >
              {/* Parchment Cover Card Overlay (Displayed inside envelope, fades out during Phase 3) */}
              <div
                ref={parchmentCoverRef}
                className="absolute inset-0 z-20 flex flex-col items-center justify-between p-6 text-center"
                style={{
                  background:
                    "linear-gradient(165deg, #ffffff 0%, #faf6ec 50%, #f3ebd7 100%)",
                  border: "1px solid rgba(197, 160, 89, 0.45)",
                }}
              >
                {/* Gold Hairline Frame */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-2 border border-amber-600/35 rounded-sm"
                />

                {/* Light Reflection Sheen */}
                <div
                  ref={cardShineRef}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-30 opacity-45"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.9) 50%, transparent 80%)",
                    transform: "translateX(-120%)",
                  }}
                />

                {/* Card Header Malayalam Title */}
                <div className="relative z-10 pt-1">
                  <p className="font-malayalam text-xs font-semibold tracking-[0.2em] text-amber-900/90 sm:text-sm">
                    വിവാഹ ക്ഷണം
                  </p>
                  <div className="mx-auto mt-1 h-0.5 w-10 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />
                </div>

                {/* Card Main Body */}
                <div className="relative z-10 my-auto flex flex-col items-center gap-1 sm:gap-1.5">
                  <span className="font-display text-[11px] tracking-[0.18em] text-amber-900/75 uppercase sm:text-xs">
                    Together with their families
                  </span>

                  {/* Oil Lamp / Radha Krishna Crest */}
                  <div className="my-1 flex items-center justify-center opacity-90">
                    <svg className="h-7 w-16 text-amber-800" viewBox="0 0 100 30" fill="none">
                      <path
                        d="M10 15 Q 30 5 50 15 Q 70 25 90 15"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <circle cx="50" cy="15" r="3" fill="currentColor" />
                      <path
                        d="M35 15 C 40 8, 45 8, 50 15 C 55 22, 60 22, 65 15"
                        stroke="currentColor"
                        strokeWidth="0.8"
                      />
                    </svg>
                  </div>

                  <h1 className="font-display text-xl font-bold tracking-wide text-amber-950 sm:text-2xl">
                    Nithin &amp; Lakshmi
                  </h1>

                  <p className="font-display text-[11px] italic tracking-wider text-amber-900/80 sm:text-xs">
                    request the pleasure of your company
                  </p>
                </div>

                {/* Card Footer Details */}
                <div className="relative z-10 w-full border-t border-amber-800/20 pt-2">
                  <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-900 sm:text-xs">
                    Saturday · 12 September 2026
                  </p>
                  <p className="font-body text-[10px] tracking-widest text-amber-800/80 uppercase">
                    Kochi · Kerala
                  </p>
                </div>
              </div>

              {/* Live Interactive Website Component Container */}
              <div className="relative h-full w-full overflow-hidden">
                {children}
              </div>
            </div>

            {/* ==========================================
                3. ENVELOPE FRONT POCKET (z-index: 3)
               ========================================== */}
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-md"
              style={{
                zIndex: 3,
                transformStyle: "preserve-3d",
              }}
            >
              <svg
                className="h-full w-full drop-shadow-lg"
                viewBox="0 0 450 295"
                preserveAspectRatio="none"
                fill="none"
              >
                <defs>
                  <linearGradient id="pocketBaseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f8f3ea" />
                    <stop offset="50%" stopColor="#eee4d3" />
                    <stop offset="100%" stopColor="#e0d2bc" />
                  </linearGradient>

                  <linearGradient id="goldSeamGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="rgba(197,160,89,0.9)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>

                  <filter id="pocketShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.25" />
                  </filter>
                </defs>

                {/* Left Side Fold */}
                <path
                  d="M 0,0 L 210,147 L 0,295 Z"
                  fill="url(#pocketBaseGrad)"
                  fillOpacity="0.98"
                  stroke="rgba(197,160,89,0.3)"
                  strokeWidth="1"
                />

                {/* Right Side Fold */}
                <path
                  d="M 450,0 L 240,147 L 450,295 Z"
                  fill="url(#pocketBaseGrad)"
                  fillOpacity="0.98"
                  stroke="rgba(197,160,89,0.3)"
                  strokeWidth="1"
                />

                {/* Bottom Luxury Rounded V Fold */}
                <path
                  d="M 0,295 L 450,295 L 450,275 C 450,275 330,192 252,147 C 234,137 216,137 198,147 C 120,192 0,275 0,275 Z"
                  fill="url(#pocketBaseGrad)"
                  filter="url(#pocketShadow)"
                  stroke="rgba(197,160,89,0.4)"
                  strokeWidth="1"
                />

                {/* Gold Seam Filigree Piping along Pocket Edge */}
                <path
                  d="M 0,275 C 120,192 198,147 225,138 C 252,147 330,192 450,275"
                  stroke="url(#goldSeamGrad)"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* ==========================================
                4. ENVELOPE TOP FLAP (z-index: 4, drops to 0 on 180° fold)
               ========================================== */}
            <div
              ref={topFlapRef}
              className="absolute top-0 left-0 h-[54%] w-full"
              style={{
                zIndex: 4,
                transformOrigin: "top center",
                transformStyle: "preserve-3d",
                willChange: "transform, z-index",
              }}
            >
              {/* Flap Outer Front Face */}
              <div
                className="absolute inset-0"
                style={{ backfaceVisibility: "hidden" }}
              >
                <svg
                  className="h-full w-full drop-shadow-xl"
                  viewBox="0 0 450 160"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="topFlapGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#faf6ee" />
                      <stop offset="70%" stopColor="#f2e7d5" />
                      <stop offset="100%" stopColor="#e5d5be" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,0 L 450,0 L 450,5 C 450,5 330,94 252,145 C 234,156 216,156 198,145 C 120,94 0,5 0,5 Z"
                    fill="url(#topFlapGrad)"
                    stroke="rgba(197,160,89,0.4)"
                    strokeWidth="1"
                  />
                  <path
                    d="M 0,5 C 120,94 198,145 225,153 C 252,145 330,94 450,5"
                    stroke="rgba(197,160,89,0.85)"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              {/* Flap Inner Back Face (Revealed on 180° fold, showing Kasavu Gold Silk Lining) */}
              <div
                className="absolute inset-0"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateX(180deg)",
                }}
              >
                <svg
                  className="h-full w-full"
                  viewBox="0 0 450 160"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0,0 L 450,0 L 450,5 C 450,5 330,94 252,145 C 234,156 216,156 198,145 C 120,94 0,5 0,5 Z"
                    fill="#efe2ca"
                  />
                </svg>
                <div
                  className="absolute inset-0 opacity-90"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 3%, 50% 100%, 0 3%)",
                  }}
                >
                  <KasavuLiningPattern />
                </div>
                <div
                  aria-hidden
                  className="pointer-events-none absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-amber-950/30 to-transparent"
                />
              </div>
            </div>

            {/* ==========================================
                5. PEEL & STICK HEART SEAL (z-index: 5)
               ========================================== */}
            <div
              ref={waxSealRef}
              onClick={triggerOpen}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  triggerOpen();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Peel & Seal Heart Sticker to open invitation"
              className={`absolute top-[48%] left-1/2 z-[5] h-14 w-14 -translate-x-1/2 -translate-y-1/2 outline-none sm:h-16 sm:w-16 ${
                isOpening ? "pointer-events-none" : "cursor-pointer"
              }`}
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            >
              <PeelAndStickHeartSeal />
            </div>

            {/* Shockwave Aura Ring Pulse */}
            <div
              ref={shockwaveRef}
              aria-hidden
              className="pointer-events-none absolute top-[48%] left-1/2 z-[5] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-500/80 opacity-0 sm:h-16 sm:w-16"
              style={{
                boxShadow: "0 0 25px rgba(225, 29, 72, 0.8)",
              }}
            />

            {/* 3D Wax Shatter Physics Particles */}
            <div
              ref={particlesGroupRef}
              aria-hidden
              className="pointer-events-none absolute top-[48%] left-1/2 z-30 h-0 w-0"
              style={{ transformStyle: "preserve-3d" }}
            >
              {fragments.map((f) => (
                <div
                  key={f.id}
                  className="absolute top-0 left-0 -ml-1.5 -mt-1.5 rounded-full"
                  style={{
                    width: `${10 * f.scale}px`,
                    height: `${10 * f.scale}px`,
                    background:
                      "radial-gradient(circle at 35% 35%, #f43f5e, #be123c 60%, #881337 100%)",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
                    border: "1px solid rgba(254,240,138,0.7)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Interactive Hint */}
          <p
            ref={hintTextRef}
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-display text-xs uppercase tracking-[0.35em] text-amber-200/80 sm:bottom-12 sm:text-sm"
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              Tap the Heart Seal to Open
              <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Ultra-Realistic Peel & Stick Small-Radius Heart Seal Component
 */
function PeelAndStickHeartSeal() {
  return (
    <div className="group relative h-full w-full">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full transition-all duration-300 group-hover:scale-110"
        style={{
          filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.4)) drop-shadow(0 3px 6px rgba(190,18,60,0.3))",
        }}
      />

      <svg
        viewBox="0 0 100 100"
        className="relative h-full w-full transition-transform duration-300 group-hover:scale-110"
      >
        <defs>
          <radialGradient id="heartWaxGrad" cx="40%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="35%" stopColor="#e11d48" />
            <stop offset="70%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#680721" />
          </radialGradient>

          <linearGradient id="heartGoldEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          <linearGradient id="peelGloss" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </linearGradient>
        </defs>

        <path d={HEART_PATH} fill="url(#heartWaxGrad)" />
        <path d={HEART_PATH} fill="url(#peelGloss)" />

        <path
          d={INNER_HEART_PATH}
          fill="none"
          stroke="url(#heartGoldEdge)"
          strokeWidth="1.8"
          opacity="0.85"
        />

        <text
          x="34"
          y="54"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="23"
          fontWeight="700"
          fill="#450a17"
          textAnchor="start"
        >
          L
        </text>
        <text
          x="33.2"
          y="53"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="23"
          fontWeight="700"
          fill="#fef08a"
          textAnchor="start"
        >
          L
        </text>

        <text
          x="50"
          y="48"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontStyle="italic"
          fontSize="11"
          fontWeight="600"
          fill="#450a17"
          textAnchor="middle"
        >
          &amp;
        </text>
        <text
          x="49.5"
          y="47.2"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontStyle="italic"
          fontSize="11"
          fontWeight="600"
          fill="#fef08a"
          textAnchor="middle"
        >
          &amp;
        </text>

        <text
          x="66"
          y="54"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="23"
          fontWeight="700"
          fill="#450a17"
          textAnchor="end"
        >
          N
        </text>
        <text
          x="65.2"
          y="53"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="23"
          fontWeight="700"
          fill="#fef08a"
          textAnchor="end"
        >
          N
        </text>

        <path
          d="M 45 82 C 48 85 50 87 50 87 C 50 87 52 85 55 82 Z"
          fill="url(#heartGoldEdge)"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

const HEART_PATH = `
  M 50 88
  C 50 88, 12 58, 12 32
  C 12 16, 26 8, 40 16
  C 50 23, 50 23, 50 23
  C 50 23, 50 23, 60 16
  C 74 8, 88 16, 88 32
  C 88 58, 50 88, 50 88
  Z
`;

const INNER_HEART_PATH = `
  M 50 80
  C 50 80, 18 53, 18 32
  C 18 20, 29 13, 40 20
  C 50 26, 50 26, 50 26
  C 50 26, 50 26, 60 20
  C 71 13, 82 20, 82 32
  C 82 53, 50 80, 50 80
  Z
`;

function KasavuLiningPattern() {
  return (
    <div className="absolute inset-0 opacity-30">
      <svg className="h-full w-full" width="100%" height="100%">
        <defs>
          <pattern
            id="kasavuPattern"
            width="30"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 15 0 L 30 15 L 15 30 L 0 15 Z"
              fill="none"
              stroke="#c5a059"
              strokeWidth="0.8"
            />
            <circle cx="15" cy="15" r="2.5" fill="#eab308" opacity="0.7" />
            <path
              d="M 0 0 L 30 30 M 30 0 L 0 30"
              stroke="#c5a059"
              strokeWidth="0.35"
              strokeDasharray="2 2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kasavuPattern)" />
      </svg>
    </div>
  );
}

function AmbientSparkles() {
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; left: number; top: number; size: number; duration: number; delay: number }>
  >([]);

  useEffect(() => {
    const items = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
    setSparkles(items);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-amber-200/70"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            boxShadow: "0 0 8px rgba(251, 191, 36, 0.8)",
            animation: `glow-pulse ${s.duration}s ease-in-out infinite ${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function FallingFlowers() {
  type FlowerType = "marigold" | "jasmine" | "rose" | "lotus_petal" | "marigold_petal";

  const [flowers, setFlowers] = useState<
    Array<{
      id: number;
      type: FlowerType;
      left: number;
      size: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const types: FlowerType[] = [
      "marigold",
      "jasmine",
      "rose",
      "lotus_petal",
      "marigold_petal",
      "marigold",
      "jasmine",
    ];

    const items = Array.from({ length: 26 }, (_, i) => ({
      id: i,
      type: types[i % types.length],
      left: 2 + Math.random() * 94,
      size: 16 + Math.random() * 22,
      duration: 7 + Math.random() * 9,
      delay: Math.random() * 7,
    }));
    setFlowers(items);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {flowers.map((f) => (
        <div
          key={f.id}
          className="absolute -top-12 opacity-85"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animation: `petal-fall ${f.duration}s linear infinite ${f.delay}s`,
            filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
          }}
        >
          <FlowerSVG type={f.type} />
        </div>
      ))}
    </div>
  );
}

function FlowerSVG({
  type,
}: {
  type: "marigold" | "jasmine" | "rose" | "lotus_petal" | "marigold_petal";
}) {
  if (type === "marigold") {
    return (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const cx = 20 + Math.cos(a) * 11;
          const cy = 20 + Math.sin(a) * 11;
          return <circle key={i} cx={cx} cy={cy} r="6.5" fill="#ea580c" />;
        })}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2 + 0.2;
          const cx = 20 + Math.cos(a) * 7.5;
          const cy = 20 + Math.sin(a) * 7.5;
          return <circle key={i} cx={cx} cy={cy} r="5.5" fill="#f97316" />;
        })}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + 0.4;
          const cx = 20 + Math.cos(a) * 4;
          const cy = 20 + Math.sin(a) * 4;
          return <circle key={i} cx={cx} cy={cy} r="4.5" fill="#eab308" />;
        })}
        <circle cx="20" cy="20" r="3.5" fill="#7c2d12" />
        <circle cx="20" cy="20" r="2" fill="#fde047" opacity="0.8" />
      </svg>
    );
  }

  if (type === "jasmine") {
    return (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {Array.from({ length: 5 }, (_, i) => {
          const deg = (i / 5) * 360;
          return (
            <path
              key={i}
              d="M 20 20 C 14 10, 16 2, 20 2 C 24 2, 26 10, 20 20 Z"
              fill="#ffffff"
              stroke="#fef08a"
              strokeWidth="0.5"
              transform={`rotate(${deg} 20 20)`}
            />
          );
        })}
        <circle cx="20" cy="20" r="3.5" fill="#fde047" />
        <circle cx="20" cy="20" r="1.8" fill="#eab308" />
      </svg>
    );
  }

  if (type === "rose") {
    return (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {Array.from({ length: 6 }, (_, i) => {
          const deg = (i / 6) * 360;
          return (
            <path
              key={i}
              d="M 20 20 C 10 12, 10 2, 20 2 C 30 2, 30 12, 20 20 Z"
              fill="#e11d48"
              transform={`rotate(${deg} 20 20)`}
            />
          );
        })}
        {Array.from({ length: 5 }, (_, i) => {
          const deg = (i / 5) * 360 + 30;
          return (
            <circle
              key={i}
              cx={20 + Math.cos((deg * Math.PI) / 180) * 4}
              cy={20 + Math.sin((deg * Math.PI) / 180) * 4}
              r="5"
              fill="#be123c"
            />
          );
        })}
        <circle cx="20" cy="20" r="3" fill="#fbbf24" />
      </svg>
    );
  }

  if (type === "lotus_petal") {
    return (
      <svg viewBox="0 0 30 40" className="h-full w-full">
        <defs>
          <linearGradient id="lotusGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
        <path
          d="M 15 2 C 5 12, 2 26, 15 38 C 28 26, 25 12, 15 2 Z"
          fill="url(#lotusGrad)"
          stroke="#f472b6"
          strokeWidth="0.5"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 30 30" className="h-full w-full">
      <path
        d="M 15 2 C 8 8, 4 18, 15 28 C 26 18, 22 8, 15 2 Z"
        fill="#f97316"
        stroke="#fde047"
        strokeWidth="0.5"
      />
    </svg>
  );
}
