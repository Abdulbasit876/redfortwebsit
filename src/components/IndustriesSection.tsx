import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";
import type { Industry } from "../types";

const API_BASE_URL = "/api/v1/public";

function getImageUrl(image?: string) {
  if (!image) return "https://via.placeholder.com/1200x600?text=No+Image";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/api/v1/public")) return image;
  if (image.startsWith("/")) return `${API_BASE_URL}${image}`;
  return `${API_BASE_URL}/${image}`;
}

interface IndustriesSectionProps {
  limit?: number;
}

export function IndustriesSection({ limit }: IndustriesSectionProps) {
  const [industriesData, setIndustriesData] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadIndustries = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/industries`);
        if (!response.ok) {
          throw new Error(`Failed to fetch industries (${response.status})`);
        }

        const payload = await response.json();
        const items = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        const mappedIndustries: Industry[] = items.map((item: any, index: number) => ({
          id: item.id || item.slug || item._id || `${item.title || "industry"}-${index}`,
          image: getImageUrl(item.image),
          icon: item.icon || "HelpCircle",
          title: item.title || "",
          description: item.description || item.shortDescription || "",
          benefits: Array.isArray(item.segmentBenefits)
            ? item.segmentBenefits
            : Array.isArray(item.benefits)
              ? item.benefits
              : []
        }));

        if (isMounted) {
          setIndustriesData(mappedIndustries);
        }
      } catch (err) {
        console.error("Error fetching industries:", err);
        if (isMounted) {
          setError("Unable to load industries.");
          setIndustriesData([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadIndustries();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayedIndustries = limit ? industriesData.slice(0, limit) : industriesData;

  return (
    <section className="bg-white py-20 md:py-28 relative overflow-hidden">
      {/* Absolute faint red ambient grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <SectionTitle
            subtitle="Industries We Serve"
            title="Smarter Solutions for {Diverse Sectors}"
          />
          {limit && (
            <a
              href="/industries"
              className="inline-flex items-center space-x-2 text-sm font-bold text-red-600 hover:text-black transition-colors duration-300 font-sans border-b-2 border-red-600 pb-1 mb-4 md:mb-12 self-start md:self-auto"
            >
              <span>VIEW ALL INDUSTRIES</span>
              <span>→</span>
            </a>
          )}
        </div>

        {/* Industries Grid */}
        {loading && (
          <div className="text-center py-16 text-sm text-neutral-500">Loading industries...</div>
        )}

        {!loading && error && (
          <div className="text-center py-16 text-sm text-neutral-500">{error}</div>
        )}

        {!loading && !error && displayedIndustries.length === 0 && (
          <div className="text-center py-16 text-sm text-neutral-500">No industries are available at the moment.</div>
        )}

        {!loading && !error && displayedIndustries.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedIndustries.map((ind, idx) => {
              const isExpanded = expandedId === ind.id;

              return (
                <motion.div
                  key={ind.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer hover:border-red-600/30"
                  onClick={() => setExpandedId(isExpanded ? null : ind.id)}
                  id={`ind-card-${ind.id}`}
                >
                {/* Image Section */}
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={ind.image}
                    alt={ind.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-red-600/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating Icon */}
                  <div className="absolute top-4 left-4 p-2.5 bg-black text-white rounded shadow-md group-hover:bg-red-600 transition-colors duration-300">
                    <LucideIcon name={ind.icon} className="w-5 h-5" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-black mb-3 font-sans group-hover:text-red-600 transition-colors duration-200">
                      {ind.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                      {ind.description}
                    </p>
                  </div>

                  <div>
                    {/* Learn More Toggle Indicator */}
                    <div className="inline-flex items-center space-x-2 text-xs font-bold font-sans tracking-wider text-red-600 mt-2">
                      <span>{isExpanded ? "HIDE BENEFITS" : "LEARN MORE BENEFITS"}</span>
                      <span>{isExpanded ? "↑" : "↓"}</span>
                    </div>

                    {/* Expandable Benefits with AnimatePresence */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mt-4 pt-4 border-t border-neutral-100"
                        >
                          <h4 className="text-xs font-body uppercase tracking-widest text-red-600 mb-2">
                            Segment Benefits
                          </h4>
                          <ul className="space-y-2">
                            {ind.benefits.map((benefit, bIdx) => (
                              <li key={bIdx} className="text-xs text-neutral-600 flex items-start space-x-2 font-body">
                                <span className="text-red-600 font-bold">•</span>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
}
