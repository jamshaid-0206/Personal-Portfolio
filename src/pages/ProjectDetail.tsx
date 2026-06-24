import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Layers, 
  ShieldCheck, 
  Github, 
  ExternalLink,
  Cpu, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2, 
  Compass, 
  Hammer, 
  Gauge, 
  BookOpen,
  Activity,
  Zap,
  BarChart3
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { projects } from '../data/projects';
import { Lightbox } from '../components/portfolio/Lightbox';
import { ProjectNavigation } from '../components/portfolio/ProjectNavigation';
import { SEOHead } from '../components/seo/SEOHead';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PageTransition } from '../components/ui/PageTransition';
import { SkeletonImage } from '../components/ui/SkeletonImage';
import { ProjectDemoVideo } from '../components/portfolio/ProjectDemoVideo';
import { SystemTopology } from '../components/portfolio/SystemTopology';
import { cn } from '../lib/utils';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const shouldReduceMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Retrieve current active project record
  const project = projects.find((p) => p.slug === slug);

  // Keyboard navigation for Lightbox modal
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        handleNextImage();
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  const getGithubUrl = (projectSlug: string) => {
    switch (projectSlug) {
      case 'readability-pro':
        return 'https://github.com/jamshaid-0206/ReadabilityPro-AI-Writing-Assistant';
      case 'mern-api-platform':
        return 'https://github.com/jamshaid-0206/binance-trading-bot';
      case 'hostelmate':
        return 'https://github.com/jamshaid-0206/MAD';
      default:
        return 'https://github.com/jamshaid-0206';
    }
  };

  const getProjectStats = (projectSlug: string) => {
    switch (projectSlug) {
      case 'readability-pro':
        return [
          { label: "AI INFERENCE LATENCY", value: "<240ms", desc: "Avg LLM generation speed", icon: Zap },
          { label: "RECALL ACCURACY", value: "98.6%", desc: "Grammar feedback correctness", icon: Activity },
          { label: "SYSTEM UPTIME", value: "99.99%", desc: "Cloud proxy availability", icon: BarChart3 }
        ];
      case 'mern-api-platform':
        return [
          { label: "WEBSOCKET LATENCY", value: "~12ms", desc: "Real-time telemetry exchange", icon: Zap },
          { label: "PEAK THROUGHPUT", value: "25k req/s", desc: "High concurrency threshold", icon: Activity },
          { label: "CPU RUNTIME OVERHEAD", value: "<4.5%", desc: "Node microservices cluster", icon: BarChart3 }
        ];
      default:
        return [
          { label: "API DISPATCH SPEED", value: "<150ms", desc: "JSON payload transfer", icon: Zap },
          { label: "USER RETENTION", value: "+185%", desc: "UX flow productivity gain", icon: Activity },
          { label: "FIRST INPUT DELAY", value: "0.45s", desc: "Framer client-side load speed", icon: BarChart3 }
        ];
    }
  };

  if (!project) {
    // If slug is invalid, route to Not Found handler
    return <Navigate to="/404" replace />;
  }

  // Gallery Navigation Helper Functions
  const handlePrevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => 
      prev === 0 ? project.images.length - 1 : (prev as number) - 1
    );
  };

  const handleNextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => 
      prev === project.images.length - 1 ? 0 : (prev as number) + 1
    );
  };

  // Parsing process steps
  const processSteps = [
    { title: "Planning", subtitle: "Architecture", icon: Compass, num: "01" },
    { title: "Design", subtitle: "Layout & UI", icon: Layers, num: "02" },
    { title: "Development", subtitle: "Full Stack", icon: Hammer, num: "03" },
    { title: "Testing", subtitle: "Audits & QA", icon: Gauge, num: "04" },
    { title: "Deployment", subtitle: "Cloud Launch", icon: CheckCircle2, num: "05" }
  ];

  return (
    <PageTransition>
      <SEOHead 
        title={project.title} 
        description={project.description} 
        image={project.coverImage} 
        slug={project.slug} 
      />

      {/* SECTION A: HERO HEADER FULL BLEED IMAGE BANNER */}
      <section className="relative h-[65vh] w-full overflow-hidden bg-black select-none">
        
        {/* Full-bleed responsive background cover using SkeletonImage */}
        <div className="absolute inset-0 w-full h-full">
          <SkeletonImage
            src={project.coverImage}
            alt={project.title}
            aspectRatio="h-full w-full"
            containerClassName="w-full h-full border-none"
            className="opacity-75"
            loading="eager"
          />
        </div>

        {/* Dynamic Dark Gradient Overlays */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/70 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(to top, rgba(10,10,11,1) 0%, rgba(10,10,11,0.1) 40%, rgba(10,10,11,0.7) 100%)"
          }}
        />

        {/* Back Link float control */}
        <div className="absolute top-24 left-6 lg:left-8 z-10">
          <Link
            to="/portfolio"
            className="group inline-flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 hover:border-white/25 rounded-sm backdrop-blur-md text-white font-mono text-xs tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>back.to_portfolio()</span>
          </Link>
        </div>

        {/* Bottom Centered Title & Metadata Panel */}
        <div className="absolute bottom-12 inset-x-0 max-w-7xl mx-auto px-6 lg:px-8 text-left z-10 flex flex-col items-start justify-end h-full pt-20">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-3"
          >
            <span className="text-xs md:text-sm font-mono tracking-widest text-emerald-400 uppercase block">
              // CATEGORY_ID: {project.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-wide text-white font-sans uppercase filter drop-shadow-[0_2px_15px_rgba(0,0,0,0.4)]">
              {project.title}
            </h1>
            <div className="flex items-center gap-2 text-xs md:text-sm font-mono tracking-widest text-white/70">
              <span>{project.year}</span>
              <span>•</span>
              <span className="uppercase">{project.client}</span>
            </div>
          </motion.div>
        </div>

      </section>

      {/* SECTION B: DOUBLE COLUMN METADATA BLOCK & PARAGRAPH INFO */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8" aria-label="Project Details">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT AREA: Tabular project metadata blocks (4-columns width) */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            <ScrollReveal>
              <div className="border border-border/80 bg-card/25 rounded-sm divide-y divide-border/60 shadow-lg">
                {/* Meta item: Client */}
                <div className="p-5 flex items-start gap-4">
                  <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">CLIENT</span>
                    <span className="text-sm font-light text-foreground mt-0.5 block">{project.client}</span>
                  </div>
                </div>

                {/* Meta item: Stack (mapped from camera) */}
                <div className="p-5 flex items-start gap-4">
                  <Layers className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">TECH_STACK</span>
                    <span className="text-sm font-light text-foreground mt-0.5 block leading-relaxed">{project.camera}</span>
                  </div>
                </div>

                {/* Meta item: Location */}
                <div className="p-5 flex items-start gap-4">
                  <MapPin className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">LOCATION</span>
                    <span className="text-sm font-light text-foreground mt-0.5 block">{project.location}</span>
                  </div>
                </div>

                {/* Meta item: Year */}
                <div className="p-5 flex items-start gap-4">
                  <Calendar className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">YEAR</span>
                    <span className="text-sm font-light text-foreground mt-0.5 block">{project.year}</span>
                  </div>
                </div>
              </div>

              {/* GitHub Button link (Conditional if repository is accessible) */}
              <div className="mt-6">
                <a
                  href={getGithubUrl(project.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3.5 border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 active:bg-emerald-500/25 font-mono text-xs tracking-wider uppercase rounded-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400"
                >
                  <Github size={14} />
                  <span>VIEW_REPOS_SOURCE()</span>
                  <ExternalLink size={12} className="opacity-60" />
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT AREA: Case Study Structured Content (8-columns width) */}
          <div className="lg:col-span-8 text-left space-y-12">
            
            {/* 1. OVERVIEW */}
            <ScrollReveal delay={0.1}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase">
                      // 01_PROJECT_OVERVIEW
                    </span>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-light tracking-wide text-foreground">
                    The Mission & Overview
                  </h2>
                  <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground select-text whitespace-pre-line">
                    {project.overview}
                  </p>
                </div>

                {/* Cyberpunk Telemetry Metrics Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {getProjectStats(project.slug).map((stat, idx) => {
                    const StatIcon = stat.icon;
                    return (
                      <div 
                        key={idx} 
                        className="bg-zinc-950/40 backdrop-blur-md border border-white/5 rounded-sm p-4 flex flex-col justify-between hover:border-emerald-500/20 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.15)] group relative"
                      >
                        {/* Status blinking dot */}
                        <span className="absolute top-3 right-3 w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        
                        <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] tracking-widest">
                          <StatIcon size={12} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span>{stat.label}</span>
                        </div>
                        
                        <div className="my-2.5">
                          <span className="text-2xl font-extralight tracking-tight text-white font-mono drop-shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                            {stat.value}
                          </span>
                        </div>
                        
                        <span className="text-[10px] text-zinc-500 font-light leading-relaxed">
                          {stat.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* 2. CHALLENGE & SOLUTION */}
            <ScrollReveal delay={0.15}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Challenge Card */}
                <div className="border border-border/80 bg-rose-500/[0.01] hover:border-rose-500/20 rounded-sm p-6 space-y-3 transition-colors duration-300">
                  <div className="flex items-center gap-2.5 text-rose-400 font-mono text-xs tracking-wider uppercase">
                    <Cpu size={14} className="text-rose-500" />
                    <span>The Challenge</span>
                  </div>
                  <p className="text-sm md:text-base font-light leading-relaxed text-muted-foreground select-text">
                    {project.challenge}
                  </p>
                </div>

                {/* Solution Card */}
                <div className="border border-border/80 bg-emerald-500/[0.01] hover:border-emerald-500/20 rounded-sm p-6 space-y-3 transition-colors duration-300">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-mono text-xs tracking-wider uppercase">
                    <Lightbulb size={14} className="text-emerald-400" />
                    <span>The Solution</span>
                  </div>
                  <p className="text-sm md:text-base font-light leading-relaxed text-muted-foreground select-text">
                    {project.solution}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* 3. CORE FEATURES */}
            <ScrollReveal delay={0.2}>
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase">
                    // 02_CORE_SYSTEM_CAPABILITIES
                  </span>
                  <div className="h-px flex-1 bg-border/40" />
                </div>
                <h3 className="text-xl md:text-2xl font-light tracking-wide text-foreground">
                  Key Functionality
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.featuresList.map((feat, idx) => {
                    const [title, desc] = feat.split(': ');
                    return (
                      <div 
                        key={idx} 
                        className="p-5 rounded-sm border border-border/60 bg-card/10 flex flex-col space-y-1.5 hover:border-emerald-500/10 transition-all duration-300"
                      >
                        <span className="font-mono text-xs text-emerald-400">0{idx + 1}. {title}</span>
                        <p className="text-xs md:text-sm font-light text-muted-foreground leading-relaxed">
                          {desc || ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>

            {/* 4. OPTIONAL DEMO VIDEO STREAM */}
            {project.demoVideoUrl && (
              <ScrollReveal delay={0.25}>
                <div className="mt-8">
                  <ProjectDemoVideo
                    videoUrl={project.demoVideoUrl}
                    posterUrl={project.demoVideoPoster}
                    title={project.title}
                  />
                </div>
              </ScrollReveal>
            )}

            {/* 5. DEVELOPMENT PROCESS STAGE FLOW */}
            <ScrollReveal delay={0.3}>
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase">
                    // 03_DEVELOPMENT_LOGS_PROCESS
                  </span>
                  <div className="h-px flex-1 bg-border/40" />
                </div>
                <h3 className="text-xl md:text-2xl font-light tracking-wide text-foreground">
                  The Journey: Planning to Production
                </h3>
                
                {/* Horizontal flow line for desktops / Vertical list for mobiles */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-2 relative pt-2">
                  {processSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    return (
                      <div key={idx} className="relative flex flex-col items-start md:items-center text-left md:text-center p-4 bg-card/15 border border-border/40 rounded-sm hover:border-emerald-500/10 transition-colors duration-300">
                        {/* Process index badge */}
                        <span className="font-mono text-[9px] text-emerald-500/60 mb-2 font-bold tracking-widest">
                          STEP_{step.num}
                        </span>
                        
                        <div className="w-10 h-10 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center text-emerald-400 mb-2">
                          <StepIcon size={16} />
                        </div>

                        <span className="text-sm font-light text-foreground">{step.title}</span>
                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5">{step.subtitle}</span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-sm md:text-base font-light leading-relaxed text-muted-foreground mt-4 select-text">
                  {project.developmentProcess}
                </p>
              </div>
            </ScrollReveal>

            {/* 3b. SYSTEM ARCHITECTURE & DATA FLOW */}
            <ScrollReveal delay={0.32}>
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase">
                    // 03B_SYSTEM_ARCHITECTURE
                  </span>
                  <div className="h-px flex-1 bg-border/40" />
                </div>
                <h3 className="text-xl md:text-2xl font-light tracking-wide text-foreground">
                  Architecture & Signal Topology
                </h3>
                <SystemTopology techStack={project.camera} />
              </div>
            </ScrollReveal>

            {/* 6. TECHNICAL HIGHLIGHTS */}
            <ScrollReveal delay={0.35}>
              <div className="space-y-4 mt-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase">
                    // 04_ADVANCED_IMPLEMENTATION_DETAILS
                  </span>
                  <div className="h-px flex-1 bg-border/40" />
                </div>
                <h3 className="text-xl md:text-2xl font-light tracking-wide text-foreground">
                  Technical Highlights
                </h3>
                <div className="space-y-3">
                  {project.technicalHighlights.map((highlight, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-sm border border-border/80 bg-zinc-950/60 flex items-start gap-3 hover:border-emerald-500/20 transition-all duration-300"
                    >
                      <span className="font-mono text-xs text-emerald-400 shrink-0 mt-0.5">$ [hl_0{index + 1}]</span>
                      <p className="text-sm font-light text-muted-foreground select-text leading-relaxed">
                        {highlight}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* 7. RESULTS & LESSONS LEARNED */}
            <ScrollReveal delay={0.4}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Results Card */}
                <div className="border border-border/80 bg-emerald-500/[0.01] hover:border-emerald-500/10 rounded-sm p-6 space-y-3 transition-colors duration-300">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-mono text-xs tracking-wider uppercase">
                    <TrendingUp size={14} className="text-emerald-400" />
                    <span>Project Results</span>
                  </div>
                  <p className="text-sm md:text-base font-light leading-relaxed text-muted-foreground select-text">
                    {project.results}
                  </p>
                </div>

                {/* Lessons Learned Card */}
                <div className="border border-border/80 bg-zinc-900/10 hover:border-emerald-500/10 rounded-sm p-6 space-y-3 transition-colors duration-300">
                  <div className="flex items-center gap-2.5 text-zinc-400 font-mono text-xs tracking-wider uppercase">
                    <BookOpen size={14} className="text-emerald-400" />
                    <span>Lessons Learned</span>
                  </div>
                  <p className="text-sm md:text-base font-light leading-relaxed text-muted-foreground select-text">
                    {project.lessonsLearned}
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* SECTION C: MASONRY-STYLE INTERACTIVE IMAGE GALLERY */}
      <section className="py-16 max-w-7xl mx-auto px-6 lg:px-8 border-t border-border/40" aria-label="Visual Exhibition">
        <ScrollReveal>
          <div className="mb-10 text-center md:text-left space-y-1">
            <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase block">
              // GRAPHICAL_ASSETS_CATALOGUE
            </span>
            <h3 className="text-xl md:text-2xl font-light tracking-wide text-foreground">
              Exhibition Gallery (8–12 Images)
            </h3>
            <p className="text-muted-foreground text-xs font-light max-w-md">
              A detailed visual walk-through of active dashboard interfaces, UI modules, code frames, and production layouts. Click on any block to expand fullscreen.
            </p>
          </div>
        </ScrollReveal>

        {/* Masonry-like grid sizing logic respecting specific item aspect ratio with SkeletonImage support */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
          {project.images.map((img, index) => {
            // Determine Tailwind CSS grid classes based on photo index and aspect ratios
            // Create a gorgeous alternating pattern that perfectly aligns 8-12 images
            const gridClass = 
              index === 1 || index === 4 || index === 7 
                ? 'col-span-1 aspect-[3/4]' 
                : index === 0 || index === 6 || index === 9
                ? 'col-span-1 md:col-span-2 aspect-[16/10]' 
                : 'aspect-square col-span-1';

            return (
              <ScrollReveal key={index} delay={index * 0.05}>
                <div
                  onClick={() => setLightboxIndex(index)}
                  className={cn(
                    "relative overflow-hidden group cursor-zoom-in bg-zinc-950 border border-border/40 hover:border-emerald-500/25 rounded-sm shadow-md transition-all duration-300",
                    gridClass
                  )}
                >
                  {/* Visual blur-up skeleton loader */}
                  <SkeletonImage
                    src={img.url}
                    alt={img.alt}
                    aspectRatio="w-full h-full"
                    containerClassName="w-full h-full border-none"
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  
                  {/* Hover zoom overlay metadata badge */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                    <span className="font-mono text-[9px] tracking-widest text-emerald-400 border border-emerald-500/30 bg-black/80 px-2.5 py-1.5 rounded-sm select-none mb-2 shadow-lg">
                      EXPAND_ASSET()
                    </span>
                    <span className="text-white text-xs font-light max-w-[200px] line-clamp-2">
                      {img.alt}
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* SECTION D: PREV/NEXT ROUTE LINK DECK */}
      <ProjectNavigation currentProjectSlug={project.slug} />

      {/* SECTION E: FULL SCREEN IMAGE LIGHTBOX DRAWER */}
      {lightboxIndex !== null && (
        <Lightbox
          images={project.images}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}

      {/* Keyboard Shortcuts Navigation Help */}
      <div className="sr-only">
        Use Left and Right arrow keys to navigate the gallery when expanded, and Escape to exit.
      </div>

    </PageTransition>
  );
}
