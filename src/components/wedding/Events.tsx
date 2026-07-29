import { motion } from "motion/react";
import { CalendarDays, Clock, MapPin, Sun } from "lucide-react";

import { SectionHeading } from "./SectionHeading";

const EVENTS = [
  {
    malayalam: "മെഹന്ദി",
    title: "Mehendi & Sangeet",
    date: "Thursday, 10 September 2026",
    time: "5:00 PM onwards",
    venue: "Tharavadu Courtyard, Thrippunithura",
    note: "Henna, chenda melam and an evening of music under the lamps.",
  },
  {
    malayalam: "മുഹൂർത്തം",
    title: "The Muhoortham",
    date: "Saturday, 12 September 2026",
    time: "10:30 AM (auspicious hour)",
    venue: "Kalyana Mandapam, Kochi",
    note: "The thali is tied as the conch sounds. Please be seated by 10:00 AM.",
  },
  {
    malayalam: "സദ്യ",
    title: "Wedding Sadya",
    date: "Saturday, 12 September 2026",
    time: "12:30 PM",
    venue: "Banquet Hall, Kalyana Mandapam",
    note: "A 26-dish feast served on a banana leaf, the way it has always been.",
  },
  {
    malayalam: "സ്വീകരണം",
    title: "Reception",
    date: "Sunday, 13 September 2026",
    time: "7:00 PM",
    venue: "Backwater Lawns, Kumarakom",
    note: "Sunset by the water, live music and a night of celebration.",
  },
];

export function Events() {
  return (
    <section id="events" className="relative bg-ivory py-24 md:py-32">
      <SectionHeading
        malayalam="ചടങ്ങുകൾ"
        title="Wedding Events"
        subtitle="Three days of rituals, feasting and family — we would love to have you at each one."
      />

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 px-6 md:grid-cols-2">
        {EVENTS.map((e, i) => (
          <motion.article
            key={e.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="glass-light group rounded-3xl p-7 transition-transform duration-500 hover:-translate-y-1.5"
          >
            <p className="font-malayalam text-xs font-bold tracking-[0.24em] text-gold">
              {e.malayalam}
            </p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-teak">{e.title}</h3>
            <dl className="mt-5 space-y-2.5 text-sm text-teak/75">
              <div className="flex items-center gap-3">
                <CalendarDays className="size-4 shrink-0 text-gold" aria-hidden />
                <dd>{e.date}</dd>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="size-4 shrink-0 text-gold" aria-hidden />
                <dd>{e.time}</dd>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="size-4 shrink-0 text-gold" aria-hidden />
                <dd>{e.venue}</dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-gold/25 pt-4 text-sm italic leading-relaxed text-muted-foreground">
              {e.note}
            </p>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto mt-8 flex max-w-5xl items-center gap-4 rounded-3xl bg-sage/10 px-6 py-5 md:px-8"
      >
        <Sun className="size-8 shrink-0 text-gold" aria-hidden />
        <p className="text-sm leading-relaxed text-teak/80">
          <span className="font-semibold">September in Kochi</span> — warm and humid, around 25–30°C
          with passing monsoon showers. Light cottons, kasavu and an umbrella are your best friends.
        </p>
      </motion.div>
    </section>
  );
}
