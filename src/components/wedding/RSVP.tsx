import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { Heart } from "lucide-react";

import { SectionHeading } from "./SectionHeading";

interface Wish {
  id: string;
  name: string;
  message: string;
}

const STORAGE_KEY = "nl-wedding-wishes";

const SEED: Wish[] = [];

function Hearts() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 0, x: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0], y: -180 - i * 12, x: (i % 2 ? 1 : -1) * (20 + i * 6), scale: 1.1 }}
          transition={{ duration: 2 + i * 0.08, ease: "easeOut" }}
          className="absolute bottom-8 left-1/2 text-gold"
        >
          <Heart className="size-4 fill-current" />
        </motion.span>
      ))}
    </div>
  );
}

export function RSVP() {
  const [wishes, setWishes] = useState<Wish[]>(SEED);
  const [celebrate, setCelebrate] = useState(false);
  const [form, setForm] = useState({ name: "", message: "" });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setWishes([...(JSON.parse(raw) as Wish[]), ...SEED]);
    } catch {
      /* ignore */
    }
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const wish: Wish = {
      id: `${Date.now()}`,
      name: form.name.trim(),
      message: form.message.trim() || "Wishing you both a beautiful beginning!",
    };
    const next = [wish, ...wishes];
    setWishes(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next.filter((w) => !w.id.startsWith("seed"))));
    } catch {
      /* ignore */
    }
    setForm({ name: "", message: "" });
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2600);
  };

  const field =
    "w-full rounded-xl border border-gold/30 bg-ivory/5 px-4 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors focus:border-gold";

  return (
    <section id="blessings" className="relative overflow-hidden bg-teak py-24 md:py-32">
      <SectionHeading
        dark
        malayalam="ആശംസകൾ"
        title="Send Blessings"
        subtitle="Leave a blessing on our wishes wall."
      />

      <div className="mx-auto mt-14 grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="glass-dark relative rounded-3xl p-7 md:p-9"
        >
          <AnimatePresence>{celebrate && <Hearts />}</AnimatePresence>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="blessings-name" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-ivory/55">
                Your name
              </label>
              <input
                id="blessings-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ananya Menon"
                className={field}
              />
            </div>

            <div>
              <label htmlFor="blessings-message" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-ivory/55">
                A wish for the couple
              </label>
              <textarea
                id="blessings-message"
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="May your life together be as sweet as ada pradhaman…"
                className={`${field} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-gold px-8 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-teak-deep transition-transform duration-300 hover:scale-[1.02]"
            >
              Send Blessing
            </button>
            <p aria-live="polite" className="min-h-5 text-center text-xs text-gold">
              {celebrate ? "Thank you — your blessing is on the wall! ❤️" : ""}
            </p>
          </form>
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {wishes.slice(0, 6).map((w) => (
              <motion.article
                key={w.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-gold/20 bg-teak-light/40 p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-ivory">{w.name}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{w.message}</p>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
