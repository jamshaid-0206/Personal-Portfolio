import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface ScrollRevealProps {
  key?: string | number | null;
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function ScrollReveal({ children, delay = 0, duration = 0.6 }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: duration + 0.2,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
