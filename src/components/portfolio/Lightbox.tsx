import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import { ProjectImage } from '../../types';

interface LightboxProps {
  images: ProjectImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({ 
  images, 
  currentIndex, 
  onClose, 
  onPrev, 
  onNext 
}: LightboxProps) {
  const shouldReduceMotion = useReducedMotion();
  const activeImage = images[currentIndex];
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch Swipe Gesture Detection
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onNext();
    } else if (isRightSwipe) {
      onPrev();
    }
  };

  // Keyboard Handlers & Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      } else if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'Tab') {
        // Focus trap simple logic
        if (!containerRef.current) return;
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent document body scrolling
    document.body.style.overflow = 'hidden';

    // Auto focus close button on load
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-black/95 flex flex-col items-center justify-center z-[100] outline-none"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      {/* Screen Reader Announcements */}
      <span className="sr-only" aria-live="polite">
        Image {currentIndex + 1} of {images.length}. {activeImage?.alt}
      </span>

      {/* Top Controls Bar */}
      <div className="absolute top-0 inset-x-0 h-16 flex items-center justify-between px-6 z-10 bg-gradient-to-b from-black/60 to-transparent">
        <span className="text-zinc-400 font-mono text-sm tracking-widest">
          {currentIndex + 1} / {images.length}
        </span>
        
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="text-white/80 hover:text-white p-2 rounded-sm border border-transparent hover:border-white/10 bg-black/20 backdrop-blur-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
          aria-label="Close lightbox"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image Stage */}
      <div 
        className="w-full h-full max-w-5xl px-4 flex items-center justify-center relative touch-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Left Arrow (Desktop Only) */}
        <button
          onClick={onPrev}
          className="absolute left-6 hidden md:flex items-center justify-center w-12 h-12 rounded-sm border border-white/10 hover:border-white/30 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>

        {/* Center Active Image Container */}
        <div 
          className="relative max-h-[80vh] max-w-full flex items-center justify-center overflow-hidden"
        >
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            className={`max-h-[80vh] max-w-full object-contain select-none rounded-sm shadow-2xl ${
              shouldReduceMotion ? '' : 'transition-all duration-300 transform scale-100'
            }`}
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Arrow (Desktop Only) */}
        <button
          onClick={onNext}
          className="absolute right-6 hidden md:flex items-center justify-center w-12 h-12 rounded-sm border border-white/10 hover:border-white/30 bg-black/40 hover:bg-black/60 text-white/80 hover:text-white transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400"
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Mobile Swipe / Tap Instructions Footer */}
      <div className="absolute bottom-6 inset-x-0 text-center pointer-events-none">
        <span className="text-zinc-500 font-mono text-[10px] md:text-xs tracking-wider">
          Swipe left/right or use Arrow keys to navigate
        </span>
        <p className="text-white/90 text-sm font-light tracking-wide max-w-md mx-auto px-6 mt-1 line-clamp-1">
          {activeImage.alt}
        </p>
      </div>
    </div>
  );
}
