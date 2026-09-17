import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respeita acessibilidade de usuários que preferem movimento reduzido
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // Configuração refinada e fluida com inércia pronunciada e elegante (mouse, trackpad e touch)
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.4,
      infinite: false,
      prevent: (node: HTMLElement) => {
        return (
          node.nodeName === "INPUT" ||
          node.nodeName === "TEXTAREA" ||
          node.nodeName === "SELECT" ||
          node.isContentEditable ||
          Boolean(node.closest?.("[data-lenis-prevent]"))
        );
      },
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    // Disponibiliza no objeto window global para inspeção e controle
    (window as unknown as { lenis: Lenis }).lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Interceptação global de links âncora (#) com rolagem suave
    const handleAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      if (!link) return;

      // Não intercepta se o link ou elemento pai tiver data-lenis-prevent
      if (link.closest("[data-lenis-prevent]")) return;

      const href = link.getAttribute("href");
      if (!href || href === "#" || href === "#/") return;

      let target: HTMLElement | null = null;
      try {
        target = document.querySelector<HTMLElement>(href);
      } catch {
        target = document.getElementById(href.replace(/^#/, ""));
      }

      if (target) {
        event.preventDefault();

        // Compensação da altura do header fixo/sticky
        const header = document.querySelector<HTMLElement>(".site-header");
        const headerHeight = header ? header.offsetHeight : 72;

        lenis.scrollTo(target, {
          offset: -headerHeight,
          duration: 1.4,
        });

        if (window.history.pushState) {
          window.history.pushState(null, "", href);
        }

        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  const scrollTo = useCallback(
    (
      target: string | HTMLElement | number,
      options?: ScrollToOptions
    ) => {
      const activeLenis = lenisRef.current;
      if (activeLenis) {
        activeLenis.scrollTo(target, {
          offset: options?.offset ?? 0,
          duration: options?.duration ?? 1.4,
          immediate: options?.immediate ?? false,
          lock: options?.lock ?? false,
        });
        return;
      }

      // Fallback nativo caso Lenis esteja desabilitado
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else if (typeof target === "string") {
        const id = target.replace(/^#/, "");
        const el =
          document.getElementById(id) ||
          document.querySelector<HTMLElement>(target);
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
    },
    []
  );

  const contextValue = useMemo(
    () => ({ lenis: lenisInstance, scrollTo }),
    [lenisInstance, scrollTo]
  );

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
