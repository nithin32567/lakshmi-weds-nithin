import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { SmoothScroll } from "@/components/wedding/SmoothScroll";
import { EnvelopeIntro } from "@/components/wedding/EnvelopeIntro";

const CustomCursor = lazy(() => import("@/components/wedding/CustomCursor").then((m) => ({ default: m.CustomCursor })));
const Footer = lazy(() => import("@/components/wedding/Footer").then((m) => ({ default: m.Footer })));
const Gallery = lazy(() => import("@/components/wedding/Gallery").then((m) => ({ default: m.Gallery })));
const Hero = lazy(() => import("@/components/wedding/Hero").then((m) => ({ default: m.Hero })));
const InvitationCard = lazy(() => import("@/components/wedding/InvitationCard").then((m) => ({ default: m.InvitationCard })));
const LoveStory = lazy(() => import("@/components/wedding/LoveStory").then((m) => ({ default: m.LoveStory })));
const Navbar = lazy(() => import("@/components/wedding/Navbar").then((m) => ({ default: m.Navbar })));
const RSVP = lazy(() => import("@/components/wedding/RSVP").then((m) => ({ default: m.RSVP })));

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "Nithin & Lakshmi — Kerala Wedding · 12 September 2026" },
      {
        name: "description",
        content:
          "സ്നേഹപൂർവ്വം സ്വാഗതം. Join Nithin & Lakshmi for a traditional Kerala wedding in Kochi on 12 September 2026 — muhoortham, sadya, gallery and RSVP.",
      },
      { property: "og:title", content: "Nithin & Lakshmi — Kerala Wedding · 12 September 2026" },
      {
        property: "og:description",
        content:
          "സ്നേഹപൂർവ്വം സ്വാഗതം. Join Nithin & Lakshmi for a traditional Kerala wedding in Kochi on 12 September 2026 — muhoortham, sadya, gallery and RSVP.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

export function Index() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  return (
    <>
      {/* Sealed wax-seal envelope intro — gate before the site */}
      {!envelopeOpened && (
        <EnvelopeIntro onComplete={() => setEnvelopeOpened(true)} />
      )}

      {/* Main website — fades in with a soft scale after envelope is dismissed */}
      <AnimatePresence>
        {envelopeOpened && (
          <motion.div
            key="site-content"
            initial={{ opacity: 0, scale: 1.018 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Suspense fallback={null}>
              <SmoothScroll>
                <CustomCursor />
                <Navbar />
                <Hero />
                <InvitationCard />
                <LoveStory />
                <Gallery />
                <RSVP />
                <Footer />
              </SmoothScroll>
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
