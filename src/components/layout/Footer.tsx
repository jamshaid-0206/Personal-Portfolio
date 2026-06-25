import { Github, Linkedin, Instagram, Mail } from 'lucide-react';
import { photographerInfo } from '../../data/photographer';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const ghUrl = photographerInfo.socialLinks.linkedin; // "https://github.com/jamshaid-0206"
  const instaUrl = photographerInfo.socialLinks.instagram;
  const mailUrl = `mailto:${photographerInfo.email}`;

  // Behance custom inline SVG icon
  const BehanceIcon = ({ size = 20 }: { size?: number }) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Behance</title>
      <path d="M22 10.7h-5.7c-.1-.7.4-1.8 1.6-1.8 1.2 0 1.5.9 1.5.9h2.3c0-.1-.4-2.8-3.8-2.8-3.4 0-4 2.8-4 4.5 0 2.2.9 4.5 4.1 4.5 3.3 0 3.8-2.5 3.8-3.4h-2.1c-.1.6-.5 1.4-1.7 1.4-1.2 0-1.7-.8-1.7-1.8h9c.1-1 .1-3.5-3.1-3.5zm-3.2-1.8c-1 0-1.3.7-1.4 1h2.7c-.1-.4-.4-1-1.3-1zM9.5 5.5H3v13h6.7c3.1 0 4.1-1.6 4.1-3.2 0-1.4-.8-2.5-2.2-2.8 1-.3 1.8-1.2 1.8-2.5 0-1.6-.9-4.5-4.5-4.5zm-3.8 4.2h3c.8 0 1.4.3 1.4 1 0 .7-.6 1.1-1.4 1.1h-3v-2.1zm0 4.4h3.3c.8 0 1.6.4 1.6 1.2 0 .8-.8 1.2-1.6 1.2h-3.3v-2.4zM16.5 5.2h6.5v1.3h-6.5V5.2z" />
    </svg>
  );

  return (
    <footer className="border-t border-border bg-background transition-colors py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Copyright */}
        <div className="text-sm text-muted-foreground font-light tracking-wide text-center md:text-left select-none">
          © {currentYear} {photographerInfo.name}. All rights reserved.
        </div>

        {/* Right Side: Social links matching spec mapping */}
        <div className="flex items-center gap-6 text-muted-foreground">
          {/* Instagram Link */}
          <a
            href={instaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm p-1.5 cursor-pointer"
            aria-label="Instagram Profile"
          >
            <Instagram size={18} />
          </a>

          {/* Email link */}
          <a
            href={mailUrl}
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm p-1.5 cursor-pointer"
            aria-label="Send Email"
          >
            <Mail size={18} />
          </a>

          {/* LinkedIn maps to GitHub URL */}
          <a
            href={ghUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm p-1.5 cursor-pointer"
            aria-label="LinkedIn Profile"
          >
            <Linkedin size={18} />
          </a>

          {/* Behance maps to GitHub URL */}
          <a
            href={ghUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm p-1.5 cursor-pointer"
            aria-label="Behance Portfolio"
          >
            <BehanceIcon size={18} />
          </a>

          {/* GitHub link directly */}
          <a
            href={ghUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm p-1.5 cursor-pointer"
            aria-label="GitHub Profile"
          >
            <Github size={18} />
          </a>
        </div>

      </div>
    </footer>
  );
}
