import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from 'motion/react';
import { ArrowRight, ArrowUpRight, Download, Github, Terminal } from 'lucide-react';
import { photographerInfo } from '../data/photographer';
import { projects } from '../data/projects';
import { Project } from '../types';
import { TechTerminal } from '../components/portfolio/TechTerminal';
import { SEOHead } from '../components/seo/SEOHead';
import { PageTransition } from '../components/ui/PageTransition';
import { Magnetic } from '../components/ui/Magnetic';
import { HeroShader } from '../components/ui/HeroShader';
import { useTheme } from '../components/providers/ThemeProvider';
import { CountUp, RevealWords, ScrambleText, VelocityMarquee } from '../components/ui/Kinetic';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------------------------- helpers ---------------------------- */
function LiveClock() {
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
  return <span ref={ref} className="tabular-nums" />;
}

/** One masked headline line that slides up into view. */
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        className="block will-change-transform"
        initial={reduce ? false : { y: '105%', rotate: 3 }}
        animate={{ y: '0%', rotate: 0 }}
        transition={{ duration: 1.15, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
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

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">
      <span className="h-px w-10 bg-current" />
      {children}
    </div>
  );
}

/* ============================== HERO ============================== */
function Hero() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const shaderScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={ref}
      className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden bg-background"
      aria-label="Hero Introduction"
    >
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { scale: shaderScale }}>
        <HeroShader light={theme === 'light'} />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-background to-transparent" />

      <motion.div
        style={reduce ? undefined : { y, opacity }}
        className="relative mx-auto flex h-full w-full max-w-[1400px] flex-col justify-between px-5 pb-8 pt-24 text-zinc-900 dark:text-white sm:px-8 md:pb-12 md:pt-28 lg:px-12"
      >
        {/* top meta row */}
        <FadeUp delay={0.1} className="flex items-start justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] sm:text-[11px]">
          <div className="flex items-center gap-2.5 rounded-full border border-current/15 bg-white/40 px-3.5 py-1.5 backdrop-blur-md dark:bg-black/20">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for work
          </div>
          <div className="hidden text-right leading-relaxed opacity-70 sm:block">
            <div>{photographerInfo.location}</div>
            <div>
              <LiveClock /> PKT
            </div>
          </div>
        </FadeUp>

        {/* headline */}
        <div>
          <FadeUp delay={0.2} className="mb-5 font-mono text-[11px] uppercase tracking-[0.3em] opacity-70 sm:text-xs">
            <ScrambleText text={`${photographerInfo.name} — full-stack developer`} delay={0.3} />
          </FadeUp>
          <h1 className="font-semibold leading-[0.9] tracking-[-0.05em] text-[clamp(2.9rem,12.5vw,9.5rem)]">
            <Line delay={0.25}>Building digital</Line>
            <Line delay={0.35}>products that</Line>
            <Line delay={0.45}>
              feel <span className="text-gradient-anim pr-[0.06em] italic">alive.</span>
            </Line>
          </h1>

          <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[1fr_auto] md:items-end">
            <FadeUp delay={0.75}>
              <p className="max-w-md text-base leading-relaxed opacity-80 md:text-lg">{photographerInfo.heroIntroduction}</p>
            </FadeUp>
            <FadeUp delay={0.85} className="flex flex-wrap items-center gap-3 lg:pr-20">
              <Magnetic>
                <Link
                  to="/portfolio"
                  className="btn-shine group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-emerald-500 px-7 py-4 text-sm font-semibold text-black shadow-[0_10px_40px_-10px_rgba(16,185,129,0.8)] transition-transform duration-300 hover:scale-[1.04] active:scale-95"
                >
                  See my work
                  <ArrowUpRight size={17} className="transition-transform duration-300 group-hover:rotate-45" />
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={photographerInfo.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="grid h-[52px] w-[52px] place-items-center rounded-full border border-current/20 bg-white/40 backdrop-blur-md transition-colors hover:border-emerald-400 hover:text-emerald-500 dark:bg-black/20"
                >
                  <Github size={18} />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="/resume.pdf"
                  download="Jamshaid_Ghafoor_Resume.pdf"
                  className="inline-flex h-[52px] items-center gap-2 rounded-full border border-current/20 bg-white/40 px-6 text-sm font-medium backdrop-blur-md transition-colors hover:border-emerald-400 hover:text-emerald-500 dark:bg-black/20"
                >
                  <Download size={16} /> Resume
                </a>
              </Magnetic>
            </FadeUp>
          </div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="relative h-12 w-px overflow-hidden bg-current/15 text-foreground">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.6s_ease-in-out_infinite] bg-emerald-400" />
        </div>
      </div>
    </section>
  );
}

