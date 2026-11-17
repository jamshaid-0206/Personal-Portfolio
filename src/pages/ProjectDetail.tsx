import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Github, Globe, Maximize2 } from 'lucide-react';
import { projects } from '../data/projects';
import { Lightbox } from '../components/portfolio/Lightbox';
import { ProjectDemoVideo } from '../components/portfolio/ProjectDemoVideo';
import { SEOHead } from '../components/seo/SEOHead';
import { PageTransition } from '../components/ui/PageTransition';
import { BTN_GHOST, BTN_PRIMARY, CONTAINER, EASE, Eyebrow, InView, PageHero } from '../components/ui/Premium';
import { cn } from '../lib/utils';

const GITHUB: Record<string, string> = {
  'readability-pro': 'https://github.com/jamshaid-0206/ReadabilityPro-AI-Writing-Assistant',
  'mern-api-platform': 'https://github.com/jamshaid-0206/binance-trading-bot',
  hostelmate: 'https://github.com/jamshaid-0206/MAD',
};

const STATS: Record<string, { label: string; value: string }[]> = {
  'aesthetic-med-pakistan': [
    { label: 'Products live', value: '27' },
    { label: 'Product categories', value: '22' },
    { label: 'Brands carried', value: '6' },
  ],
  'readability-pro': [
    { label: 'AI response latency', value: '<240ms' },
    { label: 'Grammar recall accuracy', value: '98.6%' },
    { label: 'Service uptime', value: '99.99%' },
  ],
  hostelmate: [
    { label: 'Offline sync', value: '<1s' },
    { label: 'Data recovery rate', value: '100%' },
    { label: 'Crash-free sessions', value: '99.8%' },
  ],
  'asian-it-client-platforms': [
    { label: 'Lighthouse score', value: '95+' },
    { label: 'Bundle size', value: '-40%' },
    { label: 'Site visits', value: '+185%' },
  ],
  'mern-api-platform': [
    { label: 'WebSocket latency', value: '~12ms' },
    { label: 'Peak throughput', value: '25k/s' },
    { label: 'CPU overhead', value: '<4.5%' },
  ],
};

const CATEGORY_LABEL: Record<string, string> = {
  ai: 'AI',
  mobile: 'Mobile',
  frontend: 'Frontend',
  fullstack: 'Full-stack',
  wordpress: 'WordPress',
};

const PROCESS = ['Planning', 'Design', 'Development', 'Testing', 'Launch'];

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-[clamp(2.2rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-foreground">{title}</h2>
    </div>
  );
}

