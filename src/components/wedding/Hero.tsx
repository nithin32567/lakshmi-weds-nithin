import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Countdown } from "./Countdown";
import { Nilavilakku } from "./Nilavilakku";
import { ParticleField } from "./ParticleField";

export function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-teak-deep"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 10%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 60%), radial-gradient(100% 70% at 50% 110%, color-mix(in oklab, var(--sage) 18%, transparent), transparent 65%)",
        }}
      />
      <ParticleField density={80} />

      <motion.div style={{ y, opacity }} className="relative z-10 w-full px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 w-16 sm:w-20"
        >
          <Nilavilakku className="mx-auto h-auto w-full animate-float-y" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-malayalam text-sm font-bold tracking-[0.3em] text-gold sm:text-base"
        >
          സ്നേഹപൂർവ്വം സ്വാഗതം
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-display text-6xl font-semibold leading-[0.95] sm:text-8xl lg:text-[10rem]"
        >
          <span className="text-gold-shine">Nithin</span>
          <span className="mx-3 font-hand text-4xl text-gold/70 sm:mx-6 sm:text-6xl">&amp;</span>
          <span className="text-gold-shine">Lakshmi</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="mx-auto mt-6 max-w-xl text-sm uppercase tracking-[0.35em] text-ivory/65 sm:text-base"
        >
          12 · September · 2026 — Chalakkudi, Kerala

        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-12"
        >
          <Countdown />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#rsvp"
            className="rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-[0.18em] text-teak-deep transition-transform duration-300 hover:scale-105"
          >
            RSVP
          </a>
          <a
            href="#events"
            className="rounded-full border border-gold/60 px-8 py-3 text-sm font-medium uppercase tracking-[0.18em] text-gold transition-colors duration-300 hover:bg-gold/10"
          >
            View Events
          </a>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center">
        <div className="mx-auto h-12 w-px animate-glow-pulse bg-gradient-to-b from-transparent to-gold" />
      </div>
    </section>
  );
}
