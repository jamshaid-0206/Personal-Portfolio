import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface MatrixRainProps {
  opacity?: number;
}

export function MatrixRain({ opacity = 1 }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Matrix settings
    const fontSizeBase = 12;
    const fontName = 'monospace';
    let columns = Math.ceil(width / 14);

    interface RainColumn {
      y: number;
      speed: number;
      fontSize: number;
      opacity: number;
      isBright: boolean;
      chars: string[];
      headColor: string;
      trailColor: string;
    }

    // Glyph pools
    const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const symbols = "$#@%&*+=?@_";
    const alphabet = (katakana + latin + symbols).split("");

    const generateColumn = (): RainColumn => {
      // Determine depth layer (0 = background/small/dark, 1 = foreground/large/bright)
      const depth = Math.random();
      
      let fontSize = fontSizeBase;
      let speed = Math.random() * 0.4 + 0.3; // standard background speed
      let streamOpacity = 0.15 + depth * 0.4;
      let headColor = '#34d399'; // emerald-400
      let trailColor = '#065f46'; // emerald-800

      if (depth > 0.75) {
        // Foreground stream
        fontSize = fontSizeBase + 3;
        speed = Math.random() * 0.6 + 0.8;
        headColor = '#10b981'; // emerald-500
        trailColor = '#047857'; // emerald-700
      } else if (depth < 0.3) {
        // Distant background stream
        fontSize = fontSizeBase - 3;
        speed = Math.random() * 0.2 + 0.15;
        headColor = '#a7f3d0'; // emerald-200
        trailColor = '#022c22'; // emerald-950
      }

      return {
        y: Math.random() * -120, // initial offset off-screen
        speed,
        fontSize,
        opacity: streamOpacity,
        isBright: Math.random() > 0.8,
        chars: [],
        headColor,
        trailColor
      };
    };

    let rainColumns = Array.from({ length: columns }, generateColumn);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      
      const newColumns = Math.ceil(width / 14);
      if (newColumns > columns) {
        const extra = Array.from({ length: newColumns - columns }, generateColumn);
        rainColumns = [...rainColumns, ...extra];
      } else if (newColumns < columns) {
        rainColumns = rainColumns.slice(0, newColumns);
      }
      columns = newColumns;
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    // Delta time management to make code frame-rate independent
    let lastTime = 0;
    const targetFPS = 30; // Matrix rain moves best around 30 FPS
    const frameInterval = 1000 / targetFPS;
    let accumulatedTime = 0;

    const draw = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      accumulatedTime += deltaTime;

      if (accumulatedTime >= frameInterval) {
        // semi-transparent black fade overlay for trailing tails
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < columns; i++) {
          const col = rainColumns[i];
          const x = i * 14;
          const yPixel = col.y * col.fontSize;

          // Update character array to create organic shifting characters
          if (Math.random() > 0.85 || col.chars.length === 0) {
            const nextChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            col.chars.push(nextChar);
            if (col.chars.length > 12) {
              col.chars.shift();
            }
          }

          if (yPixel >= 0 && yPixel < height + col.fontSize * 5) {
            ctx.font = `${col.fontSize}px ${fontName}`;
            ctx.shadowBlur = col.isBright ? 6 : 0;
            ctx.shadowColor = col.headColor;

            // Draw character streams with trailing tail gradient
            for (let c = 0; c < col.chars.length; c++) {
              const charY = yPixel - c * col.fontSize;
              if (charY < 0 || charY > height) continue;

              const isHead = c === col.chars.length - 1;
              
              if (isHead) {
                ctx.fillStyle = col.headColor;
                ctx.shadowBlur = col.isBright ? 8 : 0;
              } else {
                ctx.fillStyle = col.trailColor;
                ctx.shadowBlur = 0;
              }

              // Apply dynamic opacity layers to simulate authentic 3D streams
              ctx.globalAlpha = col.opacity * (1 - (col.chars.length - 1 - c) / col.chars.length);
              ctx.fillText(col.chars[c], x, charY);
            }
          }

          // Move stream downward by its individual speed delta
          col.y += col.speed;

          // Recurrent reset if a stream falls below viewport boundaries
          if (col.y * col.fontSize > height && Math.random() > 0.98) {
            rainColumns[i] = generateColumn();
            rainColumns[i].y = 0;
          }
        }
        
        ctx.globalAlpha = 1.0; // reset global opacity
        accumulatedTime = 0;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <div 
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-black via-zinc-950 to-black"
        style={{ opacity }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none select-none"
      style={{ opacity }}
    />
  );
}
