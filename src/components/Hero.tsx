import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { LucideIcon } from "./LucideIcon";
import { apiUrl, getImageUrl } from "../lib/api";
import { useHeroAnimations } from "../hooks/useHeroAnimations";
import { useMotionTilt } from "../hooks/useMotionTilt";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800";

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
    return image;
  }
  return getImageUrl(image);
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
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Refs for GSAP text animations
  const containerRef = useRef<HTMLDivElement>(null!);
  const headingRef = useRef<HTMLHeadingElement>(null!);

  // Motion tilt for hero image
  const tilt = useMotionTilt(1.02, 6);

  // Check for reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // GSAP hero text animations only
  useHeroAnimations(
    containerRef,
    headingRef,
    isReducedMotion
  );

  // Fetch hero content (unchanged business logic)
  useEffect(() => {
    let isMounted = true;

    const loadHeroContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl("/homepage"));

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

  // Split title into lines for line-by-line animation
  const titleLines = heroTitle.split(/(?<=\.) |\n/).filter(Boolean);

  return (
    <header
      ref={containerRef}
      className="relative bg-black text-white min-h-screen flex items-center pt-28 pb-20 overflow-hidden"
    >
      {/* ===== AMBIENT GLOW LAYERS ===== */}
      {/* Main red ambient glow behind image area */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 blur-[180px] rounded-full pointer-events-none will-change-transform" />
      {/* Secondary subtle white glow */}
      <div className="absolute -left-20 -top-20 w-96 h-96 bg-white/[0.02] blur-[150px] rounded-full pointer-events-none" />
      {/* Bottom right accent glow */}
      <div className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />

      {/* ===== ENHANCED GRID BACKGROUND ===== */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:48px_48px] pointer-events-none will-change-transform" />
      {/* Subtle radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* ===== COLUMN 1: TEXT CONTENT ===== */}
          <div className="hero-text-column w-full lg:w-[55%] space-y-8 lg:space-y-10">
            {/* Premium badge */}
            <div className="hero-premium-badge inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
              <span className="text-[10px] md:text-xs text-neutral-400 font-body font-medium tracking-[0.2em] uppercase">
                AI-Powered Enterprise Solutions
              </span>
            </div>

            {/* ===== MAIN HEADLINE (line-by-line reveal) ===== */}
            <h1
              ref={headingRef}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight leading-[1.1]"
            >
              {loading ? (
                <>
                  <div className="h-12 md:h-14 lg:h-16 w-full max-w-3xl rounded bg-neutral-800/70 animate-pulse" />
                  <div className="mt-3 h-12 md:h-14 lg:h-16 w-4/5 max-w-2xl rounded bg-neutral-800/70 animate-pulse" />
                </>
              ) : (
                titleLines.map((line, i) => (
                  <span
                    key={i}
                    className="hero-heading-line block will-change-transform"
                  >
                    {line}
                    {i < titleLines.length - 1 && <br />}
                  </span>
                ))
              )}
            </h1>

            {/* ===== DESCRIPTION ===== */}
            <div className="text-neutral-400 text-base md:text-lg lg:text-xl max-w-xl leading-relaxed font-body will-change-transform">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 w-full rounded bg-neutral-800/70 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-neutral-800/70 animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-neutral-800/70 animate-pulse" />
                </div>
              ) : (
                heroDescription
              )}
            </div>

            {/* ===== ACTION BUTTONS ===== */}
            <div className="flex flex-wrap gap-5 pt-2">
              {loading ? (
                <div className="inline-flex h-14 w-44 animate-pulse rounded bg-neutral-800/70" />
              ) : (
                <Link
                  to="/services"
                  className="hero-btn group relative inline-flex items-center gap-3 bg-red-600 text-white font-sans text-xs font-bold tracking-[0.15em] px-8 py-4 rounded-lg overflow-hidden transition-all duration-500 will-change-transform hover:scale-105"
                >
                  {/* Hover glow effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {/* Shine sweep */}
                  <span className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)] translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  {/* Soft glow shadow */}
                  <span className="absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(222,24,27,0.3)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10">{primaryButtonText}</span>
                  <span className="relative z-10 inline-block transition-all duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-0.5">
                    →
                  </span>
                </Link>
              )}

              <Link
                to="/about"
                className="hero-btn group relative inline-flex items-center gap-3 bg-transparent border border-white/20 text-white font-sans text-xs font-bold tracking-[0.15em] px-8 py-4 rounded-lg overflow-hidden transition-all duration-500 will-change-transform hover:scale-105"
              >
                {/* Hover fill background */}
                <span className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
                {/* Border glow on hover */}
                <span className="absolute inset-0 rounded-lg border border-red-600/0 group-hover:border-red-600/50 transition-all duration-500" />
                <span className="relative z-10 transition-colors duration-500 group-hover:text-white">
                  LEARN MORE
                </span>
                <span className="relative z-10 inline-block transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-white">
                  →
                </span>
              </Link>
            </div>

            {/* ===== TRUST BADGES ===== */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/[0.06] will-change-transform">
              {trustBadges.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="p-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-red-600 shrink-0 transition-all duration-300 group-hover:bg-red-600/10 group-hover:border-red-600/20 group-hover:shadow-lg group-hover:shadow-red-600/5">
                    <LucideIcon name={badge.icon} className="w-4 h-4" />
                  </div>
                  <span className="text-neutral-500 text-[10px] md:text-xs font-body uppercase tracking-[0.15em] font-semibold leading-tight">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ===== COLUMN 2: IMAGE (ALWAYS VISIBLE) ===== */}
          <div className="w-full lg:w-[45%]">
            <motion.div
              className="relative will-change-transform"
              animate={
                !isReducedMotion
                  ? {
                      y: isHovered ? 0 : [0, -8, 0],
                    }
                  : {}
              }
              transition={
                !isReducedMotion
                  ? {
                      y: {
                        duration: 3,
                        ease: "easeInOut",
                        repeat: isHovered ? 0 : Infinity,
                        repeatType: "reverse",
                      },
                    }
                  : {}
              }
            >
              {/* Red ambient glow behind image */}
              <div className="absolute -inset-10 bg-red-600/20 blur-[100px] rounded-full opacity-0 will-change-transform" />

              {/* Image container with 3D tilt */}
              <motion.div
                className="relative"
                style={tilt.style}
                onMouseMove={(e) => {
                  setIsHovered(true);
                  tilt.onMouseMove(e);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  tilt.onMouseLeave();
                }}
              >
                <div className="hero-image-inner relative rounded-2xl overflow-hidden will-change-transform">
                  {loading ? (
                    <div className="w-full aspect-[4/5] max-w-[480px] mx-auto bg-neutral-800/70 animate-pulse rounded-2xl" />
                  ) : (
                    <>
                      {/* Glass border frame */}
                      <div className="absolute inset-0 rounded-2xl border border-white/[0.08] z-10 pointer-events-none" />
                      {/* Inner glass shine */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent z-10 pointer-events-none" />

                      {/* The image */}
                      <div className="relative aspect-[4/5] max-w-[480px] mx-auto">
                        <img
                          src={heroImage}
                          alt={heroTitle}
                          className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-700"
                          referrerPolicy="no-referrer"
                          loading="eager"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent mix-blend-multiply" />
                      </div>

                      {/* Premium layered shadow */}
                      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-red-600/5 to-transparent opacity-50 blur-xl -z-10" />
                      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-t from-black/40 to-transparent opacity-60 blur-lg -z-10" />
                      <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}