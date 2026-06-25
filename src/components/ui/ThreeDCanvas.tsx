import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useTheme } from '../providers/ThemeProvider';

interface Point3D {
  x: number;
  y: number;
  z: number;
  color: string;
}

export function ThreeDCanvas() {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  // Mouse and Scroll tracker state for physics interpolation
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ y: 0, targetY: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current.targetY = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // Normalize mouse coordinates around the center (-1 to 1)
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const updateSize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      setDimensions({ width, height });
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvas);

    // Initialize 3D Quantum Nodes (Holographic Core)
    const nodeCount = 65;
    const nodes: Point3D[] = [];
    const radius = Math.min(width, height) * 0.22;

    // Generate points uniformly on a sphere using Golden Spiral method
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Accentuate some nodes with bright emerald, others with deep forest
      const opacity = 0.3 + Math.random() * 0.7;
      const color = Math.random() > 0.8 
        ? `rgba(52, 211, 153, ${opacity})`  // emerald-400
        : `rgba(16, 185, 129, ${opacity * 0.5})`; // emerald-500

      nodes.push({ x, y, z, color });
    }

    // Interactive Core Orbiting Ring nodes
    const ringCount = 36;
    const ringPoints: Point3D[] = [];
    const ringRadius = radius * 1.45;
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      ringPoints.push({
        x: ringRadius * Math.cos(angle),
        y: 0, // flat flat plane, will rotate
        z: ringRadius * Math.sin(angle),
        color: `rgba(16, 185, 129, ${0.1 + Math.random() * 0.4})`
      });
    }

    // Auto rotation velocities
    let rotX = 0;
    let rotY = 0;
    let rotZ = 0;

    const render = () => {
      // Clear canvas with a very subtle fade to create soft trails
      ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, width, height);

      // Interpolate mouse coordinates (Spring easing logic)
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Interpolate scroll position
      const scroll = scrollRef.current;
      scroll.y += (scroll.targetY - scroll.y) * 0.1;

      // Center coordinates
      const cx = width / 2;
      const cy = height / 2;

      // Adaptive camera distance (Scroll expands/zooms core)
      const zoomFactor = Math.max(0.5, 1 - (scroll.y / 1200));
      const currentRadius = radius * zoomFactor;

      // Update base rotation angles (react to auto + mouse + scroll)
      rotX += 0.003 + mouse.y * 0.005;
      rotY += 0.005 + mouse.x * 0.008;
      rotZ += 0.001;

      // Dynamic Projection helper
      const project = (point: Point3D) => {
        // Rotate on Y axis
        let x1 = point.x * Math.cos(rotY) - point.z * Math.sin(rotY);
        let z1 = point.x * Math.sin(rotY) + point.z * Math.cos(rotY);

        // Rotate on X axis
        let y2 = point.y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = point.y * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Rotate on Z axis
        let x3 = x1 * Math.cos(rotZ) - y2 * Math.sin(rotZ);
        let y3 = x1 * Math.sin(rotZ) + y2 * Math.cos(rotZ);

        // Tilt based on mouse movement coordinates
        const tiltX = mouse.y * 0.25;
        const tiltY = mouse.x * 0.25;

        const xFinal = x3 * Math.cos(tiltY) - z2 * Math.sin(tiltY);
        const zFinal = x3 * Math.sin(tiltY) + z2 * Math.cos(tiltY);
        const yFinal = y3 * Math.cos(tiltX) - zFinal * Math.sin(tiltX);

        // Perspective projection scale
        const fov = 450;
        const scale = fov / (fov + zFinal);
        
        return {
          X: cx + xFinal * scale * zoomFactor,
          Y: cy + yFinal * scale * zoomFactor,
          scale,
          z: zFinal
        };
      };

      // Draw subtle decorative HUD targeting guidelines
      ctx.strokeStyle = isLight ? 'rgba(4, 120, 87, 0.12)' : 'rgba(16, 185, 129, 0.04)';
      ctx.lineWidth = 1;
      
      // Center target crosshair
      ctx.beginPath();
      ctx.arc(cx, cy, currentRadius * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Outer targeting frame
      ctx.beginPath();
      ctx.moveTo(cx - currentRadius * 1.8, cy);
      ctx.lineTo(cx + currentRadius * 1.8, cy);
      ctx.moveTo(cx, cy - currentRadius * 1.8);
      ctx.lineTo(cx, cy + currentRadius * 1.8);
      ctx.stroke();

      // Project all nodes
      const projectedNodes = nodes.map(n => ({
        ...project(n),
        color: n.color
      }));

      // Project outer rings nodes
      const projectedRing = ringPoints.map(p => ({
        ...project(p),
        color: p.color
      }));

      // 1. Draw connecting mesh lines between nodes (Hologram web)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < projectedNodes.length; i++) {
        const p1 = projectedNodes[i];
        if (p1.z > 150) continue; // skip far back lines for realistic occlusion

        // Connect to nearest neighbors
        let connections = 0;
        for (let j = i + 1; j < projectedNodes.length; j++) {
          if (connections > 3) break;
          const p2 = projectedNodes[j];
          
          // Calculate distance in screen coordinates
          const dx = p1.X - p2.X;
          const dy = p1.Y - p2.Y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < radius * 0.75 * zoomFactor) {
            const alpha = (1 - dist / (radius * 0.75 * zoomFactor)) * (isLight ? 0.35 : 0.18) * p1.scale;
            ctx.strokeStyle = isLight ? `rgba(4, 120, 87, ${alpha})` : `rgba(16, 185, 129, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.X, p1.Y);
            ctx.lineTo(p2.X, p2.Y);
            ctx.stroke();
            connections++;
          }
        }
      }

      // 2. Draw Orbiting Outer Rings connecting lines
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      for (let i = 0; i < projectedRing.length; i++) {
        const p = projectedRing[i];
        if (i === 0) {
          ctx.moveTo(p.X, p.Y);
        } else {
          ctx.lineTo(p.X, p.Y);
        }
      }
      ctx.closePath();
      ctx.strokeStyle = isLight ? 'rgba(52, 211, 153, 0.25)' : 'rgba(52, 211, 153, 0.08)';
      ctx.stroke();

      // 3. Draw Nodes (Vertices)
      for (let i = 0; i < projectedNodes.length; i++) {
        const p = projectedNodes[i];
        
        // Size scales with perspective z depth
        const dotSize = Math.max(1.5, 3 * p.scale);
        
        // Node glow aura
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.X, p.Y, dotSize, 0, Math.PI * 2);
        ctx.fill();

        // Highlighting hot-spots
        if (i % 6 === 0) {
          ctx.shadowBlur = isLight ? 6 : 12;
          ctx.shadowColor = '#10b981';
          ctx.fillStyle = isLight ? '#047857' : '#ffffff';
          ctx.beginPath();
          ctx.arc(p.X, p.Y, dotSize * 1.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset shadow
        }
      }

      // 4. Draw Orbiting Satellite Rings dots
      for (let i = 0; i < projectedRing.length; i++) {
        const p = projectedRing[i];
        if (i % 3 === 0) {
          ctx.fillStyle = isLight ? 'rgba(4, 120, 87, 0.55)' : 'rgba(52, 211, 153, 0.4)';
          ctx.beginPath();
          ctx.arc(p.X, p.Y, 2 * p.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Draw Digital Core HUD angle readouts
      ctx.fillStyle = isLight ? 'rgba(4, 120, 87, 0.85)' : 'rgba(16, 185, 129, 0.35)';
      ctx.font = '8px monospace';
      
      // Bottom left coordinate readout
      ctx.fillText(`CAM_LAT: ${rotX.toFixed(4)}`, cx - currentRadius * 1.7, cy + currentRadius * 1.5);
      ctx.fillText(`CAM_LNG: ${rotY.toFixed(4)}`, cx - currentRadius * 1.7, cy + currentRadius * 1.5 + 12);
      ctx.fillText(`CORE_ZOOM_DILATION: ${zoomFactor.toFixed(2)}X`, cx - currentRadius * 1.7, cy + currentRadius * 1.5 + 24);

      // Top right telemetry status
      ctx.fillText(`SYS_RENDER_STREAM: 60FPS`, cx + currentRadius * 0.9, cy - currentRadius * 1.5);
      ctx.fillText(`NODE_DIPOLE: AUTH_ONLINE`, cx + currentRadius * 0.9, cy - currentRadius * 1.5 + 12);

      if (!shouldReduceMotion) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [dimensions, shouldReduceMotion, theme]);

  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 w-full h-full bg-background flex items-center justify-center pointer-events-none select-none">
        <div className="w-48 h-48 rounded-full border border-emerald-500/10 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-emerald-500/20 flex items-center justify-center animate-pulse">
            <div className="w-16 h-16 rounded-full bg-emerald-500/5 border border-emerald-500/30" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full bg-background select-none pointer-events-none"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block opacity-75"
      />
    </div>
  );
}
