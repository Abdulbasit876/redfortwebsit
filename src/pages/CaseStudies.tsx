import { PageBanner } from "../components/PageBanner";
import { CaseStudiesSection } from "../components/CaseStudiesSection";
import { CTA } from "../components/CTA";

export default function CaseStudiesPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Page Banner */}
      <PageBanner
        title="Our Proven Case Studies"
        subtitle="Explore how our certified engineering cell deployed AI-powered systems to yield massive business metrics."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Case Studies" }
        ]}
      />

      {/* Intro section */}
      <section className="py-16 md:py-24 bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-body tracking-widest text-red-600 uppercase font-semibold mb-3 block">
            QUANTIFIED VERIFIED IMPACT
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-black tracking-tight mb-6">
            We Build Software That Drives Metrics
          </h2>
          <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-body">
            A beautiful user interface is only valuable if it performs. Our engineering audits
            always target tangible, quantifiable business outcomes: fuel reductions, conversion uplifts,
            decreased triage bottlenecks, and lower server bills. Explore our 8 detailed cases below.
          </p>
        </div>
      </section>

      {/* Case studies grid (All 8 Case Studies) */}
      <CaseStudiesSection showTitle={false} />

      {/* CTA section */}
      <CTA
        title="Ready to Quantify Your Next Engineering Sprint?"
        description="Connect with our solutions department in Pakistan. We'll outline similar industry metrics, draft a high-fidelity Figma storyboard, and commit to strict target metrics."
      />
    </div>
  );
}
