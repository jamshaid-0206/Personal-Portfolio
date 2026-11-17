import React, { lazy, Suspense } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipToContent } from '../ui/SkipToContent';
import { CustomCursor } from '../ui/CustomCursor';
import { AuroraBackground } from '../ui/AuroraBackground';
import { ScrollProgressBar } from '../ui/ScrollProgressBar';
// Non-critical overlays are code-split so they never block first paint
const AIAssistant = lazy(() => import('../ui/AIAssistant').then((m) => ({ default: m.AIAssistant })));
const EasterEggOverlay = lazy(() => import('../ui/EasterEggOverlay').then((m) => ({ default: m.EasterEggOverlay })));

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col relative overflow-x-clip selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Easter Egg Overlay HUD & Warp */}
      <Suspense fallback={null}>
        <EasterEggOverlay />
        {/* Persistent Holographic AI Companion */}
        <AIAssistant />
      </Suspense>

      {/* Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Premium Custom Cursor Trail */}
      <CustomCursor />

      {/* Ambient Moving Gradient Aurora Backdrop (Dynamic, premium multi-colored mesh) */}
      <AuroraBackground className="fixed inset-0 z-0" />

      {/* Content Layer sitting on top of the Aurora backdrop */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Accessibility Focus Jump */}
        <SkipToContent />

        {/* Sticky Global Header Nav */}
        <Header />

        {/* Primary Semantic Body Container */}
        <main 
          id="main" 
          className="flex-1 flex flex-col focus:outline-none"
          tabIndex={-1}
        >
          {children}
        </main>

        {/* Global Bottom Footer */}
        <Footer />
      </div>
    </div>
  );
}
