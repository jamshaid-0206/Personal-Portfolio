import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface SkeletonImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  loading?: 'lazy' | 'eager';
  onClick?: () => void;
}

export function SkeletonImage({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio,
  loading = 'lazy',
  onClick
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={cn(
        "relative overflow-hidden w-full bg-zinc-900/40 border border-white/5",
        aspectRatio || "aspect-video",
        containerClassName
      )}
      onClick={onClick}
    >
      {/* Real Image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        loading={loading}
        referrerPolicy="no-referrer"
        className={cn(
          "w-full h-full object-cover transition-all duration-700 ease-out",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02] filter blur-md",
          className
        )}
      />

      {/* Shimmer Placeholder Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900"
          >
            {/* Pulsing Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-950/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite] pointer-events-none" />
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
