import { Link } from "react-router-dom";
import { motion } from "motion/react";

interface CTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
}

export function CTA({
  title = "Let's Build Something Great Together",
  description = "We turn complex software hurdles and big data challenges into beautiful, automated, and highly lucrative AI-powered digital products.",
  buttonText = "GET IN TOUCH"
}: CTAProps) {
  return (
    <section className="bg-black text-white py-20 md:py-24 relative overflow-hidden border-t border-neutral-900">
      {/* Dynamic atmospheric lighting */}
      <div className="absolute right-10 bottom-0 w-80 h-80 bg-red-600/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -left-10 top-0 w-80 h-80 bg-white/[0.01] blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="text-xs font-body tracking-[0.3em] text-red-600 uppercase font-semibold">
            JOIN REDFORT AI NETWORK
          </span>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight leading-tight max-w-3xl mx-auto">
            {title}
          </h2>

          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-body">
            {description}
          </p>

          <div className="pt-6">
            <Link
              to="/contact"
              className="inline-flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white font-sans text-xs tracking-widest font-bold px-8 py-4 rounded transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-red-600/10 hover:shadow-red-600/20"
            >
              <span>{buttonText}</span>
              <span>→</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
