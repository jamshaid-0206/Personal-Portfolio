import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Code2, Github, Download, Terminal, ArrowRight } from 'lucide-react';
import { photographerInfo } from '../data/photographer';
import { projects } from '../data/projects';
import { MatrixRain } from '../components/portfolio/MatrixRain';
import { ThreeDCanvas } from '../components/ui/ThreeDCanvas';
import { TechTerminal } from '../components/portfolio/TechTerminal';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { ScrollIndicator } from '../components/ui/ScrollIndicator';
import { SEOHead } from '../components/seo/SEOHead';
import { PageTransition } from '../components/ui/PageTransition';
import { Magnetic } from '../components/ui/Magnetic';
import { useTheme } from '../components/providers/ThemeProvider';
import { WordMorpher } from '../components/ui/WordMorpher';

export default function Home() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const shouldReduceMotion = useReducedMotion();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  // Get first 4 projects for featured display
  const featuredProjects = projects.slice(0, 4);

  // Get the first paragraph of biography
  const bioIntro = photographerInfo.biography.split('\n\n')[0];

  // Stagger configurations for hero elements
  const heroContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      }
    }
  };

  const heroItemVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 25 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] // sleek easeOutQuart
      }
    }
  };

  // Movie trailer title string characters mapping
  const titleString = "JAMSHAID GHAFOOR";

  return (
    <PageTransition>
      <SEOHead title="Home" />

      {/* SECTION A: HERO CONTAINER */}
      <section 
        onMouseMove={handleHeroMouseMove}
        onMouseEnter={() => setIsHoveringHero(true)}
        onMouseLeave={() => setIsHoveringHero(false)}
        className="h-screen w-full overflow-hidden relative bg-background flex flex-col justify-center items-center px-4 sm:px-6"
        aria-label="Hero Introduction"
      >
        {/* Layer 1: Absolute MatrixRain Background */}
        <MatrixRain opacity={0.3} />

        {/* Layer 2: Interactive 3D Digital Core / Holographic Globe */}
        <ThreeDCanvas />

        {/* Layer 3: Ambient Grid Pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none select-none z-0 bg-[linear-gradient(to_right,#10b98105_1px,transparent_1px),linear-gradient(to_bottom,#10b98105_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#10b98103_1px,transparent_1px),linear-gradient(to_bottom,#10b98103_1px,transparent_1px)] bg-[size:5rem_5rem]"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 85%)',
          }}
        />

        {/* Responsive Interactive cursor glow */}
        {!shouldReduceMotion && isHoveringHero && (
          <div 
            className="absolute inset-0 pointer-events-none select-none z-0 opacity-45 transition-opacity duration-500 hidden md:block"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.08), transparent 85%)`
            }}
          />
        )}

        {/* Layer 4: Radial Vignette Overlay for maximum contrast */}
        <div 
          className="absolute inset-0 pointer-events-none select-none z-0"
          style={{
            background: isLight 
              ? 'radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.92) 90%)'
              : 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.92) 90%)'
          }}
        />

        {/* Layer 5: Hero Interactive Content */}
        <motion.div
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center max-w-4xl space-y-6 md:space-y-8 flex flex-col items-center select-none"
        >
          {/* Status Pill */}
          <motion.div 
            variants={heroItemVariants}
            className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-emerald-500/30 bg-secondary/80 backdrop-blur-md text-emerald-800 dark:text-emerald-300 text-[10px] min-[375px]:text-xs tracking-widest uppercase select-none shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse shrink-0 shadow-[0_0_8px_#34d399]" />
            <span className="truncate">// system online — full-stack developer</span>
          </motion.div>

          {/* Glowing Movie Trailer Title Reveal */}
          <motion.h1 
            variants={heroItemVariants}
            className="text-zinc-900 dark:text-white text-[6.2vw] min-[350px]:text-[6.5vw] min-[400px]:text-[7vw] sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight min-[375px]:tracking-normal sm:tracking-widest uppercase filter drop-shadow-[0_0_40px_rgba(16,185,129,0.15)] dark:drop-shadow-[0_0_40px_rgba(16,185,129,0.35)] leading-none select-none py-1 flex justify-center items-center whitespace-nowrap flex-nowrap overflow-visible w-full"
          >
            {titleString.split("").map((char, index) => {
              // Space placeholder
              if (char === " ") {
                return <span key={index} className="w-[3.5vw] sm:w-10" />;
              }

              return (
                <motion.span
                  key={index}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 35, filter: 'blur(8px)', scale: 1.2 }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.2 + index * 0.04,
                    ease: [0.16, 1, 0.3, 1] // premium cinematic feel
                  }}
                  className="inline-block hover:text-emerald-400 transition-colors duration-300 transform-gpu"
                >
                  {char}
                </motion.span>
              );
            })}
          </motion.h1>

          {/* Monospace Tagline */}
          <motion.p 
            variants={heroItemVariants}
            className="text-emerald-800 dark:text-emerald-300/90 font-mono text-xs sm:text-sm md:text-base lg:text-lg tracking-wide max-w-2xl text-center select-all px-2"
          >
            <span className="text-emerald-500 dark:text-emerald-400 font-bold mr-1.5">&gt;</span>
            {photographerInfo.tagline}
          </motion.p>

          {/* Staggered rotating morphing text elements */}
          <motion.div variants={heroItemVariants} className="py-2">
            <WordMorpher />
          </motion.div>

          {/* Bio Introduction paragraph */}
          <motion.p 
            variants={heroItemVariants}
            className="text-zinc-700 dark:text-white/85 font-light text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl text-center select-text px-2"
          >
            {photographerInfo.heroIntroduction}
          </motion.p>

          {/* Monospace CTA Action Buttons Row */}
          <motion.div 
            variants={heroItemVariants}
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 pt-4 w-full px-4 sm:px-0"
          >
            {/* View Projects */}
            <Magnetic>
              <Link
                to="/portfolio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 border border-emerald-500/40 dark:border-emerald-400/60 bg-emerald-500/5 dark:bg-emerald-500/10 hover:bg-emerald-500/15 dark:hover:bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 font-mono text-xs tracking-wider uppercase rounded-sm transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
              >
                <Code2 size={14} />
                <span>view.projects()</span>
              </Link>
            </Magnetic>

            {/* GitHub Profile */}
            <Magnetic>
              <a
                href={photographerInfo.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 border border-zinc-300 dark:border-white/20 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-900 dark:text-white font-mono text-xs tracking-wider uppercase rounded-sm transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-2"
              >
                <Github size={14} />
                <span>github.com/jamshaid-0206</span>
              </a>
            </Magnetic>

            {/* Download Resume */}
            <Magnetic>
              <a
                href="/resume.pdf"
                download="Jamshaid_Ghafoor_Resume.pdf"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 border border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-800 dark:text-emerald-200/80 hover:text-emerald-900 dark:hover:text-emerald-200 font-mono text-xs tracking-wider uppercase rounded-sm transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
              >
                <Download size={14} />
                <span>download.resume()</span>
              </a>
            </Magnetic>
          </motion.div>

        </motion.div>

        {/* Infinitely Bouncing Scroll Hint */}
        <ScrollIndicator />
      </section>

      {/* SECTION B: TECH STACK TERMINAL SESSION */}
      <section 
        className="py-24 md:py-32 bg-secondary border-y border-emerald-500/10 dark:border-emerald-500/20 relative overflow-hidden"
        aria-label="My Technical Stack"
      >
        {/* Subtle background matrix overlay */}
        <MatrixRain opacity={0.15} />

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <ScrollReveal>
            <div className="flex flex-col items-center mb-12">
              <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs md:text-sm tracking-widest uppercase mb-4">
                <Terminal size={14} />
                <span>[ LIVE TERMINAL ENGINE ]</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-wide text-zinc-900 dark:text-white font-sans">
                My stack, in one shell session
              </h2>
              <p className="text-zinc-600 dark:text-white/60 font-light text-sm md:text-base max-w-xl mx-auto mt-3">
                Experience Jamshaid's environment configurations and skill-matrices executed natively.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive terminal card */}
          <ScrollReveal delay={0.1}>
            <TechTerminal />
          </ScrollReveal>

          {/* Extra skill pills wrapped block */}
          <ScrollReveal delay={0.2}>
            <div className="mt-12 max-w-3xl mx-auto">
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-4">
                // SYSTEM_SUPPORTED_CAPABILITIES:
              </p>
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {photographerInfo.clients.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 rounded-full border border-emerald-500/10 dark:border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-colors duration-300 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] md:text-xs tracking-wider"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION C: BIOGRAPHY HIGHLIGHTS */}
      <section 
        className="py-24 md:py-32 bg-background relative"
        aria-label="Biography Introduction"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase block mb-4">
              // BRIEF_OVERVIEW_IN_PLAINTEXT
            </span>
            <h2 className="text-3xl md:text-5xl font-light tracking-wide text-foreground font-sans">
              About My Work
            </h2>
            <div className="h-px w-16 bg-emerald-500/40 mx-auto my-8" />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="text-base md:text-xl font-light leading-relaxed text-muted-foreground select-text max-w-3xl mx-auto">
              {bioIntro}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="mt-12 flex justify-center">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2.5 text-sm md:text-base font-light tracking-wide text-foreground hover:text-emerald-500 transition-colors py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-4 rounded-sm"
              >
                <span>Learn More About Me</span>
                <ArrowRight 
                  size={16} 
                  className="text-emerald-400 group-hover:translate-x-1.5 transition-transform" 
                />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION D: FEATURED PROJECTS GRID */}
      <section 
        className="py-24 md:py-32 border-t border-border bg-card/5"
        aria-label="Featured Software Solutions"
      >
        <div className="w-full">
          {/* Header text container centered */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16 text-center">
            <ScrollReveal>
              <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase block mb-4">
                // FEATURED_PRODUCTION_LOGS
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-foreground font-sans">
                Featured Projects
              </h2>
              <p className="text-muted-foreground font-light text-sm md:text-base mt-2">
                A selection of recent mobile applications, frontend solutions, and AI platforms.
              </p>
            </ScrollReveal>
          </div>

          {/* Edge-to-edge project card grid with no horizontal overflow and safe spacing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-[100vw] overflow-hidden px-2 sm:px-4 md:px-0">
            {featuredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                aspect="landscape"
                showCategory={true}
              />
            ))}
          </div>

          {/* Footer View All link */}
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-16 text-center">
            <ScrollReveal>
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2.5 text-sm md:text-base font-light tracking-wide text-foreground hover:text-emerald-500 transition-colors py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-4 rounded-sm"
              >
                <span>View All Projects</span>
                <ArrowRight 
                  size={16} 
                  className="text-emerald-400 group-hover:translate-x-1.5 transition-transform" 
                />
              </Link>
            </ScrollReveal>
          </div>

        </div>
      </section>

    </PageTransition>
  );
}
