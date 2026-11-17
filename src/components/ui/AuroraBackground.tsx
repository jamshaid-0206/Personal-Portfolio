import { cn } from '../../lib/utils';

interface AuroraBackgroundProps {
  className?: string;
  intensity?: 'subtle' | 'vibrant';
}

/**
 * Ambient aurora backdrop.
 * Performance: no CSS `filter: blur()` and no JS animation. Soft edges come from
 * radial-gradients, and motion is a slow CSS transform on GPU-composited layers,
 * so scrolling never forces a full-screen repaint.
 */
export function AuroraBackground({ className, intensity = 'subtle' }: AuroraBackgroundProps) {
  const o = intensity === 'vibrant' ? 1 : 0.8;
  return (
    <div
      id="aurora-background"
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden pointer-events-none select-none z-[-2] w-full h-full', className)}
      style={{ contain: 'strict' }}
    >
      <div
        className="aurora-blob aurora-a"
        style={{ opacity: o, background: 'radial-gradient(closest-side, var(--aurora-1), transparent)' }}
      />
      <div
        className="aurora-blob aurora-b"
        style={{ opacity: o, background: 'radial-gradient(closest-side, var(--aurora-2), transparent)' }}
      />
      <div
        className="aurora-blob aurora-c"
        style={{ opacity: o, background: 'radial-gradient(closest-side, var(--aurora-3), transparent)' }}
      />
    </div>
  );
}
