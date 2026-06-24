import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertTriangle, Loader2, Video } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProjectDemoVideoProps {
  videoUrl?: string;
  posterUrl?: string;
  title?: string;
}

export function ProjectDemoVideo({ videoUrl, posterUrl, title = "Project Demonstration" }: ProjectDemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // If there's no videoUrl, don't render
  if (!videoUrl) return null;

  const isIframe = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com');

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Playback was blocked:", err);
      });
    }
  };

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setHasError(false);
    // Try to auto-play muted loop on successful load
    const video = videoRef.current;
    if (video) {
      video.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setVideoKey((prev) => prev + 1);
  };

  return (
    <div className="w-full space-y-6 select-none" id="demo-video-showcase">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-3 gap-2">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs tracking-widest uppercase">
          <Video size={14} className="animate-pulse" />
          <span>[ PROJECT_DEMO_VIDEO_STREAM ]</span>
        </div>
        <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">
          // STATUS: {hasError ? 'DISCONNECTED' : isLoading ? 'BUFFERING' : 'ONLINE_STREAM_01'}
        </span>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-zinc-950 border border-border shadow-2xl group">
        {isIframe ? (
          // IFRAME YT PLAYER EMBED
          <iframe
            src={`${videoUrl}?autoplay=1&mute=1&loop=1&playlist=${videoUrl.split('/').pop()?.split('?')[0]}`}
            title={`${title} Demonstration Stream`}
            className="w-full h-full border-0 opacity-90 grayscale-[40%] hover:grayscale-0 transition-all duration-700"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            referrerPolicy="no-referrer"
          />
        ) : (
          // NATIVE CONTROLLED VIDEO PLAYER
          <>
            {/* Fallback image shown during loading/error */}
            {(isLoading || hasError) && posterUrl && (
              <img
                src={posterUrl}
                alt={`${title} Fallback Presentation Poster`}
                className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale blur-[2px]"
                loading="eager"
              />
            )}

            {!hasError && (
              <video
                key={videoKey}
                ref={videoRef}
                src={videoUrl}
                poster={posterUrl}
                preload="metadata"
                playsInline
                autoPlay
                loop
                muted={isMuted}
                onLoadedData={handleLoadedData}
                onCanPlay={handleCanPlay}
                onError={handleError}
                onClick={handlePlayPause}
                className={cn(
                  "w-full h-full object-cover transition-all duration-1000 cursor-pointer",
                  isLoading ? "opacity-0 scale-102" : "opacity-80 grayscale hover:grayscale-0 scale-100"
                )}
              />
            )}

            {/* Custom Interactive Floating Video Controller Bar */}
            {!isLoading && !hasError && (
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlayPause}
                    className="p-2 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                  <button
                    onClick={handleToggleMute}
                    className="p-2 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                  >
                    {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] tracking-widest text-zinc-400 bg-black/50 px-2 py-1 rounded-sm border border-white/5 uppercase">
                    live.loop_01
                  </span>
                  <button
                    onClick={handleFullscreen}
                    className="p-2 rounded-sm bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    aria-label="Maximize to Fullscreen"
                  >
                    <Maximize size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Loading Indicator Spinner Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[1px] text-emerald-400 z-20">
                <Loader2 className="animate-spin mb-2 text-emerald-400" size={28} />
                <span className="font-mono text-[10px] tracking-widest uppercase">SYNCHRONIZING_MEDIA_FEED...</span>
              </div>
            )}

            {/* Error Overlay with Fallback & Retry Trigger */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/90 text-center text-rose-400 space-y-4 z-20">
                <AlertTriangle className="text-rose-500 animate-pulse" size={32} />
                <div className="space-y-1">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider">Video Stream Connection Interrupted</h4>
                  <p className="font-sans text-[11px] text-zinc-400 font-light max-w-sm">
                    Unable to stream the live case demonstration clip. Use the retry handle to establish connection.
                  </p>
                </div>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 font-mono text-[9px] tracking-widest uppercase rounded-sm transition-all cursor-pointer"
                >
                  <RotateCcw size={10} />
                  <span>RE-TRIGGER_CONNECT()</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
