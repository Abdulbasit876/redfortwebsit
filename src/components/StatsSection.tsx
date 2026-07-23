import { statistics as fallbackStatistics } from "../data/statistics";
import { motion } from "motion/react";

interface StatItem {
  id: string;
  value: string;
  label: string;
}

interface StatsSectionProps {
  stats?: StatItem[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  const displayedStats = stats?.length ? stats : fallbackStatistics;

  return (
    <section className="bg-black text-white py-16 border-y border-neutral-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.03),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-neutral-800">
          {displayedStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="pt-6 md:pt-0"
              id={stat.id}
            >
              <div className="text-4xl lg:text-5xl font-sans font-extrabold text-red-600 tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-xs lg:text-sm text-neutral-400 font-body font-medium uppercase tracking-widest px-2">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
