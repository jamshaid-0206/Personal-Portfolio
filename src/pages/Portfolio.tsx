import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { CategoryFilter, FilterCategory } from '../components/portfolio/CategoryFilter';
import { projects } from '../data/projects';
import { Project } from '../types';
import { SEOHead } from '../components/seo/SEOHead';
import { PageTransition } from '../components/ui/PageTransition';
import { CONTAINER, ContactCTA, EASE, PageHero } from '../components/ui/Premium';

function WorkCard({ project, index }: { key?: React.Key; project: Project; index: number }) {
  const reduce = useReducedMotion();
  const tech = project.camera.split(',').map((t) => t.trim()).slice(0, 3).join(' · ');
  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 2) * 0.08 }}
      className={index % 2 === 1 ? 'md:mt-40' : ''}
    >
      <Link to={`/portfolio/${project.slug}`} className="group block" data-cursor="view">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-gradient-to-br from-zinc-800 to-zinc-950 md:aspect-[5/6]">
          <img
            src={project.coverImage}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          <span className="absolute left-5 top-5 rounded-full bg-black/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-white">
            {project.category}
          </span>
          <span className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 scale-0 place-items-center rounded-full bg-emerald-500 text-sm font-semibold text-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100">
            View
          </span>
          <span className="absolute bottom-5 left-5 right-5 truncate text-sm text-white/80">{tech}</span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.03em] text-foreground transition-colors group-hover:text-emerald-500 md:text-4xl">
              {project.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{project.client}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
            <span className="grid h-11 w-11 place-items-center rounded-full border border-foreground/15 text-foreground transition-all duration-300 group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-black">
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState<FilterCategory>('all');
  const filtered = active === 'all' ? projects : projects.filter((p) => p.category === active);

  const counts = useMemo(() => {
    const c: Partial<Record<FilterCategory, number>> = { all: projects.length };
    for (const p of projects) c[p.category as FilterCategory] = (c[p.category as FilterCategory] || 0) + 1;
    return c;
  }, []);

  return (
    <PageTransition>
      <SEOHead
        title="Portfolio"
        description="Explore Selected Web & Mobile Apps, MERN Stack backends, and AI writing solutions developed by Jamshaid Ghafoor."
      />

      <PageHero
        eyebrow="Selected work"
        lines={['Work that', <>ships &amp; <span className="text-gradient-anim italic pr-[0.06em]">scales.</span></>]}
        intro="A selection of AI tools, mobile apps and full-stack platforms — each one designed, engineered and shipped end-to-end."
        aside={
          <div className="text-right">
            <div className="text-7xl font-semibold leading-none tracking-[-0.05em] text-foreground md:text-8xl">
              {String(projects.length).padStart(2, '0')}
            </div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Projects</div>
          </div>
        }
      />

      <section className={`${CONTAINER} pb-10`} aria-label="Projects">
        <div className="mb-14 flex flex-col gap-6 border-b border-foreground/10 pb-8 md:flex-row md:items-center md:justify-between">
          <CategoryFilter activeCategory={active} onCategoryChange={setActive} counts={counts} />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Showing {String(filtered.length).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <WorkCard key={p.id} project={p} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-dashed border-foreground/15 py-24 text-center">
            <p className="text-muted-foreground">No projects in this category yet.</p>
            <button onClick={() => setActive('all')} className="mt-4 rounded-full border border-foreground/15 px-5 py-2 text-sm hover:border-emerald-500">
              Show all
            </button>
          </div>
        )}
      </section>

      <ContactCTA />
    </PageTransition>
  );
}
