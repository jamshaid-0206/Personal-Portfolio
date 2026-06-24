import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { SkipToContent } from '../ui/SkipToContent';
import { CustomCursor } from '../ui/CustomCursor';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Premium Custom Cursor Trail */}
      <CustomCursor />

      {/* Retro-Futuristic Holographic Scanlines & Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-40 select-none opacity-[0.02] mix-blend-overlay bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%),_linear-gradient(90deg,_rgba(255,0,0,0.06),_rgba(0,255,0,0.02),_rgba(0,0,255,0.06))] bg-[size:100%_4px,_3px_100%]" />
      
      {/* Subtle Noise Grid Film Grain Texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-40 select-none opacity-[0.015] bg-[radial-gradient(#10b981_1px,transparent_1px)] bg-[size:16px_16px]" 
        style={{ maskImage: 'radial-gradient(ellipse at center, black, transparent)' }}
      />

      {/* Ambient Moving Gradient Aurora Backdrop Grid (Very low opacity for max performance) */}
      <div className="fixed -top-[40%] -left-[20%] w-[140vw] h-[140vh] rounded-full bg-radial from-emerald-950/10 via-emerald-900/5 to-transparent pointer-events-none select-none z-[-1] animate-[pulse_10s_infinite_alternate]" />

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
  );
}
