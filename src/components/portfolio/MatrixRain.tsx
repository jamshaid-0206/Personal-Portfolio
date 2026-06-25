import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useTheme } from '../providers/ThemeProvider';

interface MatrixRainProps {
  opacity?: number;
}

export function MatrixRain({ opacity = 1 }: MatrixRainProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
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

    let isPaused = false;
    let isOverridden = false;

    const handlePauseEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      isPaused = customEvent.detail?.paused ?? false;
    };

    const handleOverrideEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      isOverridden = customEvent.detail?.active ?? false;
      if (canvas) {
        canvas.style.opacity = isOverridden ? '0.65' : String(opacity);
        canvas.style.zIndex = isOverridden ? '40' : 'auto';
      }
    };

    window.addEventListener('universe_animation_pause', handlePauseEvent);
    window.addEventListener('matrix_rain_override', handleOverrideEvent);

    // Matrix settings
    const fontSizeBase = 12;
    const fontName = 'monospace';
    const columnSpacing = 20; // Increased spacing from 14 to 20 for cleaner look and ~30% fewer columns (huge rendering speedup!)
    let columns = Math.ceil(width / columnSpacing);

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

    // Developer/Code-themed glyph pools
    const binary = "01010101";
    const syntax = "{}[]();<>+=_-/\\!*&?%^#@~";
    const hex = "ABCDEF0123456789";
    const alphabet = (binary + syntax + hex).split("");

    const generateColumn = (): RainColumn => {
      const depth = Math.random();
      
      let fontSize = fontSizeBase;
      let speed = Math.random() * 0.35 + 0.25; // standard background speed
      let streamOpacity = 0.12 + depth * 0.3; // subtle opacity layers

      let headColor = isLight ? '#059669' : '#ffffff'; // White heads in dark mode look extremely crisp
      let trailColor = isLight ? '#34d399' : '#059669'; // Soft green trails

      if (depth > 0.75) {
        // Foreground stream
        fontSize = fontSizeBase + 2;
        speed = Math.random() * 0.5 + 0.6;
        headColor = isLight ? '#047857' : '#ffffff';
        trailColor = isLight ? '#10b981' : '#10b981';
      } else if (depth < 0.3) {
        // Distant background stream
        fontSize = fontSizeBase - 3;
        speed = Math.random() * 0.15 + 0.12;
        headColor = isLight ? '#065f46' : '#a7f3d0';
        trailColor = isLight ? '#e2e8f0' : '#022c22';
      }

      return {
        y: Math.random() * -100, // initial offset off-screen
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
      
      const newColumns = Math.ceil(width / columnSpacing);
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

    // Performance Optimization: IntersectionObserver to stop drawing when off-screen!
    let isIntersecting = true;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(canvas);

    // Delta time management to make code frame-rate independent
    let lastTime = 0;
    const targetFPS = 24; // Lowered target frame rate slightly for maximum performance (looks even more cinematic!)
    const frameInterval = 1000 / targetFPS;
    let accumulatedTime = 0;

    const draw = (timestamp: number) => {
      // Pause drawing if component is paused or not visible in viewport!
      if (isPaused || !isIntersecting) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      
      accumulatedTime += deltaTime;

      if (accumulatedTime >= frameInterval) {
        // semi-transparent black/white fade overlay for trailing tails
        ctx.fillStyle = isLight ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, width, height);

        for (let i = 0; i < columns; i++) {
          const col = rainColumns[i];
          const x = i * columnSpacing;
          const yPixel = col.y * col.fontSize;

          // Update character array to create organic shifting characters
          if (Math.random() > 0.85 || col.chars.length === 0) {
            const nextChar = alphabet[Math.floor(Math.random() * alphabet.length)];
            col.chars.push(nextChar);
            if (col.chars.length > 10) {
              col.chars.shift();
            }
          }

          if (yPixel >= 0 && yPixel < height + col.fontSize * 5) {
            ctx.font = `${col.fontSize}px ${fontName}`;

            // Draw character streams with trailing tail gradient
            for (let c = 0; c < col.chars.length; c++) {
              const charY = yPixel - c * col.fontSize;
              if (charY < 0 || charY > height) continue;

              const isHead = c === col.chars.length - 1;
              
              if (isHead) {
                ctx.fillStyle = col.headColor;
              } else {
                ctx.fillStyle = col.trailColor;
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
      intersectionObserver.disconnect();
      window.removeEventListener('universe_animation_pause', handlePauseEvent);
      window.removeEventListener('matrix_rain_override', handleOverrideEvent);
    };
  }, [shouldReduceMotion, theme]);

  if (shouldReduceMotion) {
    return (
      <div 
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-white via-zinc-50 to-white dark:from-black dark:via-zinc-950 dark:to-black"
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
