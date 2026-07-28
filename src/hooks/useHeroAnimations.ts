import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP Hero Animations Hook — TEXT ONLY
 *
 * Only animates the heading lines (word-by-word blur + y stagger).
 * All non-text animations (grid, glow, badge, buttons, image, trust, parallax)
 * have been removed per the new animation architecture.
 *
 * Remaining animation:
 * - Heading lines: opacity 0 → 1, blur 15px → 0, y 80 → 0, line-by-line stagger
 */
export function useHeroAnimations(
  containerRef: React.RefObject<HTMLDivElement | null>,
  headingRef: React.RefObject<HTMLHeadingElement | null>,
  isReducedMotion: boolean
) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const ctx = gsap.context(() => {
      if (isReducedMotion) {
        gsap.set(
          [headingRef.current?.children],
          { opacity: 1, y: 0, filter: "blur(0px)" }
        );
        return;
      }

      const headingEl = headingRef.current;
      const headingLines: HTMLElement[] = [];
      if (headingEl) {
        headingEl.querySelectorAll(".hero-heading-line").forEach((line) => {
          headingLines.push(line as HTMLElement);
        });
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      // ONLY heading lines reveal (text animation)
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

      timelineRef.current = tl;
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