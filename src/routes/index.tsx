import { createFileRoute } from "@tanstack/react-router";

import { EnvelopeIntro } from "@/components/wedding/EnvelopeIntro";
import { SmoothScroll } from "@/components/wedding/SmoothScroll";
import { ParticleField } from "@/components/wedding/ParticleField";
import { CustomCursor } from "@/components/wedding/CustomCursor";
import { Footer } from "@/components/wedding/Footer";
import { Gallery } from "@/components/wedding/Gallery";
import { Hero } from "@/components/wedding/Hero";
import { InvitationCard } from "@/components/wedding/InvitationCard";
import { LoveStory } from "@/components/wedding/LoveStory";
import { MeetUs } from "@/components/wedding/MeetUs";
import { Navbar } from "@/components/wedding/Navbar";
import { RSVP } from "@/components/wedding/RSVP";
import { VenueMap } from "@/components/wedding/VenueMap";

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

function Index() {
  return (
    <EnvelopeIntro>
      <SmoothScroll>
        <CustomCursor />
        <Navbar />
        <Hero />
        <MeetUs />
        <ParticleField density={80} />
        <InvitationCard />
        <LoveStory />
        <Gallery />
        <VenueMap />
        <RSVP />
        <Footer />
      </SmoothScroll>
    </EnvelopeIntro>
  );
}
