import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Modular hook for Card Reveal Animations
 *
 * Target: Service, Blog, Team, Industry, and Case Study cards
 *
 * Spec:
 * - Opacity: 0 → 1
 * - Y: 40 → 0
 * - Scale: 0.95 → 1
 * - Duration: 0.7s
 * - Ease: power3.out
 * - Stagger: 0.08s
 * - Replay on scroll back (toggleActions: play reverse play reverse)
 *
 * Performance:
 * - force3D: true — only transform + opacity, GPU composited
 * - overwrite: "auto" — no tween queue buildup
 * - No width/height/filter/color animations
 */
export function setupCardReveals(container: HTMLElement | Document = document) {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cardContainers = container.querySelectorAll<HTMLElement>("[data-animate='card']");

  cardContainers.forEach((cardContainer) => {
    if (
      cardContainer.closest("[data-page='careers']") ||
      window.location.pathname.startsWith("/careers")
    ) {
      return;
    }

    if (cardContainer.dataset.cardsInitialized === "true") return;

    const cards = Array.from(cardContainer.children).filter(
      (child) =>
        child.tagName !== "STYLE" &&
        child.tagName !== "SCRIPT" &&
        !child.classList.contains("loading") &&
        !child.classList.contains("error")
    ) as HTMLElement[];

    if (cards.length === 0) return;

    cardContainer.dataset.cardsInitialized = "true";

    if (isReducedMotion) {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1, force3D: true });
      return;
    }

    gsap.set(cards, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      force3D: true,
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: cardContainer,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play reverse play reverse",
      },
    }).to(cards, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: "power3.out",
      stagger: 0.08,
      force3D: true,
      overwrite: "auto",
    });
  });
}

export function useRevealCards() {
  useEffect(() => {
    setupCardReveals();
  }, []);
}
