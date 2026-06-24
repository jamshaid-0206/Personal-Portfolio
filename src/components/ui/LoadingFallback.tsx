import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Cpu, Wifi, Activity, Check } from 'lucide-react';
import { MatrixRain } from '../portfolio/MatrixRain';

interface LoadingFallbackProps {
  onComplete?: () => void;
}

const BOOT_LOGS = [
  { text: "INIT HOST: e8cd0aab-25be-4d56-be19-ee90d36212e5", delay: 100, icon: Cpu },
  { text: "ESTABLISHING REVERSE PROXY ON PORT 3000...", delay: 250, icon: Wifi },
  { text: "LOADING GRAPHICS ENGINE: CANVAS_2D_60FPS...", delay: 350, icon: Activity },
  { text: "COMPILING PRESET STYLES (TAILWIND_V4_AOT)...", delay: 500, icon: Shield },
  { text: "AUTHORIZING PROFILE: JAMSHAID_GHAFOOR", delay: 650, icon: Check },
  { text: "DOCKER RUNTIME BINDING: COMPLETE", delay: 750, icon: Check },
  { text: "BOOSTRAPPING MATRIX PARALLAX INTERFACE...", delay: 850, icon: Terminal },
];

export function LoadingFallback({ onComplete }: LoadingFallbackProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentLogIdx, setCurrentLogIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [glitchText, setGlitchText] = useState("INITIALIZING");

  // Glitch effect on header text
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const phrases = ["INITIALIZING", "BOOTING_SYSTEM", "SECURE_CONN_3000", "LOAD_ENV_PROD", "READY_TO_BOOT"];
      setGlitchText(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 400);

    return () => clearInterval(glitchInterval);
  }, []);

  // Log outputs sequence
  useEffect(() => {
    if (currentLogIdx < BOOT_LOGS.length) {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, `[ OK ] ${BOOT_LOGS[currentLogIdx].text}`]);
        setCurrentLogIdx((prev) => prev + 1);
      }, BOOT_LOGS[currentLogIdx].delay);
      return () => clearTimeout(timer);
    }
  }, [currentLogIdx]);

  // Smooth loading bar progression
  useEffect(() => {
    const start = Date.now();
    const duration = 2800; // Total loading time (under 3s for fast punchy loading)

    const updateProgress = () => {
      const elapsed = Date.now() - start;
      const calculatedProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(calculatedProgress);

      if (calculatedProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          setIsDone(true);
          if (onComplete) {
            onComplete();
          }
        }, 400);
      }
    };

    requestAnimationFrame(updateProgress);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black z-[99999] overflow-hidden flex flex-col justify-between p-6 sm:p-12 font-mono text-emerald-400 select-none">
      
      {/* Background Matrix cascade layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <MatrixRain opacity={1} />
      </div>

      {/* Grid Scan Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px]" />

      {/* 1. Header Area: Status */}
      <div className="relative z-20 flex justify-between items-center border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-2">
          <Terminal className="animate-pulse text-emerald-400 shrink-0" size={16} />
          <span className="text-[10px] sm:text-xs tracking-widest uppercase font-bold animate-pulse">
            CORE_LOADER_V2.10 // {glitchText}
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] tracking-widest text-emerald-500/60 uppercase">
          UTC: {new Date().toISOString().slice(11, 19)}
        </span>
      </div>

      {/* 2. Central Area: Active Typewriter Logging Terminal & Hologram */}
      <div className="relative z-20 flex-1 flex flex-col justify-center max-w-2xl w-full mx-auto my-8 gap-6 text-left">
        
        {/* Glowing HUD Hologram Indicator */}
        <div className="flex flex-col items-center justify-center text-center space-y-3 py-6 relative">
          <div className="relative">
            {/* Spinning holographic rings */}
            <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-[spin_6s_linear_infinite]" />
            <div className="absolute -inset-2 rounded-full border border-dashed border-emerald-400/10 animate-[spin_10s_linear_infinite_reverse]" />
            <div className="w-16 h-16 rounded-full bg-emerald-950/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <Cpu className="animate-pulse" size={24} />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-sm tracking-[0.25em] text-white uppercase font-light">
              JAMSHAID GHAFOOR
            </h1>
            <p className="text-[9px] tracking-widest text-emerald-500/70 uppercase">
              // SYSTEM DIAGNOSTICS & INITIALIZATION MODULE
            </p>
          </div>
        </div>

        {/* Real-time Logs Console */}
        <div className="bg-zinc-950/80 border border-emerald-500/20 rounded-sm p-4 h-48 overflow-y-auto flex flex-col gap-1.5 scrollbar-thin scrollbar-thumb-emerald-950/50">
          {logs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] sm:text-xs tracking-wider leading-relaxed flex items-start gap-1 text-emerald-400/90"
            >
              <span className="text-emerald-500 font-bold shrink-0">&gt;</span>
              <span>{log}</span>
            </motion.div>
          ))}
          {currentLogIdx < BOOT_LOGS.length && (
            <div className="text-[10px] sm:text-xs tracking-wider flex items-center gap-1 text-emerald-300">
              <span className="text-emerald-400 font-bold animate-pulse">&gt;</span>
              <span className="animate-pulse">RUNNING DIAGNOSTICS...</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Footer Area: Progress Bar */}
      <div className="relative z-20 space-y-4 max-w-2xl w-full mx-auto">
        <div className="flex justify-between items-end text-[10px] tracking-widest uppercase">
          <span>PROGRESS_SEQUENCER</span>
          <span className="text-emerald-300 font-bold">{Math.round(progress)}%</span>
        </div>
        
        {/* Progress tracks */}
        <div className="w-full h-2.5 bg-zinc-950 border border-emerald-500/20 rounded-full overflow-hidden p-0.5">
          <div 
            className="h-full bg-emerald-500 rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_#10b981]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[8px] sm:text-[9px] text-emerald-500/50 tracking-widest uppercase pt-2">
          <span>HOST: 0.0.0.0:3000</span>
          <span>STABILITY: SECURE [100%]</span>
        </div>
      </div>

    </div>
  );
}
