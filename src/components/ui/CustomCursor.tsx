import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'click' | 'view' | 'drag'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Magnetic targeting state
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [elementRect, setElementRect] = useState<{ width: number; height: number; borderRadius: string } | null>(null);

  // Keep track of raw mouse coordinates
  const mouseRef = useRef({ x: -100, y: -100 });

  // Motion values for smooth interpolation
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // High-precision organic springs
  const springConfig = { damping: 32, stiffness: 380, mass: 0.55 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect mobile/touch devices to safely disable custom cursor
    const checkDevice = () => {
      const isMobileDevice = 
        window.matchMedia('(max-width: 768px)').matches || 
        ('ontouchstart' in window) || 
        (navigator.maxTouchPoints > 0);
      setIsMobile(isMobileDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    if (isMobile) return;

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseDown = () => {
      setCursorType('click');
    };

    const handleMouseUp = () => {
      // Re-evaluate what we are currently hovering on
      const hoverTarget = document.elementFromPoint(mouseRef.current.x, mouseRef.current.y);
      if (hoverTarget) {
        const target = hoverTarget as HTMLElement;
        const closestLink = target.closest('a');
        const closestButton = target.closest('button');
        const closestClickable = target.closest('[role="button"], [onclick], input, textarea, select');
        
        if (closestLink || closestButton || closestClickable) {
          setCursorType('hover');
          return;
        }
      }
      setCursorType('default');
    };

    // Global listeners for mouse interactions
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Dynamic hover observer for interactive objects
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const closestLink = target.closest('a');
      const closestButton = target.closest('button');
      const closestClickable = target.closest('[role="button"], [onclick], input, textarea, select, [data-magnetic]');
      
      const hasViewAttr = target.closest('[data-cursor="view"]');
      const hasDragAttr = target.closest('[data-cursor="drag"]');

      if (hasViewAttr) {
        setCursorType('view');
        setHoveredElement(null); // No locking on large viewports/cards
      } else if (hasDragAttr) {
        setCursorType('drag');
        setHoveredElement(null); // No locking on drag handles
      } else if (closestLink || closestButton || closestClickable) {
        setCursorType('hover');
        setHoveredElement((closestLink || closestButton || closestClickable) as HTMLElement);
      } else {
        setCursorType('default');
        setHoveredElement(null);
      }
    };

    window.addEventListener('mouseover', handleOver);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleOver);
    };
  }, [isVisible, isMobile]);

  // RequestAnimationFrame high performance animation sync loop
  useEffect(() => {
    if (isMobile || shouldReduceMotion) return;

    let rAFId: number;

    const runLoop = () => {
      if (hoveredElement && document.body.contains(hoveredElement)) {
        const rect = hoveredElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Signature premium magnetic pull algorithm:
        // Attract the cursor position strongly to the center of the hovered component, 
        // while preserving a subtle 20% influence of real mouse coordinates to feel responsive and physical.
        const magneticX = centerX + (mouseRef.current.x - centerX) * 0.22;
        const magneticY = centerY + (mouseRef.current.y - centerY) * 0.22;

        cursorX.set(magneticX);
        cursorY.set(magneticY);

        // Fetch precise style geometries to morph shape perfectly
        const computedStyle = window.getComputedStyle(hoveredElement);
        setElementRect({
          width: rect.width,
          height: rect.height,
          borderRadius: computedStyle.borderRadius || '4px',
        });
      } else {
        // Fallback to absolute standard tracking
        cursorX.set(mouseRef.current.x);
        cursorY.set(mouseRef.current.y);
        setElementRect(null);
      }

      rAFId = requestAnimationFrame(runLoop);
    };

    rAFId = requestAnimationFrame(runLoop);

    return () => {
      cancelAnimationFrame(rAFId);
    };
  }, [hoveredElement, isMobile, shouldReduceMotion, cursorX, cursorY]);

  // Safe escape bounds
  if (isMobile || shouldReduceMotion || !isVisible) return null;

  // Custom visual state configurations
  const cursorVariants = {
    default: {
      width: 8,
      height: 8,
      backgroundColor: '#10b981', // Emerald-500
      borderColor: 'transparent',
      borderWidth: '0px',
    },
    hover: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(16, 185, 129, 0.08)',
      borderColor: 'rgba(16, 185, 129, 0.45)',
      borderWidth: '1.5px',
    },
    click: {
      width: 24,
      height: 24,
      backgroundColor: 'rgba(16, 185, 129, 0.25)',
      borderColor: '#10b981',
      borderWidth: '2px',
    },
    view: {
      width: 72,
      height: 72,
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: '#10b981',
      borderWidth: '1px',
    },
    drag: {
      width: 64,
      height: 64,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.35)',
      borderWidth: '1px',
    }
  };

  const isMagnetized = cursorType === 'hover' && elementRect;

  // Dynamic parameters for the final rendering frame
  const currentWidth = isMagnetized ? elementRect!.width + 12 : cursorVariants[cursorType].width;
  const currentHeight = isMagnetized ? elementRect!.height + 8 : cursorVariants[cursorType].height;
  const currentBorderRadius = isMagnetized ? elementRect!.borderRadius : (cursorType === 'default' ? '9999px' : '9999px');
  const currentBorderColor = isMagnetized ? 'rgba(16, 185, 129, 0.45)' : cursorVariants[cursorType].borderColor;
  const currentBorderWidth = isMagnetized ? '1.5px' : cursorVariants[cursorType].borderWidth;
  const currentBgColor = isMagnetized ? 'rgba(16, 185, 129, 0.05)' : cursorVariants[cursorType].backgroundColor;

  return (
    <>
      {/* 1. Main Interactive Magnetized Canvas Ring */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center -translate-x-1/2 -translate-y-1/2",
          isMagnetized ? "mix-blend-normal" : "mix-blend-screen"
        )}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: currentWidth,
          height: currentHeight,
          borderRadius: currentBorderRadius,
          border: currentBorderColor !== 'transparent'
            ? `${currentBorderWidth} solid ${currentBorderColor}`
            : 'none',
          backgroundColor: currentBgColor,
          boxShadow: cursorType === 'default'
            ? '0 0 10px rgba(16, 185, 129, 0.6)'
            : isMagnetized
              ? 'none'
              : '0 0 20px rgba(16, 185, 129, 0.25)',
        }}
        animate={{
          scale: cursorType === 'click' ? 0.88 : 1,
        }}
        transition={{ 
          type: 'spring', 
          stiffness: 420, 
          damping: 30,
          mass: 0.6
        }}
      >
        <AnimatePresence mode="wait">
          {cursorType === 'view' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest select-none"
            >
              view
            </motion.span>
          )}
          {cursorType === 'drag' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="text-[8px] font-mono text-white font-medium uppercase tracking-widest select-none"
            >
              drag
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 2. Secondary Atmospheric Halo Trail (Follows cursor position with high depth) */}
      <motion.div
        className="fixed top-0 left-0 w-80 h-80 rounded-full pointer-events-none z-[9998] bg-radial from-emerald-500/5 to-transparent -translate-x-1/2 -translate-y-1/2 select-none"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />
    </>
  );
}
