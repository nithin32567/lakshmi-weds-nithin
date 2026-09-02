import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { Heart } from "lucide-react";

import { SectionHeading } from "./SectionHeading";
import bgImage from "../../assets/rsvpbg.webp";

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
    "w-full rounded-xl border border-gold/30 bg-black/20 backdrop-blur-md px-4 py-3 text-sm text-ivory placeholder:text-ivory/45 outline-none transition-all focus:border-gold focus:bg-black/30 focus:shadow-[0_0_15px_rgba(223,190,106,0.2)]";

  return (
    <section id="blessings" className="relative overflow-hidden bg-teak py-24 md:py-32">
      {/* Background photo */}
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})`, opacity: 0.75 }}
      />
      {/* Overlay to ensure text legibility while allowing background to shine */}
      <div className="pointer-events-none absolute inset-0 bg-teak/30" />
      {/* Subtle vignette for depth */}
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient from-transparent to-black/40" />

      <div className="relative z-10">
        <SectionHeading
          dark
          malayalam=""
          title="Send Blessings"
          subtitle="Leave a blessing on our wishes wall."
        />

        <div className="mx-auto mt-14 grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl p-7 md:p-9"
          style={{
            background: "rgba(42, 31, 20, 0.4)",
            backdropFilter: "blur(28px) saturate(160%)",
            WebkitBackdropFilter: "blur(28px) saturate(160%)",
            border: "1px solid rgba(223, 190, 106, 0.35)", // gold border
            boxShadow: "0 0 0 1px rgba(255,255,255,0.1) inset, 0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          {/* Catch-light for liquid glass effect */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-32 w-full rounded-t-3xl"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)" }}
          />
          <AnimatePresence>{celebrate && <Hearts />}</AnimatePresence>
          <form onSubmit={submit} className="relative z-10 space-y-4">
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
                className="relative overflow-hidden rounded-2xl p-6"
                style={{
                  background: "rgba(42, 31, 20, 0.35)",
                  backdropFilter: "blur(16px) saturate(150%)",
                  WebkitBackdropFilter: "blur(16px) saturate(150%)",
                  border: "1px solid rgba(223, 190, 106, 0.25)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                }}
              >
                {/* Catch-light */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-0 h-16 w-full rounded-t-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 80%)" }}
                />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold text-ivory">{w.name}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/65">{w.message}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </section>
  );
}
