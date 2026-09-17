import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

interface ScrollToOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
  lock?: boolean;
}

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (
    target: string | HTMLElement | number,
    options?: ScrollToOptions
  ) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respeita acessibilidade de usuários que preferem movimento reduzido
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Configuração refinada para sensação fluida e amanteigada ("momentum" orgânico)
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenisRef.current = lenis;
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  const scrollTo = (
    target: string | HTMLElement | number,
    options?: ScrollToOptions
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.25,
        immediate: options?.immediate ?? false,
        lock: options?.lock ?? false,
      });
      return;
    }

    // Fallback nativo caso Lenis esteja desabilitado
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior: "smooth" });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      if (el) {
        const top =
          el.getBoundingClientRect().top +
          window.scrollY +
          (options?.offset ?? 0);
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    } else if (target instanceof HTMLElement) {
      const top =
        target.getBoundingClientRect().top +
        window.scrollY +
        (options?.offset ?? 0);
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    }
  };

  return (
    <SmoothScrollContext.Provider
      value={{ lenis: lenisRef.current, scrollTo }}
    >
      {children}
    </SmoothScrollContext.Provider>
  );
}
