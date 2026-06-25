import { motion, useReducedMotion } from 'motion/react';
import { useTheme } from '../providers/ThemeProvider';
import { cn } from '../../lib/utils';

interface AuroraBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'vibrant';
}

export function AuroraBackground({ className, intensity = 'subtle' }: AuroraBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();

  // Adjust overall opacity depending on preferred intensity
  const opacityMultiplier = intensity === 'vibrant' ? 1.4 : 1.0;

  if (shouldReduceMotion) {
    // Elegant fallback if reduced motion is requested
    return (
      <div 
        id="aurora-background-reduced"
        className={cn("absolute inset-0 overflow-hidden pointer-events-none select-none z-[-2]", className)}
      >
        <div 
          className="absolute inset-0 opacity-40 transition-all duration-1000 ease-in-out"
          style={{
            background: `radial-gradient(circle at 30% 30%, var(--aurora-1) 0%, transparent 60%), 
                         radial-gradient(circle at 70% 60%, var(--aurora-2) 0%, transparent 60%),
                         radial-gradient(circle at 50% 80%, var(--aurora-3) 0%, transparent 50%)`
          }}
        />
        {/* Ambient Overlay Layer for blending */}
        <div className="absolute inset-0 bg-transparent mix-blend-overlay opacity-30" />
      </div>
    );
  }

  return (
    <div 
      id="aurora-background"
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none select-none z-[-2] w-full h-full", 
        className
      )}
    >
      {/* Aurora Blurs Mesh Wrapper */}
      <div className="absolute inset-0 w-full h-full filter blur-[100px] sm:blur-[140px] transform-gpu">
        {/* Aurora Blob 1 - Rotating and drifting */}
        <motion.div
          id="aurora-blob-1"
          className="absolute w-[60vw] h-[60vw] min-w-[300px] min-h-[300px] rounded-full top-[-10%] left-[-10%] transition-colors duration-1000 ease-in-out"
          style={{ 
            backgroundColor: 'var(--aurora-1)',
            opacity: 0.85 * opacityMultiplier 
          }}
          animate={{
            x: ['-10%', '15%', '-5%'],
            y: ['-5%', '10%', '-10%'],
            scale: [1, 1.2, 0.9],
            rotate: [0, 120, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Aurora Blob 2 - Counter drifting */}
        <motion.div
          id="aurora-blob-2"
          className="absolute w-[70vw] h-[70vw] min-w-[350px] min-h-[350px] rounded-full bottom-[-15%] right-[-10%] transition-colors duration-1000 ease-in-out"
          style={{ 
            backgroundColor: 'var(--aurora-2)',
            opacity: 0.8 * opacityMultiplier 
          }}
          animate={{
            x: ['10%', '-15%', '5%'],
            y: ['15%', '-10%', '10%'],
            scale: [1.1, 0.85, 1.15],
            rotate: [360, 240, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Aurora Blob 3 - Ambient center drift */}
        <motion.div
          id="aurora-blob-3"
          className="absolute w-[50vw] h-[50vw] min-w-[280px] min-h-[280px] rounded-full top-[30%] left-[25%] transition-colors duration-1000 ease-in-out"
          style={{ 
            backgroundColor: 'var(--aurora-3)',
            opacity: 0.75 * opacityMultiplier 
          }}
          animate={{
            x: ['-5%', '10%', '-10%', '-5%'],
            y: ['10%', '-15%', '15%', '10%'],
            scale: [0.9, 1.1, 0.8, 0.9],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Aurora Blob 4 - Edge accent */}
        <motion.div
          id="aurora-blob-4"
          className="absolute w-[45vw] h-[45vw] min-w-[250px] min-h-[250px] rounded-full top-[10%] right-[10%] transition-colors duration-1000 ease-in-out"
          style={{ 
            backgroundColor: 'var(--aurora-4)',
            opacity: 0.7 * opacityMultiplier 
          }}
          animate={{
            x: ['5%', '-10%', '15%', '5%'],
            y: ['-10%', '15%', '-5%', '-10%'],
            scale: [1, 0.9, 1.2, 1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Grid pattern masking overlay to enhance premium look */}
      <div 
        id="aurora-mask"
        className={cn(
          "absolute inset-0 bg-transparent opacity-[0.2] dark:opacity-[0.12]",
          "bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:3rem_3rem]"
        )}
      />
    </div>
  );
}