function Cover({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  return (
    <div ref={ref} className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-gradient-to-br from-zinc-800 to-zinc-950 md:aspect-[16/8]">
      <motion.img src={src} alt={alt} style={reduce ? undefined : { scale }} className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const reduce = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const idx = projects.findIndex((p) => p.slug === slug);
  const project = projects[idx];

  useEffect(() => {
    if (lightboxIndex === null || !project) return;
    const n = project.images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setLightboxIndex((i) => (i === null ? i : (i - 1 + n) % n));
      else if (e.key === 'ArrowRight') setLightboxIndex((i) => (i === null ? i : (i + 1) % n));
      else if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, project]);

  if (!project) return <Navigate to="/404" replace />;

  const next = projects[(idx + 1) % projects.length];
  const stats = STATS[project.slug] ?? STATS['asian-it-client-platforms'];
  const n = project.images.length;

  const meta = [
    { label: 'Client', value: project.client },
    { label: 'Year', value: project.year },
    { label: 'Category', value: CATEGORY_LABEL[project.category] ?? project.category },
    { label: 'Location', value: project.location.split('/')[0].trim() },
  ];

  return (
    <PageTransition>
      <SEOHead title={project.title} description={project.description} image={project.coverImage} slug={project.slug} />

      <PageHero
        compact
        size="md"
        eyebrow={
          <Link to="/portfolio" className="group inline-flex items-center gap-2 hover:text-foreground">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> All work
          </Link>
        }
        lines={[project.title]}
        intro={project.description.split('\n\n')[0]}
      />

      {/* Cover + meta */}
      <section className={CONTAINER} aria-label="Project summary">
        <InView>
          <Cover src={project.coverImage} alt={project.title} />
        </InView>
        <InView className="mt-10 grid grid-cols-2 gap-y-8 border-b border-foreground/10 pb-10 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.label} className="pr-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{m.label}</div>
              <div className="mt-2 text-lg font-medium text-foreground">{m.value}</div>
            </div>
          ))}
        </InView>
        <InView className="mt-8 flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2">
            {project.camera.split(',').map((t) => (
              <span key={t} className="rounded-full border border-foreground/15 px-4 py-1.5 text-sm text-foreground">
                {t.trim()}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={BTN_PRIMARY}>
                <Globe size={16} /> Visit live site
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
              </a>
            )}
            {(GITHUB[project.slug] || !project.liveUrl) && (
              <a
                href={GITHUB[project.slug] ?? 'https://github.com/jamshaid-0206'}
                target="_blank"
                rel="noopener noreferrer"
                className={project.liveUrl ? BTN_GHOST : BTN_PRIMARY}
              >
                <Github size={16} /> View source
                <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
              </a>
            )}
          </div>
        </InView>
      </section>

      {/* Overview + stats */}
      <section className={`${CONTAINER} py-24 md:py-36`} aria-label="Overview">
        <div className="grid items-start gap-6 lg:grid-cols-[0.35fr_1fr] lg:gap-12">
          <Eyebrow>Overview</Eyebrow>
          <InView>
            <p className="text-[clamp(1.5rem,3vw,2.6rem)] font-medium leading-[1.2] tracking-[-0.03em] text-foreground">{project.overview}</p>
          </InView>
        </div>
        <div className="mt-20 grid gap-y-12 sm:grid-cols-3">
          {stats.map((s, i) => (
            <InView key={s.label} delay={i * 0.08} className="border-l border-foreground/10 pl-6">
              <div className="text-[clamp(3rem,6vw,5.5rem)] font-semibold leading-none tracking-[-0.05em] text-foreground">{s.value}</div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
            </InView>
          ))}
        </div>
      </section>

      {/* Challenge / Solution */}
      <section className="border-y border-foreground/10 bg-secondary/40 py-24 md:py-32" aria-label="Challenge and solution">
        <div className={`${CONTAINER} grid gap-14 md:grid-cols-2 md:gap-20`}>
          {[
            { k: '01', t: 'The challenge', d: project.challenge },
            { k: '02', t: 'The solution', d: project.solution },
          ].map((b, i) => (
            <InView key={b.k} delay={i * 0.1}>
              <div className="font-mono text-sm text-emerald-500">{b.k}</div>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">{b.t}</h3>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{b.d}</p>
            </InView>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className={`${CONTAINER} py-24 md:py-36`} aria-label="Key features">
        <SectionTitle eyebrow="Key features" title="What it does." />
        <div className="grid gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 md:grid-cols-2">
          {project.featuresList.map((f, i) => {
            const [title, ...rest] = f.split(': ');
            return (
              <InView key={i} y={20} className="group bg-background p-7 transition-colors duration-500 hover:bg-secondary md:p-10">
                <div className="font-mono text-xs text-emerald-500">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mt-4 text-xl font-semibold tracking-[-0.02em] text-foreground md:text-2xl">{title}</h3>
                {rest.length > 0 && <p className="mt-3 leading-relaxed text-muted-foreground">{rest.join(': ')}</p>}
              </InView>
            );
          })}
        </div>
      </section>

      {project.demoVideoUrl && (
        <section className={`${CONTAINER} pb-24 md:pb-36`} aria-label="Demo">
          <SectionTitle eyebrow="Demo" title="See it in action." />
          <InView>
            <ProjectDemoVideo videoUrl={project.demoVideoUrl} posterUrl={project.demoVideoPoster} title={project.title} />
          </InView>
        </section>
      )}

      {/* Process */}
      <section className={`${CONTAINER} pb-24 md:pb-36`} aria-label="Process">
        <SectionTitle eyebrow="Process" title="From idea to production." />
        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-5">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-foreground/10 sm:block" />
          {PROCESS.map((p, i) => (
            <InView key={p} delay={i * 0.08} y={20} className="relative flex items-center gap-4 sm:block">
              <div className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-foreground/15 bg-background font-mono text-sm text-emerald-500">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="text-xl font-semibold tracking-[-0.02em] text-foreground sm:mt-5">{p}</div>
            </InView>
          ))}
        </div>
        <InView>
          <p className="mt-12 max-w-3xl text-lg leading-relaxed text-muted-foreground">{project.developmentProcess}</p>
        </InView>
      </section>

      {/* Stack + highlights */}
      <section className="border-y border-foreground/10 bg-secondary/40 py-24 md:py-32" aria-label="Technical details">
        <div className={`${CONTAINER} grid gap-16 lg:grid-cols-[0.8fr_1.2fr]`}>
          <div>
            <Eyebrow>Tech stack</Eyebrow>
            <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
              {project.technologiesList.map((t, i) => (
                <li key={t} className="flex items-baseline gap-4 py-4">
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-lg text-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Technical highlights</Eyebrow>
            <div className="space-y-6">
              {project.technicalHighlights.map((h, i) => (
                <InView key={i} y={20} className="flex gap-5">
                  <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-500 font-mono text-xs font-bold text-black">{i + 1}</span>
                  <p className="text-lg leading-relaxed text-foreground">{h}</p>
                </InView>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className={`${CONTAINER} py-24 md:py-36`} aria-label="Results">
        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <InView>
            <Eyebrow>Results</Eyebrow>
            <p className="text-2xl font-medium leading-snug tracking-[-0.02em] text-foreground md:text-3xl">{project.results}</p>
          </InView>
          <InView delay={0.1}>
            <Eyebrow>Lessons learned</Eyebrow>
            <p className="text-lg leading-relaxed text-muted-foreground">{project.lessonsLearned}</p>
          </InView>
        </div>
      </section>

      {/* Gallery */}
      {n > 0 && (
        <section className={`${CONTAINER} pb-24 md:pb-36`} aria-label="Gallery">
          <SectionTitle eyebrow="Gallery" title="A closer look." />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {project.images.map((img, i) => (
              <motion.button
                key={i}
                type="button"
                onClick={() => setLightboxIndex(i)}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.06, ease: EASE }}
                className={cn(
                  'group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950',
                  i % 5 === 0 ? 'col-span-2 aspect-[16/10]' : 'aspect-square'
                )}
                aria-label={`Open image: ${img.alt}`}
              >
                <img src={img.url} alt={img.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute right-3 top-3 grid h-9 w-9 scale-0 place-items-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-100">
                  <Maximize2 size={15} />
                </span>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Next project */}
      <section className="border-t border-foreground/10" aria-label="Next project">
        <Link to={`/portfolio/${next.slug}`} className="group block">
          <div className={`${CONTAINER} flex flex-col gap-8 py-20 md:flex-row md:items-center md:justify-between md:py-28`}>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">Next project</div>
              <div className="mt-4 text-[clamp(2.5rem,7vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-foreground transition-colors duration-500 group-hover:text-emerald-500">
                {next.title}
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 md:w-80">
              <img src={next.coverImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500 text-black transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={24} />
                </span>
              </span>
            </div>
          </div>
        </Link>
        <div className={`${CONTAINER} pb-16`}>
          <Link to="/portfolio" className={BTN_GHOST}>
            <ArrowLeft size={16} /> Back to all work
          </Link>
        </div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={project.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i === null ? i : (i - 1 + n) % n))}
          onNext={() => setLightboxIndex((i) => (i === null ? i : (i + 1) % n))}
        />
      )}
    </PageTransition>
  );
}
