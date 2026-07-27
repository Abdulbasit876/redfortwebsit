import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP Hero Animations Hook
 * Handles all entrance animations, scroll effects, and micro-interactions
 *
 * Animation specs:
 * - Heading: opacity 0 → 1, blur 15px → 0, y 80 → 0, line-by-line stagger
 * - Description: fade upward after heading
 * - Buttons: stagger after description
 * - Image: scale 0.9 → 1, fade + blur reveal
 * - Background grid: animated opacity, subtle movement
 * - Parallax: grid slowest, text medium, image slightly more
 */
export function useHeroAnimations(
  containerRef: React.RefObject<HTMLDivElement | null>,
  headingRef: React.RefObject<HTMLHeadingElement | null>,
  descriptionRef: React.RefObject<HTMLElement | null>,
  buttonsRef: React.RefObject<HTMLDivElement | null>,
  imageRef: React.RefObject<HTMLDivElement | null>,
  gridRef: React.RefObject<HTMLDivElement | null>,
  glowRef: React.RefObject<HTMLDivElement | null>,
  trustRef: React.RefObject<HTMLDivElement | null>,
  isReducedMotion: boolean
) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const ctx = gsap.context(() => {
      // ===== REDUCED MOTION =====
      if (isReducedMotion) {
        gsap.set(
          [
            headingRef.current?.children,
            descriptionRef.current,
            buttonsRef.current,
            imageRef.current,
            trustRef.current,
          ],
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        );
        return;
      }

      // ===== SPLIT HEADING LINES =====
      const headingEl = headingRef.current;
      const headingLines: HTMLElement[] = [];
      if (headingEl) {
        headingEl.querySelectorAll(".hero-heading-line").forEach((line) => {
          headingLines.push(line as HTMLElement);
        });
      }

      // ===== MAIN ENTRANCE TIMELINE =====
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // 1. Background grid - animated opacity
      if (gridRef.current) {
        tl.fromTo(
          gridRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: "power2.out" },
          0
        );
      }

      // 2. Glow/ambient fade in
      if (glowRef.current) {
        tl.fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
          0.1
        );
      }

      // 3. Premium badge reveal
      const badge = containerRef.current?.querySelector(".hero-premium-badge");
      if (badge) {
        tl.fromTo(
          badge,
          { y: 20, opacity: 0, filter: "blur(4px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6 },
          0.15
        );
      }

      // 4. Heading lines reveal (opacity:0, blur:15px, y:80 → opacity:1, blur:0, y:0)
      if (headingLines.length > 0) {
        headingLines.forEach((line, i) => {
          tl.fromTo(
            line,
            { y: 80, opacity: 0, filter: "blur(15px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1,
              ease: "power3.out",
            },
            i * 0.18 + 0.3
          );
        });
      }

      // 5. Description fade upward (after heading)
      if (descriptionRef.current) {
        tl.fromTo(
          descriptionRef.current,
          { y: 40, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.15"
        );
      }

      // 6. Buttons stagger
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.querySelectorAll(".hero-btn");
        tl.fromTo(
          buttons,
          { y: 30, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );
      }

      // 7. Image scale and fade with blur
      if (imageRef.current) {
        const imgInner = imageRef.current.querySelector(".hero-image-inner");
        const imgGlow = imageRef.current.querySelector(".hero-image-glow");
        if (imgInner) {
          tl.fromTo(
            imgInner,
            { scale: 0.9, opacity: 0, filter: "blur(8px)", y: 30 },
            {
              scale: 1,
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 1.2,
              ease: "power3.out",
            },
            "-=0.5"
          );
        }
        if (imgGlow) {
          tl.fromTo(
            imgGlow,
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 1.5, ease: "power2.out" },
            "-=0.8"
          );
        }
      }

      // 8. Trust badges
      if (trustRef.current) {
        tl.fromTo(
          trustRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
          "-=0.3"
        );
      }

      timelineRef.current = tl;

      // ===== SCROLL ANIMATIONS (Parallax) =====
      // Grid moves slowest
      if (gridRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            if (gridRef.current) {
              gsap.set(gridRef.current, {
                y: self.progress * 60,
              });
            }
          },
        });
      }

      // Text content moves slightly faster
      const textCol = containerRef.current?.querySelector(".hero-text-column");
      if (textCol) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            gsap.set(textCol, {
              y: self.progress * 30,
            });
          },
        });
      }

      // Image moves slightly more
      if (imageRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            if (imageRef.current) {
              gsap.set(imageRef.current, {
                y: self.progress * 50,
              });
            }
          },
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReducedMotion]);
}

/**
 * 3D Tilt effect on the hero image
 */
export function useImageTilt(
  imageContainerRef: React.RefObject<HTMLDivElement | null>,
  isReducedMotion: boolean
) {
  useEffect(() => {
    if (isReducedMotion || !imageContainerRef.current) return;

    const container = imageContainerRef.current;
    const inner = container.querySelector(".hero-image-inner") as HTMLElement;
    if (!inner) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      gsap.to(inner, {
        rotateX,
        rotateY,
        scale: 1.02,
        duration: 0.6,
        ease: "power2.out",
        transformPerspective: 1000,
        transformOrigin: "center center",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(inner, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        transformPerspective: 1000,
      });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [imageContainerRef, isReducedMotion]);
}

/**
 * Floating animation for the hero image
 * Subtle Y-axis oscillation
 */
export function useFloatingAnimation(
  imageRef: React.RefObject<HTMLDivElement | null>,
  isReducedMotion: boolean
) {
  useEffect(() => {
    if (isReducedMotion || !imageRef.current) return;

    const inner = imageRef.current.querySelector(
      ".hero-image-inner"
    ) as HTMLElement;
    if (!inner) return;

    gsap.to(inner, {
      y: 8,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      gsap.killTweensOf(inner);
    };
  }, [imageRef, isReducedMotion]);
}