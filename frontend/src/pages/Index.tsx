import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SocialProof from "@/components/SocialProof";
import BentoGrid from "@/components/BentoGrid";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <SocialProof />
        <BentoGrid />
        <PricingSection />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
