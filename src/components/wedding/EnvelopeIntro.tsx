import { useAnimate } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ParticleField } from "@/components/wedding/ParticleField";
import bgmFile from "@/assets/DC-The-Rose-BGM.mp3";
import bgImage from "@/assets/masonary/DSC07980.webp";


const POWER2_IN_OUT = [0.65, 0, 0.35, 1] as const;
const POWER1_IN_OUT = [0.45, 0, 0.55, 1] as const;
const POWER2_OUT = [0.22, 1, 0.36, 1] as const;

interface EnvelopeIntroProps {
  children?: React.ReactNode;
  onComplete?: () => void;
}

export function EnvelopeIntro({ children, onComplete }: EnvelopeIntroProps) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const isSwiping = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio(bgmFile);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  /* Lock scroll while the intro is on screen */
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);


  const play = useCallback(async (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      if (e.type !== "touchstart") {
        e.preventDefault();
      }
    }
    
    if (audioRef.current) {
      audioRef.current.play().catch(console.warn);
    }
    if (started.current) return;
    started.current = true;
    setPlaying(true);

    const card = scope.current.querySelector<HTMLElement>("[data-card]")!;
    const pocketH = card.offsetHeight;

    /* Phase 0 — seal breaks */
    await animate(
      "[data-seal]",
      { scale: [1, 1.25, 0], opacity: [1, 1, 0] },
      { duration: 0.35, ease: POWER2_OUT },
    );

    /* Phase 1 — open the flap */
    await animate("[data-flap]", { rotateX: -180 }, { duration: 0.7, ease: POWER2_IN_OUT });

    /* Phase 2 — paper extraction */
    await animate(
      card,
      { y: -(pocketH * 0.92) },
      { duration: 1.0, ease: POWER1_IN_OUT },
    );

    /* Phase 3 — fly out & fullscreen expansion */
    card.style.zIndex = "10";
    animate("[data-part]", { opacity: 0 }, { duration: 0.6, ease: POWER2_OUT });
    await animate(
      card,
      {
        y: 0,
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        boxShadow: "0 0 0 0 rgba(0,0,0,0)",
      },
      { duration: 1.2, ease: POWER2_OUT },
    );

    await animate(scope.current, { opacity: 0 }, { duration: 0.4, ease: "linear" });
    document.body.style.overflow = "";
    setDone(true);
    onComplete?.();
  }, [animate, onComplete, scope]);

  const handleSkip = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
      if (e.type !== "touchstart") {
        e.preventDefault();
      }
    }
    
    if (audioRef.current) {
      audioRef.current.play().catch(console.warn);
    }
    document.body.style.overflow = "";
    setDone(true);
    onComplete?.();
  }, [onComplete]);

  const BOX = "absolute inset-0 m-auto w-[min(88vw,420px)] h-[min(58.6vw,280px)]";

  return (
    <div className="relative w-full min-h-screen">
      {/* Live website content — hidden until intro finishes */}
      <div
        className={`relative z-0 w-full min-h-screen transition-opacity duration-700 ${done ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {children}
      </div>

      {!done && (
        <div
          ref={scope}
          className="fixed inset-0 z-[300] select-none overflow-visible"
          style={{
            perspective: "1200px",
          }}
          role="dialog"
          aria-label="Wedding invitation envelope"
        >
          {/* Background image with light dark overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <img
              src={bgImage}
              alt=""
              className="h-full w-full object-cover object-center"
              fetchPriority="high"
            />
            {/* Dark overlay mask for visual depth and readability */}
            <div className="absolute inset-0 bg-slate-950/20" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 110% 100% at 50% 45%, rgba(24, 34, 56, 0.1) 0%, rgba(13, 21, 38, 0.4) 60%, rgba(6, 9, 20, 0.7) 100%)",
              }}
            />
          </div>

          {/* Ambient particle canvas */}
          <ParticleField density={95} />

          {/* Falling Kerala wedding flowers */}
          <FallingFlowers />

          {/* Floating gold sparkles */}
          <AmbientSparkles />

          {/* Skip button */}
          {/* <div className="absolute top-6 right-6 z-[350]">
            <button
              type="button"
              onClick={(e) => {
                if (isSwiping.current) return;
                handleSkip(e);
              }}
              onTouchStart={(e) => {
                touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                isSwiping.current = false;
              }}
              onTouchMove={(e) => {
                const dx = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
                const dy = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
                if (dx > 10 || dy > 10) {
                  isSwiping.current = true;
                }
              }}
              onTouchEnd={(e) => {
                if (isSwiping.current) return;
                e.preventDefault();
                handleSkip(e);
              }}
              className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-slate-900/60 px-4 py-2 text-xs font-medium tracking-wider text-amber-200/90 backdrop-blur-md transition-all hover:scale-105 hover:border-amber-400 hover:bg-slate-900/80 hover:text-amber-100"
            >
              Skip Intro
            </button>
          </div> */}

          {/* Header */}
          <div className="absolute top-8 left-1/2 z-10 -translate-x-1/2 text-center sm:top-12">
            <p className="font-display text-xs italic tracking-[0.25em] text-amber-200/80 uppercase sm:text-sm">
              You have received a wedding invitation
            </p>
            <h2 className="mt-1 font-display text-lg font-light tracking-[0.15em] text-amber-100/95 sm:text-xl">
              Lakshmi &amp; Nithin
            </h2>
          </div>

          {/* ── Envelope stage ── */}
          <div className="relative flex h-full w-full items-center justify-center overflow-visible">

            {/* Envelope back — z-1 */}
            <div
              data-part
              className={`${BOX} pointer-events-none rounded-xl`}
              style={{
                zIndex: 1,
                background: "linear-gradient(160deg, #faf7f2 0%, #f3ece0 50%, #e8decb 100%)",
                border: "1px solid rgba(197,160,89,0.45)",
                boxShadow: "0 40px 80px -30px rgb(0 0 0 / 0.7)",
              }}
            >
              <KasavuLiningPattern />
            </div>

            {/* Website card — z-2, raised to z-10 once it clears the pocket */}
            <div
              data-card
              className="pointer-events-none absolute inset-0 m-auto flex flex-col items-center justify-center overflow-hidden text-center"
              style={{
                zIndex: 2,
                width: "min(84vw, 392px)",
                height: "min(56vw, 262px)",
                borderRadius: "12px",
                background: "linear-gradient(165deg, #ffffff 0%, #faf6ec 50%, #f3ebd7 100%)",
                border: "1px solid rgba(197,160,89,0.5)",
                boxShadow: "0 30px 60px -25px rgb(0 0 0 / 0.55)",
              }}
            >
              <p className="font-malayalam text-[22px] font-bold  text-amber-800">
                വിവാഹ ക്ഷണം
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-amber-950 md:text-4xl">
                Nithin
              </h2>
              <p className="font-hand text-xl text-amber-700">weds</p>
              <h2 className="font-display text-3xl font-semibold text-amber-950 md:text-4xl">
                Lakshmi
              </h2>
              <div className="my-3 h-px w-24 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
              <p className="text-[11px] uppercase tracking-[0.25em] text-amber-900/70">
                12 September 2026
              </p>
            </div>

            {/* Envelope front pocket — z-3 */}
            <div data-part className={`${BOX} pointer-events-none`} style={{ zIndex: 3 }}>
              <svg
                className="h-full w-full"
                viewBox="0 0 420 280"
                preserveAspectRatio="none"
                fill="none"
              >
                <defs>
                  <linearGradient id="pocketGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f8f3ea" />
                    <stop offset="100%" stopColor="#e0d2bc" />
                  </linearGradient>
                  <linearGradient id="goldSeam" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="rgba(197,160,89,0.9)" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                {/* left triangle */}
                <path d="M 0,0 L 196,140 L 0,280 Z" fill="url(#pocketGrad)" fillOpacity="0.97" stroke="rgba(197,160,89,0.3)" strokeWidth="1" />
                {/* right triangle */}
                <path d="M 420,0 L 224,140 L 420,280 Z" fill="url(#pocketGrad)" fillOpacity="0.97" stroke="rgba(197,160,89,0.3)" strokeWidth="1" />
                {/* bottom flap */}
                <path d="M 0,280 L 420,280 L 420,260 C 310,182 240,143 210,132 C 180,143 110,182 0,260 Z" fill="url(#pocketGrad)" stroke="rgba(197,160,89,0.4)" strokeWidth="1" />
                <path d="M 0,260 C 110,182 180,143 210,132 C 240,143 310,182 420,260" stroke="url(#goldSeam)" strokeWidth="2" />
              </svg>
            </div>

            {/* Envelope top flap — z-4 */}
            <div
              data-part
              className={`${BOX} pointer-events-none`}
              style={{ zIndex: 4, transformStyle: "preserve-3d" }}
            >
              <div
                data-flap
                className="absolute inset-x-0 top-0 h-[52%] origin-top"
                style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
              >
                <svg
                  className="h-full w-full"
                  viewBox="0 0 420 146"
                  preserveAspectRatio="none"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#faf6ee" />
                      <stop offset="70%" stopColor="#f2e7d5" />
                      <stop offset="100%" stopColor="#e5d5be" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,0 L 420,0 L 420,5 C 310,88 236,136 210,144 C 184,136 110,88 0,5 Z"
                    fill="url(#flapGrad)"
                    stroke="rgba(197,160,89,0.4)"
                    strokeWidth="1"
                  />
                  <path
                    d="M 0,5 C 110,88 184,136 210,144 C 236,136 310,88 420,5"
                    stroke="rgba(197,160,89,0.85)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Heart seal + trigger — z-5 */}
            <div className={`${BOX} pointer-events-none`} style={{ zIndex: 5 }}>
              <button
                data-seal
                type="button"
                onClick={(e) => {
                  if (isSwiping.current) return;
                  play(e);
                }}
                onTouchStart={(e) => {
                  touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                  isSwiping.current = false;
                }}
                onTouchMove={(e) => {
                  const dx = Math.abs(e.touches[0].clientX - touchStartPos.current.x);
                  const dy = Math.abs(e.touches[0].clientY - touchStartPos.current.y);
                  if (dx > 10 || dy > 10) {
                    isSwiping.current = true;
                  }
                }}
                onTouchEnd={(e) => {
                  if (isSwiping.current) return;
                  e.preventDefault(); // Prevents the follow-up click event on iOS
                  play(e);
                }}
                disabled={playing}
                aria-label="Open the invitation"
                className="pointer-events-auto absolute left-1/2 top-[52%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 35% 30%, #fb7185, #be123c 60%, #881337)",
                  boxShadow: "0 10px 30px -8px rgb(0 0 0 / 0.6), 0 0 20px rgba(225,29,72,0.4)",
                }}
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#fef08a" aria-hidden>
                  <path d="M12 21s-7.5-4.7-9.3-9A5.2 5.2 0 0 1 12 6.4 5.2 5.2 0 0 1 21.3 12c-1.8 4.3-9.3 9-9.3 9Z" />
                </svg>
              </button>
            </div>

            {!playing && (
              <p className="absolute bottom-16 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.35em] text-amber-200/70 pointer-events-none">
                <span className="inline-flex items-center gap-2">
                  <span className="animate-pulse text-amber-400">✦</span>
                  Tap the seal to open
                  <span className="animate-pulse text-amber-400">✦</span>
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Helper components preserved from original ── */

function KasavuLiningPattern() {
  return (
    <div className="absolute inset-0 opacity-30 pointer-events-none">
      <svg className="h-full w-full" width="100%" height="100%">
        <defs>
          <pattern id="kasavuPattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 15 0 L 30 15 L 15 30 L 0 15 Z" fill="none" stroke="#c5a059" strokeWidth="0.8" />
            <circle cx="15" cy="15" r="2.5" fill="#eab308" opacity="0.7" />
            <path d="M 0 0 L 30 30 M 30 0 L 0 30" stroke="#c5a059" strokeWidth="0.35" strokeDasharray="2 2" />
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
    setSparkles(
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1.5 + Math.random() * 2.5,
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
      })),
    );
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
            boxShadow: "0 0 8px rgba(251,191,36,0.8)",
            animation: `glow-pulse ${s.duration}s ease-in-out infinite ${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

type FlowerType = "marigold" | "jasmine" | "rose" | "lotus_petal" | "marigold_petal";

function FallingFlowers() {
  const [flowers, setFlowers] = useState<
    Array<{ id: number; type: FlowerType; left: number; size: number; duration: number; delay: number }>
  >([]);

  useEffect(() => {
    const types: FlowerType[] = ["marigold", "jasmine", "rose", "lotus_petal", "marigold_petal", "marigold", "jasmine"];
    setFlowers(
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        type: types[i % types.length],
        left: 2 + Math.random() * 94,
        size: 16 + Math.random() * 22,
        duration: 7 + Math.random() * 9,
        delay: Math.random() * 7,
      })),
    );
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

function FlowerSVG({ type }: { type: FlowerType }) {
  if (type === "marigold") {
    return (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <circle key={i} cx={20 + Math.cos(a) * 11} cy={20 + Math.sin(a) * 11} r="6.5" fill="#ea580c" />;
        })}
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2 + 0.2;
          return <circle key={i} cx={20 + Math.cos(a) * 7.5} cy={20 + Math.sin(a) * 7.5} r="5.5" fill="#f97316" />;
        })}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + 0.4;
          return <circle key={i} cx={20 + Math.cos(a) * 4} cy={20 + Math.sin(a) * 4} r="4.5" fill="#eab308" />;
        })}
        <circle cx="20" cy="20" r="3.5" fill="#7c2d12" />
        <circle cx="20" cy="20" r="2" fill="#fde047" opacity="0.8" />
      </svg>
    );
  }
  if (type === "jasmine") {
    return (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {Array.from({ length: 5 }, (_, i) => (
          <path key={i} d="M 20 20 C 14 10, 16 2, 20 2 C 24 2, 26 10, 20 20 Z" fill="#ffffff" stroke="#fef08a" strokeWidth="0.5" transform={`rotate(${(i / 5) * 360} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="3.5" fill="#fde047" />
        <circle cx="20" cy="20" r="1.8" fill="#eab308" />
      </svg>
    );
  }
  if (type === "rose") {
    return (
      <svg viewBox="0 0 40 40" className="h-full w-full">
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d="M 20 20 C 10 12, 10 2, 20 2 C 30 2, 30 12, 20 20 Z" fill="#e11d48" transform={`rotate(${(i / 6) * 360} 20 20)`} />
        ))}
        {Array.from({ length: 5 }, (_, i) => {
          const deg = (i / 5) * 360 + 30;
          return <circle key={i} cx={20 + Math.cos((deg * Math.PI) / 180) * 4} cy={20 + Math.sin((deg * Math.PI) / 180) * 4} r="5" fill="#be123c" />;
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
        <path d="M 15 2 C 5 12, 2 26, 15 38 C 28 26, 25 12, 15 2 Z" fill="url(#lotusGrad)" stroke="#f472b6" strokeWidth="0.5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 30 30" className="h-full w-full">
      <path d="M 15 2 C 8 8, 4 18, 15 28 C 26 18, 22 8, 15 2 Z" fill="#f97316" stroke="#fde047" strokeWidth="0.5" />
    </svg>
  );
}
