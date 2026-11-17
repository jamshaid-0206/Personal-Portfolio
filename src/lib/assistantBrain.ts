/**
 * Offline "brain" for the portfolio assistant — used when the AI endpoint is
 * unavailable. Intent scoring over keywords (English + Roman Urdu) and answers
 * built from the same data the AI uses.
 */
import { photographerInfo as me } from '../data/photographer';
import { projects } from '../data/projects';
import { GITHUB_REPOS } from '../data/assistant';
import type { Project } from '../types';

export interface AssistantAction {
  label: string;
  href: string;
}

export interface BrainReply {
  text: string;
  actions: AssistantAction[];
}

type Intent =
  | 'greet'
  | 'self'
  | 'intro'
  | 'projects'
  | 'best'
  | 'skills'
  | 'experience'
  | 'education'
  | 'hire'
  | 'contact'
  | 'location'
  | 'resume'
  | 'code'
  | 'services'
  | 'thanks';

const KEYWORDS: Record<Intent, string[]> = {
  greet: ['hi', 'hello', 'hey', 'salam', 'assalam', 'aoa', 'yo', 'hola', 'good morning', 'good evening'],
  self: ['who are you', 'what are you', 'are you ai', 'are you a bot', 'tum kon', 'tum kaun', 'ap kon', 'aap kaun'],
  intro: ['who is', 'about', 'introduce', 'jamshaid', 'ghafoor', 'tell me about him', 'background', 'kaun hai', 'kon hai', 'bare mein', 'baare', 'tarruf', 'taaruf'],
  projects: ['project', 'projects', 'work', 'portfolio', 'built', 'build', 'apps', 'made', 'kaam', 'banaya'],
  best: ['best', 'favorite', 'favourite', 'top', 'proud', 'flagship', 'sab se acha', 'sabse acha', 'behtareen'],
  skills: ['stack', 'skill', 'skills', 'tech', 'technology', 'technologies', 'language', 'languages', 'framework', 'react', 'node', 'mongodb', 'tools', 'expert', 'know'],
  experience: ['experience', 'job', 'company', 'asian it', 'current', 'working', 'employer', 'tajurba', 'naukri', 'career'],
  education: ['education', 'study', 'studies', 'university', 'degree', 'bscs', 'abasyn', 'college', 'student', 'parhai', 'parh'],
  hire: ['hire', 'available', 'availability', 'freelance', 'contract', 'full time', 'full-time', 'rate', 'rates', 'price', 'pricing', 'cost', 'budget', 'charge', 'charges', 'fee', 'fees', 'hourly', 'quote', 'collaborate', 'opportunity', 'role', 'position', 'hire karna', 'rakhna'],
  contact: ['contact', 'email', 'mail', 'phone', 'number', 'call', 'whatsapp', 'reach', 'message', 'rabta', 'raabta', 'baat'],
  location: ['where', 'location', 'based', 'city', 'country', 'pakistan', 'islamabad', 'timezone', 'time zone', 'kahan', 'kidhar'],
  resume: ['resume', 'cv', 'curriculum'],
  code: ['github', 'source', 'repo', 'repository', 'code'],
  services: ['services', 'offer', 'can he do', 'what does he do', 'help me with', 'kya karta', 'kya kar sakta'],
  thanks: ['thanks', 'thank you', 'thx', 'shukriya', 'shukria', 'great', 'awesome', 'nice', 'cool', 'bye', 'allah hafiz'],
};

// Specific intents beat generic ones on ties ("freelance kaam" → hire, not projects).
const WEIGHT: Partial<Record<Intent, number>> = { hire: 1.6, contact: 1.4, resume: 1.4, code: 1.2, education: 1.2, experience: 1.1 };

const SHORT_NAME: Record<string, string> = {
  'readability-pro': 'ReadabilityPro',
  hostelmate: 'Hostelmate',
  'asian-it-client-platforms': 'Client Platforms',
  'mern-api-platform': 'Trading Engine',
  'aesthetic-med-pakistan': 'Aesthetic Med',
};

