import { motion } from "motion/react";

export function InvitationCard() {
  return (
    <section id="invitation" className="relative overflow-hidden bg-ivory py-24 md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, var(--gold) 0 1px, transparent 1px 14px)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 50, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="card-parchment relative mx-auto max-w-2xl rounded-lg px-8 py-14 text-center md:px-16 md:py-20"
      >
        <p className="font-malayalam text-xs font-bold tracking-[0.3em] text-gold md:text-sm">
          വിവാഹ ക്ഷണം
        </p>
        <p className="mt-8 text-sm leading-relaxed text-muted-foreground md:text-base">
          With the blessings of the Almighty and our families,
          <br />
          Mr. &amp; Mrs. Ramesh Menon and Mr. &amp; Mrs. Suresh Nair
          <br />
          joyfully invite you to the wedding of their children
        </p>

        <h2 className="mt-8 font-display text-5xl font-semibold text-teak md:text-6xl">
          Nithin Menon
        </h2>
        <p className="my-3 font-hand text-3xl text-gold">weds</p>
        <h2 className="font-display text-5xl font-semibold text-teak md:text-6xl">Lakshmi Nair</h2>

        <div className="mx-auto my-10 h-px w-40 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <p className="text-sm uppercase tracking-[0.28em] text-teak/70 md:text-base">
          Saturday, 12 September 2026
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Muhoortham 10:30 AM · Kalyana Mandapam, Kochi
        </p>
        <p className="mt-8 font-hand text-2xl text-sage">
          Your presence is the greatest blessing of all
        </p>
      </motion.div>
    </section>
  );
}
