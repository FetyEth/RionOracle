import { ReceiptProver } from "@/components/receipt-prover";
import { WhyRion } from "@/components/why-rion";
import { SDKQuickstart } from "@/components/sdk-quickstart";
import { HowItWorks } from "@/components/how-it-works";
import { ComparisonSection } from "@/components/comparison";
import { Gamification } from "@/components/gamification";
import { CTASection } from "@/components/cta-section";
import { Integrations } from "@/components/integrations";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { PillarSections } from "@/components/pillar-sections";
import { SectionDivider } from "@/components/section-divider";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PredictionsShowcase } from "@/components/predictions-showcase";
import HeroMultiPillar from "@/components/hero-multi-pillar";
import { LivePricesSection } from "@/components/live-feeds";
import WhyRionStoryboard from "@/components/features";
import Playground from "@/components/playground";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <Navigation />
      <HeroMultiPillar />

      {/* <ScrollReveal>
        <ReceiptProver />
      </ScrollReveal> */}

      <WhyRion />

      <PredictionsShowcase />

      <PillarSections />

      <SDKQuickstart />
      <LivePricesSection />

      <WhyRionStoryboard />

      <HowItWorks />

      <ComparisonSection />

      <Playground />

      <CTASection />

      <Integrations />

      <Footer />
    </div>
  );
}
