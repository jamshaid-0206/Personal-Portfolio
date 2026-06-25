/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';

import { ThemeProvider } from './components/providers/ThemeProvider';
import { Layout } from './components/layout/Layout';
import { LoadingFallback } from './components/ui/LoadingFallback';
import { InteractionSoundManager } from './components/providers/InteractionSoundManager';

// Pages imports
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function AppRoutes() {
  const location = useLocation();

  return (
    <Layout>
      {/* Route changes trigger slide + fade page transition animations */}
      <AnimatePresence mode="wait">
        <div key={location.pathname} className="w-full min-h-screen flex flex-col">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/portfolio/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AnimatePresence>
    </Layout>
  );
}

export default function App() {
  const [isBooting, setIsBooting] = useState(true);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <InteractionSoundManager />
        <BrowserRouter>
          <AnimatePresence mode="wait">
            {isBooting ? (
              <div key="bootloader" className="contents">
                <LoadingFallback onComplete={() => setIsBooting(false)} />
              </div>
            ) : (
              <div key="app-content" className="w-full min-h-screen flex flex-col">
                {/* Main App Routes with layout wrappers */}
                <AppRoutes />

                {/* Sonner toast popups engine */}
                <Toaster 
                  position="bottom-right" 
                  theme="dark" 
                  toastOptions={{
                    className: 'font-mono border border-border bg-black text-foreground rounded-sm shadow-md',
                    duration: 5000,
                  }}
                />
              </div>
            )}
          </AnimatePresence>
        </BrowserRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
