import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageTransition } from '../components/ui/PageTransition';
import { SEOHead } from '../components/seo/SEOHead';
import { BTN_GHOST, BTN_PRIMARY, FadeUp, Line } from '../components/ui/Premium';
import { HeroShader } from '../components/ui/HeroShader';
import { useTheme } from '../components/providers/ThemeProvider';

export default function NotFound() {
  const { theme } = useTheme();
  return (
    <PageTransition>
      <SEOHead title="404 - Not Found" />
      <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-5 text-center">
        <div className="absolute inset-0 -z-10 opacity-80">
          <HeroShader light={theme === 'light'} />
        </div>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        <div>
          <h1 className="font-semibold leading-[0.8] tracking-[-0.07em] text-foreground text-[clamp(7rem,30vw,22rem)]">
            <Line>404</Line>
          </h1>
          <FadeUp delay={0.3}>
            <p className="mx-auto mt-6 max-w-md text-lg text-muted-foreground">This page drifted off into the void. Let's get you back on track.</p>
          </FadeUp>
          <FadeUp delay={0.45} className="mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/" className={BTN_PRIMARY}>
              <ArrowLeft size={16} /> Back home
            </Link>
            <Link to="/portfolio" className={BTN_GHOST}>
              See my work
            </Link>
          </FadeUp>
        </div>
      </section>
    </PageTransition>
  );
}
