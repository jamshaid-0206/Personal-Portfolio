import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface WordMorpherProps {
  className?: string;
}

const MORPH_WORDS = [
  "Digital Products",
  "AI Systems",
  "Interactive Portals",
  "MERN Stack Architectures",
  "React Native Apps",
  "Pixel-Perfect Interfaces",
  "Scalable Backend APIs"
];

export function WordMorpher({ className }: WordMorpherProps) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MORPH_WORDS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const currentWord = MORPH_WORDS[index];

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-x-2.5 font-mono select-none ${className}`} id="hero-word-morpher">
      <span className="text-zinc-500 text-xs sm:text-sm tracking-widest uppercase">
        I BUILD_
      </span>

      <div className="relative h-10 flex items-center justify-center overflow-visible min-w-[240px] sm:min-w-[340px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="flex items-center justify-center flex-wrap gap-x-[0.15em] absolute"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 15, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -15, filter: 'blur(4px)' }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {currentWord.split("").map((char, charIdx) => {
              if (char === " ") {
                return <span key={charIdx} className="w-1.5 sm:w-2" />;
              }

              return (
                <motion.span
                  key={charIdx}
                  initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.7, y: 8, rotateX: 60 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 160,
                    damping: 12,
                    delay: charIdx * 0.02
                  }}
                  className="inline-block text-xs sm:text-sm font-semibold tracking-wider text-emerald-400 dark:text-emerald-400 uppercase drop-shadow-[0_0_10px_rgba(52,211,153,0.35)] transform-gpu"
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
