import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sparkles, Volume2, VolumeX, ArrowRight } from "lucide-react";
import { ParticleField } from "@/components/wedding/ParticleField";

// Register GSAP React plugin if available in browser
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP);
}

interface EnvelopeIntroProps {
  onComplete: () => void;
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
    // Graceful fallback
  }
}

/**
 * World-Class 3D Light-Theme Envelope Opening Experience
 * Featuring:
 *   - Luxury Light Theme Kerala Ivory & Kasavu Gold Envelope
 *   - Peel & Stick Small-Radius Heart Seal with embossed "L & N" initials
 *   - 5-Phase GSAP Master Timeline Choreography (Idle 3D tilt, Peel/Shatter, Flap Fold, Card Rise, 3D Jump-Out)
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
    const frags = Array.from({ length: 20 }, (_, i) => {
      const angle = (i / 20) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const dist = 70 + Math.random() * 110;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        z: (Math.random() - 0.2) * 160,
        rx: (Math.random() - 0.5) * 720,
        ry: (Math.random() - 0.5) * 720,
        rz: (Math.random() - 0.5) * 720,
        scale: 0.4 + Math.random() * 0.6,
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

    // PHASE 2: Peel & Stick Heart Seal Peel & Fracture
    if (waxSealRef.current) {
      tl.to(
        waxSealRef.current,
        {
          scale: 1.3,
          rotateZ: -12,
          duration: 0.15,
          ease: "power2.out",
        },
        0.1
      ).to(
        waxSealRef.current,
        {
          opacity: 0,
          scale: 0.2,
          rotateZ: 25,
          duration: 0.25,
          ease: "power3.in",
        },
        0.25
      );
    }

    // Shockwave pulse
    if (shockwaveRef.current) {
      tl.fromTo(
        shockwaveRef.current,
        { opacity: 0.9, scale: 0.5 },
        { opacity: 0, scale: 3.0, duration: 0.6, ease: "power2.out" },
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
          duration: 0.75,
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
        0.45
      );

      // Halfway through flap fold, switch z-index so top flap goes behind card
      tl.set(topFlapRef.current, { zIndex: 1 }, 0.9);
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
        1.05
      );
    }

    // Light reflection sheen across rising card
    if (cardShineRef.current) {
      tl.fromTo(
        cardShineRef.current,
        { x: "-120%" },
        { x: "220%", duration: 1.1, ease: "power2.inOut" },
        1.25
      );
    }

    // PHASE 5: The "3D Jump Out" Fullscreen Expansion
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
        1.95
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
        1.95
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
        2.35
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
      className="fixed inset-0 z-[300] select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 110% 100% at 50% 45%, #182238 0%, #0d1526 60%, #060914 100%)",
      }}
    >
      {/* Dynamic Ambient Background Elements */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 35%, rgba(212,175,55,0.2) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23c5a059' fill-opacity='0.12'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Dynamic Canvas Floating Golden Embers / Kasavu Dust */}
      <ParticleField density={95} />

      {/* Falling Kerala Wedding Flowers & Petals */}
      <FallingFlowers />

      {/* Floating Gold Kasavu Sparkles */}
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
          <p className="font-display text-xs italic tracking-[0.25em] text-amber-200/80 uppercase sm:text-sm">
            You have received a wedding invitation
          </p>
          <h2 className="mt-1 font-display text-lg font-light tracking-[0.15em] text-amber-100/95 sm:text-xl">
            Nithin &amp; Lakshmi
          </h2>
        </div>

        {/* Master 3D Light-Theme Envelope */}
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
          {/* LIGHT THEME ENVELOPE BACK PANEL */}
          <div
            className="absolute inset-0 overflow-hidden rounded-md border border-amber-500/40"
            style={{
              background:
                "linear-gradient(155deg, #faf7f2 0%, #f3ece0 50%, #e8decb 100%)",
              boxShadow:
                "0 30px 80px -10px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.8) inset, 0 10px 25px rgba(197,160,89,0.15)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Kasavu Gold Woven Silk Inner Lining */}
            <KasavuLiningPattern />

            {/* Inner Shadow Cavity Depth */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow: "inset 0 12px 30px rgba(160, 130, 70, 0.25)",
              }}
            />
          </div>

          {/* WEDDING INVITATION CARD (Inside Cavity) */}
          <div
            ref={cardRef}
            className="absolute inset-x-[4%] bottom-[4%] h-[92%] overflow-hidden rounded-sm"
            style={{
              zIndex: 2,
              transformStyle: "preserve-3d",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              willChange: "transform, width, height, top, left",
            }}
          >
            {/* Parchment Wedding Invitation Card Content */}
            <div
              className="relative flex h-full w-full flex-col items-center justify-between p-5 text-center sm:p-7"
              style={{
                background:
                  "linear-gradient(165deg, #ffffff 0%, #faf6ec 50%, #f3ebd7 100%)",
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
                    "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.9) 50%, transparent 80%)",
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
                <span className="font-display text-xs tracking-[0.18em] text-amber-900/75 uppercase sm:text-sm">
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

          {/* LIGHT THEME FRONT ENVELOPE POCKET (Triangular Folds) */}
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-md"
            style={{
              zIndex: 4,
              transformStyle: "preserve-3d",
            }}
          >
            <svg
              className="h-full w-full drop-shadow-md"
              viewBox="0 0 420 280"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                {/* Light Ivory Soft Blue / Cream Gradients */}
                <linearGradient id="pocketLightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f7f2e8" />
                  <stop offset="50%" stopColor="#efe7d8" />
                  <stop offset="100%" stopColor="#e3d7c3" />
                </linearGradient>

                <linearGradient id="goldSeamGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="rgba(197,160,89,0.85)" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Bottom V Pocket Path */}
              <path
                d="M 0,280 L 210,140 L 420,280 Z"
                fill="url(#pocketLightGrad)"
                stroke="rgba(197,160,89,0.3)"
                strokeWidth="1"
              />

              {/* Left Side Pocket Fold */}
              <path
                d="M 0,0 L 210,140 L 0,280 Z"
                fill="url(#pocketLightGrad)"
                fillOpacity="0.97"
                stroke="rgba(197,160,89,0.25)"
                strokeWidth="1"
              />

              {/* Right Side Pocket Fold */}
              <path
                d="M 420,0 L 210,140 L 420,280 Z"
                fill="url(#pocketLightGrad)"
                fillOpacity="0.97"
                stroke="rgba(197,160,89,0.25)"
                strokeWidth="1"
              />

              {/* Gold Filigree Line Edging along Seams */}
              <path
                d="M 0,280 L 210,140 L 420,280"
                stroke="url(#goldSeamGrad)"
                strokeWidth="1.8"
              />
            </svg>
          </div>

          {/* LIGHT THEME TOP TRIANGULAR FLAP */}
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
            {/* Flap Outer Front Face (Light Theme Ivory/Cream) */}
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
                  fill="#f9f5ed"
                  stroke="rgba(197,160,89,0.4)"
                  strokeWidth="1"
                />
                {/* Gold seam edge */}
                <path
                  d="M 0,0 L 210,145 L 420,0"
                  stroke="rgba(197,160,89,0.8)"
                  strokeWidth="1.8"
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
                <path d="M 0,0 L 420,0 L 210,145 Z" fill="#f0e4cc" />
              </svg>
              {/* Inner Gold Kasavu Pattern on open flap */}
              <div
                className="absolute inset-0 opacity-85"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                }}
              >
                <KasavuLiningPattern />
              </div>
            </div>
          </div>

          {/* PEEL & STICK SMALL-RADIUS HEART SEAL */}
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
            className={`absolute top-1/2 left-1/2 z-10 h-14 w-14 -translate-x-1/2 -translate-y-1/2 outline-none sm:h-16 sm:w-16 ${
              isOpening ? "pointer-events-none" : "cursor-pointer"
            }`}
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            }}
          >
            {/* Peel & Stick Heart-Shaped Wax / Sticker Seal */}
            <PeelAndStickHeartSeal />
          </div>

          {/* Shockwave Aura Ring Pulse */}
          <div
            ref={shockwaveRef}
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 z-10 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-amber-500/80 opacity-0 sm:h-16 sm:w-16"
            style={{
              boxShadow: "0 0 25px rgba(225, 29, 72, 0.8)",
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
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 font-display text-xs uppercase tracking-[0.35em] text-amber-200/80 sm:bottom-14 sm:text-sm"
        >
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            Tap the Heart Seal to Open
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * Ultra-Realistic Peel & Stick Small-Radius Heart Seal Component
 * Features:
 *  - Small radius heart shape SVG path
 *  - Tactile 3D embossed relief initials "L & N"
 *  - Realistic Peel & Stick metallic edge sheen & shadow
 */
function PeelAndStickHeartSeal() {
  return (
    <div className="group relative h-full w-full">
      {/* Tactile 3D Drop Shadow on Envelope */}
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
          {/* Rich Ruby Red Wax Radial Gradient */}
          <radialGradient id="heartWaxGrad" cx="40%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#fb7185" />
            <stop offset="35%" stopColor="#e11d48" />
            <stop offset="70%" stopColor="#be123c" />
            <stop offset="100%" stopColor="#680721" />
          </radialGradient>

          {/* Metallic Gold Sheen Gradient */}
          <linearGradient id="heartGoldEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Peel Gloss Sheen */}
          <linearGradient id="peelGloss" x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="35%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </linearGradient>
        </defs>

        {/* Heart Seal Base */}
        <path d={HEART_PATH} fill="url(#heartWaxGrad)" />
        <path d={HEART_PATH} fill="url(#peelGloss)" />

        {/* Inner Gold Foil Stamped Heart Border */}
        <path
          d={INNER_HEART_PATH}
          fill="none"
          stroke="url(#heartGoldEdge)"
          strokeWidth="1.8"
          opacity="0.85"
        />

        {/* Embossed Relief Initials "L & N" */}
        {/* L Initial */}
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

        {/* Ampersand "&" */}
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

        {/* N Initial */}
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

        {/* Peel & Stick Bottom Corner Curl Specular Accent */}
        <path
          d="M 45 82 C 48 85 50 87 50 87 C 50 87 52 85 55 82 Z"
          fill="url(#heartGoldEdge)"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}

/** Smooth, elegant Heart SVG path */
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

/** Inner concentric Heart path for gold stamped rim */
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

/**
 * Traditional Kerala Kasavu Gold Woven Lattice Pattern Component
 */
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

/**
 * Falling Kerala Wedding Flowers & Petals Component
 * Features realistic Marigold blossoms, Jasmine flowers, Lotus petals, and Red Hibiscus/Rose petals.
 */
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

/**
 * Detailed SVG Renderer for authentic Kerala wedding flowers & petals
 */
function FlowerSVG({
  type,
}: {
  type: "marigold" | "jasmine" | "rose" | "lotus_petal" | "marigold_petal";
}) {
  if (type === "marigold") {
    // Layered Golden-Orange Marigold Flower (Chendumalli)
    return (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {/* Outer Petal Ring */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const cx = 20 + Math.cos(a) * 11;
          const cy = 20 + Math.sin(a) * 11;
          return <circle key={i} cx={cx} cy={cy} r="6.5" fill="#ea580c" />;
        })}
        {/* Middle Petal Ring */}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2 + 0.2;
          const cx = 20 + Math.cos(a) * 7.5;
          const cy = 20 + Math.sin(a) * 7.5;
          return <circle key={i} cx={cx} cy={cy} r="5.5" fill="#f97316" />;
        })}
        {/* Inner Petal Ring */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + 0.4;
          const cx = 20 + Math.cos(a) * 4;
          const cy = 20 + Math.sin(a) * 4;
          return <circle key={i} cx={cx} cy={cy} r="4.5" fill="#eab308" />;
        })}
        {/* Center Seed Core */}
        <circle cx="20" cy="20" r="3.5" fill="#7c2d12" />
        <circle cx="20" cy="20" r="2" fill="#fde047" opacity="0.8" />
      </svg>
    );
  }

  if (type === "jasmine") {
    // Traditional White Jasmine Blossom (Mullappoo)
    return (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {/* 5 White Petals */}
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
        {/* Soft Yellow Center Core */}
        <circle cx="20" cy="20" r="3.5" fill="#fde047" />
        <circle cx="20" cy="20" r="1.8" fill="#eab308" />
      </svg>
    );
  }

  if (type === "rose") {
    // Red Rose / Hibiscus Blossom
    return (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {/* Outer Red Petals */}
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
        {/* Inner Swirl Petals */}
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
    // Pink Lotus Petal (Thamara)
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

  // Marigold Petal
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


