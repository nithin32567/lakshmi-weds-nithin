import { motion } from "motion/react";
import { MapPin, Navigation, Clock, Phone } from "lucide-react";

import { SectionHeading } from "./SectionHeading";

export function VenueMap() {
  return (
    <section id="venue" className="relative overflow-hidden bg-teak-deep py-24 md:py-32">
      {/* Warm ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 40% at 50% 30%, rgba(197,160,89,0.12), transparent 70%)",
        }}
      />

      {/* Top ornamental border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(197,160,89,0.6) 30%, rgba(197,160,89,0.6) 70%, transparent)",
        }}
      />

      <SectionHeading
        malayalam=""
        title="Venue"
        subtitle="Sri Chathan Master Memorial Community Hall, V.R. Puram, Chalakudy — where we say our vows."
        dark
      />

      <div className="mx-auto mt-14 max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl"
          style={{
            boxShadow:
              "0 40px 100px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(197,160,89,0.25)",
          }}
        >
          {/* Info strip above the map */}
          <div
            className="grid grid-cols-1 gap-0 sm:grid-cols-3"
            style={{
              background:
                "linear-gradient(135deg, rgba(38,30,27,0.98) 0%, rgba(49,37,32,0.98) 100%)",
              borderBottom: "1px solid rgba(197,160,89,0.22)",
            }}
          >
            {/* Venue Name */}
            <div className="flex items-start gap-3 border-b border-white/5 px-6 py-5 sm:border-b-0 sm:border-r">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gold/70">
                  Auditorium
                </p>
                <p className="mt-1 font-display text-sm leading-snug text-ivory">
                  Sri Chathan Master Memorial Community Hall
                </p>
                <p className="mt-0.5 text-xs text-ivory/50">V.R. Puram, Chalakudy</p>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-3 border-b border-white/5 px-6 py-5 sm:border-b-0 sm:border-r">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gold/70">
                  Ceremony
                </p>
                <p className="mt-1 font-display text-sm leading-snug text-ivory">
                  12 September 2026
                </p>
                <p className="mt-0.5 text-xs text-ivory/50">11:00 AM – 12:00 PM</p>
              </div>
            </div>

            {/* Directions CTA */}
            <div className="flex items-start gap-3 px-6 py-5">
              <Navigation className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <div className="flex-1">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gold/70">
                  Directions
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ivory/60">
                  Near Chalakudy town, easily accessible via NH 544.
                </p>
                <a
                  href="https://maps.google.com/?q=Sri+Chathan+Master+Memorial+Community+Hall,+V.R.Puram,+Chalakudy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold transition-all duration-200 hover:border-gold hover:bg-gold/10"
                >
                  Open in Maps ↗
                </a>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
            {/* Thin gold inner frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                boxShadow: "inset 0 0 0 1px rgba(197,160,89,0.15)",
              }}
            />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.4007653498247!2d76.3184395!3d10.3097765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0802626ccb0f87%3A0x7b0c746b787a0b97!2sSri%20Chathan%20Master%20Memorial%20Community%20Hall%2C%20V.R.Puram%2C%20Chalakudy!5e0!3m2!1sen!2sin!4v1788008201983!5m2!1sen!2sin"
              title="Sri Chathan Master Memorial Community Hall — Wedding Venue"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </motion.div>

        {/* Subtle footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-center text-xs text-ivory/35"
        >
          ✦ &nbsp; Parking available on the premises &nbsp; ✦ &nbsp; Please arrive 15 minutes early &nbsp; ✦
        </motion.p>
      </div>

      {/* Bottom ornamental border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(197,160,89,0.6) 30%, rgba(197,160,89,0.6) 70%, transparent)",
        }}
      />
    </section>
  );
}
