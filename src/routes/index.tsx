import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { SmoothScroll } from "@/components/wedding/SmoothScroll";

const CustomCursor = lazy(() => import("@/components/wedding/CustomCursor").then((m) => ({ default: m.CustomCursor })));
const DigitalPass = lazy(() => import("@/components/wedding/DigitalPass").then((m) => ({ default: m.DigitalPass })));
const Events = lazy(() => import("@/components/wedding/Events").then((m) => ({ default: m.Events })));
const Footer = lazy(() => import("@/components/wedding/Footer").then((m) => ({ default: m.Footer })));
const Gallery = lazy(() => import("@/components/wedding/Gallery").then((m) => ({ default: m.Gallery })));
const Hero = lazy(() => import("@/components/wedding/Hero").then((m) => ({ default: m.Hero })));
const InvitationCard = lazy(() => import("@/components/wedding/InvitationCard").then((m) => ({ default: m.InvitationCard })));
const LoveStory = lazy(() => import("@/components/wedding/LoveStory").then((m) => ({ default: m.LoveStory })));
const Navbar = lazy(() => import("@/components/wedding/Navbar").then((m) => ({ default: m.Navbar })));
const RSVP = lazy(() => import("@/components/wedding/RSVP").then((m) => ({ default: m.RSVP })));
const SadyaMenu = lazy(() => import("@/components/wedding/SadyaMenu").then((m) => ({ default: m.SadyaMenu })));

export const Route = createFileRoute("/")({
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
  return (
    <Suspense fallback={null}>
      <SmoothScroll>
        <CustomCursor />
        <Navbar />
        <Hero />
        <InvitationCard />
        <LoveStory />
        <Events />
        <SadyaMenu />
        <Gallery />
        <DigitalPass />
        <RSVP />
        <Footer />
      </SmoothScroll>
    </Suspense>
  );
}
