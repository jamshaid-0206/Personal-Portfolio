import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useEasterEggs } from '../../hooks/useEasterEggs';
import { Terminal, ShieldAlert, Zap, Cpu, Compass, Globe } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export function EasterEggOverlay() {
  const { devModeActive, blackHolePos, universePaused, matrixActive } = useEasterEggs();
  const location = useLocation();
  const [fps, setFps] = useState(60);

  // Dynamically vary the FPS count slightly to look like real-time telemetry
  useEffect(() => {
    if (!devModeActive || universePaused) return;
    const interval = setInterval(() => {
      setFps(Math.floor(Math.random() * 3) + 58);
    }, 800);
    return () => clearInterval(interval);
  }, [devModeActive, universePaused]);

  return (
    <>
      {/* 1. GRAVITATIONAL SINGULARITY: BLACK HOLE RIPPLE EFFECT */}
      <AnimatePresence>
        {blackHolePos && (
          <div 
            className="fixed pointer-events-none select-none z-[999999]"
            style={{ left: blackHolePos.x, top: blackHolePos.y }}
          >
            {/* Massive imploding expanding dark energy ring */}
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: [0, 4.5, 9.5], 
                opacity: [1, 0.85, 0],
                rotate: [0, 180, 360]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="w-16 h-16 -ml-8 -mt-8 rounded-full border-2 border-emerald-500/80 bg-black/95 flex items-center justify-center shadow-[0_0_80px_rgba(16,185,129,0.5),_inset_0_0_40px_rgba(16,185,129,0.3)]"
            >
              <div className="w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
            </motion.div>

            {/* Inward magnetic wave rings */}
            <motion.div
              initial={{ scale: 5, opacity: 0 }}
              animate={{ scale: 0.1, opacity: [0, 0.8, 1, 0] }}
              transition={{ duration: 1.2, ease: "easeIn", repeat: 1 }}
              className="absolute w-24 h-24 -ml-12 -mt-12 rounded-full border border-dashed border-emerald-400/50"
            />
          </div>
        )}
      </AnimatePresence>

      {/* 2. DEVELOPER MODE DIAGNOSTIC OVERLAY HUD */}
      <AnimatePresence>
        {devModeActive && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="fixed top-20 left-6 z-[49] w-[260px] bg-black/90 border border-emerald-500/30 rounded-sm p-4 font-mono text-[10px] text-emerald-400 shadow-[0_15px_40px_rgba(0,0,0,0.8)] select-none pointer-events-none"
            id="dev-mode-hud"
          >
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-emerald-400" />
            <div className="absolute top-0 left-0 w-[1px] h-1.5 bg-emerald-400" />
            <div className="absolute bottom-0 right-0 w-1.5 h-[1px] bg-emerald-400" />
            <div className="absolute bottom-0 right-0 w-[1px] h-1.5 bg-emerald-400" />

            <div className="flex items-center gap-1.5 border-b border-emerald-500/10 pb-2 mb-2">
              <Terminal size={11} className="animate-pulse" />
              <span className="font-semibold tracking-[0.2em] text-white">SYS_TELEMETRY_V4</span>
            </div>

            <div className="space-y-1.5 leading-relaxed">
              <div className="flex justify-between">
                <span className="text-zinc-500">GPU_STATUS:</span>
                <span className="text-emerald-300">ACCEL_60HZ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">RENDERER:</span>
                <span className="text-emerald-300">CANVAS_2D_AOT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">PORT:</span>
                <span className="text-emerald-300">3000 // SECURE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ACTIVE_ROUTE:</span>
                <span className="text-white truncate max-w-[130px]">{location.pathname}</span>
              </div>
              <div className="flex justify-between items-center border-t border-emerald-500/5 pt-1.5 mt-1.5">
                <span className="text-zinc-500 flex items-center gap-1"><Cpu size={9} /> COMPILER:</span>
                <span className="text-emerald-300">TSC --NOEMIT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 flex items-center gap-1"><Compass size={9} /> POSITION:</span>
                <span className="text-emerald-300">0.0.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 flex items-center gap-1"><Globe size={9} /> SYSTEM:</span>
                <span className="text-emerald-300">ACTIVE [100%]</span>
              </div>
              <div className="flex justify-between items-center border-t border-emerald-500/5 pt-1.5 mt-1.5 font-bold">
                <span className="text-zinc-400">TELEMETRY_FPS:</span>
                <span className="text-white text-xs">{universePaused ? 'PAUSED' : `${fps} FPS`}</span>
              </div>
            </div>

            <div className="mt-3 border-t border-emerald-500/10 pt-2 flex items-center gap-1.5 text-[8px] text-zinc-500 leading-normal uppercase">
              <ShieldAlert size={10} className="text-emerald-500" />
              <span>double-click logo to collapse dev tools</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
