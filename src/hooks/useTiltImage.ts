import { useEffect } from "react";
import gsap from "gsap";

/**
 * Modular hook for 3D Tilt on Standalone Images.
 *
 * Max rotation: 5° (reduced from 6° for premium subtlety)
 * Perspective: 1000px
 * Scale on tilt: 1.02
 *
 * Performance:
 * - mousemove throttled via rAF
 * - force3D: true
 * - overwrite: "auto"
 * - Cleanup registry for proper listener removal
 */
const tiltCleanupRegistry = new Map<HTMLElement, () => void>();

export function setupStandaloneImageTilts(container: HTMLElement | Document = document) {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReducedMotion) return;

  const tiltContainers = container.querySelectorAll<HTMLElement>("[data-tilt='standalone']");

  tiltContainers.forEach((cardOrContainer) => {
    if (
      cardOrContainer.closest("[data-page='careers']") ||
      window.location.pathname.startsWith("/careers")
    ) {
      return;
    }

    if (cardOrContainer.dataset.tiltInitialized === "true") return;
    cardOrContainer.dataset.tiltInitialized = "true";

    const inner = (cardOrContainer.querySelector(".tilt-inner, img") ||
      cardOrContainer) as HTMLElement;
    cardOrContainer.style.perspective = "1000px";

    let rafId: number | null = null;
    let latestRotateX = 0;
    let latestRotateY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardOrContainer.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      latestRotateX = ((e.clientY - rect.top - centerY) / centerY) * -5;
      latestRotateY = ((e.clientX - rect.left - centerX) / centerX) * 5;

      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        gsap.to(inner, {
          rotateX: latestRotateX,
          rotateY: latestRotateY,
          scale: 1.02,
          duration: 0.2,
          ease: "power2.out",
          transformPerspective: 1000,
          transformOrigin: "center center",
          force3D: true,
          overwrite: "auto",
        });
      });
    };

    const handleMouseLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      gsap.killTweensOf(inner);
      gsap.to(inner, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
        transformPerspective: 1000,
        force3D: true,
        overwrite: "auto",
      });
    };

    cardOrContainer.addEventListener("mousemove", handleMouseMove);
    cardOrContainer.addEventListener("mouseleave", handleMouseLeave);

    const cleanup = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      cardOrContainer.removeEventListener("mousemove", handleMouseMove);
      cardOrContainer.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(inner);
      tiltCleanupRegistry.delete(cardOrContainer);
    };
    tiltCleanupRegistry.set(cardOrContainer, cleanup);
  });
}

export function cleanupAllTilts() {
  tiltCleanupRegistry.forEach((fn) => fn());
  tiltCleanupRegistry.clear();
}

export function useTiltImage() {
  useEffect(() => {
    setupStandaloneImageTilts();
    return () => {
      cleanupAllTilts();
    };
  }, []);
}
