import { Link } from "react-router-dom";
import { motion } from "motion/react";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs: BreadcrumbItem[];
}

export function PageBanner({ title, subtitle, breadcrumbs }: PageBannerProps) {
  return (
    <section className="relative bg-black text-white py-24 md:py-32 overflow-hidden border-b border-neutral-900">
      {/* Decorative red glow in corner */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute left-10 top-10 w-48 h-48 bg-white/[0.01] border border-white/[0.03] rotate-45 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-mono text-neutral-500 mb-6 uppercase tracking-wider">
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                {index > 0 && <span className="text-neutral-700">/</span>}
                {item.path ? (
                  <Link
                    to={item.path}
                    className="hover:text-red-600 transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-neutral-300">{item.label}</span>
                )}
              </div>
            ))}
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight mb-4">
            {title}
          </h1>

          {subtitle && (
            <p className="text-neutral-400 text-lg md:text-xl max-w-2xl font-sans font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
