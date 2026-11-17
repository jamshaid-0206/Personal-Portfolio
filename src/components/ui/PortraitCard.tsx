import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

interface PortraitCardProps {
  name: string;
  role: string;
}

/**
 * Stylish portrait: animated gradient ring, 3D tilt + glare that follow the
 * pointer, scroll parallax, and floating glass badges. All motion is
 * transform/opacity only and disabled for reduced-motion users.
 */
export function PortraitCard({ name, role }: PortraitCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });
  const transform = useMotionTemplate`perspective(1100px) rotateX(${srx}deg) rotateY(${sry}deg)`;
  const gx = useMotionValue(50);
  const gy = useMotionValue(30);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 55%)`;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 12);
    rx.set(-(py - 0.5) * 12);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const float = (delay: number) =>
    reduce ? {} : { animate: { y: [0, -8, 0] }, transition: { duration: 5, repeat: Infinity, ease: 'easeInOut' as const, delay } };

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
      {/* ambient glow */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[48px] bg-[radial-gradient(closest-side,rgba(16,185,129,0.35),transparent)] blur-2xl" />

      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { transform }}
        className="group relative rounded-[32px] p-[2px] will-change-transform"
      >
        {/* animated gradient ring */}
        <div className="portrait-ring pointer-events-none absolute inset-0 rounded-[32px]" />

        <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] bg-zinc-900">
          <motion.img
            src="/images/jamshaid-1000.webp"
            srcSet="/images/jamshaid-640.webp 640w, /images/jamshaid-1000.webp 1000w"
            sizes="(min-width: 1024px) 40vw, 90vw"
            alt={`${name}, ${role}`}
            width={1000}
            height={1250}
            decoding="async"
            style={reduce ? undefined : { scale: imgScale, y: imgY }}
            className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 group-hover:saturate-[1.1]"
          />
          {/* colour grade: tie the maroon backdrop into the site palette */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(16,185,129,0.18)_0%,transparent_35%,transparent_60%,rgba(3,5,7,0.85)_100%)]" />
          <motion.div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: glare }} />

          {/* name plate */}
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-white">
            <div>
              <div className="text-2xl font-semibold leading-tight tracking-[-0.03em] md:text-3xl">{name}</div>
              <div className="mt-1 text-sm text-white/75">{role}</div>
            </div>
            <span className="shrink-0 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">PK · GMT+5</span>
          </div>
        </div>
      </motion.div>

      {/* floating glass badges */}
      <motion.div
        {...float(0)}
        className="absolute left-3 top-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3.5 py-2 text-xs font-medium text-white shadow-xl lg:-left-6"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        Available for work
      </motion.div>
      <motion.div
        {...float(1.2)}
        className="absolute right-3 top-[66%] rounded-2xl lg:top-[38%] border border-white/15 bg-black/55 px-4 py-3 text-white shadow-xl lg:-right-8"
      >
        <div className="text-2xl font-semibold leading-none tracking-[-0.04em]">2+ yrs</div>
        <div className="mt-1 text-[11px] text-white/70">building for the web</div>
      </motion.div>
      <motion.div
        {...float(2.4)}
        className="absolute bottom-24 left-3 hidden items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-3 py-2 text-[11px] font-medium text-white shadow-xl sm:inline-flex lg:-left-8"
      >
        {['React', 'Node', 'React Native', 'WordPress'].map((t) => (
          <span key={t} className="rounded-full bg-white/10 px-2 py-0.5">
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
