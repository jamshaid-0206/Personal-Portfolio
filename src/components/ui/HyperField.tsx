import { useEffect, useRef } from 'react';

interface P {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  hue: number;
}

interface Wave {
  x: number;
  y: number;
  r: number;
  life: number;
}

/**
 * Interactive particle network. Particles drift in pseudo-3D, link to near
 * neighbours, swirl around the pointer and get blasted by click shockwaves.
 * Pauses when off-screen or the tab is hidden; DPR capped for speed.
 */
export function HyperField({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    let w = 0;
    let h = 0;
    let parts: P[] = [];
    const waves: Wave[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let visible = true;
    let raf = 0;
    let t = 0;

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(w < 768 ? 45 : 95, Math.floor((w * h) / 12000));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        hue: Math.random() < 0.7 ? 158 : Math.random() < 0.5 ? 190 : 265,
      }));
    };

    const LINK = 120;
    const LINK2 = LINK * LINK;

    const frame = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);

      // Update
      for (const p of parts) {
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 220 * 220) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / 220) * 0.6 * p.z;
            // swirl + slight pull
            p.vx += (-dy / d) * f * 0.35 + (dx / d) * f * 0.06;
            p.vy += (dx / d) * f * 0.35 + (dy / d) * f * 0.06;
          }
        }
        for (const wv of waves) {
          const dx = p.x - wv.x;
          const dy = p.y - wv.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          if (Math.abs(d - wv.r) < 40) {
            const f = 3.2 * wv.life * p.z;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.vx += Math.sin(t * 0.004 + p.y * 0.01) * 0.012;
        p.vy += Math.cos(t * 0.004 + p.x * 0.01) * 0.012;
        p.x += p.vx + 0.12 * p.z;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }

      // Links — bucketed by alpha so the whole network is drawn in a few stroke() calls
      const buckets: number[][] = [[], [], [], []];
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const dx = a.x - b.x;
          if (dx > LINK || dx < -LINK) continue;
          const dy = a.y - b.y;
          if (dy > LINK || dy < -LINK) continue;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            const o = (1 - d2 / LINK2) * Math.min(a.z, b.z);
            buckets[Math.min(3, (o * 4) | 0)].push(a.x, a.y, b.x, b.y);
          }
        }
      }
      ctx.lineWidth = 1;
      for (let k = 0; k < 4; k++) {
        const seg = buckets[k];
        if (!seg.length) continue;
        ctx.strokeStyle = `rgba(52,211,153,${((k + 0.5) / 4) * 0.35})`;
        ctx.beginPath();
        for (let n = 0; n < seg.length; n += 4) {
          ctx.moveTo(seg[n], seg[n + 1]);
          ctx.lineTo(seg[n + 2], seg[n + 3]);
        }
        ctx.stroke();
      }

      // Pointer links
      if (mouse.active) {
        for (const p of parts) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 180 * 180) {
            ctx.strokeStyle = `rgba(52,211,153,${(1 - d2 / (180 * 180)) * 0.55})`;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const p of parts) {
        const r = p.z * 2.2;
        ctx.fillStyle = `hsla(${p.hue},90%,${55 + p.z * 25}%,${0.35 + p.z * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Shockwaves
      for (let i = waves.length - 1; i >= 0; i--) {
        const wv = waves[i];
        wv.r += 14;
        wv.life *= 0.94;
        ctx.strokeStyle = `rgba(52,211,153,${wv.life * 0.7})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(wv.x, wv.y, wv.r, 0, Math.PI * 2);
        ctx.stroke();
        if (wv.life < 0.03) waves.splice(i, 1);
      }

      if (visible && !reduce) raf = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = mouse.y >= 0 && mouse.y <= r.height;
    };
    const onLeave = () => (mouse.active = false);
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const y = e.clientY - r.top;
      if (y < 0 || y > r.height) return;
      waves.push({ x: e.clientX - r.left, y, r: 0, life: 1 });
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) start();
    });
    io.observe(canvas);
    const onVis = () => {
      visible = !document.hidden;
      if (visible) start();
    };
    const ro = new ResizeObserver(() => seed());

    seed();
    ro.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVis);
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className={`absolute inset-0 w-full h-full ${className}`} aria-hidden="true" />;
}
