import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scroll-to-top on route change.
 * Native scrolling is intentionally used (no JS smooth-scroll library): it runs on
 * the browser's compositor thread, so it stays instant and jank-free even while
 * animations are busy on the main thread.
 */
export function SmoothScroll() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
