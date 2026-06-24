import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, skip translations and do simple rapid fade or no transition
  const variants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 8,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -8,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
}
