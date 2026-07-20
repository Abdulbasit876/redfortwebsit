import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PageBanner } from "../components/PageBanner";
import { CTA } from "../components/CTA";
import { LucideIcon } from "../components/LucideIcon";
import type { CaseStudy } from "../types";

const API_BASE_URL = "/api/v1/public";

function getImageUrl(image?: string) {
  if (!image) return "https://via.placeholder.com/1200x600?text=No+Image";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/api/v1/public")) return image;
  if (image.startsWith("/")) return `${API_BASE_URL}${image}`;
  return `${API_BASE_URL}/${image}`;
}

function capitalizeFirstCharacter(text: string) {
  if (!text) return text;

  const match = text.match(/^(\s*)(\S?)/);
  if (!match) return text;

  const [, leadingWhitespace, firstChar] = match;
  if (!firstChar || !/[a-z]/.test(firstChar)) return text;

  return `${leadingWhitespace}${firstChar.toUpperCase()}${text.slice(leadingWhitespace.length + 1)}`;
}

export default function CaseStudyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentCase, setCurrentCase] = useState<CaseStudy | null>(null);
  const [contentHtml, setContentHtml] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDisplayHtml = (html: string) => {
    if (!html) return "";

    const container = document.createElement("div");
    container.innerHTML = html;

    const transformNodeText = (node: Node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;

      const text = node.textContent || "";
      if (!text.trim()) return;

      const parent = node.parentElement;
      if (!parent) return;

      const tagName = parent.tagName.toLowerCase();
      const shouldCapitalize = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li"].includes(tagName);

      if (!shouldCapitalize) return;

      const firstChar = text.trim()[0];
      if (!firstChar) return;

      const remainder = text.slice(firstChar.length);
      const capitalized = firstChar.toUpperCase() + remainder;
      node.textContent = capitalized;
    };

    container.querySelectorAll("h1, h2, h3, h4, h5, h6, p, li").forEach((element) => {
      element.childNodes.forEach((child) => transformNodeText(child));
    });

    return container.innerHTML;
  };

  useEffect(() => {
    if (!id) {
      setCurrentCase(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const loadCaseStudy = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/case-studies/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch case study (${response.status})`);
        }

        const payload = await response.json();
        const item = payload?.data || payload;

        const mappedCase: CaseStudy = {
          id: item.slug || item.id || item._id || id,
          image: getImageUrl(item.image),
          title: item.title || "",
          problem: item.shortDescription || "",
          solution: "",
          technologyUsed: [],
          result: "",
          statistics: "",
          clientFeedback: "",
        };

        if (isMounted) {
          setCurrentCase(mappedCase);
          setContentHtml(item.content || "");
          setTechnologies(Array.isArray(item.technologies) ? item.technologies : []);
        }
      } catch (err) {
        console.error("Error fetching case study:", err);
        if (isMounted) {
          setError("Unable to load the selected case study.");
          setCurrentCase(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCaseStudy();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-20 text-center font-sans">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-neutral-400">
            <LucideIcon name="Loader2" className="w-12 h-12 mx-auto animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-black">Loading case study…</h2>
        </div>
      </div>
    );
  }

  if (error || !currentCase) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-20 text-center font-sans">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-red-600">
            <LucideIcon name="ShieldAlert" className="w-16 h-16 mx-auto animate-bounce" />
          </div>
          <h2 className="text-3xl font-extrabold text-black">
            Case Study Not Located
          </h2>
          <p className="text-neutral-500 text-sm">
            The technical case study you are searching for does not exist in our records. It may
            have been renamed or archived.
          </p>
          <button
            onClick={() => navigate("/case-studies")}
            className="bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs tracking-widest px-6 py-3 rounded"
          >
            RETURN TO CASE STUDIES
          </button>
        </div>
      </div>
    );
  }

  const displayTitle = capitalizeFirstCharacter(currentCase.title || "");
  const displaySubtitle = capitalizeFirstCharacter(currentCase.problem || "");

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Page Banner */}
      <PageBanner
        title={displayTitle}
        subtitle={displaySubtitle}
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Case Studies", path: "/case-studies" },
          { label: "Details" }
        ]}
      />

      <section className="py-12 md:py-20 max-w-7xl mx-auto px-6">
        {/* Back navigation */}
        <div className="mb-10">
          <Link
            to="/case-studies"
            className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest text-red-600 hover:text-black transition-colors duration-200 uppercase"
          >
            <LucideIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back to Case Studies</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Cover Image & Full Details */}
          <div className="lg:col-span-8 space-y-12">
            {/* Image Showcase */}
            <div className="h-96 md:h-[480px] rounded-2xl overflow-hidden relative shadow-lg border border-neutral-200">
              <img
                src={currentCase.image}
                alt={displayTitle}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-6 left-6 bg-red-600 text-white font-mono text-[10px] font-bold px-3 py-1.5 rounded tracking-widest uppercase">
                Enterprise Blueprint
              </div>
            </div>

            {/* Core Breakdown */}
            <div className="space-y-10">
              {/* Problem/Challenge */}
              <div className="space-y-4">
                <div
                  className="prose prose-neutral max-w-none text-neutral-600 text-sm md:text-base leading-relaxed font-body [&_h1]:text-xl [&_h1]:md:text-2xl [&_h1]:font-extrabold [&_h1]:text-black [&_h1]:tracking-tight [&_h1]:flex [&_h1]:items-center [&_h1]:gap-2.5 [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:before:content-[''] [&_h1]:before:w-1.5 [&_h1]:before:h-6 [&_h1]:before:bg-red-600 [&_h1]:before:block [&_h1]:before:rounded [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-extrabold [&_h2]:text-black [&_h2]:tracking-tight [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2.5 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:before:content-[''] [&_h2]:before:w-1.5 [&_h2]:before:h-6 [&_h2]:before:bg-red-600 [&_h2]:before:block [&_h2]:before:rounded [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-extrabold [&_h3]:text-black [&_h3]:tracking-tight [&_h3]:flex [&_h3]:items-center [&_h3]:gap-2.5 [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:before:content-[''] [&_h3]:before:w-1.5 [&_h3]:before:h-6 [&_h3]:before:bg-red-600 [&_h3]:before:block [&_h3]:before:rounded [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-red-600 [&_blockquote]:bg-neutral-50 [&_blockquote]:p-6 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-neutral-700 [&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-6 [&_a]:text-red-600 [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: formatDisplayHtml(contentHtml) }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Meta-information */}
          <div className="lg:col-span-4 space-y-8">
            {/* Tech Stack Deployed */}
            <div className="bg-neutral-50 border border-neutral-200 p-8 rounded-xl space-y-4">
              <h4 className="text-xs font-body font-bold uppercase tracking-widest text-red-600">
                Technologies Deployed
              </h4>
              <div className="flex flex-wrap gap-2 pt-2">
                {technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="bg-white text-black border border-neutral-250 px-3 py-1.5 text-xs rounded font-body font-semibold hover:border-red-600 hover:text-red-600 transition-colors duration-250"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <CTA
        title="Ready to Scale Your Systems?"
        description="Connect with our solutions department in Pakistan. We'll map out a secure compliance blueprint, establish a private code repository, and set up a scoping milestone."
      />
    </div>
  );
}
