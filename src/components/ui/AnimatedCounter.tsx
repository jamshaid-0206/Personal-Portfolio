import { useEffect, useState, useRef } from 'react';
import { useInView } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  duration?: number;
}

export function AnimatedCounter({ value, suffix = '', duration = 1.5 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(countRef, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (start === end) return;

    const totalFrames = Math.min(Math.floor(duration * 60), 100);
    const increment = end / totalFrames;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      setCount(Math.floor(increment * frame));
      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={countRef} className="font-mono tabular-nums">
      {count}
      {suffix}
    </span>
  );
}
