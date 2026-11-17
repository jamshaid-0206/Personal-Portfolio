/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';

import { ThemeProvider } from './components/providers/ThemeProvider';
import { Layout } from './components/layout/Layout';
import { IntroLoader } from './components/ui/IntroLoader';
import { InteractionSoundManager } from './components/providers/InteractionSoundManager';
import { SmoothScroll } from './components/providers/SmoothScroll';

// Home is eager (first paint); other routes are code-split for a fast initial load.
import Home from './pages/Home';
const Portfolio = lazy(() => import('./pages/Portfolio'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-px w-40 overflow-hidden bg-emerald-500/10">
        <div className="h-full w-1/3 bg-emerald-400 animate-[loadbar_0.9s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();

  return (
    <Layout>
      <SmoothScroll />
      <AnimatePresence mode="wait">
        <div key={location.pathname} className="w-full min-h-screen flex flex-col">
          <Suspense fallback={<RouteFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<ProjectDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </AnimatePresence>
    </Layout>
  );
}

const INTRO_KEY = 'jg_intro_seen';
const readIntroSeen = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    return false;
  }
};

export default function App() {
  const [showIntro, setShowIntro] = useState(() => !readIntroSeen());

  const handleIntroDone = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* storage unavailable */
    }
    setShowIntro(false);
  };

  return (
    <HelmetProvider>
      <ThemeProvider>
        <InteractionSoundManager />
        <BrowserRouter>
          <div className="w-full min-h-screen flex flex-col">
            <AppRoutes />
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: '!rounded-2xl !border !border-foreground/10 !bg-background !text-foreground !shadow-xl',
                duration: 5000,
              }}
            />
          </div>
          {showIntro && <IntroLoader onComplete={handleIntroDone} />}
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
