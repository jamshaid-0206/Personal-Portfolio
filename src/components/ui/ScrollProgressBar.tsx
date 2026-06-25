import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  
  // Transform the raw progress value into a highly smoothed spring animation
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      id="viewport-scroll-progress"
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-emerald-500 origin-left z-[99999] pointer-events-none"
      style={{ 
        scaleX,
        boxShadow: '0 0 10px rgba(16, 185, 129, 0.8), 0 0 5px rgba(16, 185, 129, 0.4)'
      }}
    />
  );
}
