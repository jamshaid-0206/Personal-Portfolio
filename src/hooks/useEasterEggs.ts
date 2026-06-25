import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

export function useEasterEggs() {
  const [matrixActive, setMatrixActive] = useState(false);
  const [universePaused, setUniversePaused] = useState(false);
  const [devModeActive, setDevModeActive] = useState(false);
  const [blackHolePos, setBlackHolePos] = useState<{ x: number; y: number } | null>(null);

  const konamiCodeRef = useRef<string[]>([]);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPressingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const KONAMI_CODE = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  useEffect(() => {
    // 1. Keyboard event listeners (Konami & Space key)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space key to toggle universe pause state
      if (e.code === 'Space') {
        // Prevent default space scroll behavior if we want to pause
        e.preventDefault();
        setUniversePaused((prev) => {
          const newState = !prev;
          if (newState) {
            toast.warning("SYS_UNIVERSE_PAUSED", {
              description: "Time-space continuum is locked. Background canvas animations paused.",
              id: "universe-pause-toast"
            });
            window.dispatchEvent(new CustomEvent('universe_animation_pause', { detail: { paused: true } }));
          } else {
            toast.success("SYS_UNIVERSE_RESUMED", {
              description: "Quantum physics engines reactivated. Time is flowing.",
              id: "universe-pause-toast"
            });
            window.dispatchEvent(new CustomEvent('universe_animation_pause', { detail: { paused: false } }));
          }
          return newState;
        });
      }

      // Konami code tracker
      const keys = konamiCodeRef.current;
      keys.push(e.key);
      if (keys.length > KONAMI_CODE.length) {
        keys.shift();
      }

      if (keys.join(',').toLowerCase() === KONAMI_CODE.join(',').toLowerCase()) {
        setMatrixActive((prev) => {
          const next = !prev;
          if (next) {
            toast.info("KONAMI_CODE_ACCEPTED", {
              description: "Matrix mode unlocked. Code streams active.",
              id: "konami-toast"
            });
            window.dispatchEvent(new CustomEvent('matrix_rain_override', { detail: { active: true } }));
          } else {
            toast.success("RESTORE_SIMULATION", {
              description: "Exited digital void. Default CSS rules active.",
              id: "konami-toast"
            });
            window.dispatchEvent(new CustomEvent('matrix_rain_override', { detail: { active: false } }));
          }
          return next;
        });
        konamiCodeRef.current = [];
      }
    };

    // 2. Double-click listener on Header Logo
    const handleLogoDoubleClick = (e: CustomEvent) => {
      setDevModeActive((prev) => {
        const next = !prev;
        if (next) {
          toast.success("DEVELOPER_MODE_ENGAGED", {
            description: "Diagnostic overlay active. GPU telemetry metrics streaming.",
            id: "dev-mode-toast"
          });
        } else {
          toast.info("DEVELOPER_MODE_DISENGAGED", {
            description: "Returning to user view. Diagnostics deactivated.",
            id: "dev-mode-toast"
          });
        }
        return next;
      });
    };

    // 3. Mouse down & up coordinates tracker for custom gravity ripple (Black Hole)
    const handleMouseDown = (e: MouseEvent) => {
      // Ignore if clicking on button/input to maintain accessibility
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        return;
      }

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      isPressingRef.current = true;

      pressTimerRef.current = setTimeout(() => {
        if (isPressingRef.current) {
          // Trigger Black Hole gravity ripple at the exact coordinates
          setBlackHolePos({ x: lastMousePosRef.current.x, y: lastMousePosRef.current.y });
          toast.error("GRAVITATIONAL_SINGULARITY_DETECTED", {
            description: "Spawning black hole. Spacetime coordinates warped around cursor.",
            id: "singularity-toast"
          });
          
          // Clear ripple after 1.8 seconds
          setTimeout(() => {
            setBlackHolePos(null);
          }, 1800);
        }
      }, 850); // Long-press duration of 850ms
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isPressingRef.current = false;
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('logo_double_click' as any, handleLogoDoubleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('logo_double_click' as any, handleLogoDoubleClick);
      if (pressTimerRef.current) {
        clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  return { matrixActive, universePaused, devModeActive, blackHolePos };
}
