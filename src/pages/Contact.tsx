import { Mail, Phone, MapPin, Terminal, CalendarClock } from 'lucide-react';
import { ContactForm } from '../components/forms/ContactForm';
import { photographerInfo } from '../data/photographer';
import { SEOHead } from '../components/seo/SEOHead';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import { PageTransition } from '../components/ui/PageTransition';

export default function Contact() {
  const contactDetails = [
    {
      icon: <Mail size={16} className="text-emerald-400" />,
      label: 'Email',
      value: photographerInfo.email,
      href: `mailto:${photographerInfo.email}`
    },
    {
      icon: <Phone size={16} className="text-emerald-400" />,
      label: 'Phone',
      value: photographerInfo.phone,
      href: `tel:${photographerInfo.phone.replace(/\s+/g, '')}`
    },
    {
      icon: <MapPin size={16} className="text-emerald-400" />,
      label: 'Location',
      value: photographerInfo.location,
      href: `https://maps.google.com/?q=${encodeURIComponent(photographerInfo.location)}`
    }
  ];

  return (
    <PageTransition>
      <SEOHead 
        title="Contact" 
        description="Get in touch with Jamshaid Ghafoor for full-stack web and mobile development opportunities." 
      />

      {/* SECTION A: HERO HEADER */}
      <section className="py-24 md:py-32 border-b border-border bg-card/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ScrollReveal>
            <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase block mb-4">
              // TELECOMMUNICATION_PORT_0x13
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-wide text-foreground font-sans uppercase">
              Get in Touch
            </h1>
            <p className="text-muted-foreground font-light text-lg md:text-xl max-w-xl mx-auto mt-4 leading-relaxed">
              Let's discuss your next project or role.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* SECTION B: SPLIT DETAILED LAYOUT */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT PANEL: ZOD VALIDATED CONTACT ENQUIRY FORM */}
          <div className="lg:col-span-7">
            <ScrollReveal>
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-emerald-500 uppercase">
                  <Terminal size={14} />
                  <span>[ TRANSMIT_MESSAGE_SHELL ]</span>
                </div>
                
                {/* Form component */}
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT PANEL: CONTACT CARD DIRECT DETAILS */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24 text-left">
            <ScrollReveal delay={0.15}>
              <div className="space-y-6">
                
                {/* Header title */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase block">
                    // DIRECT_CHANNELS
                  </span>
                  <h2 className="text-2xl md:text-3xl font-light tracking-wide text-foreground">
                    Connect Directly
                  </h2>
                </div>

                <p className="text-muted-foreground font-light text-sm md:text-base leading-relaxed">
                  Have an interesting proposal, project scope, or full-time opening? I am always happy to discuss terms, timeline, and architectural paths.
                </p>

                {/* Info Card List with wrapped square icon sizes */}
                <div className="space-y-4">
                  {contactDetails.map((item, idx) => (
                    <a
                      key={idx}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 p-4 rounded-sm border border-border bg-card/30 hover:bg-accent/50 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {/* Square Wrapper Icon */}
                      <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-sm border border-border bg-background group-hover:border-emerald-500/20 transition-colors">
                        {item.icon}
                      </div>
                      
                      <div className="min-w-0">
                        <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase leading-none mb-1">
                          {item.label}
                        </span>
                        <span className="block text-sm font-light text-foreground group-hover:text-emerald-400 transition-colors truncate">
                          {item.value}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Active Availability Badge container */}
                <div className="pt-4 border-t border-border/60">
                  <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase block mb-3">
                    // WORK_AVAILABILITY_STATUS:
                  </span>
                  
                  <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                    <CalendarClock size={14} className="shrink-0 text-emerald-400" />
                    <span className="text-xs font-mono tracking-wider">
                      {photographerInfo.availability}
                    </span>
                  </div>
                </div>

              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

    </PageTransition>
  );
}