const PROJECT_KEYS: Record<string, string[]> = {
  'aesthetic-med-pakistan': ['aesthetic', 'aestheticmed', 'aesthetic med', 'aestheticmedpak', 'wordpress', 'woocommerce', 'elementor', 'skincare', 'skin care', 'ecommerce', 'e-commerce', 'online store', 'store', 'shop'],
  'readability-pro': ['readability', 'readabilitypro', 'writing', 'grammar', 'nlp', 'ai writing'],
  hostelmate: ['hostelmate', 'hostel', 'react native app', 'mobile app', 'accommodation'],
  'asian-it-client-platforms': ['client web', 'client platforms', 'asian it websites', 'client websites', 'websites', 'web platforms'],
  'mern-api-platform': ['mern api', 'trading', 'binance', 'crypto', 'bot', 'api platform', 'websocket'],
};

const ROMAN_URDU = /\b(kya|kia|hai|hain|kaun|kon|kahan|kese|kaise|mujhe|mujhay|aap|ap|batao|bataye|bataiye|chahiye|karta|karte|wala|ki|ka|ke|nahi|haan|kitna)\b/;
const URDU_SCRIPT = /[؀-ۿ]/;

const norm = (s: string) => ` ${s.toLowerCase().replace(/[^\p{L}\p{N}\s+]/gu, ' ').replace(/\s+/g, ' ')} `;
const has = (t: string, k: string) => t.includes(` ${k} `) || (k.includes(' ') && t.includes(k));

function detectProject(t: string): Project | undefined {
  let best: { p: Project; score: number } | undefined;
  for (const p of projects) {
    const keys = PROJECT_KEYS[p.slug] ?? [p.slug];
    const score = keys.reduce((n, k) => n + (has(t, k) || t.includes(k) ? k.length : 0), 0);
    if (score && (!best || score > best.score)) best = { p, score };
  }
  return best?.p;
}

