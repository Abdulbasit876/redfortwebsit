import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FAQSection } from "../components/FAQSection";
import { LucideIcon } from "../components/LucideIcon";
import type { Service } from "../types";

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

export default function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setService(null);
      setError("Service details are unavailable.");
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/services/${encodeURIComponent(id)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch service details (${response.status})`);
        }

        const payload = await response.json();
        const detail = normalizeService(payload?.data || payload);

        if (isMounted) {
          setService(detail);
        }
      } catch (err) {
        console.error("Error fetching service details:", err);
        if (isMounted) {
          setService(null);
          setError("Unable to load the full service details right now.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchService();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-white py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <div className="pb-8 md:pb-10 border-b border-neutral-100">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-600 text-white rounded">
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LucideIcon name={service?.icon || "Circle"} className="w-6 h-6" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-black font-sans">
              {loading ? "Loading service details" : service?.title || "Service details"}
            </h1>
          </div>
        </div>

        <div className="pt-8 md:pt-10">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-4 border-neutral-200 border-t-red-600 rounded-full animate-spin" />
            </div>
          )}

          {!loading && error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && service?.description && (
            <div
              className="prose prose-sm md:prose-base max-w-none prose-headings:font-sans prose-p:text-neutral-700 prose-a:text-red-600 prose-li:text-neutral-700"
              dangerouslySetInnerHTML={{ __html: service.description }}
            />
          )}

          {!loading && !error && !service?.description && (
            <p className="text-neutral-600">No service details are available.</p>
          )}
        </div>

        <div className="mt-12">
          <FAQSection serviceId={id} />
        </div>
      </div>
    </div>
  );
}
