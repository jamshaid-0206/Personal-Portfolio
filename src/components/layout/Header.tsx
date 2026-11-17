import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useScrolledPast } from '../../hooks/useScrollPosition';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../../lib/utils';
import { photographerInfo } from '../../data/photographer';

const EASE = [0.16, 1, 0.3, 1] as const;

const NAV = [
  { label: 'Home', path: '/' },
  { label: 'Work', path: '/portfolio' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const isActivePath = (pathname: string, path: string) => (path === '/' ? pathname === '/' : pathname.startsWith(path));

export function Header() {
  const scrolled = useScrolledPast(40);
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <motion.header
        initial={reduce ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,height] duration-500',
          scrolled && !open ? 'h-16 border-b border-foreground/10 bg-background/90' : 'h-20 border-b border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Logo */}
          <Link
            to="/"
            onDoubleClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('logo_double_click'));
            }}
            className="group relative z-[60] flex items-center gap-2 text-lg font-semibold tracking-[-0.03em] text-foreground"
            aria-label="Home"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-sm font-bold text-background transition-transform duration-500 group-hover:rotate-[360deg]">
              JG
            </span>
            <span className="hidden sm:inline">
              Jamshaid<span className="text-emerald-500">.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 rounded-full border border-foreground/10 bg-background/60 p-1 md:flex" aria-label="Primary">
            {NAV.map((l) => {
              const active = isActivePath(pathname, l.path);
              return (
                <Link
                  key={l.path}
                  to={l.path}
                  className={cn(
                    'relative isolate rounded-full px-5 py-2 text-sm font-medium transition-colors',
                    active ? 'text-background' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-foreground"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* Right */}
          <div className="relative z-[60] flex items-center gap-2">
            <ThemeToggle />
            <Link
              to="/contact"
              className="group hidden items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.04] md:inline-flex"
            >
              Let's talk
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              className="inline-flex h-11 items-center gap-2.5 rounded-full border border-foreground/15 bg-background/60 px-4 text-sm font-medium text-foreground md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span className="relative block h-2.5 w-4">
                <span className={cn('absolute left-0 h-[1.5px] w-4 bg-current transition-transform duration-300', open ? 'top-1 rotate-45' : 'top-0')} />
                <span className={cn('absolute left-0 h-[1.5px] w-4 bg-current transition-transform duration-300', open ? 'top-1 -rotate-45' : 'top-2')} />
              </span>
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-0 z-[45] flex flex-col bg-background px-5 pb-8 pt-28 md:hidden"
            initial={reduce ? { opacity: 0 } : { clipPath: 'circle(0% at 100% 0%)' }}
            animate={reduce ? { opacity: 1 } : { clipPath: 'circle(150% at 100% 0%)' }}
            exit={reduce ? { opacity: 0 } : { clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.35),transparent)]" />
            <nav className="flex flex-1 flex-col justify-center gap-2" aria-label="Mobile">
              {NAV.map((l, i) => {
                const active = isActivePath(pathname, l.path);
                return (
                  <div key={l.path} className="overflow-hidden">
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.7, delay: 0.25 + i * 0.07, ease: EASE }}
                    >
                      <Link
                        to={l.path}
                        className={cn(
                          'flex items-baseline gap-4 text-6xl font-semibold tracking-[-0.05em]',
                          active ? 'text-emerald-500' : 'text-foreground'
                        )}
                      >
                        <span className="font-mono text-xs tracking-normal text-muted-foreground">0{i + 1}</span>
                        {l.label}
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="space-y-3 border-t border-foreground/10 pt-6 text-sm text-muted-foreground"
            >
              <a href={`mailto:${photographerInfo.email}`} className="block break-all text-lg font-medium text-foreground">
                {photographerInfo.email}
              </a>
              <div className="flex gap-5">
                <a href={photographerInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  GitHub
                </a>
                <a href={photographerInfo.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
                  Instagram
                </a>
                <a href="/resume.pdf" download="Jamshaid_Ghafoor_Resume.pdf" className="hover:text-foreground">
                  Resume
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
