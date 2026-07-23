import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FAQ } from "../types";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";

interface FAQSectionProps {
  limit?: number;
  page?: string;
  serviceId?: string;
}

export function FAQSection({ limit, page, serviceId }: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = serviceId
          ? `http://localhost:5000/api/v1/public/faqs?serviceId=${encodeURIComponent(serviceId)}`
          : page
            ? `http://localhost:5000/api/v1/public/faqs?page=${encodeURIComponent(page)}`
            : "http://localhost:5000/api/v1/public/faqs";

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch FAQs (${response.status})`);
        }
        
        const data = await response.json();
        
        // Handle different response formats
        let faqList: FAQ[] = [];
        if (Array.isArray(data)) {
          faqList = data;
        } else if (Array.isArray(data?.data)) {
          faqList = data.data;
        } else if (data?.success && Array.isArray(data?.data)) {
          faqList = data.data;
        }
        
        // Map backend response to FAQ interface
        const mappedFaqs = faqList.map((item: any) => ({
          id: item.id || item._id,
          question: item.question,
          answer: item.answer
        }));
        
        setFaqs(mappedFaqs);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        setError("Failed to load frequently asked questions. Please try again later.");
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, [page, serviceId]);

  useEffect(() => {
    setIsExpanded(false);
    setOpenId(null);
  }, [page, serviceId]);

  const shouldCollapseHomepage = page === "Homepage" && !limit;
  const displayedFaqs = shouldCollapseHomepage
    ? (isExpanded ? faqs : faqs.slice(0, 5))
    : limit
      ? faqs.slice(0, limit)
      : faqs;
  const hasMoreFaqs = shouldCollapseHomepage && faqs.length > 5;

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-neutral-50 py-20 md:py-28 border-y border-neutral-100">
      <div className="max-w-4xl mx-auto px-6">
        
        <SectionTitle
          subtitle="Frequently Asked Questions"
          title="Answers to {Your Questions}"
          centered
        />

        <div className="space-y-4">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin" />
              <p className="text-neutral-500 text-sm">Loading frequently asked questions...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <LucideIcon name="AlertCircle" className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && displayedFaqs.length === 0 && (
            <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-12 text-center">
              <LucideIcon name="HelpCircle" className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600 text-sm font-medium">No frequently asked questions available at this time.</p>
            </div>
          )}

          {/* FAQ List */}
          {!loading && displayedFaqs.map((faq, idx) => {
            const isOpen = openId === faq.id;

            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white border border-neutral-200 rounded-lg overflow-hidden transition-colors duration-300 hover:border-red-600/20 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left p-6 flex justify-between items-center space-x-4 cursor-pointer focus:outline-none select-none group"
                >
                  <span className="text-base md:text-lg font-bold text-black font-sans group-hover:text-red-600 transition-colors duration-200">
                    {faq.question}
                  </span>
                  
                  <div className={`p-1.5 rounded-full bg-neutral-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shrink-0 ${isOpen ? "rotate-180" : "rotate-0"}`}>
                    <LucideIcon name="ChevronDown" className="w-5 h-5" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm text-neutral-500 leading-relaxed font-sans border-t border-neutral-50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {!loading && !error && hasMoreFaqs && (
            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              className="inline-flex items-center space-x-2 text-sm font-bold text-red-600 hover:text-black transition-colors duration-300 font-sans border-b-2 border-red-600 pb-1 mt-2"
            >
              <span>{isExpanded ? "SHOW LESS" : "VIEW MORE FAQs"}</span>
              <span>→</span>
            </button>
          )}
        </div>

      </div>
    </section>
  );
}
