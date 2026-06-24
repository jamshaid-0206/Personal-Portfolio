import { Link } from 'react-router-dom';
import { ArrowLeft, Terminal } from 'lucide-react';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PageTransition } from '../components/ui/PageTransition';
import { SEOHead } from '../components/seo/SEOHead';

export default function NotFound() {
  return (
    <PageTransition>
      <SEOHead title="404 - Not Found" />
      
      <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] py-24 px-6 text-center">
        <ScrollReveal>
          {/* Diagnostic terminal status tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 font-mono text-xs tracking-widest uppercase mb-6 select-none">
            <Terminal size={12} className="animate-pulse" />
            <span>!! SYSTEM_ERROR_404_PAGE_NOT_FOUND</span>
          </div>

          {/* Large display code */}
          <h1 className="text-8xl md:text-9xl font-extralight tracking-widest text-foreground font-sans select-none filter drop-shadow-[0_0_20px_rgba(239,68,68,0.1)]">
            404
          </h1>

          <div className="h-px w-16 bg-rose-500/30 mx-auto my-6" />

          {/* Explanation paragraph */}
          <p className="text-muted-foreground font-light text-base md:text-lg max-w-md mx-auto leading-relaxed">
            The target resource, route, or file could not be located in our directory indexes. It might have been relocated or purged.
          </p>

          {/* Action button */}
          <div className="mt-10">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 border border-border hover:border-foreground bg-card/40 text-foreground text-sm font-light tracking-widest uppercase rounded-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <ArrowLeft size={14} />
              <span>&lt;-- RETURN_TO_HOME()</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>

    </PageTransition>
  );
}
