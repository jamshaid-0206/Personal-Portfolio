import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform, MotionValue } from 'motion/react';
import { ArrowRight, ArrowUpRight, Code2, Download, Github, MousePointerClick, Terminal } from 'lucide-react';
import { photographerInfo } from '../data/photographer';
import { projects } from '../data/projects';
import { TechTerminal } from '../components/portfolio/TechTerminal';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { SEOHead } from '../components/seo/SEOHead';
import { PageTransition } from '../components/ui/PageTransition';
import { Magnetic } from '../components/ui/Magnetic';
import { WordMorpher } from '../components/ui/WordMorpher';
import { HyperField } from '../components/ui/HyperField';
import { CountUp, RevealWords, ScrambleText, VelocityMarquee } from '../components/ui/Kinetic';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ============================== HERO ============================== */
function LiveClock() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const tick = () => {
      if (ref.current) ref.current.textContent = `${new Date().toLocaleTimeString([], { hour12: false })} PKT`;
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <div ref={ref} className="tabular-nums" />;
}

function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '35%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);


  // Pointer spotlight via CSS vars (no React re-render)
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--sx', `${e.clientX - r.left}px`);
    el.style.setProperty('--sy', `${e.clientY - r.top}px`);
  };

  const [first, last] = ['JAMSHAID', 'GHAFOOR'];
  const letter = (char: string, i: number, base: number) => (
    <motion.span
      key={i}
      className="inline-block hero-letter will-change-transform"
      initial={reduce ? false : { y: '120%', rotateX: -90, opacity: 0 }}
      animate={{ y: '0%', rotateX: 0, opacity: 1 }}
      transition={{ duration: 1.1, delay: 0.15 + (base + i) * 0.045, ease: EASE }}
      whileHover={reduce ? undefined : { y: '-12%', color: '#34d399', transition: { duration: 0.2 } }}
    >
      {char}
    </motion.span>
  );

  return (
    <section
      ref={sectionRef}
      onPointerMove={onMove}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden flex items-center justify-center bg-background"
      aria-label="Hero Introduction"
    >
      <HyperField />

      {/* spotlight */}
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{ background: 'radial-gradient(500px circle at var(--sx,50%) var(--sy,40%), rgba(16,185,129,0.14), transparent 70%)' }}
      />
      {/* grid + vignette */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#10b98112_1px,transparent_1px),linear-gradient(to_bottom,#10b98112_1px,transparent_1px)] bg-[size:4.5rem_4.5rem]"
        style={{ maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 70%)' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_95%)]" />

      {/* HUD corners */}
      <div className="absolute top-24 left-4 sm:left-8 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/70 uppercase hidden sm:block">
        <div>LAT 33.68°N · LNG 73.04°E</div>
        <div className="mt-1">{photographerInfo.location}</div>
      </div>
      <div className="absolute top-24 right-4 sm:right-8 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/70 uppercase text-right hidden sm:block">
        <LiveClock />
        <div className="mt-1 flex items-center justify-end gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Available for work
        </div>
      </div>

      <motion.div
        style={reduce ? undefined : { y, scale, opacity }}
        className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-7xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-background/60 backdrop-blur-md px-4 py-1.5 font-mono text-[9px] sm:text-xs tracking-[0.15em] sm:tracking-[0.25em] uppercase whitespace-nowrap text-emerald-700 dark:text-emerald-300 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
          <ScrambleText text="full-stack dev // mern · react native" delay={0.3} />
        </motion.div>

        <h1
          className="mt-6 font-black uppercase leading-[0.82] tracking-[-0.04em] text-foreground select-none [perspective:800px]"
          aria-label={photographerInfo.name}
        >
          <span className="block whitespace-nowrap overflow-hidden pb-[0.06em] text-[15vw] sm:text-[14vw] lg:text-[11.5rem]" aria-hidden="true">
            {first.split('').map((c, i) => letter(c, i, 0))}
          </span>
          <span
            className="block whitespace-nowrap overflow-hidden pb-[0.06em] text-[15vw] sm:text-[14vw] lg:text-[11.5rem] hero-outline"
            aria-hidden="true"
          >
            {last.split('').map((c, i) => letter(c, i, first.length))}
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-6"
        >
          <WordMorpher />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05, duration: 0.8, ease: EASE }}
          className="mt-4 max-w-xl text-sm sm:text-base md:text-lg font-light text-muted-foreground leading-relaxed"
        >
          {photographerInfo.heroIntroduction}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
        >
          <Magnetic>
            <Link to="/portfolio" className="btn-shine group relative inline-flex w-full sm:w-auto items-center justify-center gap-2.5 overflow-hidden rounded-full bg-emerald-500 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_40px_rgba(16,185,129,0.45)] transition-transform hover:scale-[1.04] active:scale-95">
              <Code2 size={15} />
              <span>view.projects()</span>
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Magnetic>
          <Magnetic>
            <a href={photographerInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-foreground/15 bg-background/40 backdrop-blur-md px-7 py-3.5 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-emerald-400/60 hover:text-emerald-500">
              <Github size={15} />
              <span>github</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a href="/resume.pdf" download="Jamshaid_Ghafoor_Resume.pdf" className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full border border-foreground/15 bg-background/40 backdrop-blur-md px-7 py-3.5 font-mono text-xs uppercase tracking-wider text-foreground transition-colors hover:border-emerald-400/60 hover:text-emerald-500">
              <Download size={15} />
              <span>resume</span>
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* bottom hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 inset-x-0 flex items-end justify-between px-4 sm:px-8 font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground/70"
      >
        <span className="hidden sm:flex items-center gap-2">
          <MousePointerClick size={12} /> click anywhere · shockwave
        </span>
        <span className="flex flex-col items-center gap-2 mx-auto sm:mx-0">
          scroll
          <span className="relative h-10 w-px overflow-hidden bg-foreground/15">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-emerald-400 animate-[scrollcue_1.6s_ease-in-out_infinite]" />
          </span>
        </span>
        <span className="hidden sm:block">© {new Date().getFullYear()}</span>
      </motion.div>
    </section>
  );
}

