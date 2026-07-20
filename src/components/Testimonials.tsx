import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Testimonial } from "../types";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";

const TESTIMONIALS_API_URL = "/api/v1/public/testimonials";
const IMAGE_BASE_URL = "/api/v1/public";

const getImageUrl = (image?: string) => {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/api/v1/public")) return image;
  if (image.startsWith("/")) return `${IMAGE_BASE_URL}${image}`;
  return `${IMAGE_BASE_URL}/${image}`;
};

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(TESTIMONIALS_API_URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch testimonials (${response.status})`);
        }

        const data = await response.json();
        const testimonialList = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        const mappedTestimonials = testimonialList.map((item: any) => ({
          id: item.id || item._id || "",
          name: item.name || "",
          role: item.role || "",
          company: item.company || "",
          text: item.message || "",
          rating: Number(item.rating) || 0,
          image: getImageUrl(item.avatar),
        }));

        if (isMounted) {
          setTestimonials(mappedTestimonials);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error("Error fetching testimonials:", err);

        if (isMounted) {
          setError("Testimonials are temporarily unavailable.");
          setTestimonials([]);
          setCurrentIndex(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];
  const showCarousel = !loading && !error && testimonials.length > 0 && current;

  return (
    <section className="bg-white py-20 md:py-28 relative overflow-hidden border-b border-neutral-100">
      <div className="absolute left-0 top-0 w-96 h-96 bg-red-600/[0.01] blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <SectionTitle
          subtitle="Testimonials"
          title="What {Our Clients} Say"
          centered
        />

        {/* Carousel Block */}
        <div className="relative min-h-[380px] md:min-h-[300px] flex items-center justify-center">
          {loading && (
            <div className="w-full text-center">
              <div className="text-red-600 flex justify-center mb-6">
                <LucideIcon name="Quote" className="w-12 h-12 opacity-30 animate-pulse" />
              </div>
              <p className="text-xl md:text-2xl font-body text-black italic leading-relaxed mb-8 max-w-3xl mx-auto px-4">
                Loading testimonials...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="w-full text-center">
              <div className="text-red-600 flex justify-center mb-6">
                <LucideIcon name="Quote" className="w-12 h-12 opacity-30" />
              </div>
              <p className="text-xl md:text-2xl font-body text-black italic leading-relaxed mb-8 max-w-3xl mx-auto px-4">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && testimonials.length === 0 && (
            <div className="w-full text-center">
              <div className="text-red-600 flex justify-center mb-6">
                <LucideIcon name="Quote" className="w-12 h-12 opacity-30" />
              </div>
              <p className="text-xl md:text-2xl font-body text-black italic leading-relaxed mb-8 max-w-3xl mx-auto px-4">
                No testimonials available at this time.
              </p>
            </div>
          )}

          {showCarousel && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                transition={{ duration: 0.4 }}
                className="w-full text-center"
                id={`testimonial-${current.id}`}
              >
                {/* Quote Mark */}
                <div className="text-red-600 flex justify-center mb-6">
                  <LucideIcon name="Quote" className="w-12 h-12 opacity-30 animate-pulse" />
                </div>

                {/* Quote Text */}
                <blockquote className="text-xl md:text-2xl font-body text-black italic leading-relaxed mb-8 max-w-3xl mx-auto px-4">
                  "{current.text}"
                </blockquote>

                {/* Star Ratings */}
                <div className="flex items-center justify-center space-x-1 text-red-600 mb-6">
                  {Array.from({ length: current.rating }).map((_, rIdx) => (
                    <LucideIcon key={rIdx} name="Star" className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Client Info */}
                <div className="flex flex-col items-center font-sans">
                  {current.image && (
                    <img
                      src={current.image}
                      alt={current.name}
                      className="w-16 h-16 rounded-full object-cover grayscale mb-3.5 border-2 border-neutral-100 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <cite className="not-italic text-lg font-bold text-black block mb-1">
                    {current.name}
                  </cite>
                  <span className="text-xs font-body uppercase tracking-widest text-red-600 font-semibold">
                    {current.role}, {current.company}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Navigation Buttons */}
        {!loading && !error && testimonials.length > 0 && (
          <div className="flex items-center justify-center space-x-6 mt-10">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-neutral-200 hover:border-red-600 text-black hover:text-red-600 flex items-center justify-center transition-all duration-300"
              aria-label="Previous Testimonial"
            >
              <LucideIcon name="ArrowLeft" className="w-5 h-5" />
            </button>

            <span className="text-xs font-body text-neutral-400 font-semibold">
              {currentIndex + 1} <span className="text-neutral-300">/</span> {testimonials.length}
            </span>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-neutral-200 hover:border-red-600 text-black hover:text-red-600 flex items-center justify-center transition-all duration-300"
              aria-label="Next Testimonial"
            >
              <LucideIcon name="ArrowRight" className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