/* ============================ MARQUEE ============================= */
function SkillMarquee() {
  const skills = photographerInfo.clients;
  return (
    <section aria-label="Skills" className="relative overflow-hidden border-y border-foreground/10 py-8 md:py-12">
      <VelocityMarquee baseVelocity={-2}>
        {skills.map((s) => (
          <span key={s} className="mx-5 flex items-center gap-10 text-5xl font-semibold tracking-[-0.04em] text-foreground md:mx-8 md:text-8xl">
            {s}
            <span className="text-3xl text-emerald-500 md:text-5xl">✦</span>
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}

/* ======================= SCROLL-LIT STATEMENT ===================== */
function Word({ children, progress, range }: { key?: React.Key; children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block" aria-hidden="true">
      {children}
    </motion.span>
  );
}

function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const text =
    "I'm a full-stack developer who obsesses over the details — clean architecture, buttery interactions and interfaces that load fast and feel effortless on every screen.";
  const words = text.split(' ');
  return (
    <section aria-label="About" className="mx-auto w-full max-w-[1400px] px-5 py-24 sm:px-8 md:py-40 lg:px-12">
      <Eyebrow>About</Eyebrow>
      <p ref={ref} className="max-w-6xl text-[clamp(1.75rem,4.6vw,4.25rem)] font-medium leading-[1.12] tracking-[-0.03em] text-foreground" aria-label={text}>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
        <Link to="/about" className="group inline-flex items-center gap-3 text-sm font-medium text-foreground">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-foreground/20 transition-all duration-300 group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-black">
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:-rotate-45" />
          </span>
          More about me
        </Link>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Front-End Developer @ Asian IT · BSCS Abasyn University</span>
      </div>
    </section>
  );
}

/* ========================= STACKED WORK =========================== */
const ACCENTS = [
  { glow: 'rgba(16,185,129,0.45)', text: 'text-emerald-400' },
  { glow: 'rgba(34,211,238,0.40)', text: 'text-cyan-400' },
  { glow: 'rgba(139,92,246,0.45)', text: 'text-violet-400' },
  { glow: 'rgba(251,146,60,0.40)', text: 'text-orange-400' },
];

function StackCard({
  project,
  i,
  total,
  progress,
}: {
  key?: React.Key;
  project: Project;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.3, 1]);
  const targetScale = 1 - (total - i) * 0.04;
  const scale = useTransform(progress, [i / total, 1], [1, targetScale]);
  const accent = ACCENTS[i % ACCENTS.length];
  const tech = project.camera.split(',').map((t) => t.trim()).slice(0, 4);

  return (
    <div ref={ref} className="sticky top-0 flex h-[100svh] items-center justify-center px-3 sm:px-6">
      <motion.article
        style={{ scale: reduce ? 1 : scale, top: `calc(-4vh + ${i * 22}px)` }}
        className="relative grid h-[78svh] w-full max-w-[1300px] origin-top grid-rows-[1fr_auto] overflow-hidden rounded-[28px] border border-white/10 bg-[#07090c] text-white shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.6)] md:grid-cols-[1fr_1.25fr] md:grid-rows-1"
      >
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full opacity-70"
          style={{ background: `radial-gradient(closest-side, ${accent.glow}, transparent)` }}
        />
        {/* content */}
        <div className="relative order-2 flex flex-col justify-between gap-6 p-6 sm:p-8 md:order-1 md:p-12">
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            <span className={accent.text}>
              {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <span>
              {project.category} · {project.year}
            </span>
          </div>
          <div>
            <h3 className="text-[clamp(1.9rem,4.2vw,3.75rem)] font-semibold leading-[0.95] tracking-[-0.04em]">{project.title}</h3>
            <p className="mt-4 line-clamp-3 max-w-md text-sm leading-relaxed text-white/60 md:text-base">{project.overview}</p>
            <div className="mt-5 hidden flex-wrap gap-2 sm:flex">
              {tech.map((t) => (
                <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <Link
            to={`/portfolio/${project.slug}`}
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-emerald-400"
          >
            View case study
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </div>
        {/* image */}
        <Link
          to={`/portfolio/${project.slug}`}
          data-cursor="view"
          className="relative order-1 m-3 overflow-hidden rounded-[20px] bg-gradient-to-br from-zinc-800 to-zinc-950 md:order-2"
          aria-label={project.title}
        >
          <motion.img
            src={project.coverImage}
            alt=""
            loading="lazy"
            decoding="async"
            style={{ scale: reduce ? 1 : imgScale }}
            className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </Link>
      </motion.article>
    </div>
  );
}

function StackedWork() {
  const ref = useRef<HTMLDivElement>(null);
  const featured = projects.slice(0, 4);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return (
    <section aria-label="Selected Work" className="relative">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-6 px-5 pt-10 sm:px-8 lg:px-12">
        <div>
          <Eyebrow>Selected work</Eyebrow>
          <h2 className="text-[clamp(3rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-[-0.05em] text-foreground">
            <RevealWords text="Things I've built" />
          </h2>
        </div>
        <Link to="/portfolio" className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-emerald-500">
          All projects <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
        </Link>
      </div>
      <div ref={ref} className="relative">
        {featured.map((p, i) => (
          <StackCard key={p.id} project={p} i={i} total={featured.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

/* ============================ SERVICES ============================ */
const SERVICES = [
  { t: 'Frontend Engineering', d: 'React, TypeScript & Tailwind — pixel-perfect, accessible, animated interfaces.' },
  { t: 'Mobile Apps', d: 'Cross-platform React Native apps with native feel, offline-first data and Firebase.' },
  { t: 'Backend & APIs', d: 'Node, Express & MongoDB services with clean REST design that scale.' },
  { t: 'Performance & UX', d: 'Code-splitting, Core Web Vitals and motion that stays at 60fps.' },
];

function Services() {
  return (
    <section aria-label="What I do" className="mx-auto w-full max-w-[1400px] px-5 py-24 sm:px-8 md:py-36 lg:px-12">
      <Eyebrow>What I do</Eyebrow>
      <ul className="border-b border-foreground/10">
        {SERVICES.map((s, i) => (
          <motion.li
            key={s.t}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
            className="service-row group relative border-t border-foreground/10"
          >
            <Link to="/contact" className="relative z-10 grid grid-cols-[auto_1fr_auto] items-center gap-4 py-7 text-foreground transition-colors duration-500 group-hover:text-black md:gap-10 md:px-6 md:py-10">
              <span className="font-mono text-xs text-muted-foreground transition-colors duration-500 group-hover:text-black/60 md:text-sm">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="block text-[clamp(1.75rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] transition-transform duration-500 md:group-hover:translate-x-4">
                  {s.t}
                </span>
                <span className="mt-2 block max-w-xl text-sm text-muted-foreground transition-colors duration-500 group-hover:text-black/70 md:text-base">
                  {s.d}
                </span>
              </span>
              <ArrowUpRight className="h-7 w-7 transition-transform duration-500 group-hover:rotate-45 md:h-10 md:w-10" />
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

/* ============================= STATS ============================== */
function Stats() {
  const items = [
    { n: projects.length, s: '+', label: 'Shipped projects' },
    { n: 2, s: '+', label: 'Years building' },
    { n: photographerInfo.clients.length, s: '', label: 'Core technologies' },
    { n: 100, s: '%', label: 'Responsive' },
  ];
  return (
    <section aria-label="Stats" className="mx-auto w-full max-w-[1400px] px-5 pb-24 sm:px-8 lg:px-12">
      <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
            className="border-l border-foreground/10 pl-5 md:pl-8"
          >
            <div className="text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-none tracking-[-0.05em] text-foreground">
              <CountUp to={it.n} suffix={it.s} />
            </div>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{it.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ============================ TERMINAL ============================ */
function TerminalSection() {
  return (
    <section aria-label="Interactive terminal" className="relative overflow-hidden border-y border-foreground/10 bg-secondary/40 py-24 md:py-32">
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:px-12">
        <div>
          <Eyebrow>
            <Terminal size={13} /> Playground
          </Eyebrow>
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-foreground">
            <RevealWords text="My stack, in one shell." />
          </h2>
          <p className="mt-5 max-w-md text-muted-foreground">It's a real interactive terminal — type a command and poke around.</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
          className="text-left"
        >
          <TechTerminal />
        </motion.div>
      </div>
    </section>
  );
}

/* ============================== CTA =============================== */
function BigCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['30%', '0%']);
  return (
    <section ref={ref} aria-label="Contact" className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 md:pt-40 lg:px-12">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(60%_80%_at_50%_100%,rgba(16,185,129,0.22),transparent_70%)]" />
      <motion.div style={reduce ? undefined : { y }} className="relative mx-auto max-w-[1400px]">
        <Eyebrow>Have a project in mind?</Eyebrow>
        <h2 className="text-[clamp(3.5rem,13vw,13rem)] font-semibold leading-[0.85] tracking-[-0.06em] text-foreground">
          Let's work
          <br />
          <span className="text-gradient-anim italic pr-[0.06em]">together.</span>
        </h2>
        <div className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-center md:justify-between">
          <a
            href={`mailto:${photographerInfo.email}`}
            className="group relative w-fit break-all text-xl font-medium text-foreground sm:text-2xl md:text-3xl"
          >
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

export default function Home() {
  return (
    <PageTransition>
      <SEOHead title="Home" />
      <Hero />
      <SkillMarquee />
      <Statement />
      <StackedWork />
      <Services />
      <Stats />
      <TerminalSection />
      <BigCTA />
    </PageTransition>
  );
}
