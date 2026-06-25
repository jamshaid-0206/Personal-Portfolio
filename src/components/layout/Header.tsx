import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../../lib/utils';
import { useTheme } from '../providers/ThemeProvider';

// Premium morphing hamburger icon component
function HamburgerIcon({ isOpen, isTransparent, isLight }: { isOpen: boolean; isTransparent: boolean; isLight: boolean }) {
  return (
    <div className="w-5 h-4 flex flex-col justify-between items-center relative cursor-pointer select-none">
      <motion.span
        animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
        className={cn(
          "w-5 h-[1.5px] block origin-center absolute top-0 transition-colors",
          isTransparent ? (isLight ? "bg-zinc-900" : "bg-white") : "bg-foreground"
        )}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
      <motion.span
        animate={isOpen ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
        className={cn(
          "w-5 h-[1.5px] block origin-center absolute top-[7px] transition-colors",
          isTransparent ? (isLight ? "bg-zinc-900" : "bg-white") : "bg-foreground"
        )}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
        className={cn(
          "w-5 h-[1.5px] block origin-center absolute top-[14px] transition-colors",
          isTransparent ? (isLight ? "bg-zinc-900" : "bg-white") : "bg-foreground"
        )}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
    </div>
  );
}

export function Header() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const scrollY = useScrollPosition();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  // Transparent state only on Home page when NOT scrolled (scrollY < 50)
  const isTransparent = isHomePage && scrollY < 50;

  // Sync mobile drawer open state with body scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const headerVariants = {
    hidden: { y: -100 },
    visible: { 
      y: 0, 
      transition: { 
        duration: 0.6, 
        ease: 'easeOut' 
      } 
    }
  };

  return (
    <>
      <motion.header
        variants={headerVariants}
        initial={shouldReduceMotion ? { y: 0 } : "hidden"}
        animate="visible"
        className={cn(
          "fixed top-0 inset-x-0 h-16 z-50 flex items-center transition-all duration-500",
          isTransparent 
            ? (isLight ? "bg-transparent text-zinc-900 border-b border-transparent" : "bg-transparent text-white border-b border-transparent") 
            : "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800/80 shadow-sm text-zinc-900 dark:text-white"
        )}
      >
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo Link */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center"
          >
            <Link 
              to="/" 
              onDoubleClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('logo_double_click'));
              }}
              className={cn(
                "text-sm sm:text-base md:text-lg font-light tracking-[0.25em] sm:tracking-[0.3em] uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-4 rounded-sm transition-colors",
                isTransparent 
                  ? (isLight ? "hover:text-emerald-600 text-zinc-900" : "hover:text-emerald-300 text-white") 
                  : "hover:text-emerald-500 dark:hover:text-emerald-400 text-zinc-900 dark:text-white"
              )}
            >
              JAMSHAID GHAFOOR
            </Link>
          </motion.div>
 
          {/* Desktop Navigation Row */}
          <nav className="hidden md:flex items-center gap-8 text-sm tracking-widest font-light">
            <ul className="flex items-center gap-8">
              {navLinks.map((link, idx) => {
                const isActive = 
                  link.path === '/' 
                    ? location.pathname === '/' 
                    : location.pathname.startsWith(link.path);
 
                return (
                  <motion.li 
                    key={link.path}
                    initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * idx + 0.3 }}
                    className="relative py-1"
                  >
                    <Link
                      to={link.path}
                      className={cn(
                        "transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-4 rounded-sm",
                        isTransparent 
                          ? (isActive 
                              ? (isLight ? "font-semibold text-zinc-900" : "font-medium text-white") 
                              : (isLight ? "text-zinc-600 hover:text-zinc-900" : "text-white/70 hover:text-white"))
                          : (isActive
                              ? "font-semibold text-zinc-900 dark:text-white"
                              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white")
                      )}
                    >
                      {link.label}
                    </Link>
 
                    {/* Sliding active path underline indicators */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        transition={
                          shouldReduceMotion 
                            ? { duration: 0 } 
                            : { type: 'spring', stiffness: 380, damping: 30 }
                        }
                        className={cn(
                          "absolute -bottom-1 inset-x-0 h-px",
                          isTransparent 
                            ? (isLight ? "bg-zinc-900" : "bg-white") 
                            : "bg-zinc-900 dark:bg-white"
                        )}
                      />
                    )}
                  </motion.li>
                );
              })}
            </ul>

            <div className="border-l border-border/60 pl-4">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Right Controls Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-3.5 rounded-sm border border-transparent transition-all cursor-pointer flex items-center justify-center",
                isTransparent 
                  ? (isLight ? "text-zinc-900 hover:bg-zinc-100" : "text-white hover:bg-white/10") 
                  : "text-foreground hover:bg-accent"
              )}
              aria-label="Toggle navigation menu"
            >
              <HamburgerIcon isOpen={mobileMenuOpen} isTransparent={isTransparent} isLight={isLight} />
            </button>
          </div>

        </div>
      </motion.header>

      {/* Accessible Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Sliding drawer content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={shouldReduceMotion ? { duration: 0.1 } : { type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-xs h-full bg-background border-l border-border shadow-2xl p-6 flex flex-col justify-between"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/40">
                  <span className="text-xs font-mono tracking-widest text-emerald-500 uppercase">
                    // NAV_MENU
                  </span>
                  
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-sm text-foreground hover:bg-accent border border-transparent hover:border-border cursor-pointer focus-visible:ring-1 focus-visible:ring-ring"
                    aria-label="Close navigation menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Vertical Links List */}
                <nav className="flex flex-col gap-6 text-left">
                  {navLinks.map((link) => {
                    const isActive = 
                      link.path === '/' 
                        ? location.pathname === '/' 
                        : location.pathname.startsWith(link.path);
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={cn(
                          "text-lg font-light tracking-wide py-1 border-b border-transparent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm",
                          isActive 
                            ? "text-foreground font-medium border-emerald-500/40" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar footer status block */}
              <div className="border-t border-border pt-6 mt-auto flex flex-col gap-3 font-mono text-[10px] tracking-widest text-muted-foreground">
                <p>STATUS: ONLINE</p>
                <p>© {new Date().getFullYear()} J_GHAFOOR</p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