function detectIntents(t: string): Intent[] {
  const scored = (Object.keys(KEYWORDS) as Intent[])
    .map((i) => ({ i, s: KEYWORDS[i].reduce((n, k) => n + (has(t, k) ? 1 + k.split(' ').length : 0), 0) * (WEIGHT[i] ?? 1) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  return scored.map((x) => x.i);
}

const projectAction = (p: Project): AssistantAction => ({ label: `View ${SHORT_NAME[p.slug] ?? p.title.split(' ')[0]}`, href: `/portfolio/${p.slug}` });
const EMAIL: AssistantAction = { label: 'Email Jamshaid', href: `mailto:${me.email}` };
const CONTACT: AssistantAction = { label: 'Contact page', href: '/contact' };
const WHATSAPP: AssistantAction = { label: 'WhatsApp him', href: me.whatsapp };

function describeProject(p: Project, ur: boolean): BrainReply {
  const what = p.description.split('\n\n')[0].split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.');
  const outcome = p.results.split('. ')[0].replace(/\.?$/, '.');
  const text = ur
    ? `**${p.title}** (${p.year}) — ${what}\n\n- Stack: ${p.camera}\n- Natija: ${outcome}`
    : `**${p.title}** (${p.year}) — ${what}\n\n- Stack: ${p.camera}\n- Result: ${outcome}`;
  const actions = [projectAction(p)];
  if (p.liveUrl) actions.push({ label: 'Visit live site', href: p.liveUrl });
  else if (GITHUB_REPOS[p.slug]) actions.push({ label: 'View code', href: GITHUB_REPOS[p.slug] });
  return { text, actions };
}

export function localReply(input: string): BrainReply {
  const t = norm(input);
  const ur = URDU_SCRIPT.test(input) || ROMAN_URDU.test(t);
  const say = (en: string, urdu: string) => (ur ? urdu : en);

  const project = detectProject(t);
  const intents = detectIntents(t);
  const top = intents[0];

  if (project && top !== 'contact' && top !== 'hire') return describeProject(project, ur);

  switch (top) {
    case 'greet':
      return {
        text: say(
          "Hey! I can tell you about Jamshaid's projects, skills, experience, or how to work with him. What would you like to know?",
          'Salam! Main aap ko Jamshaid ke projects, skills, experience ya un ke saath kaam karne ke baare mein bata sakta hoon. Kya jaanna chahenge?'
        ),
        actions: [],
      };
    case 'self':
      return {
        text: say(
          "I'm Jamshaid's AI assistant. I know his work inside out and can answer questions about his projects, skills and availability — and point you to the right page.",
          'Main Jamshaid ka AI assistant hoon. Un ke projects, skills aur availability ke baare mein sawal poochein, main sahi page tak bhi le jaunga.'
        ),
        actions: [],
      };
    case 'projects':
    case 'best':
      if (top === 'best' || intents.includes('best')) {
        const p = projects.find((x) => x.slug === 'readability-pro') ?? projects[0];
        const r = describeProject(p, ur);
        return { ...r, text: say('His flagship is ', 'Un ka sab se behtareen project ') + r.text };
      }
      return {
        text: say(
          `He has shipped ${projects.length} featured projects:\n${projects.map((p) => `- **${p.title}** — ${p.category}`).join('\n')}\n\nWant details on any of them?`,
          `Unhon ne ${projects.length} khaas projects banaye hain:\n${projects.map((p) => `- **${p.title}** — ${p.category}`).join('\n')}\n\nKisi ki tafseel chahiye?`
        ),
        actions: [{ label: 'See all projects', href: '/portfolio' }],
      };
    case 'skills':
      return {
        text: say(
          `His core stack:\n- **Frontend:** React, React Native, Redux, Tailwind, HTML5/CSS3\n- **Backend:** Node.js, Express, REST APIs, MVC\n- **Data:** MongoDB, Firebase\n- **CMS & e-commerce:** WordPress, WooCommerce, Elementor Pro\n- **Tooling:** Git/GitHub, TypeScript, performance optimisation`,
          `Un ka main stack:\n- **Frontend:** React, React Native, Redux, Tailwind\n- **Backend:** Node.js, Express, REST APIs\n- **Data:** MongoDB, Firebase\n- **CMS:** WordPress, WooCommerce, Elementor\n- **Tools:** Git/GitHub, TypeScript`
        ),
        actions: [{ label: 'About him', href: '/about' }],
      };
    case 'experience':
      return {
        text: say(
          "He's currently a **Front-End Developer at Asian IT** (2024 – present), building fast, responsive client websites — translating designs into pixel-perfect UIs, code-splitting for speed and integrating REST APIs. He has also shipped Hostelmate and ReadabilityPro end-to-end.",
          'Woh is waqt **Asian IT mein Front-End Developer** hain (2024 se). Client websites ko tez aur responsive banate hain, designs ko pixel-perfect UI mein badalte hain aur REST APIs jodte hain.'
        ),
        actions: [{ label: 'About him', href: '/about' }],
      };
    case 'education':
      return {
        text: say(
          `He's studying a **BSc in Computer Science at Abasyn University, Islamabad** (2023 – 2027), alongside working professionally as a developer.`,
          `Woh **Abasyn University, Islamabad se BS Computer Science** kar rahe hain (2023 – 2027), aur saath mein developer ki naukri bhi.`
        ),
        actions: [],
      };
    case 'hire':
    case 'services':
      return {
        text: say(
          `Yes — he's **${me.availability.toLowerCase()}**. He builds web apps, React Native mobile apps, REST APIs and AI integrations. For rates and timelines, the quickest way is a short message describing your project.`,
          `Ji haan — woh freelance, contract aur full-time kaam ke liye available hain. Web apps, mobile apps, APIs aur AI integrations banate hain. Rate aur timeline ke liye apne project ka chhota sa message bhej dein.`
        ),
        actions: [WHATSAPP, CONTACT],
      };
    case 'contact':
      return {
        text: say(
          `You can reach him on **WhatsApp at ${me.phone}** or by email at **${me.email}**. He usually replies within a day.`,
          `Aap un se **WhatsApp (${me.phone})** ya email **${me.email}** par rabta kar sakte hain. Aam taur par ek din mein jawab dete hain.`
        ),
        actions: [WHATSAPP, EMAIL],
      };
    case 'location':
      return {
        text: say(
          `He's based in **${me.location}** (PKT, GMT+5) and works with clients remotely worldwide.`,
          `Woh **${me.location}** mein hain (PKT, GMT+5) aur duniya bhar ke clients ke saath remote kaam karte hain.`
        ),
        actions: [],
      };
    case 'resume':
      return { text: say('Here’s his resume — it covers his experience, education and projects.', 'Yeh raha un ka resume.'), actions: [{ label: 'Download resume', href: '/resume.pdf' }] };
    case 'code':
      return {
        text: say('His code lives on GitHub — including ReadabilityPro, Hostelmate and the MERN trading engine.', 'Un ka code GitHub par hai.'),
        actions: [{ label: 'Open GitHub', href: me.socialLinks.linkedin }],
      };
    case 'thanks':
      return { text: say('Anytime! Anything else you’d like to know?', 'Koi baat nahi! Aur kuch poochna hai?'), actions: [] };
    case 'intro':
    default:
      if (top === 'intro' || /jamshaid|ghafoor/.test(t)) {
        return {
          text: say(
            `**${me.name}** is a full-stack developer from Islamabad who builds fast, polished web and mobile apps with the MERN stack and React Native. He works as a Front-End Developer at Asian IT and is studying Computer Science at Abasyn University.`,
            `**${me.name}** Islamabad ke full-stack developer hain jo MERN stack aur React Native se tez aur khoobsurat web aur mobile apps banate hain. Asian IT mein Front-End Developer hain aur Abasyn University se CS kar rahe hain.`
          ),
          actions: [{ label: 'About him', href: '/about' }, { label: 'See his work', href: '/portfolio' }],
        };
      }
      return {
        text: say(
          `I'm not sure about that one — I only know about Jamshaid's work. Try asking about his projects, skills or availability, or email him at ${me.email}.`,
          `Is ka mujhe pata nahi — main sirf Jamshaid ke kaam ke baare mein jaanta hoon. Projects, skills ya availability ke baare mein poochein, ya ${me.email} par email karein.`
        ),
        actions: [EMAIL],
      };
  }
}

/** Follow-up chips tailored to what was just discussed. */
export function suggestionsFor(input: string): string[] {
  const t = norm(input);
  const p = detectProject(t);
  const i = detectIntents(t)[0];
  if (p) return ['What tech did he use?', 'Show another project', 'Is he available for hire?'];
  switch (i) {
    case 'projects':
    case 'best':
      return ['Tell me about Hostelmate', 'What is his tech stack?', 'How can I contact him?'];
    case 'skills':
      return ['Show me his best project', 'Where does he work?', 'Is he available for hire?'];
    case 'hire':
    case 'services':
    case 'contact':
      return ['Download his resume', 'Where is he based?', 'Show me his best project'];
    default:
      return ['Show me his best project', 'What is his tech stack?', 'Is he available for hire?'];
  }
}

/** Splits trailing [[Label|href]] action markers out of a reply. */
export function parseActions(raw: string): BrainReply {
  const actions: AssistantAction[] = [];
  const text = raw
    .replace(/\[\[([^\]|]{1,40})\|([^\]\s]{1,200})\]\]/g, (_, label: string, href: string) => {
      const external = /^https:\/\/(github\.com\/jamshaid-0206|wa\.me\/923124134549)/.test(href) || projects.some((p) => p.liveUrl && href.startsWith(p.liveUrl));
      if ((/^(\/|mailto:)/.test(href) || external) && actions.length < 2) actions.push({ label: label.trim(), href });
      return '';
    })
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { text, actions };
}
