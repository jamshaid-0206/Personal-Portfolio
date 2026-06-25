import { useEffect, useRef } from 'react';

interface VoicePulseAnalyzerProps {
  isSpeaking: boolean;
}

export function VoicePulseAnalyzer({ isSpeaking }: VoicePulseAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  // Frequency wave multipliers to create a complex organic voice-like wave
  const waveParams = [
    { freq: 0.05, amp: 12, speed: 0.15 },
    { freq: 0.12, amp: 6, speed: -0.25 },
    { freq: 0.25, amp: 3, speed: 0.35 },
    { freq: 0.02, amp: 4, speed: 0.08 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Audio animation loop
    const animate = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const centerY = height / 2;

      // Clear with slight trailing opacity for phosphor ghosting effect
      ctx.fillStyle = 'rgba(9, 9, 11, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle terminal background grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
      ctx.lineWidth = 1;
      
      // Vertical grid lines
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal grid lines
      for (let y = 0; y < height; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw middle baseline (dimmer emerald)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Draw side border brackets for authentic retro aesthetic
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.beginPath();
      ctx.moveTo(10, 4);
      ctx.lineTo(4, 4);
      ctx.lineTo(4, height - 4);
      ctx.lineTo(10, height - 4);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - 10, 4);
      ctx.lineTo(width - 4, 4);
      ctx.lineTo(width - 4, height - 4);
      ctx.lineTo(width - 10, height - 4);
      ctx.stroke();

      // Draw glowing oscilloscope signal line
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#10b981'; // Tailwind emerald-500
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';

      phaseRef.current += 1;

      // Draw wave path across the width
      for (let x = 0; x < width; x++) {
        let y = centerY;

        if (isSpeaking) {
          // Combine multiple sine waves with differing speeds to simulate natural human voice frequencies
          let waveSum = 0;
          waveParams.forEach((wave) => {
            waveSum += Math.sin(x * wave.freq + phaseRef.current * wave.speed) * wave.amp;
          });

          // Soft envelope to taper waves at both horizontal screen edges
          const edgeEnvelope = Math.sin((x / width) * Math.PI);
          y += waveSum * edgeEnvelope;
        } else {
          // Idle state: subtle natural micro-jitter (white noise simulation)
          y += (Math.random() - 0.5) * 0.9;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow for next frame

      // Add a small terminal badge indicating pulse state
      ctx.fillStyle = isSpeaking ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.4)';
      ctx.font = '7px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
      ctx.fillText(
        isSpeaking ? 'ANALOG_VOICE_SPECTRUM: REVERBERATING' : 'ANALOG_VOICE_SPECTRUM: IDLE_SCAN', 
        14, 
        height - 6
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking]);

  return (
    <div className="w-full h-12 bg-zinc-950/90 border-b border-emerald-500/10 relative overflow-hidden select-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
        style={{ imageRendering: 'auto' }}
      />
    </div>
  );
}
