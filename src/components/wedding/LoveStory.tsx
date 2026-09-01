import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { SectionHeading } from "./SectionHeading";
import bgImage from "@/assets/masonary/DSC08240-optimized.webp";

// ── Real assets ───────────────────────────────────────────────────────────────
import sheYes from "@/assets/moments/DSC08993.JPG";
import familyMeet1 from "@/assets/moments/image-copy.png";
import familyMeet2 from "@/assets/moments/image-copy-2.png";
import trip1 from "@/assets/moments/WhatsApp-Image-2026-09-01-at-3.49.33-PM.jpeg";
import trip2 from "@/assets/moments/image-copy-8.png";
import trip3 from "@/assets/moments/image-copy-4-clean.png";
import engagementImg from "@/assets/moments/IMG_20260628_123805.jpeg";

// ── Types ─────────────────────────────────────────────────────────────────────
interface MomentImage {
  src: string;
  alt: string;
  objectPosition?: string;
}

interface Moment {
  id: string;
  date: string;
  icon: string;
  title: string;
  subtitle: string;
  story: string;
  images?: MomentImage[];
  accent: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const MOMENTS: Moment[] = [
  {
    id: "yes",
    date: "23 November 2025",
    icon: "🌸",
    title: "She Said Yes",
    subtitle: "The moment that changed everything",
    story:
      "A quiet moment, just the two of us — she said yes, and the world felt a little more whole. A beginning that needed no words, only a smile.",
    images: [{ src: sheYes, alt: "Nithin and Lakshmi — she said yes" }],
    accent: "#e8a0b4",
  },
  {
    id: "family",
    date: "First Family Meeting",
    icon: "🏡",
    title: "Two Families, One Heart",
    subtitle: "The day our worlds met",
    story:
      "A warm afternoon, nervous smiles, and the quiet joy of two families finding each other. Flowers, gifts, and the beginning of something beautiful.",
    images: [
      { src: familyMeet1, alt: "First family meeting — Nithin and Lakshmi with family" },
      { src: familyMeet2, alt: "Flowers and gifts exchanged at the family meeting" },
    ],
    accent: "#9b7940",
  },
  {
    id: "trip",
    date: "First Trip Together",
    icon: "🏍️",
    title: "Roads & Mountains",
    subtitle: "Where the adventure begins",
    story:
      "Open roads, misty hills, and the kind of laughter that lives only in motion. Our first trip together — proof that every journey is better with the right person beside you.",
    images: [
      { src: trip1, alt: "Nithin and Lakshmi on a motorcycle road trip" },
      { src: trip2, alt: "Couple at a mountain viewpoint" },
      { src: trip3, alt: "Couple at Adiyogi Shiva statue — a spiritual journey together" },
    ],
    accent: "#4a7c59",
  },
  {
    id: "engagement",
    date: "Engagement Day",
    icon: "💍",
    title: "The Beginning",
    subtitle: "When two families became one",
    story:
      "Two families, two hearts, one promise. The day everything officially began — rings exchanged, blessings given, futures intertwined.",
    images: [
      { src: engagementImg, alt: "Nithin and Lakshmi on their engagement day", objectPosition: "top" },
    ],
    accent: "#c9a84c",
  },
];

// ── Inner image slider (used inside carousel cards for multi-image) ───────────
function ImageSlider({ images, accent }: { images: MomentImage[]; accent: string }) {
  const [[active, direction], setActive] = useState([0, 0]);
  const total = images.length;

  function paginate(dir: number) {
    const next = active + dir;
    if (next < 0 || next >= total) return;
    setActive([next, dir]);
  }

  function onDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    if (info.offset.x < -40 || info.velocity.x < -300) paginate(1);
    else if (info.offset.x > 40 || info.velocity.x > 300) paginate(-1);
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? "100%" : "-100%", opacity: 0 }),
  };

  const img = images[active];

  return (
    <div className="mt-4 flex flex-col flex-1" style={{ minHeight: 0 }}>
      {/* Slide area */}
      <div className="relative flex-1 overflow-hidden rounded-xl" style={{ minHeight: 0 }}>
        <motion.img
          key={active}
          src={img.src}
          alt={img.alt}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={onDragEnd}
          style={{ objectPosition: img.objectPosition ?? "center", touchAction: "pan-y" }}
          className="absolute inset-0 h-full w-full object-cover select-none cursor-grab active:cursor-grabbing"
        />

        {/* Prev / next tap zones */}
        {active > 0 && (
          <button
            onClick={() => paginate(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full bg-black/30 text-white text-lg backdrop-blur-sm"
            aria-label="Previous image"
          >‹</button>
        )}
        {active < total - 1 && (
          <button
            onClick={() => paginate(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full bg-black/30 text-white text-lg backdrop-blur-sm"
            aria-label="Next image"
          >›</button>
        )}

        {/* Counter badge */}
        <div className="absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white backdrop-blur-sm">
          {active + 1} / {total}
        </div>
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5 shrink-0">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive([i, i > active ? 1 : -1])}
              aria-label={`Image ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === active ? "18px" : "6px",
                height: "6px",
                borderRadius: "9999px",
                background: i === active ? accent : "rgba(255,255,255,0.35)",
                boxShadow: i === active ? `0 0 8px ${accent}99` : "none",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Photo Grid ────────────────────────────────────────────────────────────────
// fill=true → ImageSlider (carousel cards, mobile)
// fill=false → static grid (desktop 2-col)
function PhotoGrid({ images, fill = false, accent = "#c9a84c" }: {
  images: MomentImage[];
  fill?: boolean;
  accent?: string;
}) {
  // Carousel / mobile mode: always use ImageSlider for clean UX
  if (fill) {
    return <ImageSlider images={images} accent={accent} />;
  }

  // Desktop grid mode: natural sizes
  const gridCols =
    images.length === 1 ? "grid-cols-1" :
    images.length === 2 ? "grid-cols-2" :
    images.length === 3 ? "grid-cols-3" :
    "grid-cols-2";

  return (
    <div className={`mt-4 grid gap-2 ${gridCols}`}>
      {images.map((img, idx) =>
        images.length === 1 ? (
          <div key={idx} className="overflow-hidden rounded-xl w-full">
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-auto object-contain"
            />
          </div>
        ) : (
          <div key={idx} className="overflow-hidden rounded-xl" style={{ height: "150px" }}>
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover"
              style={{ objectPosition: img.objectPosition ?? "center" }}
            />
          </div>
        )
      )}
    </div>
  );
}

function NoPhotoCard({ icon, accent }: { icon: string; accent: string }) {
  return (
    <div
      className="mt-4 flex h-28 items-center justify-center rounded-xl border border-dashed"
      style={{ borderColor: `${accent}55`, background: `${accent}0d` }}
    >
      <div className="text-center">
        <span className="block text-4xl">{icon}</span>
        <p className="mt-1.5 text-xs" style={{ color: `${accent}88` }}>
          Some moments live only in memory
        </p>
      </div>
    </div>
  );
}

// ── Card inner content — fill=true uses flex-column for carousel (no empty gaps) ──
function CardContent({ m, fill = false }: { m: Moment; fill?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${fill ? "flex flex-col h-full" : ""}`}
      style={{
        background: "rgba(255, 255, 255, 0.10)",
        backdropFilter: "blur(28px) saturate(160%)",
        WebkitBackdropFilter: "blur(28px) saturate(160%)",
        border: `1px solid ${m.accent}55`,
        boxShadow: [
          `0 0 0 1px rgba(255,255,255,0.18) inset`,
          `0 8px 48px ${m.accent}30`,
          `0 2px 0 ${m.accent}40 inset`,
          `0 32px 64px rgba(0,0,0,0.35)`,
        ].join(", "),
      }}
    >
      {/* Shimmer top bar */}
      <div
        className="h-[3px] w-full shrink-0"
        style={{ background: `linear-gradient(90deg, ${m.accent}ee, ${m.accent}55 50%, transparent)` }}
      />
      {/* Catch-light */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-24 w-full rounded-t-2xl"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 60%)" }}
      />

      {/* Content — flex-1 + flex-col in carousel so image area fills the rest */}
      <div
        className={`relative p-4 ${fill ? "flex flex-col flex-1" : ""}`}
        style={fill ? { minHeight: 0 } : {}}
      >
        <div className="flex items-start gap-2.5 shrink-0">
          <span
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border text-sm"
            style={{
              borderColor: `${m.accent}66`,
              background: `${m.accent}22`,
              backdropFilter: "blur(8px)",
              boxShadow: `0 0 12px ${m.accent}44`,
            }}
          >
            {m.icon}
          </span>

          <div className="min-w-0 flex-1">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: `${m.accent}28`,
                color: m.accent,
                border: `1px solid ${m.accent}50`,
                textShadow: `0 0 8px ${m.accent}66`,
              }}
            >
              {m.date}
            </span>
            <h3
              className="mt-1.5 font-display text-lg font-bold leading-tight"
              style={{ color: "rgba(255,255,255,0.95)", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
            >
              {m.title}
            </h3>
            <p
              className="mt-0.5 text-[11px] font-medium"
              style={{ color: m.accent, textShadow: `0 0 10px ${m.accent}66` }}
            >
              {m.subtitle}
            </p>
          </div>
        </div>

        <p className="mt-3 text-[13px] leading-relaxed shrink-0" style={{ color: "rgba(255,255,255,0.75)" }}>
          {m.story}
        </p>

        {/* Image area — when fill=true this is flex-1 and images stretch to cover remaining height */}
        {m.images && m.images.length > 0 ? (
          <PhotoGrid images={m.images} fill={fill} accent={m.accent} />
        ) : (
          <NoPhotoCard icon={m.icon} accent={m.accent} />
        )}
      </div>
    </div>
  );
}

// ── Grid card (md+) ───────────────────────────────────────────────────────────
function ChapterCard({ m, index }: { m: Moment; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 60, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: index * 0.18 }}
    >
      <motion.div
        whileHover={{ y: -5, scale: 1.005 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="h-full"
      >
        <CardContent m={m} />
      </motion.div>
    </motion.li>
  );
}

// ── Mobile carousel ───────────────────────────────────────────────────────────
function MomentCarousel() {
  const [current, setCurrent] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = (el: HTMLDivElement | null) => {
    if (el) setContainerWidth(el.offsetWidth);
  };
  const x = useMotionValue(0);
  const total = MOMENTS.length;

  function goTo(idx: number) {
    const clamped = Math.max(0, Math.min(total - 1, idx));
    setCurrent(clamped);
    animate(x, -(clamped * (containerWidth || window.innerWidth - 32)), {
      type: "spring",
      stiffness: 300,
      damping: 35,
    });
  }

  function onDragEnd(_: unknown, info: { offset: { x: number }; velocity: { x: number } }) {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -500) {
      goTo(current + 1);
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 500) {
      goTo(current - 1);
    } else {
      goTo(current);
    }
  }

  const slideWidth = containerWidth || 300;

  return (
    <div className="mt-14 px-4">
      {/* Viewport */}
      <div className="overflow-hidden rounded-2xl" ref={containerRef}>
        <motion.ul
          className="flex"
          style={{ x, width: `${total * 100}%` }}
          drag="x"
          dragConstraints={{ left: -(total - 1) * slideWidth, right: 0 }}
          dragElastic={0.08}
          onDragEnd={onDragEnd}
        >
          {MOMENTS.map((m) => (
            <li
              key={m.id}
              className="select-none"
              style={{ width: slideWidth, height: "560px", touchAction: "pan-y" }}
            >
              <CardContent m={m} fill />
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Dot indicators */}
      <div className="mt-5 flex items-center justify-center gap-2.5">
        {MOMENTS.map((m, i) => (
          <button
            key={m.id}
            onClick={() => goTo(i)}
            aria-label={`Go to ${m.title}`}
            className="transition-all duration-300"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              borderRadius: "9999px",
              background: i === current ? m.accent : "rgba(255,255,255,0.3)",
              boxShadow: i === current ? `0 0 10px ${m.accent}88` : "none",
            }}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <div className="mt-4 flex justify-center gap-4">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl text-white backdrop-blur-sm transition-opacity disabled:opacity-30"
          aria-label="Previous"
        >
          ‹
        </button>
        <span className="self-center text-xs text-white/50">
          {current + 1} / {total}
        </span>
        <button
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xl text-white backdrop-blur-sm transition-opacity disabled:opacity-30"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function LoveStory() {
  return (
    <section id="story" className="relative overflow-hidden py-24 md:py-32" style={{ background: "#2a1f14" }}>
      {/* Background photo */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})`, opacity: 0.38 }}
      />
      {/* Dark gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />

      {/* Floating bokeh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { w: 300, h: 300, top: "8%", left: "-4%", color: "#e8a0b4" },
          { w: 220, h: 220, top: "55%", right: "-3%", color: "#c9a84c" },
          { w: 250, h: 250, bottom: "4%", left: "28%", color: "#9b7940" },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: orb.w,
              height: orb.h,
              top: (orb as any).top,
              left: (orb as any).left,
              right: (orb as any).right,
              bottom: (orb as any).bottom,
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
              opacity: 0.07,
            }}
            animate={{ scale: [1, 1.12, 1], opacity: [0.07, 0.12, 0.07] }}
            transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <SectionHeading
          dark
          malayalam=""
          title="Our Moments"
          subtitle="Not every chapter has a story — some are just feelings we carry."
        />

        {/* ── Mobile: swipeable carousel ── */}
        <div className="md:hidden">
          <MomentCarousel />
        </div>

        {/* ── md+: two-column grid ── */}
        <ol className="relative mx-auto mt-14 hidden max-w-5xl grid-cols-2 gap-5 px-4 md:grid md:px-6">
          {MOMENTS.map((m, i) => (
            <ChapterCard key={m.id} m={m} index={i} />
          ))}
        </ol>

        {/* End flourish */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-14 flex flex-col items-center gap-2"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          <p className="font-hand text-2xl text-gold">…and the best is yet to come 🌸</p>
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
