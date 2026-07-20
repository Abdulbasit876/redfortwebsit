import { motion } from "motion/react";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";

export function WhyChooseUs() {
  const whyChooseUsFeatures = [
    {
      title: "Luxury Enterprise SLA",
      description: "Guaranteed 99.99% system availability and high-priority engineering cell response times.",
      icon: "ShieldAlert"
    },
    {
      title: "Certified AI Competency",
      description: "Ph.D. level machine learning researchers designing fine-tuned local models and agent chains.",
      icon: "Cpu"
    },
    {
      title: "Rigid Security Hardening",
      description: "Architectures audit-ready for SOC2, HIPAA, and PCI-DSS compliance out of the box.",
      icon: "Lock"
    },
    {
      title: "Client-First Transparency",
      description: "Direct Slack channel connections with daily updates and real-time Jira trackers.",
      icon: "RefreshCw"
    }
  ];

  return (
    <section className="bg-black text-white py-20 md:py-28 relative overflow-hidden border-y border-neutral-900">
      <div className="absolute right-0 bottom-0 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionTitle
          subtitle="Why Choose Us"
          title="Why Leading Enterprises {Choose RedFort AI}"
          light
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {whyChooseUsFeatures.map((feat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-neutral-950 border border-neutral-900 rounded p-6 hover:border-red-600/30 hover:bg-neutral-900 transition-all duration-300"
              id={`why-choose-card-${idx}`}
            >
              <div className="text-red-600 mb-4 p-2.5 bg-black border border-neutral-850 inline-block rounded">
                <LucideIcon name={feat.icon} className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2 font-sans">
                {feat.title}
              </h4>
              <p className="text-neutral-450 text-xs leading-relaxed font-body">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
