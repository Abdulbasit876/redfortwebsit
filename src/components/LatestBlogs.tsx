import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { BlogPost } from "../types";
import { SectionTitle } from "./SectionTitle";
import { LucideIcon } from "./LucideIcon";

const IMAGE_BASE_URL = "/api/v1/public";

const getImageUrl = (image?: string) => {
  if (!image) return "https://via.placeholder.com/800x450?text=No+Image";
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith("/api/v1/public")) return image;
  if (image.startsWith("/")) return `${IMAGE_BASE_URL}${image}`;
  return `${IMAGE_BASE_URL}/${image}`;
};

interface LatestBlogsProps {
  limit?: number;
  showTitle?: boolean;
}

export function LatestBlogs({ limit, showTitle = true }: LatestBlogsProps) {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/v1/public/blogs");
        if (!res.ok) {
          console.error("LatestBlogs: fetch failed", res.status);
          setPosts([]);
          return;
        }
 
        const json = await res.json();
        console.log("LatestBlogs API response:", json);

        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
          ? json.data
          : [];

        const sorted = (list || []).slice().sort((a: any, b: any) => {
          const aDate = Date.parse(a.publishedAt || a.createdAt || "") || 0;
          const bDate = Date.parse(b.publishedAt || b.createdAt || "") || 0;
          return bDate - aDate;
        });
       console.log("LatestBlogs sorted posts:", sorted);
        setPosts(sorted);
      } catch (err: any) {
        console.error("LatestBlogs: fetch error", err);
        setPosts([]);
      }
    };

    load();
  }, []);

  // Map backend items (if they don't match BlogPost shape) to required fields
  const normalize = (it: any) => {
    const contentHtml = it.content || "";
    const text = String(contentHtml).replace(/<[^>]*>/g, "").trim();
    return {
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
    } as BlogPost;
  };

  const displayedBlogs = (limit ? posts.slice(0, limit) : posts).map(normalize);
   console.log("see teh displayblogs",displayedBlogs)

  if (displayedBlogs.length === 0) {
    return (
      <section className="bg-white py-20 md:py-28 relative">
        <div className="max-w-7xl mx-auto px-6">
          {showTitle && (
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <SectionTitle
                subtitle="Latest Blogs"
                title="Insights & {Technology Trends}"
              />
              {limit && (
                <Link
                  to="/blog"
                  className="inline-flex items-center space-x-2 text-sm font-bold text-red-600 hover:text-black transition-colors duration-300 font-sans border-b-2 border-red-600 pb-1 mb-4 md:mb-12 self-start md:self-auto"
                >
                  <span>VIEW ALL ARTICLES</span>
                  <span>→</span>
                </Link>
              )}
            </div>
          )}

          <div className="text-center py-20 border border-dashed border-neutral-200 rounded-xl bg-neutral-50">
            <p className="text-sm text-neutral-500">No latest blog posts are available right now.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-6">
        {showTitle && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <SectionTitle
              subtitle="Latest Blogs"
              title="Insights & {Technology Trends}"
            />
            {limit && (
              <Link
                to="/blog"
                className="inline-flex items-center space-x-2 text-sm font-bold text-red-600 hover:text-black transition-colors duration-300 font-sans border-b-2 border-red-600 pb-1 mb-4 md:mb-12 self-start md:self-auto"
              >
                <span>VIEW ALL ARTICLES</span>
                <span>→</span>
              </Link>
            )}
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedBlogs.map((post, idx) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-red-600/20"
              id={`blog-post-${post.id}`}
            >
              {/* Cover Image */}
              <div className="h-52 overflow-hidden relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* Floating Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white font-body text-xxs font-bold px-2.5 py-1 rounded tracking-widest uppercase">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Text Content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center text-xs text-neutral-400 font-body mb-3 uppercase tracking-wider">
                    <span className="flex items-center space-x-1">
                      <LucideIcon name="Calendar" className="w-3.5 h-3.5 text-red-600" />
                      <span>{post.date}</span>
                    </span>
                    <span className="mx-2 text-neutral-300">|</span>
                    <span className="flex items-center space-x-1">
                      <LucideIcon name="User" className="w-3.5 h-3.5 text-red-600" />
                      <span>{post.author}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-black mb-3 font-sans group-hover:text-red-600 transition-colors duration-200 line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-neutral-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                  {/* Read Article Link */}
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center space-x-2 text-xs font-bold font-sans tracking-wider text-red-600 group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <span>READ ARTICLE</span>
                    <span>→</span>
                  </Link>

                  {/* Share/Action Icon placeholder */}
                  <div className="text-neutral-400 hover:text-red-600 transition-colors duration-200">
                    <LucideIcon name="Bookmark" className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
