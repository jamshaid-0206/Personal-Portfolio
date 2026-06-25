import { useEffect, useRef } from 'react';
import { playBlip, playHoverBlip, playType, playSpacebar } from '../../lib/audio';

/**
 * Global provider component that registers global interaction listeners.
 * Plays crisp, low-volume blip and typewriter sound effects programmatically.
 */
export function InteractionSoundManager() {
  const lastHoveredRef = useRef<EventTarget | null>(null);
  const lastHoverTimeRef = useRef<number>(0);

  useEffect(() => {
    // 1. GLOBAL INTERACTIVE CLICK SOUNDS
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Find if clicked element or any parent is an interactive target
      const interactiveEl = target.closest(
        'a, button, [role="button"], input[type="submit"], input[type="button"], .cursor-pointer, .clickable'
      );
      
      if (interactiveEl) {
        // Don't play if the element is disabled or has aria-disabled
        if (
          interactiveEl.hasAttribute('disabled') || 
          interactiveEl.getAttribute('aria-disabled') === 'true'
        ) {
          return;
        }
        playBlip(0.02);
      }
    };

    // 2. SUBTLE HOVER TICK SOUNDS
    const handleGlobalMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target === lastHoveredRef.current) return;

      const interactiveEl = target.closest(
        'a, button, [role="button"], input[type="submit"], input[type="button"], .cursor-pointer, .clickable'
      );

      if (interactiveEl) {
        lastHoveredRef.current = interactiveEl;
        
        // Prevent playing on disabled controls
        if (
          interactiveEl.hasAttribute('disabled') || 
          interactiveEl.getAttribute('aria-disabled') === 'true'
        ) {
          return;
        }

        const now = Date.now();
        // Throttle slightly to keep the interface sounding clean and undistorted
        if (now - lastHoverTimeRef.current > 75) {
          playHoverBlip(0.006);
          lastHoverTimeRef.current = now;
        }
      } else {
        lastHoveredRef.current = null;
      }
    };

    // 3. KEYBOARD FEEDBACK FOR ALL USER INPUT FIELDS
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInputField = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable;

      if (isInputField) {
        // Only trigger on printable keys, Spacebar, Backspace, Delete, and Enter
        if (e.key.length === 1) {
          if (e.key === ' ') {
            playSpacebar(0.012);
          } else {
            playType(0.008);
          }
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          playType(0.006);
        } else if (e.key === 'Enter') {
          playBlip(0.01, true); // Play a light high confirmation pitch
        }
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    window.addEventListener('mouseover', handleGlobalMouseOver, { capture: true, passive: true });
    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true, passive: true });

    return () => {
      window.removeEventListener('click', handleGlobalClick, { capture: true });
      window.removeEventListener('mouseover', handleGlobalMouseOver, { capture: true });
      window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
    };
  }, []);

  return null;
}
