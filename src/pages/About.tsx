import { ArrowUpRight, Download, Github, Mail, MapPin, GraduationCap } from 'lucide-react';
import { photographerInfo } from '../data/photographer';
import { SEOHead } from '../components/seo/SEOHead';
import { PageTransition } from '../components/ui/PageTransition';
import { CountUp, RevealWords } from '../components/ui/Kinetic';
import { motion, useReducedMotion } from 'motion/react';
import { BTN_GHOST, BTN_PRIMARY, CONTAINER, ContactCTA, EASE, Eyebrow, InView, PageHero } from '../components/ui/Premium';

export default function About() {
  const reduce = useReducedMotion();
  const bio = photographerInfo.biography.split('\n\n');
  const approach = photographerInfo.approach.split('\n\n');
  const experience = photographerInfo.awards.map((a) => {
    const m = a.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    return m ? { title: m[1], period: m[2] } : { title: a, period: '' };
  });

  const stats = [
    { n: 12, s: '+', label: 'Projects shipped' },
    { n: 45, s: 'k+', label: 'Lines of code' },
    { n: 850, s: '+', label: 'Git commits' },
    { n: 100, s: '%', label: 'Client satisfaction' },
  ];

  const facts = [
    { icon: Mail, label: 'Email', value: photographerInfo.email, href: `mailto:${photographerInfo.email}` },
    { icon: MapPin, label: 'Based in', value: photographerInfo.location },
    { icon: GraduationCap, label: 'Education', value: photographerInfo.education },
  ];

  return (
    <PageTransition>
      <SEOHead
        title="About"
        description="Learn more about Jamshaid Ghafoor, Full-Stack Developer and MERN Specialist currently pursuing BSCS in Islamabad, Pakistan."
      />

      <PageHero
        eyebrow="About me"
        lines={['Code with', <>craft &amp; <span className="text-gradient-anim italic pr-[0.06em]">care.</span></>]}
        intro={photographerInfo.tagline}
        aside={
          <div className="inline-flex items-center gap-2.5 rounded-full border border-foreground/15 bg-background/50 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for work
          </div>
        }
      />

      {/* Portrait + bio */}
      <section className={`${CONTAINER} py-16 md:py-24`} aria-label="Biography">
        <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <InView className="lg:sticky lg:top-28">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-900/60 via-zinc-900 to-violet-950">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={photographerInfo.portraitImage}
              >
                <source src="https://videos.pexels.com/video-files/3129957/3129957-sd_640_360_25fps.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
                <div>
                  <div className="text-2xl font-semibold tracking-[-0.03em]">{photographerInfo.name}</div>
                  <div className="text-sm text-white/70">Full-stack developer</div>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">PK · GMT+5</span>
              </div>
            </div>
          </InView>

          <div>
            <InView>
              <p className="text-[clamp(1.4rem,2.5vw,2.2rem)] font-medium leading-[1.25] tracking-[-0.03em] text-foreground">{bio[0]}</p>
            </InView>
            {bio.slice(1).map((p, i) => (
              <InView key={i} delay={0.05}>
                <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{p}</p>
              </InView>
            ))}

            <InView delay={0.1}>
              <dl className="mt-12 divide-y divide-foreground/10 border-y border-foreground/10">
                {facts.map((f) => (
                  <div key={f.label} className="grid grid-cols-[auto_1fr] items-center gap-5 py-5 sm:grid-cols-[180px_1fr]">
                    <dt className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      <f.icon size={15} className="text-emerald-500" />
                      {f.label}
                    </dt>
                    <dd className="text-right text-foreground sm:text-left">
                      {f.href ? (
                        <a href={f.href} className="break-all hover:text-emerald-500">
                          {f.value}
                        </a>
                      ) : (
                        f.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </InView>

            <InView delay={0.15} className="mt-10 flex flex-wrap gap-3">
              <a href="/resume.pdf" download="Jamshaid_Ghafoor_Resume.pdf" className={BTN_PRIMARY}>
                <Download size={16} /> Download resume
              </a>
              <a href={photographerInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className={BTN_GHOST}>
                <Github size={16} /> GitHub
                <ArrowUpRight size={15} className="transition-transform group-hover:rotate-45" />
              </a>
            </InView>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`${CONTAINER} py-16`} aria-label="Numbers">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
          {stats.map((s, i) => (
            <InView key={s.label} delay={i * 0.08} className="border-l border-foreground/10 pl-5 md:pl-8">
              <div className="text-[clamp(3rem,7vw,6.5rem)] font-semibold leading-none tracking-[-0.05em] text-foreground">
                <CountUp to={s.n} suffix={s.s} />
              </div>
              <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
            </InView>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className={`${CONTAINER} py-20 md:py-32`} aria-label="Experience">
        <Eyebrow>Experience & milestones</Eyebrow>
        <ul className="border-b border-foreground/10">
          {experience.map((e, i) => (
            <motion.li
              key={e.title}
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: EASE }}
              className="service-row group relative border-t border-foreground/10"
            >
                <div className="relative z-10 grid grid-cols-[auto_1fr] items-center gap-5 py-7 text-foreground transition-colors duration-500 group-hover:text-black md:grid-cols-[auto_1fr_auto] md:gap-10 md:px-6 md:py-9">
                  <span className="font-mono text-xs text-muted-foreground transition-colors duration-500 group-hover:text-black/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[clamp(1.4rem,3.4vw,3rem)] font-semibold leading-tight tracking-[-0.035em] transition-transform duration-500 md:group-hover:translate-x-3">
                    {e.title}
                  </span>
                  {e.period && (
                    <span className="col-start-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors duration-500 group-hover:text-black/70 md:col-start-auto">
                      {e.period}
                    </span>
                  )}
                </div>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section className="border-y border-foreground/10 bg-secondary/40 py-20 md:py-28" aria-label="Skills">
        <div className={`${CONTAINER} grid gap-12 lg:grid-cols-[1fr_1.4fr]`}>
          <div>
            <Eyebrow>Toolkit</Eyebrow>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-foreground">
              <RevealWords text="What I work with." />
            </h2>
          </div>
          <div className="flex flex-wrap content-start gap-3">
            {photographerInfo.clients.map((s, i) => (
              <InView key={s} delay={i * 0.03} y={20}>
                <span className="inline-block rounded-full border border-foreground/15 bg-background px-5 py-3 text-base font-medium text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:bg-emerald-500 hover:text-black md:text-lg">
                  {s}
                </span>
              </InView>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className={`${CONTAINER} py-20 md:py-32`} aria-label="Approach">
        <Eyebrow>How I work</Eyebrow>
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {approach.map((p, i) => (
            <InView key={i} delay={i * 0.1}>
              <div className="font-mono text-sm text-emerald-500">0{i + 1}</div>
              <p className="mt-4 text-xl leading-relaxed text-foreground md:text-2xl md:leading-relaxed">{p}</p>
            </InView>
          ))}
        </div>
      </section>

      <ContactCTA />
    </PageTransition>
  );
}
