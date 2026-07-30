import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sparkles, Volume2, VolumeX, ArrowRight } from "lucide-react";

// Register GSAP React plugin if available
gsap.registerPlugin(useGSAP);

interface EnvelopeIntroProps {
  onComplete: () => void;
}

/**
 * Web Audio API helper for procedural wax seal snap & pop sound effect.
 * Requires no external audio files, works instantly and reliably across modern browsers.
 */
function playProceduralWaxSnap(soundEnabled: boolean) {
  if (!soundEnabled || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    // 1. High frequency snap crackle
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

    // 2. Low deep wooden/wax thud pop
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
    // Graceful fallback if audio context blocked by browser policy
  }
}

/**
 * World-Class 3D Envelope Opening Experience
 * Multi-phase GSAP timeline choreography:
 *   Phase 1: Floating 3D Idle with interactive tilt & high-realism Wax Seal
 *   Phase 2: Wax Seal Shatter with 3D physics fragment vectors & shockwave
 *   Phase 3: 3D Top Flap Fold Back (-180deg rotateX) exposing Kasavu Gold inner lining
 *   Phase 4: Wedding Invitation Card emerges from envelope cavity with dynamic light sheen
 *   Phase 5: 3D Jump Out expansion — Viewport zooms in while envelope recedes with blur, 
 *            card aligns flush fullscreen and unmasks to main website
 */
