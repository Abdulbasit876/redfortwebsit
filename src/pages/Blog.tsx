import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { BlogPost } from "../types";
import { PageBanner } from "../components/PageBanner";
import { SectionTitle } from "../components/SectionTitle";
import { LucideIcon } from "../components/LucideIcon";

const API_BASE_URL = "/api/v1/public";
const IMAGE_BASE_URL = "/api/v1/public";

const getImageUrl = (image?: string) => {
  if (!image) return "https://via.placeholder.com/800x450?text=No+Image";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/api/v1/public")) return image;
  if (image.startsWith("/")) return `${IMAGE_BASE_URL}${image}`;
  return `${IMAGE_BASE_URL}/${image}`;
};

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const postsPerPage = 6;

  // Extract all unique categories dynamically
  const categories = useMemo(() => {
    const list = new Set(posts.map((b) => b.category));
    return ["All", ...Array.from(list)];
  }, [posts]);

  // Filter posts based on search text and category selections
  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const filteredBlogs = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  // Paginate filtered posts
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + postsPerPage);
  }, [filteredBlogs, currentPage]);

  const totalPages = Math.max(Math.ceil(filteredBlogs.length / postsPerPage), 1);

  // Fetch blog posts from backend
  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/blogs`, { signal: ac.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        return res.json();
      })
      .then((raw) => {
        console.log("BlogIndex API response:", raw);
        // backend may return { success, message, data: [...] }
        const arr = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];

        const mapped: BlogPost[] = arr.map((it: any) => {
          const contentHtml = it.content || "";
          const text = String(contentHtml).replace(/<[^>]*>/g, "").trim();
          return {
            id: it.id || it._id || "",
            slug: it.slug || "",
            title: it.title || "",
            excerpt: it.excerpt || text.slice(0, 160),
            content: String(contentHtml || ""),
            image: getImageUrl(it.image),
            category: it.category || it.metaCategory || "General",
            author: it.authorName || it.createdBy || "",
            date: it.publishedAt ? new Date(it.publishedAt).toLocaleDateString() : it.createdAt ? new Date(it.createdAt).toLocaleDateString() : "",
            tags: Array.isArray(it.tags) ? it.tags : [],
          };
        });

        setPosts(mapped);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
        setError("Unable to load publications from server.");
        setLoading(false);
      });

    return () => ac.abort();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Page Banner */}
      <PageBanner
        title="Engineering Publications"
        subtitle="Weekly research papers, coding guidelines, and technical deep-dives authored by our senior architects."
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Blog" }
        ]}
      />

      {/* Main Content Area */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Search & Category Filter bar */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-16 border-b border-neutral-100 pb-10">
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md font-body">
              <input
                type="text"
                placeholder="Search articles, tags, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 focus:border-red-600 text-black placeholder-neutral-400 px-5 py-3.5 pl-12 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors duration-200"
              />
              <LucideIcon
                name="Search"
                className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category selection scroll bar */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto font-sans">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[10px] uppercase font-bold tracking-wider rounded border transition-all duration-200 cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-red-600 border-red-600 text-white shadow-md"
                      : "bg-white border-neutral-200 text-black hover:border-red-600/30 hover:text-red-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Post (Only show on page 1 and if no query/filter active) */}
          {currentPage === 1 && searchQuery === "" && selectedCategory === "All" && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 mb-16 group hover:border-red-600/20"
            >
                  <div className="lg:col-span-7 h-80 lg:h-auto overflow-hidden relative">
                <img
                  src={getImageUrl(posts[0].image)}
                  alt={posts[0].title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-red-600 text-white font-body text-[10px] font-bold px-3 py-1.5 rounded tracking-widest uppercase">
                    FEATURED PUBLICATION
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between font-sans">
                <div>
                  <div className="flex items-center text-xs text-neutral-400 font-body mb-4 uppercase tracking-wider">
                    <span className="flex items-center space-x-1">
                      <LucideIcon name="Calendar" className="w-3.5 h-3.5 text-red-600" />
                      <span>{posts[0].date}</span>
                    </span>
                    <span className="mx-2">|</span>
                    <span>{posts[0].author}</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-black mb-4 group-hover:text-red-600 transition-colors duration-200 leading-tight">
                    <Link to={`/blog/${posts[0].slug}`} className="hover:underline">
                      {posts[0].title}
                    </Link>
                  </h3>

                  <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                    {posts[0].excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-neutral-250 flex items-center justify-between font-sans">
                    <Link
                    to={`/blog/${posts[0].slug}`}
                    className="inline-flex items-center space-x-2 text-xs font-bold tracking-wider text-red-600 group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <span>READ ARTICLE</span>
                    <span>→</span>
                  </Link>

                  <span className="text-xxs text-neutral-400 uppercase tracking-widest font-semibold">
                    {posts[0].category}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedBlogs.map((post, idx) => (
                <motion.article
                  layout
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-red-600/20"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white font-body text-[9px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col justify-between font-sans">
                    <div>
                      <div className="flex items-center text-xs text-neutral-400 font-body mb-3 uppercase tracking-wider">
                        <span>{post.date}</span>
                      </div>

                      <h4 className="text-lg font-bold text-black mb-3 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 leading-snug">
                        <Link to={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </h4>

                      <p className="text-neutral-500 text-xs leading-relaxed mb-6 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-100 flex items-center justify-between font-sans">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center space-x-2 text-xs font-bold tracking-wider text-red-600 group-hover:translate-x-1.5 transition-transform duration-300"
                      >
                        <span>READ ARTICLE</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* Empty Search Fallback */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-20 font-sans border border-dashed border-neutral-200 rounded-xl bg-neutral-50">
              <div className="text-neutral-400 mb-4">
                <LucideIcon name="ShieldQuestion" className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-black mb-1">
                No Publications Located
              </h4>
              <p className="text-neutral-550 text-sm max-w-sm mx-auto leading-relaxed">
                No articles matches search term "{searchQuery}". Try executing another database query.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-xs font-sans font-bold tracking-widest rounded"
              >
                RESET FILTERS
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-16 pt-10 border-t border-neutral-100 font-body font-semibold">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                className="p-3 rounded border border-neutral-200 hover:border-red-600 hover:text-red-600 text-black disabled:text-neutral-350 disabled:border-neutral-100 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
                aria-label="Previous Page"
              >
                <LucideIcon name="ChevronLeft" className="w-4 h-4" />
              </button>

              <span className="text-xs text-neutral-450 uppercase tracking-widest">
                Page <span className="font-extrabold text-black">{currentPage}</span> of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                className="p-3 rounded border border-neutral-200 hover:border-red-600 hover:text-red-600 text-black disabled:text-neutral-350 disabled:border-neutral-100 disabled:cursor-not-allowed transition-all duration-200 shrink-0"
                aria-label="Next Page"
              >
                <LucideIcon name="ChevronRight" className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Embedded Newsletter banner */}
      <section className="bg-black text-white py-16 border-t border-neutral-900">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="text-xs font-body tracking-widest text-red-600 uppercase font-semibold">
            JOIN OUR SCHOLARLY CIRCLE
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white font-sans tracking-tight">
            Subscribe to RedFort Technical Insights
          </h2>
          <p className="text-neutral-400 text-xs max-w-lg mx-auto font-body leading-relaxed">
            Get our latest code blueprints, machine learning fine-tuning schedules, and performance audits sent directly to your desk.
          </p>
          <div className="pt-4 max-w-md mx-auto">
            {newsletterSubscribed ? (
              <p className="text-xs text-red-600 font-body font-semibold py-3">
                ✓ Successfully subscribed to RedFort Technical Insights.
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNewsletterSubscribed(true);
                  e.currentTarget.reset();
                }}
                className="flex font-body"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your corporate email"
                  className="flex-grow bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 px-4 py-3 rounded-l text-xs focus:outline-none focus:border-red-600"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-r text-xs font-sans font-bold tracking-widest cursor-pointer"
                >
                  SUBSCRIBE
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
