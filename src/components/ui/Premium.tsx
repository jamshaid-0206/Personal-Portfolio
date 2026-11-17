import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { HeroShader } from './HeroShader';
import { Magnetic } from './Magnetic';
import { useTheme } from '../providers/ThemeProvider';
import { photographerInfo } from '../../data/photographer';

export const EASE = [0.16, 1, 0.3, 1] as const;

/** Shared page container width + gutters. */
export const CONTAINER = 'mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12';

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 ${className}`}>
      <span className="h-px w-10 bg-current" />
      {children}
    </div>
  );
}

/** Masked line that slides up on mount. */
export function Line({ children, delay = 0, className = '' }: { key?: React.Key; children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className={`block overflow-hidden pb-[0.08em] -mb-[0.08em] ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={reduce ? false : { y: '105%', rotate: 3 }}
        animate={{ y: '0%', rotate: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Fade-up on mount. */
export function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Fade-up when scrolled into view. */
export function InView({
  children,
  delay = 0,
  className = '',
  y = 40,
}: {
  key?: React.Key;
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function LiveClock({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const tick = () => {
      if (ref.current)
        ref.current.textContent = new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Asia/Karachi',
        });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span ref={ref} className={`tabular-nums ${className}`} />;
}

/**
 * Inner-page hero: liquid shader band, eyebrow, masked multi-line title and
 * optional intro + side slot. Fades/parallaxes out on scroll.
 */
export function PageHero({
  eyebrow,
  lines,
  intro,
  aside,
  children,
  compact = false,
  size = 'lg',
}: {
  eyebrow: React.ReactNode;
  lines: React.ReactNode[];
  intro?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  compact?: boolean;
  size?: 'lg' | 'md';
}) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className={`relative isolate w-full overflow-hidden ${compact ? 'min-h-[62svh]' : 'min-h-[78svh]'} flex items-end`}
    >
      <div className="absolute inset-0 -z-10 opacity-90">
        <HeroShader light={theme === 'light'} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/40 to-background" />

      <motion.div style={reduce ? undefined : { y, opacity }} className={`${CONTAINER} pb-14 pt-32 md:pb-20 md:pt-40`}>
        <FadeUp delay={0.1}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </FadeUp>
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <h1
            className={`font-semibold leading-[0.9] tracking-[-0.05em] text-foreground ${
              size === 'md' ? 'text-[clamp(2.6rem,7.5vw,7rem)]' : 'text-[clamp(3rem,11vw,9rem)]'
            }`}
          >
            {lines.map((l, i) => (
              <Line key={i} delay={0.15 + i * 0.1}>
                {l}
              </Line>
            ))}
          </h1>
          {aside && <FadeUp delay={0.6}>{aside}</FadeUp>}
        </div>
        {intro && (
          <FadeUp delay={0.5} className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {intro}
          </FadeUp>
        )}
        {children}
      </motion.div>
    </section>
  );
}

/** Big "Let's work together" call-to-action used at the end of pages. */
export function ContactCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['30%', '0%']);
  return (
    <section ref={ref} aria-label="Contact" className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 md:pt-40 lg:px-12">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_80%_at_50%_100%,rgba(16,185,129,0.22),transparent_70%)]" />
      <motion.div style={reduce ? undefined : { y }} className="relative mx-auto max-w-[1400px]">
        <Eyebrow>Have a project in mind?</Eyebrow>
        <h2 className="text-[clamp(3.5rem,13vw,13rem)] font-semibold leading-[0.85] tracking-[-0.06em] text-foreground">
          Let's work
          <br />
          <span className="text-gradient-anim italic pr-[0.06em]">together.</span>
        </h2>
        <div className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-center md:justify-between">
          <a href={`mailto:${photographerInfo.email}`} className="group relative w-fit break-all text-xl font-medium text-foreground sm:text-2xl md:text-3xl">
            {photographerInfo.email}
            <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-emerald-500 transition-transform duration-500 group-hover:scale-x-100" />
          </a>
          <Magnetic>
            <Link
              to="/contact"
              className="btn-shine group relative grid h-36 w-36 place-items-center overflow-hidden rounded-full bg-emerald-500 text-sm font-semibold text-black shadow-[0_20px_80px_-20px_rgba(16,185,129,0.9)] transition-transform duration-500 hover:scale-110 md:h-44 md:w-44"
            >
              <span className="flex flex-col items-center gap-2">
                <ArrowUpRight size={28} className="transition-transform duration-500 group-hover:rotate-45" />
                Get in touch
              </span>
            </Link>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}

/** Pill button styles shared across pages. */
export const BTN_PRIMARY =
  'btn-shine group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-emerald-500 px-7 py-4 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(16,185,129,0.8)] transition-transform duration-300 hover:scale-[1.04] active:scale-95';
export const BTN_GHOST =
  'group inline-flex items-center gap-2.5 rounded-full border border-foreground/15 px-6 py-4 text-sm font-medium text-foreground transition-colors hover:border-emerald-500 hover:text-emerald-500';
