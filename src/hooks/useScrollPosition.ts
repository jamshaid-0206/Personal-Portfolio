import { useEffect, useState } from 'react';

/**
 * Returns true once the page is scrolled past `threshold` px.
 * Only updates state when the boolean flips, so scrolling never re-renders consumers.
 */
export function useScrolledPast(threshold = 50) {
  const [past, setPast] = useState(() => typeof window !== 'undefined' && window.scrollY > threshold);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const next = window.scrollY > threshold;
        setPast((prev) => (prev === next ? prev : next));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return past;
}
