import { Helmet } from 'react-helmet-async';
import { photographerInfo } from '../../data/photographer';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  slug?: string;
}

export function SEOHead({ title, description, image, slug }: SEOHeadProps) {
  const siteName = photographerInfo.name;
  const defaultDesc = photographerInfo.heroIntroduction;
  const metaEnv = (import.meta as any).env || {};
  const canonicalUrl = slug ? `${metaEnv.VITE_APP_URL || 'https://github.com/jamshaid-0206'}/portfolio/${slug}` : (metaEnv.VITE_APP_URL || 'https://github.com/jamshaid-0206');
  
  const formattedTitle = title 
    ? `${title} — ${siteName}` 
    : `${siteName} — Full-Stack Developer`;
    
  const metaDescription = (description || defaultDesc).substring(0, 160);
  const ogImage = image || photographerInfo.portraitImage;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{formattedTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={formattedTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
}
