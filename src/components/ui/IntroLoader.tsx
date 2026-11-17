import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

const NAME = 'JAMSHAID GHAFOOR';
const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ';

interface IntroLoaderProps {
  onComplete: () => void;
}

/**
 * Fast cinematic intro: a 0→100 counter, scrambled name decoding and a
 * split-curtain exit. Auto-finishes in ~1.4s, skippable by click / key.
 */
export function IntroLoader({ onComplete }: IntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState(NAME.replace(/\S/g, '_'));
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    window.setTimeout(onComplete, 650);
  };

  useEffect(() => {
    const DURATION = 1300;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      const revealed = Math.floor(eased * NAME.length);
      setText(
        NAME.split('')
          .map((c, i) => (c === ' ' ? ' ' : i < revealed ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join('')
      );
      if (t < 1) raf = requestAnimationFrame(tick);
      else window.setTimeout(finish, 180);
    };
    raf = requestAnimationFrame(tick);

    const skip = () => finish();
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const curtain = { duration: 0.65, ease: [0.76, 0, 0.24, 1] as const };

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-auto select-none" aria-label="Loading" role="status">
      {/* Split curtains */}
      <motion.div
        className="absolute inset-x-0 top-0 h-1/2 bg-[#030507]"
        animate={{ y: leaving ? '-100%' : 0 }}
        transition={curtain}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#030507]"
        animate={{ y: leaving ? '100%' : 0 }}
        transition={curtain}
      />

      {/* Center slit of light on exit */}
      <motion.div
        className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: progress / 100, opacity: leaving ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ boxShadow: '0 0 24px 2px rgba(52,211,153,.6)' }}
      />

      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-4"
        animate={{ opacity: leaving ? 0 : 1, scale: leaving ? 1.08 : 1, filter: leaving ? 'blur(8px)' : 'blur(0px)' }}
        transition={{ duration: 0.35 }}
      >
        <div className="font-mono text-[10px] sm:text-xs tracking-[0.5em] text-emerald-400/70 -translate-y-10">
          INITIALIZING PORTFOLIO
        </div>
        <div className="font-black text-white text-3xl sm:text-5xl md:text-7xl tracking-tight text-center whitespace-pre font-mono -translate-y-6">
          {text}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 font-black text-white/90 tabular-nums leading-none text-6xl sm:text-8xl md:text-[10rem]"
        animate={{ opacity: leaving ? 0 : 1, y: leaving ? 40 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {progress}
        <span className="text-emerald-400">%</span>
      </motion.div>
      <motion.div
        className="absolute bottom-8 left-6 sm:bottom-12 sm:left-10 font-mono text-[10px] tracking-widest text-white/40"
        animate={{ opacity: leaving ? 0 : 1 }}
      >
        CLICK / PRESS ANY KEY TO SKIP
      </motion.div>
    </div>
  );
}
