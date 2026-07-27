import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Modular hook for Soft Paragraph/Text Reveal Animations
 *
 * Spec:
 * - Opacity: 0 → 1
 * - Y: 30 → 0
 * - Duration: 0.7s
 * - Ease: power3.out
 * - force3D: true — GPU composited only
 * - No layout-thrashing properties (no width/height/filter)
 */
export function setupTextReveals(container: HTMLElement | Document = document) {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = container.querySelectorAll<HTMLElement>("[data-animate='text']");

  elements.forEach((el) => {
    if (
      el.closest("[data-page='careers']") ||
      window.location.pathname.startsWith("/careers")
    ) {
      return;
    }

    if (isReducedMotion) {
      gsap.set(el, { opacity: 1, y: 0, force3D: true });
      return;
    }

    if (el.dataset.textInitialized === "true") return;
    el.dataset.textInitialized = "true";

    gsap.set(el, { y: 30, opacity: 0, force3D: true });

    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        end: "bottom top",
        toggleActions: "play reverse play reverse",
      },
    }).to(el, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power3.out",
      force3D: true,
      overwrite: "auto",
    });
  });
}

export function useRevealText() {
  useEffect(() => {
    setupTextReveals();
  }, []);
}
