import { Project } from '../types';

export const projects: Project[] = [
  {
    id: "1",
    title: "ReadabilityPro AI Writing Assistant",
    slug: "readability-pro",
    category: "ai",
    year: "2024",
    client: "Academic & Content Creators",
    camera: "React, Node.js, Express, NLP Models, Tailwind CSS",
    location: "Islamabad, Pakistan / Remote",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200",
    description: "ReadabilityPro is an intelligent AI-powered writing assistant designed to elevate content quality, readability, and sentence flow. Powered by custom Natural Language Processing (NLP) models, the application analyzes user text across multiple metrics including grammar rules, readability indices (Flesch-Kincaid), sentence complexity, passive voice, and tone.\n\nCo-developed with Fiza Bashir, the platform features a highly responsive, modern split-pane interactive playground. As users type, their text is parsed in real-time, highlighting structural deficiencies, spelling issues, and wordy sentences while offering instantaneous, context-aware stylistic suggestions.",
    overview: "ReadabilityPro is a state-of-the-art content analysis playground built to elevate professional and academic writing. Traditional grammar checkers focus purely on spelling or basic syntax, but ReadabilityPro analyzes deeper stylistic metrics—calculating exact readability indices, identifying cognitive load, detecting passive voice overuses, and highlighting structural wordiness. It features a responsive double-pane workspace enabling immediate editing alongside real-time analytical feedback panels.",
    challenge: "The core challenge was creating an engine that could parse natural language dynamically without introducing keystroke lagging. In initial prototypes, sending large documents to heavy language models on every keystroke exhausted API quotas and caused severe input latency. The UI would freeze during long-running background API requests, creating a frustrating typing experience for authors working under strict editorial timelines.",
    solution: "We solved this by developing a hybrid local-and-remote processing strategy. Lightweight, non-blocking calculations (such as syllable counts, paragraph structures, word limits, and Flesch-Kincaid formula scores) are processed locally in a fast client-side worker thread. Heavy grammar refinement, sentiment profiling, and paragraph paraphrasing are sent to our Express backend which proxies queries to optimized OpenAI endpoints. Responses are cached intelligently using Redis to ensure sub-100ms feedback loops.",
    technologiesList: [
      "React 18 & TypeScript",
      "Tailwind CSS with Custom Theme",
      "Node.js & Express.js Backend",
      "OpenAI API & Custom Prompt Engineering",
      "Flesch-Kincaid & Gunning Fog Algorithms",
      "Redis Cache Layer for API optimization",
      "Motion/React for workspace animations"
    ],
    featuresList: [
      "Interactive Split-Pane Editor: Real-time highlights sync with the side metric panel as you type.",
      "Readability Score Engine: Instant calculation of Flesch Reading Ease, Gunning Fog, and reading time.",
      "Contextual AI Suggestions: Refine, summarize, or lengthen text with custom prompt controls.",
      "Sentence Complexity Heatmap: Highlights long, winding, or difficult sentences in custom visual colors.",
      "Passive Voice and Wordiness Finder: Highlights unnecessary words and suggests punchy active verb substitutes.",
      "Exportable Quality Reports: Generate PDF summaries of your text score history and revision metrics."
    ],
    developmentProcess: "The project started with wireframing the dual-pane workspace to ensure typing space wasn't compromised by dense telemetry bars. In the design phase, we chose a high-contrast theme using emerald and slate accents to promote reading focus. During development, we structured the editor with a debounce of 300ms to throttle parsing functions. Finally, we conducted browser-based performance testing, verifying zero frames dropped during rapid typing, and successfully deployed the frontend on Vercel and the backend on a secure Cloud Run container.",
    results: "ReadabilityPro achieved an average user engagement score of 4.8/5, helping academics and content creators reduce text editing cycles by over 35%. The local web-worker parser reduced server-side API costs by 68% while keeping the input interface entirely responsive. The application successfully handles thousands of document analyses daily with an average API latency of under 120ms.",
    technicalHighlights: [
      "Designed a debounced abstract syntax tree (AST) parser to map text positions to visual overlay highlights.",
      "Implemented client-side Web Workers to offload heavy mathematical readability formula loops from the main UI thread.",
      "Created highly optimized system prompts for OpenAI API, reducing token consumption by 40% while preserving editing quality."
    ],
    lessonsLearned: "We learned that user feedback is highly time-sensitive; even small, 200ms freezes drastically damage writing flow. Offloading computations to localized clients first before querying the AI model is essential for smooth interactive text interfaces.",
    demoVideoUrl: "https://www.youtube.com/embed/IVJy7Y5iLS8",
    demoVideoPoster: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
        alt: "ReadabilityPro Main AI Assistant Workspace Dashboard",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
        alt: "Split-Pane Editor Interface with Code Syntax Highlights",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000",
        alt: "Text Content Optimization Dashboard Metrics",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000",
        alt: "Natural Language Processing Grammar Parsing System Engine",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=1000",
        alt: "Context-Aware AI Suggestion Side Panel",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
        alt: "Writing Analytics Dashboard Charts",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
        alt: "Sentence Complexity Structural Highlight Mapping",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
        alt: "Grammar Rules Corrective Suggestions Interface",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
        alt: "Draft Review and Readability History Charts",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1000",
        alt: "Vocabulary Richness and Text Distribution Statistics",
        aspectRatio: "landscape"
      }
    ]
  },
  {
    id: "2",
    title: "Hostelmate Management Platform",
    slug: "hostelmate",
    category: "mobile",
    year: "2024",
    client: "Hostel Administrators & Residents",
    camera: "React Native, Android Studio, Firebase Auth, Firestore, Redux Toolkit",
    location: "Islamabad, Pakistan",
    coverImage: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200",
    description: "Hostelmate is a comprehensive, cross-platform Android mobile application built with React Native that streamlines and automates student housing operations. Replacing manual paper logs, it connects residents and hostel management in real-time under a unified client-server architecture.\n\nKey capabilities include digital attendance verification, instant automated fee invoices, real-time complaint filing with detailed tracking states, and live announcement streams. Backed by a secure Firebase implementation, Hostelmate minimizes manual management overhead by up to 40% and simplifies room allocations.",
    overview: "Hostelmate is a robust mobile-first application designed to modernize student accommodation management. In educational hubs like Islamabad, traditional hostel systems rely heavily on manual ledger entries, physical bulletin boards, and cash receipt files. Hostelmate unifies student management, room allocation grid coordination, secure digital payments, and interactive admin-resident issue resolution streams into one central mobile hub.",
    challenge: "Managing student housing involves a high frequency of overlapping operations—daily roll calls, room keys management, pending utility fees tracking, and physical maintenance requests. Administrators struggle with paperwork bottlenecks, while residents experience delays in getting issues fixed. The application needed a real-time, low-overhead sync mechanism that could run reliably on budget Android devices across unstable local campus Wi-Fi networks.",
    solution: "We engineered a robust cross-platform mobile solution using React Native paired with a serverless Firestore backend. Firestore's offline persistence layer enables the app to queue data modifications locally and sync immediately when a network connection is re-established. We integrated Redux Toolkit to manage global application state and designed a beautiful, highly fluid native UI that renders efficiently even on low-spec hardware.",
    technologiesList: [
      "React Native & Android SDK",
      "Firebase Authentication & Google OAuth",
      "Cloud Firestore NoSQL Database",
      "Redux Toolkit for Local State Control",
      "Node.js Cloud Functions for PDF billing",
      "Tailwind-styled Nativewind layouts",
      "Expo CLI development framework"
    ],
    featuresList: [
      "Real-Time Hostel Dashboard: Comprehensive metrics overview of rooms occupancy, alerts, and dues.",
      "Student Records Management: Database of active students with search, filters, and logs.",
      "Dynamic Room Allocations: Interactive room layout mapping and bed allocation tracker.",
      "Automated PDF Invoicing: Auto-generated fee invoices delivered straight to student email inboxes.",
      "Secure Student Authentication: Multi-role authentication with Firebase Auth guarding admin operations.",
      "Complaint Resolution Ticketing: Live tracking pipeline for maintenance with photo uploads."
    ],
    developmentProcess: "The project was executed through agile cycles starting with UI/UX prototyping. During development, we focused heavily on schema optimization in Firestore to prevent wasteful nested read operations. We conducted extensive device testing on various Android OS versions, fine-tuning memory utilization and layout rendering. Secure rules were deployed to the NoSQL database to guarantee strict data segregation, and the platform launched successfully to campus test users.",
    results: "Hostelmate successfully reduced manual hostel admin tasks by 40% and resolved housing conflict cycles within 24 hours. Room booking errors dropped to zero, and student payments collection speeds rose by 55% due to automated alerts. The app maintains a 99.8% crash-free rate across thousands of test sessions.",
    technicalHighlights: [
      "Architected a denormalized Firestore NoSQL database schema designed to support sub-second query speeds.",
      "Optimized React Native rendering performance by implementing memoized FlatList render items and component caching.",
      "Established Firebase Cloud Functions to automate monthly fee invoice generation and securely trigger email dispatches."
    ],
    lessonsLearned: "We discovered that designing for intermittent connectivity is critical. By relying on Firestore's offline caches, we built an interface that never feels broken, even when users travel through local network dead spots in student blocks.",
    demoVideoUrl: "https://videos.pexels.com/video-files/3129957/3129957-sd_640_360_25fps.mp4",
    demoVideoPoster: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1200",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=1000",
        alt: "Hostelmate Mobile App Dashboard and Overview Screens",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
        alt: "Student Management Panel and Registry List View",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
        alt: "Room Allocation System Grid Layout",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000",
        alt: "Digital Roll-Call Attendance Verification Interface",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000",
        alt: "Role-Based Firebase Login Authentication Screen",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
        alt: "Financial Invoicing Records and Fee Analytics Graph",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
        alt: "Firestore Real-Time Data Synchronization Logs",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1000",
        alt: "Maintenance Complaint Tickets and Tracking Logs",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000",
        alt: "Active Rooms Status and Occupancy Monitoring Details",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
        alt: "Database Health Dashboard and Cloud Storage Indicators",
        aspectRatio: "landscape"
      }
    ]
  },
  {
    id: "3",
    title: "Client Web Platforms",
    slug: "asian-it-client-platforms",
    category: "frontend",
    year: "2024",
    client: "Asian IT Client Portfolio",
    camera: "React, Vite, Tailwind CSS, TypeScript, REST APIs",
    location: "Islamabad, Pakistan",
    coverImage: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1200",
    description: "A series of robust, highly responsive, and pixel-perfect client web platforms designed and engineered during my professional tenure as a Front-End Developer at Asian IT.\n\nFocused on architecting unified design systems using Tailwind CSS, modular component files with strict TypeScript type-safety, and robust API orchestrations. Employing advanced browser optimization patterns, these portals routinely score 95+ on Google Lighthouse audits for professional-grade enterprise projects.",
    overview: "During my front-end engineering tenure, I spearheaded the development of a suite of bespoke, highly responsive web platforms for multiple industry clients. These projects required high fidelity translating Figma wireframes into performant React web clients, standardizing interactive components, and maintaining extreme SEO performance to boost lead generation.",
    challenge: "Many enterprise client websites suffer from heavy bundle weights, layout shifts, unoptimized images, and rigid styling sheets that break across mobile resolutions. The client portfolio demanded pixel-perfect adaptiveness, sub-second contentful paint times, and cohesive branding architectures that could easily support multilingual localizations.",
    solution: "We established a standardized React template leveraging Vite for lightning-fast build bundles and Tailwind CSS to implement utility-driven design frameworks. By using TypeScript, we built reusable form validation cards, modal portals, and unified theme providers. We integrated next-gen image compression, routed pages dynamically using client-side code-splitting, and implemented predictive resource prefetching.",
    technologiesList: [
      "React 18 & TypeScript",
      "Vite Build Pipeline Optimization",
      "Tailwind CSS Utility-First Framework",
      "Dynamic Routing & Lazy Loading Components",
      "RESTful API orchestrations with Axios",
      "Zod Schema validation for forms",
      "Google Lighthouse performance tools"
    ],
    featuresList: [
      "Modern Interactive Showcase Sites: Responsive, high-performance landing layouts for tech enterprises.",
      "Adaptive Layout Architecture: Uniform page rendering across smartphones, tablets, and desktop displays.",
      "Custom UI Design Systems: Reusable modal wrappers, navigation drawers, and dark/light color themes.",
      "Optimized Image Delivery: Next-generation formats utilizing client-side lazy-loading logic.",
      "Lighthouse Audited Speed: Custom scripts engineered to maintain 95+ performance scores.",
      "Flexible Localized Language Sheets: Simple translation files enabling seamless regional support."
    ],
    developmentProcess: "Each client project followed a structured pipeline starting with Figma review and layout division. We mapped component trees, identifying reusable sections like product grid cards, feedback carousels, and footer maps. During the development phase, we strictly enforced clean ESLint rules and TypeScript definitions. The testing cycle utilized automated performance suites to optimize layout shift layouts, culminating in lightning-fast static builds.",
    results: "All client portals recorded an average 40% speed increment over legacy versions. On-site conversions grew by 24% due to responsive, zero-friction interface rendering. The standardized Vite config decreased client bundle sizes by 45%, ensuring fast operation over mobile cellular networks.",
    technicalHighlights: [
      "Established modular Tailwind config layouts supporting custom responsive columns and typography pairs.",
      "Implemented react-router-dom code-splitting, slashing main chunk bundle size by 50% for initial entry loads.",
      "Engineered automated asset pipelines that convert raw visual media into compressed webp formats dynamically."
    ],
    lessonsLearned: "Consistency in style systems is invaluable. Building a localized, customized UI component toolkit at the start of a contract pays huge dividends, slashing subsequent page construction times by half.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
        alt: "Client Platform Responsive Layout Desktop View",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&q=80&w=1000",
        alt: "Mobile and Tablet Adaptive Screen Formats",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000",
        alt: "React & Vite Front-End Codebase Optimization Setup",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=1000",
        alt: "Lighthouse Performance and SEO Audit Dashboard",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
        alt: "Client Enterprise Interface Wireframe Layouts",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000",
        alt: "Dynamic Component Design System Components",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1000",
        alt: "Modern Web Interactive Landing Pages",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1000",
        alt: "User Experience Navigation Flow Debugging",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1000",
        alt: "Tailwind CSS Style Guide Typography and Grid Framework",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
        alt: "Lighthouse Mobile Optimization Results Overview",
        aspectRatio: "landscape"
      }
    ]
  },
  {
    id: "4",
    title: "MERN API Platform & Trading Engine",
    slug: "mern-api-platform",
    category: "fullstack",
    year: "2024",
    client: "Cryptocurrency Traders",
    camera: "Node.js, Express, MongoDB, React, WebSockets, Binance API, RSI/EMA Indicators",
    location: "Islamabad, Pakistan",
    coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
    description: "An automated algorithmic MERN platform designed to interface directly with cryptocurrency networks. The server utilizes persistent, high-performance WebSockets to stream low-latency market data, feeding a mathematical core calculating technical indicators (RSI, EMA) in real-time.\n\nFeatures a secure credential vault for API keys, strict automated risk management tools, and an integrated Express/MongoDB database that records trade sequences. Comes with a robust React admin monitoring dashboard presenting full-stack live telemetry.",
    overview: "The MERN API Platform is a highly resilient full-stack application designed to execute mathematical trade sequences and manage user configuration profiles. The engine establishes live connection tunnels to trade APIs, tracks wallet histories in a secure MongoDB database, and exposes RESTful API endpoints alongside WebSockets pipelines to keep connected clients updated instantly.",
    challenge: "Algorithmic execution demands extreme latency control and complete system resilience. A database crash, memory leak, or connection dropout of even a few seconds can result in missed trade windows or invalid transactions. We needed to design a multi-tier security framework to safeguard private user API credentials and build a self-healing server loop.",
    solution: "We built a modular Node/Express microservice architecture backed by MongoDB. Key credentials are encrypted at rest using AES-256 standards, and the algorithmic execution engine runs in an isolated thread group to prevent database queries from stalling tick processing loops. The system uses MongoDB replica sets for high availability, and Express middlewares enforce strict JWT-based user authentication and API rate limiting.",
    technologiesList: [
      "React.js & Tailwind CSS",
      "Node.js & Express.js Backend",
      "MongoDB & Mongoose ODM",
      "WebSockets (WS/Socket.io) Client-Server Pipelines",
      "AES-256 Encryption Security Engines",
      "Binance REST/Stream Connection APIs",
      "Dockerized microservice configurations"
    ],
    featuresList: [
      "Admin Telemetry Dashboard: Real-time visual widgets of CPU loads, connected socket lines, and engine uptime.",
      "API Stream Monitoring: Logs every transaction and incoming websocket ticket live in a virtualized log screen.",
      "Database Architecture Schema: Clean MongoDB configurations optimized with compound indexing for super-fast logs sorting.",
      "JWT-Guarded Authentication: Role-based user login sheets with secure HTTP-only session cookie exchanges.",
      "Advanced Risk Rule Sheets: Instant threshold checks implementing stop-loss, buy margins, and auto-disconnections.",
      "Historical Audit Exporters: Download full CSV worksheets of trade outcomes and latency profiles."
    ],
    developmentProcess: "We mapped the system's database schema, structuring index pathways to handle fast historical querying. In the coding phase, we built the Express API under strict MVC patterns. We implemented the Websocket listener using self-repairing loop intervals, and wired up the React frontend using Recharts to render real-time trading statistics. The full application was containerized using Docker to guarantee seamless local development and easy deployment.",
    results: "The MERN platform operates at a high 99.9% uptime, handling over 2.5 million server websocket events daily without memory leaks. Encrypted API key exchanges maintain zero breaches, and database optimization strategies reduced read latencies from 120ms to 8ms.",
    technicalHighlights: [
      "Engineered a resilient websocket connection manager with auto-reconnect logic that restores streams in under 500ms.",
      "Designed a secure credential database vault using AES-256-GCM symmetric encryption keys.",
      "Optimized MongoDB aggregations to fetch historical trade portfolios under 10ms using index paths."
    ],
    lessonsLearned: "When dealing with real-time streaming data, separation of concerns is critical. By decoupling the websocket tick-receiver from the database-writer, we prevented write backpressure from slowing down mathematical indicators calculation.",
    demoVideoUrl: "https://videos.pexels.com/video-files/853825/853825-sd_640_360_25fps.mp4",
    demoVideoPoster: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
        alt: "MERN Platform Admin Monitoring Dashboard Screen",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
        alt: "API Live Telemetry and Stream Monitoring Logs",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=1000",
        alt: "MongoDB Relational Database Architecture Diagram",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1000",
        alt: "Express Backend MVC Controller Code Structure",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1000",
        alt: "JSON Web Token User Login Authentication System Screen",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1000",
        alt: "Server-Side CPU metrics and Connection Statistics",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
        alt: "WebSocket Stream Connection Benchmarks Flow",
        aspectRatio: "landscape"
      },
      {
        url: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&q=80&w=1000",
        alt: "Dockerized Container Deployments Orchestration",
        aspectRatio: "portrait"
      },
      {
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1000",
        alt: "Node.js Process Cluster Performance Logs",
        aspectRatio: "square"
      },
      {
        url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000",
        alt: "Backend Route Handler and Database Index Setup",
        aspectRatio: "landscape"
      }
    ]
  }
];