/* ============================ MARQUEE ============================= */
function SkillMarquee() {
  const skills = photographerInfo.clients;
  return (
    <section aria-label="Skills" className="relative py-10 md:py-14 border-y border-emerald-500/15 bg-secondary/40 overflow-hidden">
      <VelocityMarquee baseVelocity={-2.5} className="py-2">
        {skills.map((s) => (
          <span key={s} className="mx-6 md:mx-10 flex items-center gap-6 md:gap-10 text-4xl md:text-7xl font-black uppercase tracking-tight text-foreground">
            {s}
            <span className="text-emerald-400 text-3xl md:text-5xl">✦</span>
          </span>
        ))}
      </VelocityMarquee>
      <VelocityMarquee baseVelocity={2.5} className="py-2">
        {skills.map((s) => (
          <span key={s} className="mx-6 md:mx-10 flex items-center gap-6 md:gap-10 text-4xl md:text-7xl font-black uppercase tracking-tight hero-outline-muted">
            {s}
            <span className="text-foreground/20 text-3xl md:text-5xl">/</span>
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}

/* ============================= STATS ============================== */
function Stats() {
  const items = [
    { n: projects.length, s: '+', label: 'Shipped Projects' },
    { n: 2, s: '+', label: 'Years Building' },
    { n: photographerInfo.clients.length, s: '', label: 'Core Technologies' },
    { n: 100, s: '%', label: 'Responsive & Fast' },
  ];
  return (
    <section aria-label="Stats" className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-20 md:py-28">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-emerald-500/15 rounded-2xl overflow-hidden border border-emerald-500/15">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
            className="group relative bg-background p-6 md:p-10 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-cyan-500/5 transition-colors duration-500" />
            <div className="relative text-5xl md:text-7xl font-black tracking-tighter text-foreground">
              <CountUp to={it.n} suffix={it.s} />
            </div>
            <div className="relative mt-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-muted-foreground">
              {it.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ======================= SCROLL-LIT STATEMENT ===================== */
function Word({ children, progress, range }: { key?: React.Key; children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em] text-foreground" aria-hidden="true">
      {children}
    </motion.span>
  );
}

function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] });
  const text = photographerInfo.biography.split('\n\n')[0];
  const words = text.split(' ');
  return (
    <section aria-label="About" className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 py-16 md:py-28">
      <div className="font-mono text-xs tracking-[0.3em] uppercase text-emerald-500 mb-8 flex items-center gap-3">
        <span className="h-px w-10 bg-emerald-500" /> ( about )
      </div>
      <p ref={ref} className="text-2xl sm:text-3xl md:text-5xl font-semibold leading-[1.2] tracking-tight" aria-label={text}>
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </p>
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12">
        <Link to="/about" className="group inline-flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-foreground hover:text-emerald-500 transition-colors">
          <span className="relative">
            more about me
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-emerald-500 transition-transform duration-500 group-hover:scale-x-100" />
          </span>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-foreground/20 transition-all duration-300 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-black group-hover:rotate-[-45deg]">
            <ArrowRight size={16} />
          </span>
        </Link>
      </motion.div>
    </section>
  );
}

/* ============================ TERMINAL ============================ */
function TerminalSection() {
  return (
    <section aria-label="My Technical Stack" className="relative py-20 md:py-28 bg-secondary/40 border-y border-emerald-500/15 overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[60rem] max-w-full rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase text-emerald-500 mb-4">
          <Terminal size={14} /> live terminal
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
          <RevealWords text="My stack, in one shell." />
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Type commands, poke around — it's interactive.</p>
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 25 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
          style={{ transformPerspective: 1200 }}
          className="mt-12 text-left"
        >
          <TechTerminal />
        </motion.div>
      </div>
    </section>
  );
}

/* ===================== PINNED HORIZONTAL WORK ===================== */
function HorizontalWork() {
  const featured = projects.slice(0, 6);
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const measure = () => {
      setIsDesktop(mq.matches);
      if (trackRef.current) setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const header = (
    <div className="flex items-end justify-between gap-6 px-4 sm:px-6 md:px-12 mb-8 md:mb-10">
      <div>
        <div className="font-mono text-xs tracking-[0.3em] uppercase text-emerald-500 mb-3 flex items-center gap-3">
          <span className="h-px w-10 bg-emerald-500" /> ( selected work )
        </div>
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.9]">
          <RevealWords text="Featured Projects" />
        </h2>
      </div>
      <Link to="/portfolio" className="hidden md:inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-emerald-500 transition-colors shrink-0">
        all projects <ArrowUpRight size={14} />
      </Link>
    </div>
  );

  if (!isDesktop) {
    return (
      <section aria-label="Featured Projects" className="py-20">
        {header}
        <div ref={trackRef} className="grid grid-cols-1 gap-4 px-4">
          {featured.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} aspect="landscape" />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/portfolio" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-500">
            all projects <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section ref={targetRef} aria-label="Featured Projects" className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        {header}
        <motion.div ref={trackRef} style={{ x }} className="flex gap-6 px-12 w-max will-change-transform">
          {featured.map((p, i) => (
            <div key={p.id} className="w-[min(46vw,640px)] shrink-0">
              <ProjectCard project={p} index={i} aspect="landscape" />
              <div className="mt-4 flex items-baseline gap-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <span className="text-emerald-500 text-2xl font-black tracking-tighter">{String(i + 1).padStart(2, '0')}</span>
                <span className="truncate">{p.title}</span>
              </div>
            </div>
          ))}
          <Link
            to="/portfolio"
            className="group w-[min(30vw,380px)] shrink-0 aspect-[4/3] rounded-2xl border border-dashed border-emerald-500/40 flex flex-col items-center justify-center gap-4 text-foreground hover:bg-emerald-500/10 transition-colors"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-black transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-45deg]">
              <ArrowRight size={28} />
            </span>
            <span className="font-mono text-xs uppercase tracking-widest">view all work</span>
          </Link>
        </motion.div>
        <div className="mx-12 mt-10 h-px bg-foreground/10 relative overflow-hidden">
          <motion.div style={{ width: bar }} className="absolute inset-y-0 left-0 bg-emerald-400 shadow-[0_0_12px_#34d399]" />
        </div>
      </div>
    </section>
  );
}

/* ============================== CTA =============================== */
function BigCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.7, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 0]);
  return (
    <section ref={ref} aria-label="Contact" className="relative overflow-hidden py-28 md:py-40 px-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.18),transparent_60%)] pointer-events-none" />
      <motion.div style={{ scale, rotate }} className="relative text-center">
        <div className="font-mono text-xs tracking-[0.3em] uppercase text-emerald-500 mb-6">( got an idea? )</div>
        <h2 className="text-[13vw] md:text-[9rem] font-black uppercase leading-[0.85] tracking-tighter text-foreground">
          Let's build
          <br />
          <span className="text-gradient-anim">something wild</span>
        </h2>
        <div className="mt-12 flex justify-center">
          <Magnetic>
            <Link
              to="/contact"
              className="btn-shine group relative grid h-40 w-40 md:h-48 md:w-48 place-items-center overflow-hidden rounded-full bg-emerald-500 text-black font-mono text-sm font-bold uppercase tracking-widest shadow-[0_0_80px_rgba(16,185,129,0.5)] transition-transform duration-500 hover:scale-110"
            >
              <span className="flex flex-col items-center gap-2">
                <ArrowUpRight size={28} className="transition-transform duration-500 group-hover:rotate-45" />
                say hello
              </span>
            </Link>
          </Magnetic>
        </div>
        <a href={`mailto:${photographerInfo.email}`} className="mt-10 inline-block font-mono text-sm md:text-base text-muted-foreground hover:text-emerald-500 transition-colors">
          <ScrambleText text={photographerInfo.email} />
        </a>
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
      <Stats />
      <Statement />
      <HorizontalWork />
      <TerminalSection />
      <BigCTA />
    </PageTransition>
  );
}
