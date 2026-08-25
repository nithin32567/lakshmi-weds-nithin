import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { SectionHeading } from "./SectionHeading";
import placeholder from "@/assets/fixing.jpeg";
import Masonry from "./Masonry";

const backwaters = placeholder;
const bride = placeholder;
const elephant = placeholder;
const groom = placeholder;
const hands = placeholder;
const lamps = placeholder;

const PHOTOS = [
  { src: bride, alt: "Lakshmi in a traditional kasavu saree with temple jewellery", height: 800 },
  { src: lamps, alt: "Rows of lit brass nilavilakku lamps at dusk", height: 400 },
  { src: hands, alt: "Henna-adorned hands exchanging garlands", height: 600 },
  { src: backwaters, alt: "Kerala backwaters at golden hour with a houseboat", height: 500 },
  { src: groom, alt: "Nithin in a traditional mundu and gold-bordered shawl", height: 900 },
  { src: elephant, alt: "Caparisoned temple elephant during a Kerala festival procession", height: 550 },
];

const masonryItems = PHOTOS.map((p, i) => ({
  id: String(i),
  img: p.src,
  height: p.height,
  alt: p.alt
}));

export function Gallery() {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % PHOTOS.length)), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + PHOTOS.length) % PHOTOS.length)),
    [],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, next, prev]);

  return (
    <section id="gallery" className="bg-ivory py-24 md:py-32">
      <SectionHeading
        malayalam="ഓർമ്മകൾ"
        title="Moments & Memories"
        subtitle="Glimpses of the land, the light and the love that shaped this celebration."
      />

      <div className="mx-auto mt-14 max-w-6xl px-6 h-[600px] sm:h-[800px] md:h-[1000px] w-full">
        <Masonry
          items={masonryItems}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={0.95}
          blurToFocus={true}
          colorShiftOnHover={false}
          onItemClick={(item, index) => setIndex(index)}
        />
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="fixed inset-0 z-[120] flex items-center justify-center bg-teak-deep/95 p-4 backdrop-blur-md"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close photo viewer"
              className="absolute right-5 top-5 rounded-full border border-gold/40 p-2 text-gold"
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 rounded-full border border-gold/40 p-2 text-gold md:left-8"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 rounded-full border border-gold/40 p-2 text-gold md:right-8"
            >
              <ChevronRight className="size-6" />
            </button>
            <motion.figure
              key={index}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-4xl"
            >
              <img
                src={PHOTOS[index].src}
                alt={PHOTOS[index].alt}
                className="max-h-[75vh] w-auto rounded-xl object-contain"
              />
              <figcaption className="mt-4 text-center text-sm text-ivory/60">
                {PHOTOS[index].alt}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
