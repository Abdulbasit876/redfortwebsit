import { useMemo, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BlogPost } from "../types";
import { PageBanner } from "../components/PageBanner";
import { CTA } from "../components/CTA";
import { LucideIcon } from "../components/LucideIcon";

const API_BASE_URL = "/api/v1/public";
const IMAGE_BASE_URL = "/api/v1/public";

const getImageUrl = (image?: string) => {
  if (!image) return "https://via.placeholder.com/1200x600?text=No+Image";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/api/v1/public")) return image;
  if (image.startsWith("/")) return `${IMAGE_BASE_URL}${image}`;
  return `${IMAGE_BASE_URL}/${image}`;
};

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch specific post by slug
  useEffect(() => {
    if (!slug) return;
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/blogs/${slug}`, { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Not found (${res.status})`);
        return res.json();
      })
      .then((raw) => {
        console.log("BlogDetail API response:", raw);
        // backend can return { success, message, data: [...] } or single object
        let it: any = null;
        if (raw == null) it = null;
        else if (Array.isArray(raw)) it = raw[0] || null;
        else if (Array.isArray(raw?.data)) it = raw.data[0] || null;
        else it = raw?.data || raw;

        if (!it) throw new Error("Article not found");

        const contentHtml = it.content || "";
        const text = String(contentHtml).replace(/<[^>]*>/g, "").trim();

        const mapped: BlogPost = {
          id: it.id || it._id || "",
          slug: it.slug || "",
          title: it.title || "",
          excerpt: it.excerpt || text.slice(0, 160),
          content: String(contentHtml || ""),
          image: getImageUrl(it.image),
          category: it.category || "General",
          author: it.authorName || it.createdBy || "",
          date: it.publishedAt ? new Date(it.publishedAt).toLocaleDateString() : it.createdAt ? new Date(it.createdAt).toLocaleDateString() : "",
          tags: Array.isArray(it.tags) ? it.tags : [],
        };

        setCurrentPost(mapped);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
        setError("Failed to load article.");
        setLoading(false);
      });

    return () => ac.abort();
  }, [slug]);

  // Fetch list of blogs to show related posts
  useEffect(() => {
    const ac = new AbortController();
    fetch(`${API_BASE_URL}/blogs`, { signal: ac.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then((data: any[]) => {
        const related = (data || [])
          .filter((b: any) => (b.slug || b._id) !== slug)
          .slice(0, 3)
          .map((it: any) => ({
            id: it.id || it._id || "",
            slug: it.slug || "",
            title: it.title || "",
            excerpt: it.excerpt || "",
            content: it.content || "",
            image: getImageUrl(it.image),
            category: it.category || "General",
            author: it.authorName || it.createdBy || "",
            date: it.publishedAt ? new Date(it.publishedAt).toLocaleDateString() : it.createdAt ? new Date(it.createdAt).toLocaleDateString() : "",
            tags: Array.isArray(it.tags) ? it.tags : [],
          }));
        setRelatedBlogs(related);
      })
      .catch(() => {});

    return () => ac.abort();
  }, [slug]);

  // Handle fallback if slug is not located in database
  if (!currentPost) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-20 text-center font-sans">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-red-600">
            <LucideIcon name="ShieldAlert" className="w-16 h-16 mx-auto animate-bounce" />
          </div>
          <h2 className="text-3xl font-extrabold text-black">
            Article Not Located
          </h2>
          <p className="text-neutral-500 text-sm">
            The technical publication you are searching for does not exist in our database. It may
            have been renamed or deprecated.
          </p>
          <button
            onClick={() => navigate("/blog")}
            className="bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs tracking-widest px-6 py-3 rounded"
          >
            RETURN TO PUBLICATIONS
          </button>
        </div>
      </div>
    );
  }


  if (loading) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-20 text-center font-sans">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-neutral-400">
            <LucideIcon name="Loader2" className="w-12 h-12 mx-auto animate-spin" />
          </div>
          <h2 className="text-2xl font-bold">Loading article…</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-20 text-center font-sans">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-red-600">
            <LucideIcon name="ShieldAlert" className="w-16 h-16 mx-auto animate-bounce" />
          </div>
          <h2 className="text-3xl font-extrabold text-black">Unable to load article</h2>
          <p className="text-neutral-500 text-sm">{error}</p>
          <button
            onClick={() => navigate("/blog")}
            className="bg-red-600 hover:bg-red-700 text-white font-sans font-bold text-xs tracking-widest px-6 py-3 rounded"
          >
            RETURN TO PUBLICATIONS
          </button>
        </div>
      </div>
    );
  }

  const handleShare = (network: string) => {
    const pageUrl = window.location.href;
    const title = currentPost.title;

    if (network === "copy") {
      navigator.clipboard.writeText(pageUrl);
      alert("Article link copied to clipboard securely.");
    } else if (network === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`, "_blank");
    } else if (network === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`, "_blank");
    }
  };

  // Crude helper to format content body cleanly with responsive headers, bold text and listings
  const renderParagraphs = (content: string) => {
    return content.split("\n\n").map((para, pIdx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Header H1 or H2 formatting
      if (trimmed.startsWith("# ")) {
        return (
          <h2 key={pIdx} className="text-2xl md:text-3xl font-extrabold text-black font-sans tracking-tight mt-10 mb-6 leading-tight">
            {trimmed.replace("# ", "")}
          </h2>
        );
      }
      if (trimmed.startsWith("## ")) {
        return (
          <h3 key={pIdx} className="text-xl md:text-2xl font-bold text-black font-sans tracking-tight mt-8 mb-4">
            {trimmed.replace("## ", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("### ")) {
        return (
          <h4 key={pIdx} className="text-lg font-bold text-black font-sans tracking-tight mt-6 mb-3">
            {trimmed.replace("### ", "")}
          </h4>
        );
      }

      // Code blocks formatter
      if (trimmed.startsWith("```")) {
        const cleaned = trimmed.replace(/```[a-z]*/, "").replace(/```$/, "").trim();
        return (
          <pre
            key={pIdx}
            className="bg-neutral-950 border-l-4 border-red-600 rounded-r-lg p-5 text-neutral-200 text-xs font-mono overflow-x-auto leading-relaxed my-6 shadow-md"
          >
            <code>{cleaned}</code>
          </pre>
        );
      }

      // Bullet points lists formatter
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed.split(/\n[-*] /g);
        return (
          <ul key={pIdx} className="space-y-2.5 my-6 pl-5 text-sm md:text-base text-neutral-600 list-disc font-body">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="leading-relaxed">
                {item.replace(/^[-*] /, "").trim()}
              </li>
            ))}
          </ul>
        );
      }

      // Ordered lists formatter
      if (/^\d+\./.test(trimmed)) {
        const items = trimmed.split(/\n\d+\. /g);
        return (
          <ol key={pIdx} className="space-y-2.5 my-6 pl-5 text-sm md:text-base text-neutral-600 list-decimal font-body">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="leading-relaxed">
                {item.replace(/^\d+\. /, "").trim()}
              </li>
            ))}
          </ol>
        );
      }

      // Standard text paragraphs
      return (
        <p key={pIdx} className="text-neutral-600 text-sm md:text-base leading-relaxed mb-6 font-body">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Dynamic breadcrumb page banner */}
      <PageBanner
        title={currentPost.title}
        subtitle={`Authored by ${currentPost.author} on ${currentPost.date}`}
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Blog", path: "/blog" },
          { label: currentPost.category }
        ]}
      />

      <article className="py-16 md:py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6">
          {/* Article Cover Image */}
          <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-lg mb-12 border border-neutral-200">
            <img
              src={currentPost.image}
              alt={currentPost.title}
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left sidebar: Share & tags */}
            <div className="lg:col-span-3 space-y-8 font-body">
              {/* Publication metadata */}
              <div className="border-t border-b border-neutral-200 py-6 space-y-4">
                <div>
                  <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                    Category
                  </span>
                  <span className="text-xs font-bold text-red-600 block uppercase tracking-wide mt-1">
                    {currentPost.category}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                    Published
                  </span>
                  <span className="text-xs text-black block font-bold mt-1">
                    {currentPost.date}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">
                    Architect
                  </span>
                  <span className="text-xs text-black block font-bold mt-1">
                    {currentPost.author}
                  </span>
                </div>
              </div>

              {/* Share links */}
              <div>
                <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mb-4">
                  Share Article
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-9 h-9 rounded border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-600/30 flex items-center justify-center transition-all duration-300 cursor-pointer"
                    aria-label="Share on Twitter"
                  >
                    <LucideIcon name="Twitter" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="w-9 h-9 rounded border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-600/30 flex items-center justify-center transition-all duration-300 cursor-pointer"
                    aria-label="Share on LinkedIn"
                  >
                    <LucideIcon name="Linkedin" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="w-9 h-9 rounded border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-600/30 flex items-center justify-center transition-all duration-300 cursor-pointer"
                    aria-label="Copy Link"
                  >
                    <LucideIcon name="Link" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tags list */}
              <div>
                <span className="block text-[10px] text-neutral-400 uppercase tracking-widest font-semibold mb-3">
                  Key Index
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentPost.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="bg-neutral-50 text-neutral-600 border border-neutral-200 px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right main: Formatted Article text */}
            <div className="lg:col-span-9">
              {currentPost.content && /<\/?[a-z][\s\S]*>/i.test(currentPost.content) ? (
                <div className="prose prose-sm md:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: currentPost.content }} />
              ) : (
                renderParagraphs(currentPost.content)
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Related Blogs Block */}
      {relatedBlogs.length > 0 && (
        <section className="py-20 bg-neutral-50 border-t border-b border-neutral-100">
          <div className="max-w-7xl mx-auto px-6">
            <span className="block text-xs font-body text-red-600 uppercase tracking-widest mb-3 font-semibold">
              RECENT LITERATURE
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-black font-sans tracking-tight mb-12">
              Related Technical Publications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  <div className="h-44 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between font-sans">
                    <div>
                      <span className="text-[10px] font-body text-neutral-400 block mb-2">
                        {post.date}
                      </span>
                      <h4 className="text-base font-bold text-black mb-3 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 leading-snug">
                        <Link to={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </h4>
                    </div>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center space-x-1.5 text-xs font-bold font-sans tracking-wider text-red-600 group-hover:translate-x-1 transition-transform duration-300 mt-4"
                    >
                      <span>READ</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA section */}
      <CTA />
    </div>
  );
}
