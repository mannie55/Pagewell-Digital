import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { SectionSeam } from "@/components/sections/section-seam";
import { ServicesSection } from "@/components/sections/services-section";
import { SocialProofSection } from "@/components/sections/social-proof-section";
import { TeamSection } from "@/components/sections/team-section";
import { WorkSection } from "@/components/sections/work-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <SocialProofSection />
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
