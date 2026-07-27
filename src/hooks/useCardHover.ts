import { useEffect } from "react";
import gsap from "gsap";

/**
 * Production-grade card hover system with premium 3D tilt.
 * Behave exactly like the Hero image 3D tilt with proper perspective, smooth inertia, and parallax.
 */
const cleanupRegistry = new Map<HTMLElement, () => void>();

export function setupCardHovers(container: HTMLElement | Document = document) {
  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (isReducedMotion) return;

  const cardContainers = container.querySelectorAll<HTMLElement>("[data-animate='card']");

  cardContainers.forEach((cardContainer) => {
    if (
      cardContainer.closest("[data-page='careers']") ||
      window.location.pathname.startsWith("/careers")
    ) {
      return;
    }

    const cards = Array.from(cardContainer.children).filter(
      (child) =>
        child.tagName !== "STYLE" &&
        child.tagName !== "SCRIPT" &&
        !child.classList.contains("loading") &&
        !child.classList.contains("error")
    ) as HTMLElement[];

    cards.forEach((card) => {
      if (card.dataset.hoverInitialized === "true") return;
      card.dataset.hoverInitialized = "true";

      // ── Cache DOM references once ──────────────────────────────
      const img = card.querySelector<HTMLElement>("img, [data-card-image]");
      const icon = card.querySelector<HTMLElement>("svg, [data-card-icon]");
      const badge = card.querySelector<HTMLElement>("[data-card-badge], span.badge");
      const button = card.querySelector<HTMLElement>("a, button, [role='button']");

      // Set transform style and perspective on the card
      card.style.transformStyle = "preserve-3d";
      gsap.set(card, { transformPerspective: 1000, transformOrigin: "center center" });

      // Elements that might contain CSS transitions (disable them temporarily during hover)
      const elementsToDisableTransition = [card, img, icon, badge, button].filter(Boolean) as HTMLElement[];

      // ── quickTo setters — configured with smooth inertia (duration: 0.5) like Hero image tilt ──
      const qCard = {
        rotX: gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
        rotY: gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
        y: gsap.quickTo(card, "y", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
        scale: gsap.quickTo(card, "scale", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
      };

      const qImg = img ? {
        x: gsap.quickTo(img, "x", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
        y: gsap.quickTo(img, "y", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
        scale: gsap.quickTo(img, "scale", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
      } : null;

      const qIcon = (icon && icon !== img) ? {
        x: gsap.quickTo(icon, "x", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
        y: gsap.quickTo(icon, "y", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
      } : null;

      const qBadge = (badge && badge !== img) ? {
        x: gsap.quickTo(badge, "x", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
        y: gsap.quickTo(badge, "y", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
      } : null;

      const qButton = (button && button !== img) ? {
        x: gsap.quickTo(button, "x", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
        y: gsap.quickTo(button, "y", { duration: 0.5, ease: "power2.out", force3D: true, overwrite: "auto" }),
      } : null;

      // ── Cached rect — refreshed on each mouseenter ─────────────
      let rect = { left: 0, top: 0, width: 0, height: 0 };

      const handleMouseEnter = () => {
        rect = card.getBoundingClientRect();
        
        // Temporarily disable CSS transition property so GSAP can animate instantly and smoothly
        elementsToDisableTransition.forEach((el) => {
          el.style.transition = "none";
        });

        // Smoothly fade premium shadow in
        gsap.to(card, {
          boxShadow: "0 25px 50px -12px rgba(222, 24, 27, 0.18), 0 12px 24px -6px rgba(0, 0, 0, 0.12)",
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto"
        });
      };

      const handleMouseMove = (e: MouseEvent) => {
        const normX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const normY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        // Premium 3D Tilt values: 9 degrees max tilt, -10px lift, scale 1.035
        qCard.rotX(normY * -9);
        qCard.rotY(normX * 9);
        qCard.y(-10);
        qCard.scale(1.035);

        // Image: noticeable 14px inverse parallax + 1.08 zoom
        if (qImg) {
          qImg.x(normX * -14);
          qImg.y(normY * -14);
          qImg.scale(1.08);
        }

        // Icon, Badge, Button: subtle parallax inside the 3D space
        if (qIcon) {
          qIcon.x(normX * 6);
          qIcon.y(normY * 6);
        }
        if (qBadge) {
          qBadge.x(normX * 5);
          qBadge.y(normY * 5);
        }
        if (qButton) {
          qButton.x(normX * 4);
          qButton.y(normY * 4);
        }
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          scale: 1,
          boxShadow: "0 0px 0px 0px rgba(0, 0, 0, 0)",
          duration: 0.6,
          ease: "power3.out",
          force3D: true,
          overwrite: "auto",
          onComplete: () => {
            // Restore normal CSS transitions when animation settles
            elementsToDisableTransition.forEach((el) => {
              el.style.transition = "";
            });
          }
        });

        if (img) gsap.to(img, { x: 0, y: 0, scale: 1, duration: 0.6, ease: "power3.out", force3D: true, overwrite: "auto" });
        if (icon && icon !== img) gsap.to(icon, { x: 0, y: 0, duration: 0.6, ease: "power3.out", force3D: true, overwrite: "auto" });
        if (badge && badge !== img) gsap.to(badge, { x: 0, y: 0, duration: 0.6, ease: "power3.out", force3D: true, overwrite: "auto" });
        if (button && button !== img) gsap.to(button, { x: 0, y: 0, duration: 0.6, ease: "power3.out", force3D: true, overwrite: "auto" });
      };

      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mousemove", handleMouseMove);
      card.addEventListener("mouseleave", handleMouseLeave);

      // ── Cleanup ────────────────────────────────────────────────
      const cleanup = () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mousemove", handleMouseMove);
        card.removeEventListener("mouseleave", handleMouseLeave);
        const targets = [card, img, icon, badge, button].filter(Boolean) as HTMLElement[];
        gsap.killTweensOf(targets);
        cleanupRegistry.delete(card);
      };
      cleanupRegistry.set(card, cleanup);
    });
  });
}

export function cleanupAllCardHovers() {
  cleanupRegistry.forEach((fn) => fn());
  cleanupRegistry.clear();
}

export function useCardHover() {
  useEffect(() => {
    setupCardHovers();
    return cleanupAllCardHovers;
  }, []);
}
