import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AboutVideoProps {
  posterUrl?: string;
  className?: string;
}

const VIDEO_SOURCES = [
  // High-quality, fast-loading, compressed tech/developer workspace loops
  "https://assets.mixkit.co/videos/preview/mixkit-web-developer-working-on-his-computer-34311-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-code-running-on-a-computer-screen-22002-large.mp4",
  "https://videos.pexels.com/video-files/3129957/3129957-sd_640_360_25fps.mp4"
];

export function AboutVideo({ 
  posterUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
  className 
}: AboutVideoProps) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [videoKey, setVideoKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-attempt playback when loading completes or key updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!isLoading && !hasError) {
      video.play().catch((err) => {
        console.warn("Autoplay was prevented by browser security rules, waiting for user interaction:", err);
      });
    }
  }, [isLoading, hasError, videoKey]);

  const handleLoadedData = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = (e: any) => {
    console.error(`Video stream error on source index ${currentSourceIndex}:`, e);
    
    // Attempt next backup source if available
    if (currentSourceIndex < VIDEO_SOURCES.length - 1) {
      setCurrentSourceIndex((prev) => prev + 1);
      setIsLoading(true);
      setVideoKey((prev) => prev + 1);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setCurrentSourceIndex(0); // Reset to primary source
    setRetryCount((prev) => prev + 1);
    setVideoKey((prev) => prev + 1);
  };

  return (
    <div className={cn("relative w-full h-full bg-zinc-950 flex items-center justify-center overflow-hidden group select-none", className)}>
      
      {/* Fallback Static Image (Shown when error exists or while initial load is starting) */}
      {(hasError || isLoading) && (
        <img
          src={posterUrl}
          alt="Developer programming workspace environment fallback"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:scale-105"
          loading="eager"
        />
      )}

      {/* Video Stream Element */}
      {!hasError && (
        <video
          key={videoKey}
          ref={videoRef}
          src={VIDEO_SOURCES[currentSourceIndex]}
          poster={posterUrl}
          preload="metadata"
          playsInline
          autoPlay
          loop
          muted
          onLoadedData={handleLoadedData}
          onCanPlay={handleCanPlay}
          onError={handleError}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-1000 ease-out",
            isLoading ? "opacity-0" : "opacity-80 grayscale hover:grayscale-0"
          )}
        />
      )}

      {/* Overlay status indicators */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px] text-emerald-400">
          <Loader2 className="animate-spin mb-2 text-emerald-400" size={28} />
          <span className="font-mono text-[10px] tracking-widest uppercase">INITIALIZING_STREAM_0{currentSourceIndex + 1}...</span>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/85 text-center text-rose-400 space-y-4">
          <AlertTriangle className="text-rose-500 animate-pulse" size={32} />
          <div className="space-y-1">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider">Stream Connection Failure</h4>
            <p className="font-sans text-[11px] text-zinc-400 font-light max-w-[220px]">
              The remote video streams failed to establish a connection.
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 font-mono text-[9px] tracking-widest uppercase rounded-sm transition-all cursor-pointer"
          >
            <RotateCcw size={10} />
            <span>RETRY_CONNECTION()</span>
          </button>
        </div>
      )}

      {/* Subtle Bottom Control Status Strip */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="font-mono text-[8px] tracking-widest text-white/50 bg-black/65 px-2 py-1 rounded-sm border border-white/5 uppercase">
          {hasError ? 'OFFLINE' : isLoading ? 'BUFFERING' : `LIVE_STREAM_0${currentSourceIndex + 1}`}
        </span>
      </div>

    </div>
  );
}
