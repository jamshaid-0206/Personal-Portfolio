import { ArrowUpRight } from 'lucide-react';
import { ContactForm } from '../components/forms/ContactForm';
import { photographerInfo } from '../data/photographer';
import { SEOHead } from '../components/seo/SEOHead';
import { PageTransition } from '../components/ui/PageTransition';
import { CONTAINER, Eyebrow, InView, LiveClock, PageHero } from '../components/ui/Premium';

export default function Contact() {
  const channels = [
    { label: 'Email', value: photographerInfo.email, href: `mailto:${photographerInfo.email}` },
    { label: 'Phone', value: photographerInfo.phone, href: `tel:${photographerInfo.phone.replace(/\s+/g, '')}` },
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
            </div>
          </InView>
        </div>
      </section>
    </PageTransition>
  );
}
