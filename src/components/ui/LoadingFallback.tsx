import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Zap, Sparkles } from 'lucide-react';
import { playExplosionSweep } from '../../lib/audio';

interface LoadingFallbackProps {
  onComplete?: () => void;
}

interface Point {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  angle?: number;
  speed?: number;
  friction?: number;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
}

export function LoadingFallback({ onComplete }: LoadingFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [energy, setEnergy] = useState(0);
  const [stage, setStage] = useState<'single' | 'drawing' | 'assembled' | 'exploding'>('single');
  const [isHovered, setIsHovered] = useState(false);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2, lastX: window.innerWidth / 2, lastY: window.innerHeight / 2, moved: false });
  const [glitchText, setGlitchText] = useState("CORE_INIT");

  const stageRef = useRef<'single' | 'drawing' | 'assembled' | 'exploding'>('single');
  const onCompleteRef = useRef(onComplete);

  // Keep onCompleteRef updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Helper to change stage on both ref and state
  const changeStage = (newStage: 'single' | 'drawing' | 'assembled' | 'exploding') => {
    stageRef.current = newStage;
    setStage(newStage);
  };

  useEffect(() => {
    const textInterval = setInterval(() => {
      const phrases = ["PORT_3000_ESTABLISHED", "ENERGY_RESONANCE_OK", "ALIGNING_VECTORS", "GRID_MATRIX_ACTIVE", "AWAITING_EXPLOSION"];
      setGlitchText(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 1200);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive sizing
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Interactive mouse and touch trackers
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moved = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.moved = true;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.moved = true;
      }
    };

    const handleMouseDownClick = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.moved = true;
    };

    const handleCanvasClick = () => {
      if (stageRef.current === 'assembled') {
        changeStage('exploding');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('mousedown', handleMouseDownClick);
    canvas.addEventListener('click', handleCanvasClick);

    // Automated failsafe timer to automatically start compiling after 3 seconds of inactivity
    const failsafeTimer = setTimeout(() => {
      if (!mouseRef.current.moved) {
        mouseRef.current.moved = true;
      }
    }, 3000);

    // Initial state setup
    let currentEnergy = 0;
    const logoPoints: Point[] = [];
    const trailParticles: TrailParticle[] = [];
    
    // Generate the "JG" logo point cloud at the center
    const cx = width / 2;
    const cy = height / 2;
    const sizeScale = Math.min(width, height) > 600 ? 1 : 0.75;

    const generateLogo = () => {
      logoPoints.length = 0;
      const logoScaleX = 90 * sizeScale;
      const logoScaleY = 100 * sizeScale;

      // Draw "J" path: line from top right, going down, then curves left and up
      // J is on the left side: offset center x by -70
      const jcx = cx - 65 * sizeScale;
      const jcy = cy;

      // Vertical stem of J
      for (let y = -70; y < 30; y += 7) {
        logoPoints.push({
          x: cx + (Math.random() - 0.5) * 400,
          y: cy + (Math.random() - 0.5) * 400,
          targetX: jcx + 30 * sizeScale,
          targetY: jcy + y * sizeScale,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.8 + 1,
          alpha: 0,
          color: 'rgba(16, 185, 129, 0.85)' // Emerald-500
        });
      }
      // Curve of J (bottom left)
      for (let angle = 0; angle <= Math.PI; angle += 0.15) {
        const rx = 30 * sizeScale;
        const ry = 30 * sizeScale;
        logoPoints.push({
          x: cx + (Math.random() - 0.5) * 400,
          y: cy + (Math.random() - 0.5) * 400,
          targetX: jcx + 30 * sizeScale - rx + Math.cos(angle) * rx,
          targetY: jcy + 30 * sizeScale + Math.sin(angle) * ry,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.8 + 1,
          alpha: 0,
          color: 'rgba(52, 211, 153, 0.85)' // Emerald-400
        });
      }

      // Draw "G" path: nearly closed circle with an inner shelf
      // G is on the right side: offset center x by +65
      const gcx = cx + 65 * sizeScale;
      const gcy = cy;
      const gRadius = 55 * sizeScale;

      // Outer C curve of G
      for (let angle = Math.PI * 0.2; angle <= Math.PI * 1.8; angle += 0.08) {
        logoPoints.push({
          x: cx + (Math.random() - 0.5) * 400,
          y: cy + (Math.random() - 0.5) * 400,
          targetX: gcx + Math.cos(angle) * gRadius,
          targetY: gcy + Math.sin(angle) * gRadius,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.8 + 1,
          alpha: 0,
          color: 'rgba(16, 185, 129, 0.85)'
        });
      }
      // Horizontal bar of G
      for (let x = 0; x <= 35; x += 5) {
        logoPoints.push({
          x: cx + (Math.random() - 0.5) * 400,
          y: cy + (Math.random() - 0.5) * 400,
          targetX: gcx + gRadius - x * sizeScale,
          targetY: gcy + 12 * sizeScale,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.8 + 1,
          alpha: 0,
          color: 'rgba(52, 211, 153, 0.85)'
        });
      }
      // Vertical inner stem of G
      for (let y = 12; y <= 30; y += 6) {
        logoPoints.push({
          x: cx + (Math.random() - 0.5) * 400,
          y: cy + (Math.random() - 0.5) * 400,
          targetX: gcx + gRadius - 35 * sizeScale,
          targetY: gcy + y * sizeScale,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.8 + 1,
          alpha: 0,
          color: 'rgba(16, 185, 129, 0.85)'
        });
      }
    };

    generateLogo();

    // Trigger the actual explosion animation sequence
    let explosionProgress = 0;
    let explosionTriggered = false;

    const triggerExplosion = () => {
      explosionTriggered = true;
      playExplosionSweep(0.06);
      // Transform all logo points into ultra-fast outward exploding vectors
      logoPoints.forEach((p) => {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = Math.random() * 18 + 8;
        p.vx = (dx / dist) * force + (Math.random() - 0.5) * 10;
        p.vy = (dy / dist) * force + (Math.random() - 0.5) * 10;
        p.friction = 0.98;
        p.size = Math.random() * 3 + 2;
      });

      // Spawn 1500 additional background explosion spark particles for raw atmospheric depth
      for (let i = 0; i < 1500; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 25 + 5;
        logoPoints.push({
          x: cx,
          y: cy,
          targetX: 0,
          targetY: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 0.5,
          alpha: 1,
          friction: Math.random() * 0.05 + 0.93,
          color: Math.random() > 0.4 ? 'rgba(52, 211, 153, 0.9)' : 'rgba(16, 185, 129, 0.7)'
        });
      }
    };

    // Smooth single glowing particle position (initially centered)
    let singleX = cx;
    let singleY = cy;

    const renderLoop = () => {
      // Clear canvas with a very soft trail overlay to give glowing shadows
      ctx.fillStyle = 'rgba(0, 0, 0, 0.09)';
      ctx.fillRect(0, 0, width, height);

      // 1. STAGE: SINGLE PARTICLE
      if (stageRef.current === 'single') {
        // Interpolate single glowing particle towards mouse cursor smoothly
        const dx = mouseRef.current.x - singleX;
        const dy = mouseRef.current.y - singleY;
        singleX += dx * 0.12;
        singleY += dy * 0.12;

        // Draw radial glowing atmosphere behind the single particle
        const glowRad = ctx.createRadialGradient(singleX, singleY, 0, singleX, singleY, 18);
        glowRad.addColorStop(0, 'rgba(52, 211, 153, 1)');
        glowRad.addColorStop(0.3, 'rgba(16, 185, 129, 0.45)');
        glowRad.addColorStop(1, 'rgba(16, 185, 129, 0)');
        ctx.fillStyle = glowRad;
        ctx.beginPath();
        ctx.arc(singleX, singleY, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(singleX, singleY, 3, 0, Math.PI * 2);
        ctx.fill();

        // If user starts moving mouse, transition to the assembly "drawing" stage
        if (mouseRef.current.moved) {
          changeStage('drawing');
        }
      }

      // 2. STAGE: DRAWING & CONNECTING ENERGY MATRIX
      if (stageRef.current === 'drawing' || stageRef.current === 'assembled') {
        // Increment global energy smoothly
        if (stageRef.current === 'drawing') {
          currentEnergy += 0.35; // Steadily build up to 100% in 4-5s
          if (currentEnergy >= 100) {
            currentEnergy = 100;
            changeStage('assembled');
          }
          setEnergy(Math.floor(currentEnergy));
        }

        // Draw active connecting lines between mouse and logo target point coordinate cloud
        if (stageRef.current === 'drawing') {
          logoPoints.forEach((p, idx) => {
            // Draw lines to a fraction of the points to prevent visual overload
            if (idx % 12 === 0) {
              const dx = mouseRef.current.x - p.targetX;
              const dy = mouseRef.current.y - p.targetY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 260 * sizeScale) {
                const lineAlpha = (1 - dist / (260 * sizeScale)) * 0.18;
                ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
              }
            }
          });
        }

        // Emit cursor trail sparkles dynamically
        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const lmx = mouseRef.current.lastX;
        const lmy = mouseRef.current.lastY;
        const mouseVel = Math.sqrt((mx - lmx) * (mx - lmx) + (my - lmy) * (my - lmy));

        if (mouseVel > 1.5 && Math.random() < 0.6) {
          trailParticles.push({
            x: mx,
            y: my,
            vx: (Math.random() - 0.5) * 3 + (lmx - mx) * 0.1,
            vy: (Math.random() - 0.5) * 3 + (lmy - my) * 0.1,
            size: Math.random() * 2.5 + 1,
            color: Math.random() > 0.5 ? 'rgba(52, 211, 153, 0.85)' : 'rgba(16, 185, 129, 0.6)',
            alpha: 1,
            decay: Math.random() * 0.03 + 0.015
          });
        }

        // Update & Render Cursor Trails
        for (let i = trailParticles.length - 1; i >= 0; i--) {
          const t = trailParticles[i];
          t.x += t.vx;
          t.y += t.vy;
          t.alpha -= t.decay;

          if (t.alpha <= 0) {
            trailParticles.splice(i, 1);
            continue;
          }

          ctx.fillStyle = t.color;
          ctx.globalAlpha = t.alpha;
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1.0; // Reset alpha

        // Update & Draw Logo Points with magnetic spring-like attraction
        logoPoints.forEach((p) => {
          // Progress parameter (0 to 1) representing assembly ratio
          const assembleProgress = currentEnergy / 100;
          
          // Interpolate current target positions as function of time
          const targetX = p.targetX;
          const targetY = p.targetY;

          const dx = targetX - p.x;
          const dy = targetY - p.y;
          
          // Magnetic alignment pull force
          const pullStrength = 0.04 + assembleProgress * 0.08;
          p.x += dx * pullStrength;
          p.y += dy * pullStrength;
          p.alpha = Math.min(assembleProgress * 1.2, 0.95);

          // Render individual point cloud dot
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Subtle neon light lines joining adjacent point neighbors for grid feel
          if (stageRef.current === 'assembled' && Math.random() < 0.04) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size + 1, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Atmospheric glowing core behind assembled logo
        if (stageRef.current === 'assembled') {
          const mainGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140 * sizeScale);
          mainGlow.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
          mainGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = mainGlow;
          ctx.beginPath();
          ctx.arc(cx, cy, 140 * sizeScale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. STAGE: THE EXPLOSION FINALE
      if (stageRef.current === 'exploding') {
        if (!explosionTriggered) {
          triggerExplosion();
        }
        explosionProgress += 1;

        logoPoints.forEach((p) => {
          // Physics equations with high friction decay
          p.x += p.vx;
          p.y += p.vy;
          if (p.friction) {
            p.vx *= p.friction;
            p.vy *= p.friction;
          }
          p.alpha -= 0.012; // slow fade-out

          if (p.alpha > 0) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        ctx.globalAlpha = 1.0; // Reset alpha

        // Peak flash expansion covers viewport to trigger screen handover
        if (explosionProgress >= 75) {
          cancelAnimationFrame(animationFrameId);
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return;
        }
      }

      // Retain previous coordinates for precise velocity computing
      mouseRef.current.lastX = mouseRef.current.x;
      mouseRef.current.lastY = mouseRef.current.y;

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mousedown', handleMouseDownClick);
      canvas.removeEventListener('click', handleCanvasClick);
      clearTimeout(failsafeTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleExplodeClick = () => {
    if (stageRef.current === 'assembled') {
      changeStage('exploding');
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-black z-[99999] overflow-hidden flex flex-col justify-between p-6 md:p-12 font-mono text-emerald-400 select-none cursor-crosshair"
    >
      {/* Absolute high-perf canvas container */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block z-0" 
      />

      {/* Futuristic Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] opacity-40" />

      {/* Core HUD HUD Interface overlay */}
      <div className="relative z-20 flex justify-between items-center border-b border-emerald-500/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] md:text-xs tracking-[0.25em] font-light text-zinc-400 uppercase">
            JG_MULTIVERSE_HYPERDRIVE // {glitchText}
          </span>
        </div>
        <span className="text-[9px] md:text-[10px] tracking-widest text-zinc-500 uppercase">
          SECURE_CONN_3000 // LOC: {new Date().toISOString().slice(11, 19)}
        </span>
      </div>

      {/* Interactive Floating Guidelines text overlays */}
      <div className="relative z-20 flex-1 flex flex-col justify-end items-center mb-16 text-center select-none pointer-events-none">
        <AnimatePresence mode="wait">
          {stage === 'single' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2 max-w-md"
            >
              <p className="text-xs tracking-[0.3em] text-white uppercase font-light leading-relaxed">
                MOVE CURSOR OR TAP TO IGNITE CORE
              </p>
              <p className="text-[10px] tracking-widest text-emerald-500/50 uppercase">
                // system is offline. drag or tap to gather localized energy cells.
              </p>
            </motion.div>
          )}

          {stage === 'drawing' && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-center gap-4">
                <span className="text-zinc-500 text-xs">// CELL_CONN_RATIO:</span>
                <span className="text-white text-lg font-bold font-mono tracking-widest min-w-[70px] text-right">
                  {energy}%
                </span>
              </div>
              <div className="w-48 h-1 bg-zinc-950 border border-emerald-500/10 rounded-full overflow-hidden p-0.5 mx-auto">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-75 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  style={{ width: `${energy}%` }}
                />
              </div>
              <p className="text-[9px] tracking-widest text-zinc-500 uppercase">
                DRAWING SEED COORDS FOR QUANTUM LOGO ASSEMBLY
              </p>
            </motion.div>
          )}

          {stage === 'assembled' && (
            <motion.div
              key="assembled"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4 pointer-events-auto cursor-pointer group"
              onClick={handleExplodeClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Pulsing button */}
              <button 
                type="button"
                className="px-6 py-3 border border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-mono text-xs tracking-[0.3em] uppercase rounded-sm transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.25)] flex items-center gap-2.5 mx-auto"
              >
                <Zap size={12} className="animate-pulse" />
                <span>ENTER_MULTIVERSE.sh</span>
                <Sparkles size={12} className="group-hover:rotate-12 transition-transform" />
              </button>
              <p className="text-[10px] tracking-widest text-white/50 uppercase leading-relaxed max-w-sm mx-auto">
                ENERGY CONNECTED! CLICK CORE OR BUTTON TO TRIGGER LOGO RUPTURE SEQUENCER
              </p>
            </motion.div>
          )}

          {stage === 'exploding' && (
            <motion.div
              key="exploding"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-1"
            >
              <h2 className="text-white text-lg tracking-[0.5em] uppercase font-extralight animate-pulse">
                SYS_DIMENSION_SHIFTING
              </h2>
              <p className="text-[9px] tracking-widest text-emerald-400/60 uppercase">
                STREAMING COGNITIVE SUB-PROCESSES INTO VIRTUAL SCREEN SPACE
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom telemetry overlay */}
      <div className="relative z-20 flex justify-between items-center border-t border-emerald-500/10 pt-4 text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-widest">
        <span>STABILITY: SECURE [100%]</span>
        <span>PROD_HOST_CONTAINER: 3000</span>
      </div>
    </div>
  );
}
