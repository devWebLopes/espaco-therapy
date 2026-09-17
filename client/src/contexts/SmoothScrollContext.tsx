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
  /** Rolagem programática genérica (sem offset automático do header). */
  scrollTo: (
    target: string | HTMLElement | number,
    options?: ScrollToOptions
  ) => void;
  /**
   * Rolagem por âncora com offset automático do header, atualização de URL e
   * gerenciamento de foco. Use para links internos `#id`.
   */
  scrollToAnchor: (targetId: string, closeMobileMenu?: () => void) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
  scrollToAnchor: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/* -------------------------------------------------------------------------- */
/*  Funções auxiliares puras (sem dependência de estado React)                 */
/* -------------------------------------------------------------------------- */

/** Retorna a altura atual do header fixo ou 72 px como fallback. */
function getHeaderOffset(): number {
  const header = document.querySelector<HTMLElement>(".site-header");
  return header ? header.offsetHeight : 72;
}

/** Resolve um hash `#id` em um HTMLElement (ou `null`). */
function resolveTarget(hash: string): HTMLElement | null {
  if (!hash || hash === "#" || hash === "#/") return null;
  const id = hash.replace(/^#/, "");
  return (
    document.getElementById(id) ??
    document.querySelector<HTMLElement>(hash) ??
    null
  );
}

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

    /* ---- Loop RAF -------------------------------------------------------- */
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    /* ---- Interceptação global de links âncora (#) ------------------------ */
    const handleAnchorClick = (event: MouseEvent) => {
      // Ignora se já foi tratado ou se há tecla modificadora
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

      event.preventDefault();

      const id = href.replace(/^#/, "");

      // Caso especial: #inicio → rolar ao topo
      if (id === "inicio") {
        lenis.scrollTo(0, { duration: 1.4 });
        if (window.history.pushState) {
          window.history.pushState(null, "", "#inicio");
        }
        return;
      }

      const target = resolveTarget(href);
      if (!target) return;

      const headerHeight = getHeaderOffset();

      lenis.scrollTo(target, {
        offset: -headerHeight,
        duration: 1.4,
      });

      if (window.history.pushState) {
        window.history.pushState(null, "", href);
      }

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", handleAnchorClick);

    /* ---- Scroll para hash na carga inicial ------------------------------- */
    const initialHash = window.location.hash;
    if (initialHash && initialHash !== "#" && initialHash !== "#/") {
      // Pequeno delay para garantir que o DOM renderizou e o Lenis estabilizou
      const timerId = window.setTimeout(() => {
        const id = initialHash.replace(/^#/, "");
        if (id === "inicio") {
          lenis.scrollTo(0, { immediate: true });
          return;
        }
        const target = resolveTarget(initialHash);
        if (target) {
          lenis.scrollTo(target, {
            offset: -getHeaderOffset(),
            duration: 1.4,
          });
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      }, 100);

      // Cleanup do timer
      const originalCleanup = () => {
        window.clearTimeout(timerId);
      };

      // Guarda referência para cleanup combinado
      return () => {
        originalCleanup();
        document.removeEventListener("click", handleAnchorClick);
        cancelAnimationFrame(rafId);
        lenis.destroy();
        lenisRef.current = null;
        setLenisInstance(null);
        delete (window as unknown as { lenis?: Lenis }).lenis;
      };
    }

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /*  scrollTo — rolagem programática genérica (sem offset do header)        */
  /* ---------------------------------------------------------------------- */
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
        const el = resolveTarget(target);
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

  /* ---------------------------------------------------------------------- */
  /*  scrollToAnchor — função reutilizável para navegação por âncora         */
  /* ---------------------------------------------------------------------- */
  const scrollToAnchor = useCallback(
    (targetId: string, closeMobileMenu?: () => void) => {
      // Fecha menu mobile primeiro (se callback fornecido)
      closeMobileMenu?.();

      const id = targetId.replace(/^#/, "");
      const activeLenis = lenisRef.current;

      // Caso especial: #inicio → rolar ao topo
      if (id === "inicio") {
        if (activeLenis) {
          activeLenis.scrollTo(0, { duration: 1.4 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        if (window.history.pushState) {
          window.history.pushState(null, "", "#inicio");
        }
        return;
      }

      const target = resolveTarget(`#${id}`);
      if (!target) return;

      const headerHeight = getHeaderOffset();

      if (activeLenis) {
        activeLenis.scrollTo(target, {
          offset: -headerHeight,
          duration: 1.4,
        });
      } else {
        // Fallback nativo
        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight;
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }

      if (window.history.pushState) {
        window.history.pushState(null, "", `#${id}`);
      }

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    []
  );

  const contextValue = useMemo(
    () => ({ lenis: lenisInstance, scrollTo, scrollToAnchor }),
    [lenisInstance, scrollTo, scrollToAnchor]
  );

  return (
    <SmoothScrollContext.Provider value={contextValue}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
