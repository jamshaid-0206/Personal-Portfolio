import { ArrowUpRight } from 'lucide-react';
import { ContactForm } from '../components/forms/ContactForm';
import { photographerInfo } from '../data/photographer';
import { SEOHead } from '../components/seo/SEOHead';
import { PageTransition } from '../components/ui/PageTransition';
import { CONTAINER, Eyebrow, InView, LiveClock, PageHero } from '../components/ui/Premium';

export default function Contact() {
  const channels = [
    { label: 'WhatsApp', value: photographerInfo.phone, href: photographerInfo.whatsapp, external: true },
    { label: 'Email', value: photographerInfo.email, href: `mailto:${photographerInfo.email}` },
    { label: 'GitHub', value: 'github.com/jamshaid-0206', href: photographerInfo.socialLinks.linkedin, external: true },
    { label: 'Instagram', value: '@jd_x26', href: photographerInfo.socialLinks.instagram, external: true },
  ];

  return (
    <PageTransition>
      <SEOHead title="Contact" description="Get in touch with Jamshaid Ghafoor for full-stack web and mobile development opportunities." />

      <PageHero
        compact
        eyebrow="Contact"
        lines={["Let's build", <>something <span className="text-gradient-anim italic pr-[0.06em]">great.</span></>]}
        intro="Have a project, a role or just an idea? Tell me a bit about it — I usually reply within a day."
      />

      <section className={`${CONTAINER} pb-24 pt-8 md:pb-36`} aria-label="Contact form">
        <div className="grid gap-16 lg:grid-cols-[1.25fr_0.75fr] lg:gap-24">
          <InView>
            <ContactForm />
          </InView>

          <InView delay={0.1} className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>Direct</Eyebrow>
            <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{c.label}</span>
                      <span className="mt-1 block break-all text-lg font-medium text-foreground transition-colors group-hover:text-emerald-500">{c.value}</span>
                    </span>
                    <ArrowUpRight size={20} className="shrink-0 text-muted-foreground transition-all duration-300 group-hover:rotate-45 group-hover:text-emerald-500" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-3xl border border-foreground/10 bg-secondary/40 p-6">
              <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                {photographerInfo.availability}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {photographerInfo.location} · <LiveClock /> PKT
              </p>
              <a
                href={photographerInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37A9.86 9.86 0 0 1 2.16 12C2.16 6.55 6.6 2.11 12.06 2.11a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.89-9.89 9.89M20.46 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.17-3.49-8.41" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </InView>
        </div>
      </section>
    </PageTransition>
  );
}
