import { motion } from "motion/react";
import { PageBanner } from "../components/PageBanner";
import { ServicesSection } from "../components/ServicesSection";
import { FAQSection } from "../components/FAQSection";
import { CTA } from "../components/CTA";
import { SectionTitle } from "../components/SectionTitle";
import { LucideIcon } from "../components/LucideIcon";

export default function ServicesPage() {
  const processSteps = [
    {
      num: "01",
      title: "Scoping & Discovery",
      desc: "A senior architect maps your existing schema constraints, budget models, and timelines in a dedicated discovery session."
    },
    {
      num: "02",
      title: "Agile Sprints",
      desc: "We write clean, typed code in weekly iterations. You have real-time access to a private staging URL and progress metrics."
    },
    {
      num: "03",
      title: "QA & Vulnerability Scans",
      desc: "Continuous browser tests (via Playwright) and automated security audits check for code integrity prior to any launch."
    },
    {
      num: "04",
      title: "Production SLA",
      desc: "Deploying code with zero-downtime rolling clusters, managed under a robust SLA that keeps metrics optimal."
    }
  ];

  const techStackCategories = [
    {
      title: "Artificial Intelligence",
      items: ["TensorFlow", "PyTorch", "Gemini API", "Hugging Face", "Pinecone Vector DB", "LangChain"]
    },
    {
      title: "Frontend Engineering",
      items: ["React 19", "TypeScript", "Next.js 15", "Vite", "Tailwind CSS", "Framer Motion"]
    },
    {
      title: "Backend & Systems",
      items: ["Node.js (NestJS)", "Express", "Python (FastAPI)", "PostgreSQL", "MongoDB", "Redis"]
    },
    {
      title: "Cloud & Orchestration",
      items: ["AWS Cloud Run", "Google Cloud Platform", "Docker", "Kubernetes", "Terraform", "GitHub Actions"]
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Page Banner */}
      <PageBanner
        title="Our Technical Services"
        subtitle="Full Stack Development, Artificial Intelligence & Machine Learning, Business Automation, and AI Full Stack Solutions."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Services" }
        ]}
      />

      {/* Introduction */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-xs font-body tracking-widest text-red-600 uppercase font-semibold mb-3 block">
            ENTERPRISE-GRADE CAPABILITIES
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-black tracking-tight mb-6">
            We Deliver Premium IT & AI Infrastructure
          </h2>
          <p className="text-neutral-500 text-base md:text-lg leading-relaxed font-body">
            Whether you need a custom LLM fine-tuned on company files, a highly scalable SaaS platform,
            or an automated robotic process (RPA) pipeline, RedFort AI provides certified engineering cells
            focused entirely on rapid velocity and immaculate code execution.
          </p>
        </div>
      </section>

      {/* Services Grid (All 12 Services) */}
      <ServicesSection showTitle={false} />

      {/* Technology Stack */}
      <section className="py-20 md:py-28 bg-black text-white relative overflow-hidden border-y border-neutral-900">
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionTitle
            subtitle="Our Frameworks"
            title="Our Advanced {Technology Stack}"
            light
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {techStackCategories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 hover:border-red-600/30 transition-all duration-300"
              >
                <h4 className="text-sm font-body uppercase tracking-widest text-red-600 mb-4 font-bold">
                  {cat.title}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="bg-black text-neutral-300 border border-neutral-800 px-3 py-1.5 text-xs rounded font-body font-medium hover:border-red-600/40 hover:text-white transition-colors duration-250"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="py-20 md:py-28 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            subtitle="Methodology"
            title="Our Four-Stage {Development Process}"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 relative">
            {processSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="relative bg-neutral-50 rounded p-6 border border-neutral-200 hover:border-red-600/30 transition-all duration-300 group"
              >
                <span className="block text-4xl font-sans font-black text-red-600/20 group-hover:text-red-600 transition-colors duration-300 mb-4">
                  {step.num}
                </span>
                <h4 className="text-lg font-bold text-black font-sans mb-2 group-hover:text-red-600 transition-colors duration-200">
                  {step.title}
                </h4>
                <p className="text-neutral-550 text-xs leading-relaxed font-sans">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (All 10 FAQs) */}
      <FAQSection />

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
