import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";
import type { Service } from "../types";

interface ServicesSectionProps {
  limit?: number;
  showTitle?: boolean;
}

const API_BASE_URL = "http://localhost:5000/api/v1/public";

function normalizeService(item: any): Service {
  return {
    id: item?.id || item?._id || item?.slug || item?.title || "",
    title: item?.title || "",
    description: item?.description || item?.longDescription || item?.shortDescription || "",
    icon: item?.icon || "Circle",
    status: item?.status,
    slug: item?.slug || "",
  };
}

function extractServiceList(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (payload?.success && Array.isArray(payload?.data)) return payload.data;
  return [];
}

function getDescriptionPreview(description?: string) {
  if (!description) return "";

  const text = description.replace(/<[^>]*>/g, " ");
  const temp = document.createElement("textarea");
  temp.innerHTML = text;

  const plainText = temp.value
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return "";

  if (plainText.length <= 140) return plainText;

  return `${plainText.slice(0, 137).trimEnd()}...`;
}

export function ServicesSection({ limit, showTitle = true }: ServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/services`);
        if (!response.ok) {
          throw new Error(`Failed to fetch services (${response.status})`);
        }

        const payload = await response.json();
        const list = extractServiceList(payload);
        const mappedServices = list.map(normalizeService);
        setServices(mappedServices);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const displayedServices = limit ? services.slice(0, limit) : services;

  const handleOpenService = async (service: Service) => {
    if (!service.slug) {
      setSelectedService(service);
      return;
    }

    setSelectedService(service);
    setIsLoadingDetails(true);
    setDetailsError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/services/${service.slug}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch service details (${response.status})`);
      }

      const payload = await response.json();
      const detail = normalizeService(payload?.data || payload);
      setSelectedService(detail);
    } catch (err) {
      console.error("Error fetching service details:", err);
      setDetailsError("Unable to load the full service details right now.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedService(null);
    setIsLoadingDetails(false);
    setDetailsError(null);
  };

  return (
    <section className="bg-neutral-50 py-20 md:py-28 border-y border-neutral-100">
      <div className="max-w-7xl mx-auto px-6">
        {showTitle && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <SectionTitle
              subtitle="Our Services"
              title="We Provide {Best IT & AI Solutions}"
            />
            {limit && (
              <Link
                to="/services"
                className="inline-flex items-center space-x-2 text-sm font-bold text-red-600 hover:text-black transition-colors duration-300 font-sans border-b-2 border-red-600 pb-1 mb-4 md:mb-12 self-start md:self-auto"
              >
                <span>EXPLORE ALL SERVICES</span>
                <span>→</span>
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {loading && (
            <div className="md:col-span-2 flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin" />
              <p className="mt-4 text-sm text-neutral-500">Loading services...</p>
            </div>
          )}

          {!loading && error && (
            <div className="md:col-span-2 rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && displayedServices.length === 0 && (
            <div className="md:col-span-2 rounded-lg border border-neutral-200 bg-white px-6 py-8 text-center text-sm text-neutral-500">
              No services are available at the moment.
            </div>
          )}

          {!loading && !error && displayedServices.map((srv, idx) => {
            const preview = getDescriptionPreview(srv.description);

            return (
              <motion.div
                key={srv.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="bg-white rounded-lg p-8 border border-neutral-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:border-red-600/30"
                onClick={() => handleOpenService(srv)}
                id={`srv-card-${srv.id}`}
              >
                <div>
                  <div className="w-12 h-12 rounded bg-neutral-100 text-red-600 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <LucideIcon name={srv.icon} className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-black font-sans group-hover:text-red-600 transition-colors duration-200">
                    {srv.title}
                  </h3>

                  {preview && (
                    <p className="text-neutral-500 text-sm leading-relaxed mt-4 line-clamp-3">
                      {preview}
                    </p>
                  )}
                </div>

                <div className="inline-flex items-center space-x-2 text-xs font-bold font-sans tracking-wider text-red-600 group-hover:translate-x-1.5 transition-transform duration-300 mt-6">
                  <span>LEARN MORE</span>
                  <span>→</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedService && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-white rounded-xl w-full max-w-2xl overflow-hidden border border-neutral-200 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8 max-h-[70vh] overflow-y-auto">
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-red-600 text-white rounded">
                        <LucideIcon name={selectedService.icon} className="w-6 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-black font-sans">
                        {selectedService.title}
                      </h2>
                    </div>
                    <button
                      onClick={closeModal}
                      className="bg-black/5 hover:bg-red-600 text-black hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                      ✕
                    </button>
                  </div>

                  {isLoadingDetails && (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin" />
                    </div>
                  )}

                  {!isLoadingDetails && detailsError && (
                    <p className="text-sm text-red-600 mb-6">{detailsError}</p>
                  )}

                  {!isLoadingDetails && selectedService.description && (
                    <div
                      className="prose prose-sm md:prose-base max-w-none prose-headings:font-sans prose-p:text-neutral-700 prose-a:text-red-600 prose-li:text-neutral-700"
                      dangerouslySetInnerHTML={{ __html: selectedService.description }}
                    />
                  )}

                  {!isLoadingDetails && !selectedService.description && !detailsError && (
                    <p className="text-neutral-600">No service details are available.</p>
                  )}

                  <div className="flex justify-end pt-6 border-t border-neutral-100 mt-6">
                    <button
                      onClick={closeModal}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded font-sans text-xs font-bold tracking-widest transition-colors duration-200"
                    >
                      CLOSE DETAILS
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
