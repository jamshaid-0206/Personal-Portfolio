import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Inertia-based smooth scrolling (desktop) + scroll-to-top on route change. */
export function SmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.2 });
    lenisInstance = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  useEffect(() => {
    if (lenisInstance) lenisInstance.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
