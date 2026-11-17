import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react';

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ';

/* ------------------------------------------------------------------ */
/* ScrambleText — decodes on mount/in-view and re-scrambles on hover    */
/* ------------------------------------------------------------------ */
export function ScrambleText({
  text,
  className = '',
  delay = 0,
  speed = 28,
  hover = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  hover?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [out, setOut] = useState(reduce ? text : text.replace(/\S/g, ' '));
  const timer = useRef<number | undefined>(undefined);

  const run = () => {
    if (reduce) return setOut(text);
    window.clearInterval(timer.current);
    let frame = 0;
    const total = text.length * 2 + 6;
    timer.current = window.setInterval(() => {
      frame++;
      const revealed = Math.max(0, Math.floor((frame - 6) / 2));
      setOut(
        text
          .split('')
          .map((c, i) => (c === ' ' ? ' ' : i < revealed ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join('')
      );
      if (frame >= total) {
        window.clearInterval(timer.current);
        setOut(text);
      }
    }, speed);
  };

  useEffect(() => {
    if (!inView) return;
    const id = window.setTimeout(run, delay * 1000);
    return () => {
      window.clearTimeout(id);
      window.clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, text]);

  return (
    <span ref={ref} className={className} onMouseEnter={hover ? run : undefined} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* VelocityMarquee — infinite strip whose speed & skew react to scroll  */
/* ------------------------------------------------------------------ */
export function VelocityMarquee({
  children,
  baseVelocity = 3,
  className = '',
}: {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(smoothVelocity, [-2000, 2000], [12, -12]);
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const onScreen = useInView(wrapRef, { margin: '100px' });

  useAnimationFrame((_, delta) => {
    if (reduce || !onScreen) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) direction.current = -1;
    else if (vf > 0) direction.current = 1;
    moveBy += direction.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={wrapRef} className={`overflow-hidden whitespace-nowrap flex flex-nowrap ${className}`}>
      <motion.div className="flex flex-nowrap whitespace-nowrap will-change-transform" style={{ x, skewX: reduce ? 0 : skew }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex flex-nowrap shrink-0" aria-hidden={i > 0}>
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RevealWords — masked, staggered word rise                             */
/* ------------------------------------------------------------------ */
export function RevealWords({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.05,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]" aria-hidden="true">
          <motion.span
            className={`inline-block ${wordClassName}`}
            variants={{
              hidden: { y: reduce ? 0 : '110%', rotate: reduce ? 0 : 6, opacity: reduce ? 0 : 1 },
              show: { y: '0%', rotate: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
            }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* CountUp — rAF counter, no re-render storms                            */
/* ------------------------------------------------------------------ */
export function CountUp({ to, suffix = '', duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const e = 1 - Math.pow(1 - t, 4);
      el.textContent = `${Math.round(to * e)}${suffix}`;
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, suffix, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}
