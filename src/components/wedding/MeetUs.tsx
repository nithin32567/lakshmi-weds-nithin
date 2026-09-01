import { motion } from "motion/react";
import { ParticleField } from "./ParticleField";


export function MeetUs() {
  return (
    <section id="meet-us" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-teak-deep py-24">
      {/* Background gradients similar to Hero */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(100% 70% at 50% 10%, color-mix(in oklab, var(--sage) 18%, transparent), transparent 65%), radial-gradient(120% 80% at 50% 110%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 60%)",
        }}
      />

      <ParticleField density={80} />

      <div className="relative z-10 w-full max-w-6xl px-6 md:px-12">
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold/70 mb-4"
          >
            The Happy Couple
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-ivory"
          >
            Meet Us
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center mt-6"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
            <div className="mx-4 text-gold text-lg">❦</div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12 lg:gap-24">
          {/* Groom Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Circle */}
            <div className="relative flex items-center justify-center w-56 h-56 md:w-64 md:h-64 rounded-full border border-gold/30 mb-8" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--gold) 15%, transparent) 0%, transparent 70%)" }}>
              <span className="font-hand text-7xl md:text-8xl text-gold-shine">N</span>
              <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-gold/10 mix-blend-screen" />
              <div className="absolute -bottom-4 -right-2 w-8 h-8 rounded-full bg-gold/15 mix-blend-screen" />
            </div>

            <h3 className="font-hand text-5xl md:text-6xl text-gold mb-3">Nithin</h3>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-ivory/70 mb-10">The Groom</p>

            {/* Detail Box */}
            <div className="w-full rounded-xl border border-gold/10 bg-[#211a17]/60 p-8 md:p-10 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-widest text-gold/60 mb-4">Son of</p>
              <p className="font-display text-2xl text-ivory mb-8">Mr. Prathapan &amp; Manju Prathapan</p>
              <div className="text-sm tracking-wide text-ivory/50 space-y-1.5 font-light">
                <p>Pulikkarayil House, Elamgulam</p>
                <p>Kottayam, Kerala</p>
              </div>
            </div>
          </motion.div>

          {/* Bride Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            {/* Circle */}
            <div className="relative flex items-center justify-center w-56 h-56 md:w-64 md:h-64 rounded-full border border-[#e47d8b]/30 mb-8" style={{ background: "radial-gradient(circle, color-mix(in oklab, #e47d8b 15%, transparent) 0%, transparent 70%)" }}>
              <span className="font-hand text-7xl md:text-8xl text-[#e47d8b]" style={{ textShadow: "0 0 20px rgba(228,125,139,0.3)" }}>L</span>
              <div className="absolute -top-4 -right-6 w-12 h-12 rounded-full bg-[#e47d8b]/10 mix-blend-screen" />
              <div className="absolute -bottom-2 -left-4 w-8 h-8 rounded-full bg-[#e47d8b]/15 mix-blend-screen" />
            </div>

            <h3 className="font-hand text-5xl md:text-6xl text-[#e47d8b] mb-3">Lakshmi</h3>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-ivory/70 mb-10">The Bride</p>

            {/* Detail Box */}
            <div className="w-full rounded-xl border border-[#e47d8b]/10 bg-[#211a17]/60 p-8 md:p-10 backdrop-blur-sm">
              <p className="text-[11px] uppercase tracking-widest text-[#e47d8b]/60 mb-4">Daughter of</p>
              <p className="font-display text-2xl text-ivory mb-8">Mr. Santhosh &amp; Rema Santhosh</p>
              <div className="text-sm tracking-wide text-ivory/50 space-y-1.5 font-light">
                <p>Kizhakkudan House, Vellanchira</p>
                <p>Thrissur, Kerala</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
