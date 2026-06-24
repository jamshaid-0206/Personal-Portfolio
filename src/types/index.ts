export interface ProjectImage {
  url: string;
  alt: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'mobile' | 'ai' | 'frontend' | 'fullstack';
  year: string;
  client: string;
  camera: string; // Used as the Stack description (e.g., "React, Redux, Node.js")
  location: string;
  coverImage: string;
  images: ProjectImage[];
  description: string;
  overview: string;
  challenge: string;
  solution: string;
  technologiesList: string[];
  featuresList: string[];
  developmentProcess: string;
  results: string;
  technicalHighlights: string[];
  lessonsLearned: string;
  demoVideoUrl?: string;
  demoVideoPoster?: string;
}

export interface PhotographerInfo {
  name: string;
  tagline: string;
  heroIntroduction: string;
  biography: string; // separated by double-newlines
  approach: string;
  awards: string[]; // Acts as Experience list
  clients: string[]; // Acts as Skills list
  education: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  socialLinks: {
    linkedin: string;
    behance: string;
    instagram: string; // Acts as mailto link
  };
  portraitImage: string;
}
