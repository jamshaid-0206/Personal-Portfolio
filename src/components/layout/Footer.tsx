import { Link } from 'react-router-dom';
import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { photographerInfo } from '../../data/photographer';
import { LiveClock } from '../ui/Premium';

const NAV = [
  { label: 'Home', path: '/' },
  { label: 'Work', path: '/portfolio' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { label: 'GitHub', href: photographerInfo.socialLinks.linkedin },
    { label: 'Instagram', href: photographerInfo.socialLinks.instagram },
    { label: 'WhatsApp', href: photographerInfo.whatsapp },
    { label: 'Email', href: `mailto:${photographerInfo.email}` },
    { label: 'Resume', href: '/resume.pdf' },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-foreground/10 bg-background">
      <div className="mx-auto w-full max-w-[1400px] px-5 pt-16 sm:px-8 md:pt-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="max-w-sm text-2xl font-semibold leading-tight tracking-[-0.03em] text-foreground md:text-3xl">
              Building fast, beautiful products for the web & mobile.
            </p>
            <Link
              to="/contact"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.04]"
            >
              Start a project
              <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Menu</h3>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.path}>
                  <Link to={n.path} className="footer-link text-foreground">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Socials</h3>
            <ul className="space-y-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    {...(s.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    {...(s.label === 'Resume' ? { download: 'Jamshaid_Ghafoor_Resume.pdf' } : {})}
                    className="footer-link text-foreground"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Local time</h3>
            <p className="text-foreground">
              <LiveClock /> PKT
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{photographerInfo.location}</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full border border-foreground/20 transition-colors group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-black">
                <ArrowUp size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
              </span>
              Back to top
            </button>
          </div>
        </div>

        {/* Giant wordmark */}
        <div className="mt-16 select-none overflow-hidden md:mt-24" aria-hidden="true">
          <div className="footer-wordmark whitespace-nowrap text-center font-semibold leading-[0.78] tracking-[-0.06em] text-[18.5vw] lg:text-[16.5rem]">
            Jamshaid
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-foreground/10 py-6 text-xs text-muted-foreground sm:flex-row">
          <span>
            © {year} {photographerInfo.name}. All rights reserved.
          </span>
          <span>Designed & built with React, TypeScript & WebGL</span>
        </div>
      </div>
    </footer>
  );
}
