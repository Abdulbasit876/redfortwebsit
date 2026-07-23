import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
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
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
                id={`srv-card-${srv.id}`}
                onClick={() => navigate(`/services/${srv.slug || srv.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/services/${srv.slug || srv.id}`);
                  }
                }}
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

                <Link
                  to={`/services/${srv.slug || srv.id}`}
                  className="inline-flex items-center space-x-2 text-xs font-bold font-sans tracking-wider text-red-600 group-hover:translate-x-1.5 transition-transform duration-300 mt-6"
                >
                  <span>LEARN MORE</span>
                  <span>→</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
