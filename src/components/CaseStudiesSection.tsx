import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";
import type { CaseStudy } from "../types";

interface CaseStudiesSectionProps {
  limit?: number;
  showTitle?: boolean;
}

const API_BASE_URL = "/api/v1/public";

function getImageUrl(image?: string) {
  if (!image) return "https://via.placeholder.com/800x450?text=No+Image";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/api/v1/public")) return image;
  if (image.startsWith("/")) return `${API_BASE_URL}${image}`;
  return `${API_BASE_URL}/${image}`;
}

export function CaseStudiesSection({ limit, showTitle = true }: CaseStudiesSectionProps) {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadCases = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/case-studies`);
        if (!response.ok) {
          throw new Error(`Failed to fetch case studies (${response.status})`);
        }

        const payload = await response.json();
        const list = Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];

        const mappedCases = list.map((item: any) => ({
          id: item.slug || item.id || item._id || "",
          image: getImageUrl(item.image),
          title: item.title || "",
          problem: item.shortDescription || "",
          solution: "",
          technologyUsed: [],
          result: "",
          statistics: "",
          clientFeedback: "",
        }));

        if (isMounted) {
          setCases(mappedCases);
        }
      } catch (err) {
        console.error("Error fetching case studies:", err);
        if (isMounted) {
          setError("Unable to load case studies right now.");
          setCases([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCases();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayedCases = limit ? cases.slice(0, limit) : cases;

  return (
    <section className="bg-neutral-50 py-20 md:py-28 border-y border-neutral-100 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {showTitle && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <SectionTitle
              subtitle="Case Studies"
              title="Our Proven {Success Stories}"
            />
            {limit && (
              <Link
                to="/case-studies"
                className="inline-flex items-center space-x-2 text-sm font-bold text-red-600 hover:text-black transition-colors duration-300 font-sans border-b-2 border-red-600 pb-1 mb-4 md:mb-12 self-start md:self-auto"
              >
                <span>EXPLORE ALL PROJECTS</span>
                <span>→</span>
              </Link>
            )}
          </div>
        )}

        {/* Case Studies Grid */}
        {loading && (
          <div className="text-center py-16 text-sm text-neutral-500">Loading case studies...</div>
        )}

        {!loading && error && (
          <div className="text-center py-16 text-sm text-red-600">{error}</div>
        )}

        {!loading && !error && displayedCases.length === 0 && (
          <div className="text-center py-16 text-sm text-neutral-500">No case studies available at the moment.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {!loading && !error && displayedCases.map((cs, idx) => (
            <motion.div
              key={cs.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="bg-white border border-neutral-200 rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:border-red-600/30"
              onClick={() => navigate(`/case-studies/${cs.id}`)}
              id={`cs-card-${cs.id}`}
            >
              {/* Card Image Cover with overlay */}
              <div className="h-64 relative overflow-hidden">
                <img
                  src={cs.image}
                  alt={cs.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />
                
                {/* Floating Metric Badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block text-xs font-body bg-red-600 text-white px-3 py-1 rounded-full uppercase tracking-widest font-semibold mb-2 shadow-md">
                    {cs.statistics || ""}
                  </span>
                  <h3 className="text-xl font-bold text-white font-sans leading-tight">
                    {cs.title}
                  </h3>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="p-6 bg-white flex justify-between items-center border-t border-neutral-100">
                <p className="text-neutral-500 text-sm line-clamp-2 max-w-[80%]">
                  {cs.problem}
                </p>
                <div className="w-8 h-8 rounded-full bg-neutral-100 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shrink-0">
                  <LucideIcon name="ArrowUpRight" className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
