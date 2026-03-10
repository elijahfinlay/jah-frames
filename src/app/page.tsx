import { HeroSection } from "@/components/landing/hero-section";
import { ToolsShowcase } from "@/components/landing/tools-showcase";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { UseCases } from "@/components/landing/use-cases";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ToolsShowcase />
      <FeaturesGrid />
      <HowItWorks />
      <ComparisonTable />
      <UseCases />
      <FaqSection />
      <CtaSection />
    </>
  );
}
