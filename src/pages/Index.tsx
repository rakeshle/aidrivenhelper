
import { useAuth } from '@/contexts/AuthContext';
import HeroSection from '@/components/home/HeroSection';
import WelcomeCard from '@/components/home/WelcomeCard';
import Statistics from '@/components/Statistics';
import MaterialsSection from '@/components/home/MaterialsSection';
import FeatureShowcase from '@/components/FeatureShowcase';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col space-y-10">
      {/* Hero Section */}
      <HeroSection />

      {/* Welcome Card - Conditionally rendered when user is logged in */}
      <WelcomeCard />

      {/* Statistics Section with enhanced styling */}
      <section className="container mx-auto px-4">
        <Statistics />
      </section>

      {/* Learning Materials Exchange Section */}
      <MaterialsSection />

      {/* Feature Showcase Section */}
      <FeatureShowcase />

      {/* FAQ Section */}
      <FAQ />

      {/* Testimonials Section with enhanced styling */}
      <section className="container mx-auto px-4 mb-18">
        <Testimonials />
      </section>
    </div>
  );
};

export default Index;
