import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { CategoryFilter, FilterCategory } from '../components/portfolio/CategoryFilter';
import { projects } from '../data/projects';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { SEOHead } from '../components/seo/SEOHead';
import { PageTransition } from '../components/ui/PageTransition';
import { MatrixRain } from '../components/portfolio/MatrixRain';
import { 
  Terminal, 
  ArrowRight, 
  Calendar, 
  Briefcase, 
  MapPin, 
  Activity, 
  Zap, 
  BarChart3, 
  Layers,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const shouldReduceMotion = useReducedMotion();

  // Filter projects by active category choice
  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((project) => project.category === activeCategory);

  // Stats helper corresponding to ProjectDetail telemetry
  const getProjectStats = (projectSlug: string) => {
    switch (projectSlug) {
      case 'readability-pro':
        return [
          { label: "AI SPEED", value: "<240ms", icon: Zap },
          { label: "RECALL RATE", value: "98.6%", icon: Activity },
          { label: "UPTIME", value: "99.99%", icon: BarChart3 }
        ];
      case 'hostelmate':
        return [
          { label: "OFFLINE SYNC", value: "<1s", icon: Zap },
          { label: "RECOVERY RATE", value: "100%", icon: Activity },
          { label: "CRASH-FREE", value: "99.8%", icon: BarChart3 }
        ];
      case 'asian-it-client-platforms':
        return [
          { label: "LIGHTHOUSE", value: "95+", icon: Zap },
          { label: "BUNDLE SIZE", value: "-40%", icon: Activity },
          { label: "SITE VISITS", value: "+185%", icon: BarChart3 }
        ];
      case 'mern-api-platform':
        return [
          { label: "SOCKET LATENCY", value: "~12ms", icon: Zap },
          { label: "THROUGHPUT", value: "25k req/s", icon: Activity },
          { label: "OVERHEAD", value: "<4.5%", icon: BarChart3 }
        ];
      default:
        return [
          { label: "API SPEED", value: "<150ms", icon: Zap },
          { label: "RETENTION", value: "+185%", icon: Activity },
          { label: "FIRST INPUT", value: "0.45s", icon: BarChart3 }
        ];
    }
  };

  return (
    <PageTransition>
      <SEOHead 
        title="Portfolio" 
        description="Explore Selected Web & Mobile Apps, MERN Stack backends, and AI writing solutions developed by Jamshaid Ghafoor." 
      />

      {/* Page Hero Header */}
      <section id="portfolio-hero" className="py-24 md:py-32 border-b border-border bg-card/10 relative overflow-hidden">
        {/* Layer 1: Absolute MatrixRain Background */}
        <MatrixRain opacity={0.15} />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <ScrollReveal>
            <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase block mb-4">
              // ARCHIVE_DIRECTORY_0x40
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-foreground font-sans uppercase">
              Portfolio
            </h1>
            <p className="text-muted-foreground font-light text-lg md:text-xl max-w-xl mx-auto mt-4 leading-relaxed">
              Selected Software Solutions & Engineering Works.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Category Sticky Filters */}
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Primary Portfolio Grid Section */}
      <section id="portfolio-gallery" className="py-16 md:py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredProjects.length > 0 ? (
              <motion.div 
                layout="position"
                className="space-y-24 md:space-y-32"
              >
                {filteredProjects.map((project, idx) => {
                  const projectStats = getProjectStats(project.slug);
                  const isEven = idx % 2 === 0;

                  return (
                    <motion.div
                      layout
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.95, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -30 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30,
                        opacity: { duration: 0.2 }
                      }}
                      className={cn(
                        "grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center py-10 border-b border-white/5 last:border-b-0 bg-transparent"
                      )}
                      style={{ contentVisibility: 'auto' }}
                    >
                      {/* Visual Media Showcase Section */}
                      <div 
                        className={cn(
                          "lg:col-span-5 relative group overflow-hidden bg-zinc-950/40 backdrop-blur-md border border-white/10 rounded-sm p-1.5 transition-all duration-500 shadow-md",
                          "hover:shadow-[0_25px_60px_rgba(16,185,129,0.15)] hover:border-emerald-500/30",
                          isEven ? "" : "lg:order-2"
                        )}
                      >
                        <Link 
                          to={`/portfolio/${project.slug}`}
                          className="block aspect-[4/3] relative overflow-hidden rounded-sm bg-black group"
                        >
                          {/* Status blinking dot in top-left corner */}
                          <div className="absolute top-3 left-3 z-30 inline-flex items-center gap-1.5 px-2 py-0.5 bg-black/75 border border-emerald-500/20 rounded-sm font-mono text-[8px] tracking-wider text-emerald-400">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                            <span>SYS_LIVE_0{idx + 1}</span>
                          </div>

                          {/* Image overlay with premium zoom and color fade transitions */}
                          <img 
                            src={project.coverImage} 
                            alt={project.title} 
                            className="absolute inset-0 w-full h-full object-cover opacity-75 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-[0.16,1,0.3,1]"
                          />

                          {/* Gradient overlay tint */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500" />

                          {/* Interactive Reflection light streak */}
                          <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-10" />

                          {/* Technology summary pill overlay on hover */}
                          <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            {project.camera.split(',').slice(0, 3).map((tech, tIdx) => (
                              <span key={tIdx} className="px-2 py-0.5 rounded-sm bg-black/90 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] uppercase tracking-wider">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </Link>
                      </div>

                      {/* Detailed Metadata and Specifications Section */}
                      <div 
                        className={cn(
                          "lg:col-span-7 flex flex-col justify-center space-y-6",
                          isEven ? "lg:pl-4" : "lg:pr-4 lg:order-1"
                        )}
                      >
                        {/* Section tag category index */}
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-400 uppercase">
                            // 0{idx + 1}_{project.category.toUpperCase()}_ENGINE
                          </span>
                          <div className="h-px flex-1 bg-border/40" />
                        </div>

                        {/* Heading link */}
                        <div className="space-y-1">
                          <Link 
                            to={`/portfolio/${project.slug}`}
                            className="group inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                          >
                            <h2 className="text-2xl md:text-3xl font-light tracking-wide text-foreground group-hover:text-emerald-400 transition-colors duration-300">
                              {project.title}
                            </h2>
                            <ChevronRight size={18} className="text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                          </Link>

                          {/* Location, Client, Year Metadata Row */}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-500 font-mono tracking-wider pt-1 uppercase">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} className="text-emerald-500/75" />
                              {project.year}
                            </span>
                            <span className="text-zinc-700">•</span>
                            <span className="flex items-center gap-1">
                              <Briefcase size={12} className="text-emerald-500/75" />
                              {project.client}
                            </span>
                            {project.location && (
                              <>
                                <span className="text-zinc-700">•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin size={12} className="text-emerald-500/75" />
                                  {project.location.split('/')[0].trim()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Brief description overview */}
                        <p className="text-sm md:text-base font-light leading-relaxed text-muted-foreground select-text">
                          {project.description.split('\n\n')[0]}
                        </p>

                        {/* Technical Performance Telemetry Indicators */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 py-2">
                          {projectStats.map((stat, sIdx) => {
                            const StatIcon = stat.icon;
                            return (
                              <div 
                                key={sIdx} 
                                className="bg-zinc-950/40 backdrop-blur-md border border-white/5 rounded-sm p-3 flex flex-col justify-between hover:border-emerald-500/20 transition-colors duration-300 group"
                              >
                                <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[9px] tracking-wider uppercase">
                                  <StatIcon size={10} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                                  <span className="truncate">{stat.label}</span>
                                </div>
                                <div className="mt-1">
                                  <span className="text-base sm:text-lg font-light tracking-tight text-white font-mono drop-shadow-[0_0_8px_rgba(16,185,129,0.1)]">
                                    {stat.value}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Extended Technology Badges Container */}
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block">
                            // TECHNOLOGICAL_STACK
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {project.camera.split(',').map((tech, tIdx) => (
                              <span 
                                key={tIdx} 
                                className="px-2.5 py-1 rounded-full border border-emerald-500/10 bg-emerald-500/5 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-colors duration-300 text-emerald-300/90 font-mono text-[10px] tracking-wide"
                              >
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                          <Link
                            to={`/portfolio/${project.slug}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 border border-emerald-400/30 bg-emerald-500/5 hover:bg-emerald-500/15 text-emerald-300 font-mono text-xs tracking-wider uppercase rounded-sm transition-all duration-300 cursor-pointer"
                          >
                            <Terminal size={12} />
                            <span>view_case_study.sh</span>
                          </Link>

                          <Link
                            to={`/portfolio/${project.slug}`}
                            className="inline-flex items-center gap-2 px-4 py-2.5 text-muted-foreground hover:text-white font-mono text-xs tracking-wider uppercase rounded-sm transition-colors duration-300"
                          >
                            <span>inspect_blueprint.cfg</span>
                            <ArrowRight size={12} className="text-zinc-500 group-hover:text-emerald-400" />
                          </Link>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-24 border border-dashed border-border rounded-sm bg-accent/20"
              >
                <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
                  !! ZERO_RECORDS_FOUND_FOR_CRITERIA
                </p>
                <button
                  onClick={() => setActiveCategory('all')}
                  className="mt-4 inline-flex px-4 py-2 border border-border rounded-sm font-mono text-xs text-foreground hover:bg-accent transition-colors cursor-pointer"
                >
                  reset.filters()
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

    </PageTransition>
  );
}
