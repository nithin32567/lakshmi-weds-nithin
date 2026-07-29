import { useEffect, useState } from "react";

const TARGET = new Date("2026-09-12T10:30:00+05:30").getTime();

function diff() {
  const d = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

const LABELS: Record<string, string> = {
  days: "Days",
  hours: "Hours",
  minutes: "Minutes",
  seconds: "Seconds",
};

export function Countdown() {
  const [t, setT] = useState(() => diff());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="flex items-stretch justify-center gap-2 sm:gap-4"
      role="timer"
      aria-label="Countdown to the wedding day"
    >
      {(Object.keys(LABELS) as Array<keyof typeof t>).map((key) => (
        <div
          key={key}
          className="glass-dark min-w-[70px] rounded-2xl px-3 py-3 text-center sm:min-w-[92px] sm:px-5 sm:py-4"
        >
          <div className="font-display text-3xl font-semibold tabular-nums text-gold sm:text-5xl">
            {mounted ? String(t[key]).padStart(2, "0") : "--"}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-ivory/55 sm:text-xs">
            {LABELS[key]}
          </div>
        </div>
      ))}
    </div>
  );
}
