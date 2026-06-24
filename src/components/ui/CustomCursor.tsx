import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { useReducedMotion } from 'motion/react';

export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'click' | 'view' | 'drag'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Motion values for smooth interpolation
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Custom high-precision spring configurations for premium organic lag-free movement
  const springConfig = { damping: 30, stiffness: 350, mass: 0.6 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Detect mobile device to disable custom cursor safely
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

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
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
      setCursorType('default');
    };

    // Listen to mouse position globally
    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Dynamic hover target observer
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const closestLink = target.closest('a');
      const closestButton = target.closest('button');
      const closestClickable = target.closest('[role="button"], [onclick], input, textarea, select');
      
      // Custom portfolio hover elements for "View Project" or "Drag"
      const hasViewAttr = target.closest('[data-cursor="view"]');
      const hasDragAttr = target.closest('[data-cursor="drag"]');

      if (hasViewAttr) {
        setCursorType('view');
      } else if (hasDragAttr) {
        setCursorType('drag');
      } else if (closestLink || closestButton || closestClickable) {
        setCursorType('hover');
      } else {
        setCursorType('default');
      }
    };

    window.addEventListener('mouseover', handleOver);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleOver);
    };
  }, [cursorX, cursorY, isVisible, isMobile]);

  // Hide on mobile or if motion reduction is requested
  if (isMobile || shouldReduceMotion || !isVisible) return null;

  // Custom visual state configuration map
  const cursorVariants = {
    default: {
      width: 8,
      height: 8,
      backgroundColor: '#10b981', // emerald-500
      borderColor: 'transparent',
    },
    hover: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.5)',
      borderWidth: '1.5px',
    },
    click: {
      width: 24,
      height: 24,
      backgroundColor: 'rgba(16, 185, 129, 0.3)',
      borderColor: '#10b981',
      borderWidth: '2px',
    },
    view: {
      width: 70,
      height: 70,
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: '#10b981',
      borderWidth: '1px',
    },
    drag: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: 'rgba(255, 255, 255, 0.3)',
      borderWidth: '1px',
    }
  };

  return (
    <>
      {/* 1. Main Dot / Center Ring Cursor */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-screen flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: cursorVariants[cursorType].width,
          height: cursorVariants[cursorType].height,
          border: cursorVariants[cursorType].borderColor !== 'transparent' 
            ? `${cursorVariants[cursorType].borderWidth} solid ${cursorVariants[cursorType].borderColor}`
            : 'none',
          backgroundColor: cursorVariants[cursorType].backgroundColor,
          boxShadow: cursorType === 'default' 
            ? '0 0 10px rgba(16, 185, 129, 0.6)' 
            : '0 0 20px rgba(16, 185, 129, 0.25)',
        }}
        animate={{
          scale: cursorType === 'click' ? 0.85 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
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

      {/* 2. Secondary Glowing Halo / Trail for true cinematic depth */}
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
