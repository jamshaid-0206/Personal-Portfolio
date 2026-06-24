import { ChevronDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

export function ScrollIndicator() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 0.7,
      y: 0,
      transition: {
        delay: 1.2,
        duration: 0.8,
      },
    },
  };

  const bounceTransition = shouldReduceMotion
    ? {}
    : {
        y: {
          duration: 1.6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };

  const bounceVariants = {
    animate: {
      y: [0, 6, 0],
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10 text-white"
    >
      <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase opacity-80">
        SCROLL
      </span>
      <motion.div
        variants={bounceVariants}
        animate={shouldReduceMotion ? undefined : "animate"}
        transition={bounceTransition}
      >
        <ChevronDown size={16} className="text-emerald-400" />
      </motion.div>
    </motion.div>
  );
}
