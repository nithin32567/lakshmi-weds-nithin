import { motion } from "motion/react";

import { SectionHeading } from "./SectionHeading";
import placeholder from "@/assets/fixing.jpeg";

const sadyaSpread = placeholder;

const COURSES = [
  {
    group: "Upperi & Pickles",
    malayalam: "ഉപ്പേരി",
    items: ["Kaya varuthathu", "Sarkara upperi", "Inji puli", "Naranga achar", "Manga achar"],
  },
  {
    group: "Thoran & Mezhukkupuratti",
    malayalam: "തോരൻ",
    items: ["Cabbage thoran", "Beans mezhukkupuratti", "Beetroot pachadi", "Kichadi", "Olan"],
  },
  {
    group: "The Mains",
    malayalam: "പ്രധാന വിഭവങ്ങൾ",
    items: ["Matta rice", "Parippu curry & ghee", "Sambar", "Avial", "Kaalan", "Rasam", "Pulissery"],
  },
  {
    group: "Payasam",
    malayalam: "പായസം",
    items: ["Ada pradhaman", "Palada payasam", "Semiya payasam", "Pappadam & banana"],
  },
];

export function SadyaMenu() {
  return (
    <section id="sadya" className="relative overflow-hidden bg-teak-deep py-24 md:py-32">
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(80% 50% at 50% 0%, color-mix(in oklab, var(--sage) 45%, transparent), transparent 70%)",
        }}
      />
      <div className="relative">
        <SectionHeading
          dark
          malayalam="സദ്യ"
          title="The Wedding Sadya"
          subtitle="Twenty-six dishes, one banana leaf, and a tradition served with both hands."
        />

        <div className="mx-auto mt-14 grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-3xl gold-hairline"
          >
            <img
              src={sadyaSpread}
              alt="Traditional Kerala sadya feast served on a banana leaf with rice, curries and payasam"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {COURSES.map((c, i) => (
              <motion.div
                key={c.group}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="glass-dark rounded-2xl p-6"
              >
                <p className="font-malayalam text-xs font-bold tracking-[0.22em] text-gold">
                  {c.malayalam}
                </p>
                <h3 className="mt-1.5 font-display text-2xl font-semibold text-ivory">{c.group}</h3>
                <ul className="mt-4 space-y-2">
                  {c.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-ivory/65">
                      <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
