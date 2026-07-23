import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { LucideIcon } from "./LucideIcon";

const HERO_API_URL = "/api/v1/public/homepage";
const IMAGE_BASE_URL = "/api/v1/public";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800";

const fallbackHeroContent = {
  title: "Building Digital Solutions That Empower Businesses",
  description:
    "RedFort AI delivers innovative, scalable, and highly secure AI integrations and full-stack software architectures designed to amplify enterprise productivity.",
  buttonText: "EXPLORE SERVICES",
  image: FALLBACK_IMAGE,
};

function resolveHeroImage(image?: string) {
  if (!image) return FALLBACK_IMAGE;
  if (/^https?:\/\//i.test(image)) {
    return image.replace("http://localhost:5000", "");
  }
  if (image.startsWith("/uploads/")) return `${IMAGE_BASE_URL}${image}`;
  if (image.startsWith("/api/v1/public")) return image;
  return image;
}

function normalizeHeroPayload(payload: any) {
  const data = payload?.data ?? payload;

  return {
    title: data?.heroTitle || fallbackHeroContent.title,
    description: data?.heroDescription || fallbackHeroContent.description,
    buttonText: data?.buttonText || fallbackHeroContent.buttonText,
    image: resolveHeroImage(data?.heroImage),
  };
}

export function Hero() {
  const trustBadges = [
    { label: "Innovative Solutions", icon: "Lightbulb" },
    { label: "Experienced Team", icon: "Users" },
    { label: "Customer Focused", icon: "HeartHandshake" },
    { label: "Quality Support", icon: "ShieldCheck" },
  ];

  const [heroContent, setHeroContent] = useState(fallbackHeroContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadHeroContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(HERO_API_URL);

        if (!response.ok) {
          throw new Error(`Failed to fetch hero content (${response.status})`);
        }

        const payload = await response.json();

        if (!isMounted) return;

        setHeroContent(normalizeHeroPayload(payload));
      } catch (error) {
        console.error("Hero: failed to load homepage data", error);
        if (isMounted) {
          setHeroContent(fallbackHeroContent);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHeroContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const heroTitle = heroContent.title;
  const heroDescription = heroContent.description;
  const primaryButtonText = heroContent.buttonText;
  const heroImage = heroContent.image;

  return (
    <header className="relative bg-black text-white min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Dynamic graphic glow layers */}
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute -left-10 -top-10 w-96 h-96 bg-white/[0.01] blur-[120px] rounded-full pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Column 1: Left Text Block */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight leading-tight"
            >
              {loading ? (
                <>
                  <div className="h-12 md:h-14 lg:h-16 w-full max-w-3xl rounded bg-neutral-800/70 animate-pulse" />
                  <div className="mt-3 h-12 md:h-14 lg:h-16 w-4/5 max-w-2xl rounded bg-neutral-800/70 animate-pulse" />
                </>
              ) : (
                heroTitle
              )}
            </motion.h1>

            {/* Description Paragraph */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-neutral-400 text-base md:text-lg max-w-xl leading-relaxed font-body"
            >
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 w-full rounded bg-neutral-800/70 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-neutral-800/70 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-neutral-800/70 animate-pulse" />
                </div>
              ) : (
                heroDescription
              )}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              {loading ? (
                <div className="inline-flex h-14 w-44 animate-pulse rounded bg-neutral-800/70" />
              ) : (
                <Link
                  to="/services"
                  className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold tracking-widest px-8 py-4 rounded transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-red-600/10"
                >
                  <span>{primaryButtonText}</span>
                  <span>→</span>
                </Link>
              )}

              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-white border border-red-600 hover:bg-neutral-50 text-red-600 font-sans text-xs font-bold tracking-widest px-8 py-4 rounded transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-red-600/5"
              >
                <span>LEARN MORE</span>
              </Link>
            </motion.div>

            {/* Trust Badges Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-neutral-900"
            >
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="p-1.5 bg-neutral-950 border border-neutral-900 rounded text-red-600 shrink-0">
                    <LucideIcon name={badge.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-neutral-400 text-xxs font-body uppercase tracking-wider font-semibold">
                    {badge.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Column 2: Right Image Block */}
          <div className="lg:col-span-5 relative hidden lg:block">
            {/* Absolute background accent ring */}
            <div className="absolute inset-0 bg-red-600 rounded-3xl rotate-6 translate-x-4 translate-y-4 opacity-10 blur-sm -z-10" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-3xl overflow-hidden border-8 border-neutral-950 shadow-2xl aspect-[4/5] max-w-[400px] mx-auto"
            >
              {loading ? (
                <div className="w-full h-full bg-neutral-800/70 animate-pulse" />
              ) : (
                <>
                  <img
                    src={heroImage}
                    alt={heroTitle}
                    className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Soft overlay red tint block */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent mix-blend-multiply opacity-40" />
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
