import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";

import { SectionHeading } from "./SectionHeading";

const MAPS_URL = "https://maps.google.com/?q=Kalyana+Mandapam+Kochi+Kerala";

export function DigitalPass() {
  return (
    <section id="pass" className="relative overflow-hidden bg-teak-deep py-24 md:py-32">
      <SectionHeading
        dark
        malayalam="ഡിജിറ്റൽ പാസ്"
        title="Your Digital Pass"
        subtitle="Save this to your phone — scan at the venue gate for directions and seating."
      />

      <motion.div
        initial={{ opacity: 0, y: 50, rotateY: -12 }}
        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="glass-dark mx-auto mt-14 flex max-w-3xl flex-col items-center gap-8 rounded-3xl p-8 md:flex-row md:p-10"
      >
        <div className="rounded-2xl bg-ivory p-4">
          <QRCodeSVG
            value={MAPS_URL}
            size={148}
            bgColor="#F7F4EC"
            fgColor="#261E1B"
            level="M"
            aria-label="QR code linking to the wedding venue location on the map"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <p className="font-malayalam text-xs font-bold tracking-[0.24em] text-gold">
            നിത്തിൻ &amp; ലക്ഷ്മി
          </p>
          <h3 className="mt-2 font-display text-4xl font-semibold text-ivory">Wedding Pass</h3>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-left text-sm">
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ivory/45">Date</dt>
              <dd className="mt-1 text-ivory/85">12 Sep 2026</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ivory/45">Muhoortham</dt>
              <dd className="mt-1 text-ivory/85">10:30 AM</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ivory/45">Venue</dt>
              <dd className="mt-1 text-ivory/85">Kalyana Mandapam</dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-[0.2em] text-ivory/45">City</dt>
              <dd className="mt-1 text-ivory/85">Kochi, Kerala</dd>
            </div>
          </dl>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-7 inline-block rounded-full bg-gold px-7 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-teak-deep transition-transform duration-300 hover:scale-105"
          >
            Get Directions
          </a>
        </div>
      </motion.div>
    </section>
  );
}
