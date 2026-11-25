import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import type { Metadata } from "next";
import { ProblemSection } from "@/components/sections/problem-section";
import { ProcessSection } from "@/components/sections/process-section";
import { SectionSeam } from "@/components/sections/section-seam";
import { ServicesSection } from "@/components/sections/services-section";
import { SocialProofSection } from "@/components/sections/social-proof-section";
import { TeamSection } from "@/components/sections/team-section";
import { WorkSection } from "@/components/sections/work-section";

// The layout's default title is just the brand; the homepage carries the main search terms.
export const metadata: Metadata = {
  title: {
    absolute: "Website Design & SEO Agency, UK and Nigeria | Pagewell Digital",
  },
};

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SocialProofSection />
      <ProblemSection />
      <ServicesSection />
      <SectionSeam />
      <WorkSection />
      <AboutSection />
      <ProcessSection />
      <TeamSection />
      <FaqSection />
      <ContactSection />
    </main>
  );
}
