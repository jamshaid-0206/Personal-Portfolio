import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Project } from '../../types';
import { cn } from '../../lib/utils';

interface ProjectCardProps {
  key?: string | number | null;
  project: Project;
  index: number;
  aspect?: 'landscape' | 'portrait' | 'square';
  showCategory?: boolean;
}

export function ProjectCard({ 
  project, 
  index, 
  aspect = 'landscape',
  showCategory = true 
}: ProjectCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt and Cursor Tracking state
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Aspect ratio styling map
  const aspectClasses = {
    landscape: 'aspect-[4/3]',
    portrait: 'aspect-[3/4]',
    square: 'aspect-square'
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const element = cardRef.current;
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates inside card
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    
    setMousePos({ x: localX, y: localY });

    if (shouldReduceMotion) return;

    const mouseX = localX - width / 2;
    const mouseY = localY - height / 2;
    
    // Max tilt angles (10 degrees for gorgeous depth)
    const rX = -(mouseY / (height / 2)) * 10;
    const rY = (mouseX / (width / 2)) * 10;
    
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 35 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1] // premium easeOutQuart
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transform: shouldReduceMotion 
          ? 'none' 
          : `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
      className={cn(
        "w-full transition-all duration-500 rounded-sm relative group overflow-hidden bg-zinc-950/40 backdrop-blur-md border border-white/10",
        isHovered ? "shadow-[0_25px_60px_rgba(16,185,129,0.18)] border-emerald-500/40 z-10 scale-[1.01]" : "shadow-md"
      )}
      data-cursor="view"
    >
      <Link 
        to={`/portfolio/${project.slug}`}
        className="block relative overflow-hidden h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        
        {/* Aspect Wrapper */}
        <div className={cn("relative w-full overflow-hidden", aspectClasses[aspect])} style={{ transformStyle: 'preserve-3d' }}>
          
          {/* Main Cover Image */}
          <img
            src={project.coverImage}
            alt={project.title}
            className={cn(
              "absolute inset-0 w-full h-full object-cover will-change-transform opacity-75 grayscale transition-all duration-700",
              isHovered ? "scale-105 opacity-90 grayscale-0" : "",
              shouldReduceMotion ? "" : "ease-[0.16,1,0.3,1]"
            )}
            loading="lazy"
          />

          {/* Dynamic Mirror Glare Overlay (Interactive reflection) */}
          {!shouldReduceMotion && isHovered && (
            <div 
              className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay opacity-30 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.7), transparent 80%)`
              }}
            />
          )}

          {/* Interactive cursor glow behind title */}
          {!shouldReduceMotion && isHovered && (
            <div 
              className="absolute inset-0 pointer-events-none z-0 opacity-40 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.18), transparent 85%)`
              }}
            />
          )}

          {/* Vignette Overlay Gradient */}
          <div 
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-out z-10",
              isHovered ? "opacity-95" : "opacity-85 md:opacity-40"
            )}
            style={{
              backgroundImage: "linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.15) 100%)"
            }}
          />

          {/* Text Captions Content Stack inside 3D space */}
          <div 
            className={cn(
              "absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col items-start gap-1 transition-all duration-500 ease-[0.16,1,0.3,1] select-none z-20 text-left",
              isHovered 
                ? "translate-y-0 opacity-100" 
                : "translate-y-2 md:translate-y-6 md:opacity-0"
            )}
            style={{
              transform: !shouldReduceMotion && isHovered ? 'translateZ(45px)' : 'translateZ(0px)',
              backfaceVisibility: 'hidden'
            }}
          >
            {showCategory && (
              <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-400 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                // {project.category}
              </span>
            )}
            
            <h3 className="text-xl md:text-2xl font-light tracking-wide text-white font-sans mt-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {project.title}
            </h3>
            
            <div className="flex items-center gap-3 mt-2 text-xs text-white/75 font-mono tracking-widest uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              <span>{project.year}</span>
              <span className="text-emerald-400/70">•</span>
              <span className="truncate max-w-[180px] sm:max-w-[260px]">{project.client}</span>
            </div>
          </div>

          {/* Glowing Outer Rim border strip */}
          <div 
            className={cn(
              "absolute inset-0 pointer-events-none border transition-all duration-500 rounded-sm z-30",
              isHovered ? "border-emerald-500/40 opacity-100" : "border-white/5 opacity-40"
            )}
          />

          {/* Static terminal layout items on bottom corner for cyber aesthetics */}
          <div className="absolute top-4 right-4 z-20 font-mono text-[8px] text-white/30 group-hover:text-emerald-400/60 transition-colors duration-300 uppercase tracking-widest">
            {isHovered ? `SYS_VIEW::0${index + 1}` : `SYS_LOCK::0${index + 1}`}
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
