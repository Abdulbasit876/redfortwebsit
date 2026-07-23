import { Hero } from "../components/Hero";
import { WhoWeAre } from "../components/WhoWeAre";
import { ServicesSection } from "../components/ServicesSection";
import { WhyChooseUs } from "../components/WhyChooseUs";
import { IndustriesSection } from "../components/IndustriesSection";
import { CaseStudiesSection } from "../components/CaseStudiesSection";
import { Testimonials } from "../components/Testimonials";
import { FAQSection } from "../components/FAQSection";
import { LatestBlogs } from "../components/LatestBlogs";
import { ContactSection } from "../components/ContactSection";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Section (Keep Existing Design) */}
      <Hero />

      {/* 2. About Section */}
      <WhoWeAre />

      {/* 3. Our Services */}
      <ServicesSection limit={4} />

      {/* 4. Why Choose Us */}
      <WhyChooseUs />

      {/* 5. Industries We Serve */}
      <IndustriesSection limit={6} />

      {/* 6. Our Recent Success Stories */}
      <CaseStudiesSection limit={4} />

      {/* 7. Testimonials */}
      <Testimonials />

      {/* 8. FAQ Section */}
      <FAQSection page="Homepage" />

      {/* 9. Latest Blogs */}
      <LatestBlogs limit={4} />

      {/* 10. Contact Us */}
      <ContactSection />
    </div>
  );
}
