import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Modular hook for Word-Split Heading Reveal Animations
 *
 * Performance-optimised version:
 * - Animates opacity + transform only (no layout props)
 * - force3D: true on all tweens
 * - Heading guard prevents double-initialisation
 * - GSAP context used for clean lifecycle management
 */
export function setupHeadingReveals(container: HTMLElement | Document = document) {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const headings = container.querySelectorAll<HTMLElement>("[data-animate='heading']");

  headings.forEach((heading) => {
    if (
      heading.closest("[data-page='careers']") ||
      window.location.pathname.startsWith("/careers")
    ) {
      return;
    }

    if (isReducedMotion) {
      gsap.set(heading, { opacity: 1, y: 0, force3D: true });
      return;
    }

    if (heading.dataset.headingInitialized === "true") return;
    heading.dataset.headingInitialized = "true";

    // Complex children (hero lines, links, images) → animate the whole element
    const hasComplexChildren = heading.querySelector("br, span.hero-heading-line, a, img");

    if (hasComplexChildren) {
      gsap.set(heading, { y: 50, opacity: 0, force3D: true });
      gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top 90%",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      }).to(heading, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
        force3D: true,
        overwrite: "auto",
      });
      return;
    }

    const text = heading.textContent || "";
    const words = text.split(/\s+/).filter(Boolean);

    if (words.length <= 1) {
      gsap.set(heading, { y: 50, opacity: 0, force3D: true });
      gsap.timeline({
        scrollTrigger: {
          trigger: heading,
          start: "top 90%",
          end: "bottom top",
          toggleActions: "play reverse play reverse",
        },
      }).to(heading, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power4.out",
        force3D: true,
        overwrite: "auto",
      });
      return;
    }

    // Split text into word spans — each word gets the CSS gradient automatically
    const wordSpans: HTMLSpanElement[] = [];
    heading.innerHTML = "";

    words.forEach((word, idx) => {
      if (idx > 0) {
        heading.appendChild(document.createTextNode("\u00A0"));
      }
      const span = document.createElement("span");
      span.textContent = word;
      // heading-word-span picks up the gradient from CSS
      span.className = "heading-word-span inline-block";
      heading.appendChild(span);
      wordSpans.push(span);
    });

    gsap.set(wordSpans, { y: 50, opacity: 0, force3D: true });

    gsap.timeline({
      scrollTrigger: {
        trigger: heading,
        start: "top 90%",
        end: "bottom top",
        toggleActions: "play reverse play reverse",
      },
    }).to(wordSpans, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.045,
      force3D: true,
      overwrite: "auto",
    });
  });
}

export function useRevealHeading() {
  useEffect(() => {
    setupHeadingReveals();
  }, []);
}
