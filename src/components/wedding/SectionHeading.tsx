import { motion } from "motion/react";

interface SectionHeadingProps {
  malayalam: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}

function GoldOrnament() {
  return (
    <svg
      viewBox="0 0 180 20"
      className="mx-auto mt-5 h-4 w-44 text-gold"
      fill="none"
      aria-hidden
    >
      <line x1="0" y1="10" x2="66" y2="10" stroke="currentColor" strokeOpacity="0.5" />
      <line x1="114" y1="10" x2="180" y2="10" stroke="currentColor" strokeOpacity="0.5" />
      <circle cx="74" cy="10" r="2" fill="currentColor" fillOpacity="0.6" />
      <circle cx="106" cy="10" r="2" fill="currentColor" fillOpacity="0.6" />
      <path
        d="M90 3 L97 10 L90 17 L83 10 Z"
        stroke="currentColor"
        strokeWidth="1.4"
        fill="currentColor"
        fillOpacity="0.18"
      />
      <circle cx="90" cy="10" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function SectionHeading({ malayalam, title, subtitle, dark = false }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-3xl px-6 text-center"
    >
      <p className="font-malayalam text-sm font-bold tracking-[0.28em] text-gold md:text-base">
        {malayalam}
      </p>
      <h2
        className={`mt-3 text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl ${
          dark ? "text-ivory" : "text-teak"
        }`}
      >
        {title}
      </h2>
      <GoldOrnament />
      {subtitle && (
        <p
          className={`mt-5 text-base leading-relaxed md:text-lg ${
            dark ? "text-ivory/65" : "text-muted-foreground"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
