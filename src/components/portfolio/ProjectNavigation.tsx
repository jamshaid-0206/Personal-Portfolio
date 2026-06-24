import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Project } from '../../types';
import { projects } from '../../data/projects';

interface ProjectNavigationProps {
  currentProjectSlug: string;
}

export function ProjectNavigation({ currentProjectSlug }: ProjectNavigationProps) {
  const currentIndex = projects.findIndex((p) => p.slug === currentProjectSlug);
  
  if (currentIndex === -1) return null;

  // Compute circular indexes for previous and next projects
  const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
  const nextIndex = (currentIndex + 1) % projects.length;

  const prevProject = projects[prevIndex];
  const nextProject = projects[nextIndex];

  return (
    <div className="border-t border-border mt-20 pt-12 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Previous Project Card */}
        <Link
          to={`/portfolio/${prevProject.slug}`}
          className="group flex flex-col p-6 md:p-8 rounded-sm border border-border bg-card/30 hover:bg-accent hover:border-foreground/20 transition-all duration-300 relative overflow-hidden"
        >
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2">
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>PREVIOUS PROJECT</span>
          </div>
          
          <span className="text-xl md:text-2xl font-light tracking-wide text-foreground mt-1">
            {prevProject.title}
          </span>
          <span className="text-xs font-mono text-emerald-400 mt-1 uppercase">
            // {prevProject.category}
          </span>
        </Link>

        {/* Next Project Card */}
        <Link
          to={`/portfolio/${nextProject.slug}`}
          className="group flex flex-col p-6 md:p-8 rounded-sm border border-border bg-card/30 hover:bg-accent hover:border-foreground/20 transition-all duration-300 relative overflow-hidden md:text-right md:items-end"
        >
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-muted-foreground uppercase mb-2 md:flex-row-reverse">
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            <span>NEXT PROJECT</span>
          </div>
          
          <span className="text-xl md:text-2xl font-light tracking-wide text-foreground mt-1">
            {nextProject.title}
          </span>
          <span className="text-xs font-mono text-emerald-400 mt-1 uppercase">
            // {nextProject.category}
          </span>
        </Link>
      </div>
    </div>
  );
}
