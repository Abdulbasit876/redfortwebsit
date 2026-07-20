import { useState } from "react";
import { PageBanner } from "../components/PageBanner";
import { IndustriesSection } from "../components/IndustriesSection";
import { CTA } from "../components/CTA";
import { SectionTitle } from "../components/SectionTitle";

export default function IndustriesPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Banner */}
      <PageBanner
        title="Industries We Service"
        subtitle="Tailored digital solutions, AI operations, and compliance frameworks across 12 unique verticals."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Industries" }
        ]}
      />

      {/* Intro info */}
      <section className="py-16 md:py-24 bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-body tracking-widest text-red-600 uppercase font-semibold mb-3 block">
            SPECIALIZED VERTICAL INTEGRITY
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-black tracking-tight mb-6">
            Engineered Compliance for {"{Diverse Sectors}"}
          </h2>
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-body">
            Every sector operates under specific system constraints: HIPAA in healthcare, SOC2 in FinTech,
            PCI-DSS in retail checkout lines. At RedFort AI, our developers are fully trained in sector-specific
            regulations, shipping code that is safe, fast, and compliant by default.
          </p>
        </div>
      </section>

      {/* Industries grid (All 12) */}
      <IndustriesSection />

      {/* Call to action */}
      <CTA
        title="Need a Sector-Specific Solutions Architect?"
        description="Connect with our offices in Wah Cantt or Islamabad, Pakistan. We'll map out a secure compliance blueprint, establish a private code repository, and set up a scoping milestone."
      />
    </div>
  );
}
