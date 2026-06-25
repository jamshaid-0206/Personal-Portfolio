import React, { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'motion/react';
import { Code2, Clock, Zap, GitCommit, FileCode, Users, Terminal } from 'lucide-react';
import { cn } from '../../lib/utils';

// High-performance smooth numerical counter that triggers when it enters the viewport
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ value, duration = 1.8, prefix = '', suffix = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const startValue = 0;

    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Beautiful ease-out quad transition
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * (value - startValue) + startValue);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

interface MetricItem {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ComponentType<any>;
  desc: string;
}

interface ProjectStatsProps {
  projectSlug: string;
  className?: string;
}

export function ProjectStats({ projectSlug, className }: ProjectStatsProps) {
  // Define custom production counters based on specific case studies
  const getMetrics = (slug: string): MetricItem[] => {
    switch (slug) {
      case 'readability-pro':
        return [
          {
            label: "LINES OF CODE",
            value: 14800,
            suffix: "+",
            icon: Code2,
            desc: "Custom debounced parser, Web Workers & API proxy"
          },
          {
            label: "DEVELOPMENT HOURS",
            value: 240,
            icon: Clock,
            desc: "Agile iteration, engineering, & schema optimization"
          },
          {
            label: "PERF AUDIT SCORE",
            value: 99,
            suffix: "/100",
            icon: Zap,
            desc: "Google Lighthouse core web vitals optimization"
          },
          {
            label: "UNIT TESTS PASSED",
            value: 350,
            icon: GitCommit,
            desc: "Jest/React Testing Library suites covering AST rules"
          }
        ];
      case 'hostelmate':
        return [
          {
            label: "LINES OF CODE",
            value: 18500,
            suffix: "+",
            icon: Code2,
            desc: "React Native structures & offline-first Firestore"
          },
          {
            label: "DEVELOPMENT HOURS",
            value: 320,
            icon: Clock,
            desc: "Figma wireframing, native device audits & rule configs"
          },
          {
            label: "PERF AUDIT SCORE",
            value: 96,
            suffix: "/100",
            icon: Zap,
            desc: "FlatList optimization & memoized component trees"
          },
          {
            label: "BETA TESTERS",
            value: 120,
            suffix: "+",
            icon: Users,
            desc: "Active student residents & hostel admin accounts"
          }
        ];
      case 'asian-it-client-platforms':
        return [
          {
            label: "LINES OF CODE",
            value: 35000,
            suffix: "+",
            icon: Code2,
            desc: "Reusable modular components & custom CSS sheets"
          },
          {
            label: "DEVELOPMENT HOURS",
            value: 680,
            icon: Clock,
            desc: "Contract development & multi-platform deployments"
          },
          {
            label: "PERF AUDIT SCORE",
            value: 98,
            suffix: "/100",
            icon: Zap,
            desc: "Vite code splitting & sub-second render speeds"
          },
          {
            label: "DELIVERED SYSTEMS",
            value: 8,
            icon: FileCode,
            desc: "Production-ready enterprise client web platforms"
          }
        ];
      default:
        return [
          {
            label: "LINES OF CODE",
            value: 12000,
            suffix: "+",
            icon: Code2,
            desc: "Clean modular TypeScript component codebase"
          },
          {
            label: "DEVELOPMENT HOURS",
            value: 150,
            icon: Clock,
            desc: "Comprehensive engineering sprint planning cycles"
          },
          {
            label: "PERF AUDIT SCORE",
            value: 97,
            suffix: "/100",
            icon: Zap,
            desc: "Efficient bundle builds & fast load times"
          },
          {
            label: "COMMITS LOGGED",
            value: 180,
            icon: GitCommit,
            desc: "Granular deployment commits & staging logs"
          }
        ];
    }
  };

  const metrics = getMetrics(projectSlug);

  return (
    <div className={cn("space-y-6", className)} id="project-numerical-stats">
      <div className="flex items-center gap-2">
        <span className="text-[10px] md:text-xs font-mono tracking-widest text-emerald-500 uppercase">
          // 01B_PRODUCTION_KPI_TELEMETRY
        </span>
        <div className="h-px flex-1 bg-border/40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-zinc-950/40 backdrop-blur-md border border-white/5 hover:border-emerald-500/20 rounded-sm p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.2)]"
            >
              {/* Corner tech lines */}
              <div className="absolute top-0 left-0 w-1.5 h-[1px] bg-emerald-500/30 group-hover:bg-emerald-400 transition-colors" />
              <div className="absolute top-0 left-0 w-[1px] h-1.5 bg-emerald-500/30 group-hover:bg-emerald-400 transition-colors" />
              <div className="absolute bottom-0 right-0 w-1.5 h-[1px] bg-emerald-500/30 group-hover:bg-emerald-400 transition-colors" />
              <div className="absolute bottom-0 right-0 w-[1px] h-1.5 bg-emerald-500/30 group-hover:bg-emerald-400 transition-colors" />

              {/* Glowing decorative accent */}
              <div className="absolute -inset-px rounded-sm bg-gradient-to-br from-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {metric.label}
                  </span>
                  <div className="w-6 h-6 rounded-sm border border-white/5 bg-white/[0.02] flex items-center justify-center text-zinc-500 group-hover:text-emerald-400 group-hover:border-emerald-500/10 transition-all duration-300">
                    <IconComponent size={12} />
                  </div>
                </div>

                <div className="mt-4 mb-2">
                  <span className="text-3xl font-extralight tracking-tight text-white font-mono drop-shadow-[0_0_12px_rgba(16,185,129,0.1)]">
                    <AnimatedCounter
                      value={metric.value}
                      prefix={metric.prefix}
                      suffix={metric.suffix}
                    />
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-[10px] text-zinc-500 font-light leading-relaxed select-none group-hover:text-zinc-400 transition-colors">
                  {metric.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
