import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setupHeadingReveals } from "./useRevealHeading";
import { setupTextReveals } from "./useRevealText";
import { setupCardReveals } from "./useRevealCards";
import { setupStandaloneImageTilts } from "./useTiltImage";
import { setupCardHovers } from "./useCardHover";

gsap.registerPlugin(ScrollTrigger);

// Global GSAP config — applied once
gsap.config({ force3D: true });

/**
 * Global scroll animations orchestrator.
 *
 * Performance architecture:
 *
 * 1. MutationObserver DISCONNECTS before initAllAnimations runs.
 *    Prevents heading innerHTML splits from re-triggering the observer
 *    (the primary infinite-loop + freeze cause).
 *
 * 2. Observer callback is DEBOUNCED (150ms).
 *    Coalesces rapid successive API/React mutations into one reinit.
 *
 * 3. ScrollTrigger.refresh() runs ONCE after init, in a rAF.
 *    Never called inside the observer callback.
 *
 * 4. All ScrollTriggers are killed on cleanup via ScrollTrigger.getAll().
 *
 * 5. Button reveal uses force3D + transform only (no layout props).
 *
 * 6. Observer starts after preloader is guaranteed complete (3500ms).
 *    Initial animations start after first paint (100ms).
 */
export function useScrollAnimations() {
  useEffect(() => {
    if (window.location.pathname.startsWith("/careers")) return;

    let observer: MutationObserver | null = null;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let isRunning = false;

    // ── Button reveal ──────────────────────────────────────────────
    const initButtonReveals = (container: HTMLElement | Document = document) => {
      const buttons = container.querySelectorAll<HTMLElement>("[data-animate='button']");
      buttons.forEach((btn) => {
        if (btn.dataset.btnInitialized === "true") return;
        btn.dataset.btnInitialized = "true";

        gsap.set(btn, { y: 28, opacity: 0, force3D: true });
        gsap.timeline({
          scrollTrigger: {
            trigger: btn,
            start: "top 90%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }).to(btn, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.5)",
          force3D: true,
          overwrite: "auto",
        });
      });
    };

    // ── Main init ─────────────────────────────────────────────────
    const initAllAnimations = (container: HTMLElement | Document = document) => {
      setupHeadingReveals(container);
      setupTextReveals(container);
      setupCardReveals(container);
      setupStandaloneImageTilts(container);
      setupCardHovers(container);
      initButtonReveals(container);
    };

    // ── Safe reinit (disconnect → run → reconnect) ────────────────
    const safeReinit = () => {
      if (isRunning) return;
      isRunning = true;

      if (observer) observer.disconnect();

      initAllAnimations();

      // Refresh layout calculations after DOM mutations settle
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        requestAnimationFrame(() => {
          if (observer) {
            observer.observe(document.body, { childList: true, subtree: true });
          }
          isRunning = false;
        });
      });
    };

    // ── Initial setup — deferred to avoid blocking first paint ────
    const initTimer = setTimeout(() => {
      if (observer) observer.disconnect();
      initAllAnimations();
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, 100);

    // ── MutationObserver — starts after preloader is done ─────────
    const observerTimer = setTimeout(() => {
      observer = new MutationObserver((mutations) => {
        // Only react to actual new DOM nodes (not attribute / style changes)
        const hasNewNodes = mutations.some((m) => m.addedNodes.length > 0);
        if (!hasNewNodes) return;

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(safeReinit, 150);
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }, 3500);

    // ── Cleanup ───────────────────────────────────────────────────
    return () => {
      clearTimeout(initTimer);
      clearTimeout(observerTimer);
      if (debounceTimer) clearTimeout(debounceTimer);
      if (observer) observer.disconnect();

      // Kill all ScrollTriggers created by this orchestrator
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
}