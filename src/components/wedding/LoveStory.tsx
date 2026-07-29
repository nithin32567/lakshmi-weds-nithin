import { motion } from "motion/react";

import { SectionHeading } from "./SectionHeading";
import placeholder from "@/assets/gallery-placeholder.svg";

const firstMeeting = placeholder;
const coffeeDate = placeholder;
const proposal = placeholder;

const MOMENTS = [
  {
    img: firstMeeting,
    year: "2019",
    title: "The First Glance",
    malayalam: "ആദ്യ കാഴ്ച",
    text: "A crowded Onam celebration in Fort Kochi, a spilled cup of payasam, and a laugh neither of us could forget.",
    alt: "Nithin and Lakshmi meeting for the first time at an Onam celebration in Fort Kochi",
  },
  {
    img: coffeeDate,
    year: "2021",
    title: "Endless Conversations",
    malayalam: "നീണ്ട സംഭാഷണങ്ങൾ",
    text: "Two years of filter coffee at a tiny Kochi cafe, monsoon walks, and dreams that slowly turned into plans.",
    alt: "Nithin and Lakshmi sharing filter coffee at a small cafe in Kochi",
  },
  {
    img: proposal,
    year: "2025",
    title: "The Question",
    malayalam: "ആ ചോദ്യം",
    text: "On a houseboat drifting through the Alleppey backwaters at sunset, one knee, one ring, one forever yes.",
    alt: "Marriage proposal on a houseboat in the Alleppey backwaters at sunset",
  },
];

export function LoveStory() {
  return (
    <section id="story" className="relative bg-teak-deep py-24 md:py-32">
      <SectionHeading
        dark
        malayalam="ഞങ്ങളുടെ കഥ"
        title="Our Love Story"
        subtitle="Every great love story in Kerala begins with rain, coffee and a little bit of fate."
      />

      <div className="relative mx-auto mt-16 max-w-5xl px-6">
        <div
          aria-hidden
          className="absolute inset-y-0 left-[27px] w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent md:left-1/2"
        />
        <ol className="space-y-16 md:space-y-24">
          {MOMENTS.map((m, i) => (
            <li key={m.title}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex flex-col gap-6 pl-16 md:flex-row md:items-center md:gap-12 md:pl-0 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="absolute left-[20px] top-2 size-4 rounded-full border-2 border-gold bg-teak-deep md:left-1/2 md:-translate-x-1/2"
                />

                <div className="md:w-1/2">
                  <div className="group relative overflow-hidden rounded-2xl gold-hairline">
                    <img
                      src={m.img}
                      alt={m.alt}
                      loading="lazy"
                      className="h-64 w-full object-cover transition-transform duration-[900ms] group-hover:scale-110 md:h-80"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-teak-deep/70 to-transparent"
                    />
                  </div>
                </div>

                <div className={`md:w-1/2 ${i % 2 === 1 ? "md:text-right" : ""}`}>
                  <p className="font-hand text-3xl text-gold">{m.year}</p>
                  <p className="mt-1 font-malayalam text-xs font-bold tracking-[0.24em] text-gold/70">
                    {m.malayalam}
                  </p>
                  <h3 className="mt-2 font-display text-3xl font-semibold text-ivory md:text-4xl">
                    {m.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60 md:text-base">
                    {m.text}
                  </p>
                </div>
              </motion.div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