export function EnvelopeIntro({ onComplete }: EnvelopeIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const topFlapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardShineRef = useRef<HTMLDivElement>(null);
  const waxSealRef = useRef<HTMLDivElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const particlesGroupRef = useRef<HTMLDivElement>(null);
  const hintTextRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [isOpening, setIsOpening] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fragments, setFragments] = useState<
    Array<{ id: number; x: number; y: number; z: number; rx: number; ry: number; rz: number; scale: number }>
  >([]);

  // Generate 3D shatter particle parameters once
  useEffect(() => {
    const frags = Array.from({ length: 24 }, (_, i) => {
      const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 90 + Math.random() * 140;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        z: (Math.random() - 0.2) * 200,
        rx: (Math.random() - 0.5) * 720,
        ry: (Math.random() - 0.5) * 720,
        rz: (Math.random() - 0.5) * 720,
        scale: 0.5 + Math.random() * 0.8,
      };
    });
    setFragments(frags);
  }, []);

  // Lock body scroll during intro
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.style.overflow = "";
      onComplete();
    }
  }, [onComplete]);

  // Phase 1: Gyroscopic mouse tilt effect on desktop
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isOpening || !envelopeRef.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      // Soft 3D tilt calculation
      const rotateY = (mouseX / (rect.width / 2)) * 14;
      const rotateX = -(mouseY / (rect.height / 2)) * 14;

      gsap.to(envelopeRef.current, {
        rotateX,
        rotateY,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    [isOpening]
  );

  const handleMouseLeave = useCallback(() => {
    if (isOpening || !envelopeRef.current) return;
    gsap.to(envelopeRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: "power2.out",
    });
  }, [isOpening]);

  // Master GSAP Timeline Execution
  const { contextSafe } = useGSAP({ scope: containerRef });

  const triggerOpen = contextSafe(() => {
    if (isOpening) return;
    setIsOpening(true);

    // Audio cue
    playProceduralWaxSnap(soundEnabled);

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete();
      },
    });

    // Reset envelope tilt flush to center for clean opening
    tl.to(
      envelopeRef.current,
      {
        rotateX: 0,
        rotateY: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      0
    );

    // Fade out hint text
    if (hintTextRef.current) {
      tl.to(
        hintTextRef.current,
        {
          opacity: 0,
          y: 10,
          duration: 0.3,
        },
        0
      );
    }

    // PHASE 2: Wax Seal Fracture & Shatter
    if (waxSealRef.current) {
      tl.to(
        waxSealRef.current,
        {
          scale: 1.25,
          duration: 0.12,
          ease: "power2.out",
        },
        0.1
      ).to(
        waxSealRef.current,
        {
          opacity: 0,
          scale: 0.2,
          duration: 0.25,
          ease: "power3.in",
        },
        0.22
      );
    }

    // Shockwave pulse
    if (shockwaveRef.current) {
      tl.fromTo(
        shockwaveRef.current,
        { opacity: 0.9, scale: 0.5 },
        { opacity: 0, scale: 3.2, duration: 0.6, ease: "power2.out" },
        0.22
      );
    }

    // 3D Particles explode outward
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
          duration: 0.8,
          stagger: 0.01,
          ease: "power3.out",
        },
        0.22
      );
    }

    // PHASE 3: 3D Top Flap Fold Back (-180 deg)
    if (topFlapRef.current) {
      tl.to(
        topFlapRef.current,
        {
          rotateX: -180,
          duration: 1.0,
          ease: "back.inOut(1.5)",
        },
        0.5
      );

      // Halfway through flap fold, switch z-index so top flap goes behind card
      tl.set(topFlapRef.current, { zIndex: 1 }, 0.95);
    }

    // PHASE 4: Invitation Card Emerges vertically from pocket
    if (cardRef.current) {
      tl.to(
        cardRef.current,
        {
          y: "-105%",
          z: 35,
          duration: 1.1,
          ease: "power3.inOut",
        },
        1.1
      );
    }

    // Light reflection sheen across the rising card
    if (cardShineRef.current) {
      tl.fromTo(
        cardShineRef.current,
        { x: "-120%" },
        { x: "220%", duration: 1.1, ease: "power2.inOut" },
        1.3
      );
    }

    // PHASE 5: The "3D Jump Out" Fullscreen Expansion
    // Viewport zooms into emerging card while envelope pushes into background with depth blur
    if (envelopeRef.current) {
      tl.to(
        envelopeRef.current,
        {
          z: -800,
          scale: 0.4,
          opacity: 0,
          filter: "blur(18px)",
          duration: 1.1,
          ease: "power4.inOut",
        },
        2.0
      );
    }

    if (cardRef.current) {
      tl.to(
        cardRef.current,
        {
          y: "-50%",
          top: "50%",
          left: "50%",
          x: "-50%",
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
          borderRadius: "0px",
          z: 0,
          rotateX: 0,
          rotateY: 0,
          duration: 1.2,
          ease: "power4.inOut",
        },
        2.0
      );
    }

    // Overall screen unmask / fade out
    if (overlayRef.current) {
      tl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        2.4
      );
    }
  });

  const handleSkip = useCallback(() => {
    document.body.style.overflow = "";
    onComplete();
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[300] select-none overflow-hidden bg-[#070b14]"
      style={{
        background:
          "radial-gradient(ellipse 100% 90% at 50% 45%, #152238 0%, #0a1322 55%, #050810 100%)",
      }}
    >
      {/* Dynamic Ambient Background Elements */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(212,175,55,0.15) 0%, transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23c5a059' fill-opacity='0.08'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating Gold Kasavu Sparkles */}
      <AmbientSparkles />

      {/* Top Utility Controls */}
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

      {/* 3D Stage Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex h-full w-full items-center justify-center p-4"
        style={{ perspective: "1200px" }}
      >
        {/* Header Greeting */}
        <div className="absolute top-12 left-1/2 z-10 -translate-x-1/2 text-center sm:top-16">
          <p className="font-display text-xs italic tracking-[0.25em] text-amber-200/75 uppercase sm:text-sm">
            Invitation Card
          </p>
          <h2 className="mt-1 font-display text-lg font-light tracking-[0.15em] text-amber-100/90 sm:text-xl">
            Nithin &amp; Lakshmi
          </h2>
        </div>

        {/* Master 3D Envelope Component */}
        <div
          ref={envelopeRef}
          className="relative select-none"
          style={{
            width: "min(90vw, 420px)",
            height: "min(62vw, 280px)",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* ENVELOPE BACK PANEL & KASAVU LINING */}
          <div
            className="absolute inset-0 overflow-hidden rounded-md border border-amber-400/30 bg-[#0f172a]"
            style={{
              boxShadow:
                "0 35px 90px -15px rgba(0,0,0,0.85), inset 0 0 40px rgba(0,0,0,0.6)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Dark Indigo paper texture */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(145deg, #1b2a47 0%, #101c33 60%, #0b1324 100%)",
              }}
            />

            {/* Kasavu Gold Woven Silk Inner Lining */}
            <KasavuLiningPattern />

            {/* Inner Shadow Cavity Depth */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow: "inset 0 10px 30px rgba(0,0,0,0.7)",
              }}
            />
          </div>

          {/* THE WEDDING INVITATION CARD (Inside Cavity) */}
          <div
            ref={cardRef}
            className="absolute inset-x-[4%] bottom-[4%] h-[92%] overflow-hidden rounded-sm"
            style={{
              zIndex: 2,
              transformStyle: "preserve-3d",
              boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
              willChange: "transform, width, height, top, left",
            }}
          >
            {/* Parchment Wedding Invitation Card Content */}
            <div
              className="relative flex h-full w-full flex-col items-center justify-between p-5 text-center sm:p-7"
              style={{
                background:
                  "linear-gradient(165deg, #fffdf8 0%, #f7f1e3 50%, #eee4ce 100%)",
                border: "1px solid rgba(197, 160, 89, 0.45)",
              }}
            >
              {/* Card Gold Hairline Frame */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-2.5 border border-amber-600/30"
              />

              {/* Light Reflection Sheen */}
              <div
                ref={cardShineRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 opacity-40"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.8) 50%, transparent 80%)",
                  transform: "translateX(-120%)",
                }}
              />

              {/* Card Header Malayalam Flourish */}
              <div className="relative z-10 pt-1">
                <p className="font-malayalam text-xs font-semibold tracking-[0.2em] text-amber-800/90 sm:text-sm">
                  വിവാഹ ക്ഷണം
                </p>
                <div className="mx-auto mt-1.5 h-0.5 w-12 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent" />
              </div>

              {/* Card Main Body */}
              <div className="relative z-10 my-auto flex flex-col items-center gap-1 sm:gap-2">
                <span className="font-display text-xs tracking-[0.18em] text-amber-900/70 uppercase sm:text-sm">
                  Together with their families
                </span>

                {/* Radha Krishna Crest Line Art */}
                <div className="my-1 flex items-center justify-center opacity-85">
                  <svg className="h-7 w-20 text-amber-800" viewBox="0 0 100 30" fill="none">
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

                <h1 className="font-display text-2xl font-bold tracking-wide text-amber-950 sm:text-3xl">
                  Nithin &amp; Lakshmi
                </h1>

                <p className="font-display text-xs italic tracking-wider text-amber-900/80 sm:text-sm">
                  request the pleasure of your company to celebrate their wedding
                </p>
              </div>

              {/* Card Footer Details */}
              <div className="relative z-10 w-full border-t border-amber-800/20 pt-2.5">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.25em] text-amber-900 sm:text-sm">
                  Saturday · 12 September 2026
                </p>
                <p className="font-body text-[10px] tracking-widest text-amber-800/80 uppercase sm:text-xs">
                  Kochi · Kerala
                </p>
              </div>
            </div>
          </div>

          {/* FRONT ENVELOPE POCKET (Triangular Folds) */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-md"
            style={{
              zIndex: 4,
              transformStyle: "preserve-3d",
            }}
          >
            <svg
              className="h-full w-full drop-shadow-lg"
              viewBox="0 0 420 280"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="pocketGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e2e4f" />
                  <stop offset="60%" stopColor="#15223b" />
                  <stop offset="100%" stopColor="#0d1628" />
                </linearGradient>

                <linearGradient id="goldSeamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="rgba(212,175,55,0.7)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Bottom V Pocket Path */}
              <path
                d="M 0,280 L 210,140 L 420,280 Z"
                fill="url(#pocketGrad)"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />

              {/* Left Side Pocket Fold */}
              <path
                d="M 0,0 L 210,140 L 0,280 Z"
                fill="url(#pocketGrad)"
                fillOpacity="0.95"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />

              {/* Right Side Pocket Fold */}
              <path
                d="M 420,0 L 210,140 L 420,280 Z"
                fill="url(#pocketGrad)"
                fillOpacity="0.95"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="1"
              />

              {/* Gold Filigree Line Edging along Seams */}
              <path
                d="M 0,280 L 210,140 L 420,280"
                stroke="url(#goldSeamGrad)"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* TOP TRIANGULAR FLAP (Rotates -180 deg along top origin) */}
          <div
            ref={topFlapRef}
            className="absolute top-0 left-0 h-[52%] w-full"
            style={{
              zIndex: 5,
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            {/* Flap Outer Front Face */}
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: "hidden" }}
            >
              <svg
                className="h-full w-full drop-shadow-md"
                viewBox="0 0 420 145"
                preserveAspectRatio="none"
                fill="none"
              >
                <path
                  d="M 0,0 L 420,0 L 210,145 Z"
                  fill="#1c2b4a"
                  stroke="rgba(212,175,55,0.4)"
                  strokeWidth="1"
                />
                {/* Gold seam edge */}
                <path
                  d="M 0,0 L 210,145 L 420,0"
                  stroke="rgba(212,175,55,0.7)"
                  strokeWidth="1.5"
                />
              </svg>
            </div>

            {/* Flap Inner Back Face (Kasavu Gold Texture visible when folded open) */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            >
              <svg
                className="h-full w-full"
                viewBox="0 0 420 145"
                preserveAspectRatio="none"
              >
                <path d="M 0,0 L 420,0 L 210,145 Z" fill="#142138" />
              </svg>
              {/* Inner Gold Kasavu Pattern on open flap */}
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              >
                <KasavuLiningPattern />
              </div>
            </div>
          </div>

          {/* 3D WAX SEAL (Centered over Top Flap Tip) */}
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
            aria-label="Break Wax Seal to open invitation"
            className={`absolute top-1/2 left-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 outline-none sm:h-28 sm:w-28 ${
              isOpening ? "pointer-events-none" : "cursor-pointer"
            }`}
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            {/* Realistic Red Wax Seal SVG with embossed relief */}
            <WaxSeal3D />
          </div>

          {/* Shockwave Aura Ring Pulse */}
          <div
            ref={shockwaveRef}
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-400/80 opacity-0"
            style={{
              boxShadow: "0 0 35px rgba(245, 158, 11, 0.8)",
            }}
          />

          {/* 3D Wax Shatter Physics Particles */}
          <div
            ref={particlesGroupRef}
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 z-30 h-0 w-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {fragments.map((f) => (
              <div
                key={f.id}
                className="absolute top-0 left-0 -ml-2 -mt-2 rounded-xs"
                style={{
                  width: `${12 * f.scale}px`,
                  height: `${14 * f.scale}px`,
                  background:
                    "radial-gradient(circle at 35% 35%, #e11d48, #9f1239 60%, #4c0519 100%)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.6)",
                  border: "1px solid rgba(251,191,36,0.5)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Interactive Hint */}
        <p
          ref={hintTextRef}
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 font-display text-xs uppercase tracking-[0.35em] text-amber-200/70 sm:bottom-14 sm:text-sm"
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            Tap the Wax Seal to Open
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * Ultra-Realistic 3D Red Wax Seal Component with Metallic Gold Dust & Raised Relief
 */
function WaxSeal3D() {
  return (
    <div className="group relative h-full w-full">
      {/* Dynamic Drop Shadow onto Envelope Paper */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full transition-all duration-300 group-hover:scale-105"
        style={{
          boxShadow:
            "0 14px 28px rgba(0,0,0,0.65), 0 6px 12px rgba(0,0,0,0.45), 0 0 20px rgba(185,28,28,0.3)",
        }}
      />

      <svg
        viewBox="0 0 100 100"
        className="relative h-full w-full transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          {/* Deep Crimson Wax Radial Gradient */}
          <radialGradient id="waxBodyGrad" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="35%" stopColor="#e11d48" />
            <stop offset="70%" stopColor="#9f1239" />
            <stop offset="100%" stopColor="#4c0519" />
          </radialGradient>

          {/* Metallic Gold Dust Accents */}
          <radialGradient id="goldDust" cx="45%" cy="35%" r="50%">
            <stop offset="0%" stopColor="rgba(254, 240, 138, 0.45)" />
            <stop offset="60%" stopColor="rgba(217, 119, 6, 0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>

          {/* Highlight Specular Sheen */}
          <linearGradient id="waxSheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
          </linearGradient>
        </defs>

        {/* Organic Wax Rim Edge */}
        <path d={WAX_BLOB_PATH} fill="url(#waxBodyGrad)" />
        <path d={WAX_BLOB_PATH} fill="url(#goldDust)" />
        <path d={WAX_BLOB_PATH} fill="url(#waxSheen)" opacity="0.3" />

        {/* Inner Engraved Stamped Concentric Circles */}
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke="#4c0519"
          strokeWidth="1.8"
          opacity="0.6"
        />
        <circle
          cx="50"
          cy="50"
          r="26"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Embossed Relief Initials "L & N" */}
        {/* Shadow Layer for 3D Relief Depth */}
        <text
          x="33"
          y="59"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="26"
          fontWeight="700"
          fill="#30030f"
          textAnchor="start"
        >
          L
        </text>
        {/* Raised Highlight Layer */}
        <text
          x="32.2"
          y="58"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="26"
          fontWeight="700"
          fill="#fef08a"
          textAnchor="start"
        >
          L
        </text>

        {/* Ampersand "&" */}
        <text
          x="50"
          y="52"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontStyle="italic"
          fontSize="13"
          fontWeight="600"
          fill="#30030f"
          textAnchor="middle"
        >
          &amp;
        </text>
        <text
          x="49.5"
          y="51.2"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontStyle="italic"
          fontSize="13"
          fontWeight="600"
          fill="#fef08a"
          textAnchor="middle"
        >
          &amp;
        </text>

        {/* "N" Initial */}
        <text
          x="67"
          y="59"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="26"
          fontWeight="700"
          fill="#30030f"
          textAnchor="end"
        >
          N
        </text>
        <text
          x="66.2"
          y="58"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="26"
          fontWeight="700"
          fill="#fef08a"
          textAnchor="end"
        >
          N
        </text>

        {/* Gold Bead Accents Around Rim */}
        {GOLD_BEAD_POSITIONS.map((pos, i) => (
          <circle
            key={i}
            cx={pos[0]}
            cy={pos[1]}
            r="0.8"
            fill="#fef08a"
            opacity="0.75"
          />
        ))}
      </svg>
    </div>
  );
}

/** Pre-computed bead accent coordinates */
const GOLD_BEAD_POSITIONS: [number, number][] = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2;
  return [
    Math.round((50 + Math.cos(angle) * 28) * 10) / 10,
    Math.round((50 + Math.sin(angle) * 28) * 10) / 10,
  ];
});

/** Irregular organic SVG path for realistic melted wax edge */
const WAX_BLOB_PATH = `
  M 50 6
  C 60 5, 70 8, 78 14
  C 84 18, 90 25, 93 33
  C 96 41, 95 50, 93 58
  C 90 67, 85 75, 78 81
  C 70 87, 60 92, 50 92
  C 40 92, 30 87, 22 81
  C 15 75, 10 67, 7 58
  C 5 50, 4 41, 7 33
  C 10 25, 16 18, 22 14
  C 30 8, 40 5, 50 6
  Z
`;

/**
 * Traditional Kerala Kasavu Gold Woven Lattice Pattern Component
 */
function KasavuLiningPattern() {
  return (
    <div className="absolute inset-0 opacity-25">
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
            <circle cx="15" cy="15" r="2.5" fill="#eab308" opacity="0.6" />
            <path
              d="M 0 0 L 30 30 M 30 0 L 0 30"
              stroke="#c5a059"
              strokeWidth="0.3"
              strokeDasharray="2 2"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kasavuPattern)" />
      </svg>
    </div>
  );
}

/**
 * Floating Ambient Gold Sparkles Animation
 */
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
