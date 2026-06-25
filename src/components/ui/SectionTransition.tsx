import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /**
   * Whether to enable the staggered reveal animation for children.
   * @default true
   */
  stagger?: boolean;
  /**
   * Whether to enable the vertical scroll-bound parallax effect.
   * @default true
   */
  parallax?: boolean;
  /**
   * The maximum vertical translation offset in pixels for the parallax movement.
   * @default 30
   */
  parallaxOffset?: number;
  /**
   * Stagger delay between sequential children.
   * @default 0.12
   */
  staggerDelay?: number;
}

export function SectionTransition({
  children,
  className,
  id,
  stagger = true,
  parallax = true,
  parallaxOffset = 30,
  staggerDelay = 0.12,
}: SectionTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // 1. Precise viewport scroll parallax logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Calculate high-performance vertical translation values mapped to viewport exit states
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [parallaxOffset, -parallaxOffset]
  );
  
  // Smooth out raw values with an elegant structural spring
  const springY = useSpring(rawY, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  // Gracefully skip parallax if user prefers reduced motion or if parallax is disabled
  const yValue = shouldReduceMotion || !parallax ? 0 : springY;

  // 2. Variants for staggered enter reveal transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.05,
      },
    },
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 25 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18,
      },
    },
  };

  // Dynamically wrap direct children elements for clean, hands-free auto-staggering
  const renderedChildren = React.useMemo(() => {
    if (!stagger) return children;

    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      
      // If the child is already a motion element or custom layout wrapper we want to preserve,
      // wrap it gracefully in a structured reveal block.
      return (
        <motion.div variants={childVariants} className="w-full">
          {child}
        </motion.div>
      );
    });
  }, [children, stagger, shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      id={id}
      className={cn("relative overflow-hidden w-full", className)}
    >
      <motion.div
        style={{ y: yValue }}
        variants={stagger ? containerVariants : undefined}
        initial={stagger ? "hidden" : undefined}
        whileInView={stagger ? "visible" : undefined}
        viewport={{ once: true, margin: "-120px" }}
        className="w-full h-full flex flex-col"
      >
        {!stagger && !shouldReduceMotion ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full h-full flex flex-col"
          >
            {children}
          </motion.div>
        ) : (
          renderedChildren
        )}
      </motion.div>
    </div>
  );
}
