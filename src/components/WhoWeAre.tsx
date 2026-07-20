import { motion } from "motion/react";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";

export function WhoWeAre() {
  const values = [
    {
      title: "Innovation",
      description: "We adopt the latest technologies to build future-ready solutions.",
      icon: "Cpu"
    },
    {
      title: "Integrity",
      description: "We believe in transparency, honesty, and ethical business practices.",
      icon: "ShieldCheck"
    },
    {
      title: "Excellence",
      description: "We are committed to delivering the absolute best quality in everything we do.",
      icon: "Award"
    }
  ];

  return (
    <section className="bg-white py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7">
            <SectionTitle
              subtitle="Who We Are"
              title="We Are {RedFort AI}"
            />
            
            <p className="text-neutral-700 text-lg mb-8 leading-relaxed font-body">
              We are a premium technology and software engineering company focused on delivering
              high-quality digital products and autonomous artificial intelligence. Our mission is to
              transform complex business challenges into powerful, elegant solutions that drive immediate,
              compounding corporate value.
            </p>

            {/* Core Values Rows */}
            <div className="space-y-6">
              {values.map((val, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all duration-300 group"
                >
                  <div className="p-3 bg-neutral-100 rounded text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                    <LucideIcon name={val.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-black font-sans group-hover:text-red-600 transition-colors duration-200 mb-1">
                      {val.title}
                    </h4>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-red-600 rounded-2xl rotate-3 translate-x-3 translate-y-3 opacity-20 blur-sm -z-10" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative rounded-2xl overflow-hidden border-8 border-neutral-100 shadow-xl aspect-square"
            >
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800"
                alt="RedFort AI office collaboration"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
