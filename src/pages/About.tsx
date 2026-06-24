import { useState } from 'react';
import { Mail, Github, Linkedin, Download, Terminal } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { photographerInfo } from '../data/photographer';
import { SEOHead } from '../components/seo/SEOHead';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PageTransition } from '../components/ui/PageTransition';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';
import { AboutVideo } from '../components/ui/AboutVideo';
import { cn } from '../lib/utils';

export default function About() {
  const [mediaTab, setMediaTab] = useState<'demo' | 'loop'>('demo');
  const shouldReduceMotion = useReducedMotion();
  const bioParagraphs = photographerInfo.biography.split('\n\n');

  // Slide entrance configurations
  const slideLeftVariants = {
    hidden: { 
      opacity: 0, 
      x: shouldReduceMotion ? 0 : -10 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.1, 
        ease: 'easeOut' 
      }
    }
  };

  const slideRightVariants = {
    hidden: { 
      opacity: 0, 
      x: shouldReduceMotion ? 0 : 10 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8, 
        delay: 0.1, 
        ease: 'easeOut' 
      }
    }
  };

  return (
    <PageTransition>
      <SEOHead 
        title="About" 
        description="Learn more about Jamshaid Ghafoor, Full-Stack Developer and MERN Specialist currently pursuing BSCS in Islamabad, Pakistan." 
      />

      {/* SECTION A: PAGE HERO */}
      <section className="py-24 md:py-32 border-b border-border bg-card/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase block mb-4">
              // BIOGRAPHICAL_RECORDS
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-foreground font-sans uppercase">
              About
            </h1>
            <p className="text-muted-foreground font-light text-lg md:text-xl max-w-xl mx-auto mt-4 leading-relaxed">
              Full-Stack Developer & MERN Specialist.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION B: SPLIT DETAILED LAYOUT */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT SIDE COLUMN: Autoplay loop video + Social links deck */}
          <motion.div
            variants={slideLeftVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="space-y-6 lg:col-span-5"
          >
            {/* Interactive media player tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/80 pb-3 gap-2 font-mono text-[10px] tracking-widest text-muted-foreground uppercase select-none">
              <span>// CHOOSE_MEDIA_SOURCE</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setMediaTab('demo')}
                  className={cn(
                    "px-2.5 py-1 rounded-sm border transition-colors cursor-pointer text-[9px] sm:text-[10px]",
                    mediaTab === 'demo'
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-medium"
                      : "border-border/60 hover:border-foreground/20 hover:bg-accent"
                  )}
                >
                  [ WORKSPACE_CAM ]
                </button>
                <button
                  onClick={() => setMediaTab('loop')}
                  className={cn(
                    "px-2.5 py-1 rounded-sm border transition-colors cursor-pointer text-[9px] sm:text-[10px]",
                    mediaTab === 'loop'
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-medium"
                      : "border-border/60 hover:border-foreground/20 hover:bg-accent"
                  )}
                >
                  [ DEV_ENV_LOOP ]
                </button>
              </div>
            </div>

            {/* Visual looping code workspace media player */}
            <div className="aspect-[3/4] overflow-hidden rounded-sm bg-zinc-950 border border-border relative shadow-lg">
              {mediaTab === 'demo' ? (
                <div className="w-full h-full relative">
                  <video
                    className="w-full h-full object-cover opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                  >
                    <source src="/about_video.mp4" type="video/mp4" />
                    <source src="/uploaded_video.mp4" type="video/mp4" />
                    <source src="https://videos.pexels.com/video-files/3129957/3129957-sd_640_360_25fps.mp4" type="video/mp4" />
                  </video>
                  {/* CRT Scanline styling effect */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] opacity-30" />
                </div>
              ) : (
                <AboutVideo />
              )}
              {/* Overlapping terminal badge */}
              <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/60 border border-emerald-500/20 rounded-sm font-mono text-[9px] tracking-wider text-emerald-300 pointer-events-none">
                <Terminal size={10} className="animate-pulse" />
                <span>{mediaTab === 'demo' ? 'WORKSPACE_FEED_01' : 'DEV_ENVIRONMENT_01'}</span>
              </div>
            </div>

            {/* Micro horizontal social buttons row */}
            <div className="flex items-center gap-2 w-full">
              {/* Mail shortcut */}
              <a
                href={`mailto:${photographerInfo.email}`}
                className="flex-1 p-3 border border-border rounded-sm hover:bg-accent text-foreground transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label="Send direct Email"
              >
                <Mail size={16} />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/jamshaid-0206"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 p-3 border border-border rounded-sm hover:bg-accent text-foreground transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label="View Github account"
              >
                <Github size={16} />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/jamshaidghafoor/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 p-3 border border-border rounded-sm hover:bg-accent text-foreground transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label="Visit LinkedIn profile"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </motion.div>

          {/* RIGHT SIDE COLUMN: Biography, Location details and Resume download */}
          <motion.div
            variants={slideRightVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="text-left space-y-6 flex flex-col items-start lg:col-span-7"
          >
            {/* Header elements */}
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-light tracking-wide text-foreground">
                {photographerInfo.name}
              </h2>
              <p className="font-mono text-xs md:text-sm text-emerald-400 tracking-wide">
                &gt; {photographerInfo.tagline}
              </p>
            </div>

            {/* Separator Line */}
            <div className="h-px w-full bg-border" />

            {/* Paragraph iteration */}
            <div className="space-y-4 text-base md:text-lg font-light leading-relaxed text-muted-foreground select-text">
              {bioParagraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Quantitative experience metrics block */}
            <div className="grid grid-cols-2 gap-4 w-full pt-2">
              <div className="border border-border/80 rounded-sm p-4 bg-card/20 flex flex-col items-start space-y-1 hover:border-emerald-500/10 transition-colors">
                <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-muted-foreground uppercase">// PROJECTS_SHIPPED:</span>
                <span className="text-2xl md:text-3xl font-light text-emerald-400">
                  <AnimatedCounter value={12} suffix="+" />
                </span>
              </div>
              <div className="border border-border/80 rounded-sm p-4 bg-card/20 flex flex-col items-start space-y-1 hover:border-emerald-500/10 transition-colors">
                <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-muted-foreground uppercase">// LINES_OF_CODE:</span>
                <span className="text-2xl md:text-3xl font-light text-emerald-400">
                  <AnimatedCounter value={45} suffix="k+" />
                </span>
              </div>
              <div className="border border-border/80 rounded-sm p-4 bg-card/20 flex flex-col items-start space-y-1 hover:border-emerald-500/10 transition-colors">
                <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-muted-foreground uppercase">// GIT_COMMITS:</span>
                <span className="text-2xl md:text-3xl font-light text-emerald-400">
                  <AnimatedCounter value={850} suffix="+" />
                </span>
              </div>
              <div className="border border-border/80 rounded-sm p-4 bg-card/20 flex flex-col items-start space-y-1 hover:border-emerald-500/10 transition-colors">
                <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-muted-foreground uppercase">// SUCCESS_RATE:</span>
                <span className="text-2xl md:text-3xl font-light text-emerald-400">
                  <AnimatedCounter value={100} suffix="%" />
                </span>
              </div>
            </div>

            {/* Metadata properties stack */}
            <div className="border border-border/80 rounded-sm p-5 w-full bg-card/25 space-y-3 font-mono text-xs md:text-sm select-all">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground tracking-widest uppercase">// EMAIL:</span>
                <span className="text-foreground text-right">{photographerInfo.email}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground tracking-widest uppercase">// LOCATION:</span>
                <span className="text-foreground text-right">{photographerInfo.location}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground tracking-widest uppercase">// HIGHER_EDUCATION:</span>
                <span className="text-foreground text-right truncate max-w-[200px] md:max-w-xs">{photographerInfo.education}</span>
              </div>
            </div>

            {/* Emerald resume download button */}
            <div className="pt-4">
              <a
                href="/resume.pdf"
                download="Jamshaid_Ghafoor_Resume.pdf"
                className="inline-flex items-center gap-2.5 px-6 py-3 border border-emerald-400/60 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/25 active:bg-emerald-500/30 font-mono text-xs md:text-sm tracking-wider uppercase rounded-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 select-none cursor-pointer"
              >
                <Download size={14} />
                <span>download.resume()</span>
              </a>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION C: EXTRAS OR APPROACH BANNER */}
      <section className="py-16 md:py-24 border-t border-border bg-card/5">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <ScrollReveal>
            <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase block mb-2">
              // PHILOSOPHICAL_APPROACH
            </span>
            <h3 className="text-2xl md:text-3xl font-light tracking-wide text-foreground">
              Development Approach & Values
            </h3>
            <div className="h-px w-16 bg-emerald-500/30 mx-auto my-4" />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left text-sm md:text-base font-light text-muted-foreground leading-relaxed select-text">
              {photographerInfo.approach.split('\n\n').map((para, idx) => (
                <p key={idx} className="bg-card/20 p-6 rounded-sm border border-border/40 hover:border-emerald-500/10 transition-colors">
                  {para}
                </p>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

    </PageTransition>
  );
}
