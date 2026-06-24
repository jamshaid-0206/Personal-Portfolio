import React from 'react';
import { motion } from 'motion/react';
import { Monitor, Cpu, Database, Network, ArrowRight, Activity } from 'lucide-react';

interface TopologyProps {
  techStack?: string;
}

export function SystemTopology({ techStack = "React, Node.js, Express, MongoDB" }: TopologyProps) {
  // Parsing tech stacks into list
  const stacks = techStack.split(',').map(s => s.trim());

  return (
    <div className="w-full bg-zinc-950/80 border border-emerald-500/10 rounded-sm p-6 space-y-6 text-left select-none" id="system-topology">
      
      {/* Header section status */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] tracking-widest uppercase">
          <Network size={14} className="animate-spin [animation-duration:8s]" />
          <span>[ INFRASTRUCTURE_TOPOLOGY_DIAGRAM ]</span>
        </div>
        <span className="text-zinc-500 font-mono text-[8px] tracking-widest uppercase">
          // STATUS: DEPLOYED_PROD
        </span>
      </div>

      {/* Interactive Architecture Schema Canvas */}
      <div className="relative aspect-[21/9] w-full border border-white/5 bg-zinc-950 rounded-sm overflow-hidden flex items-center justify-between p-4 sm:p-8">
        
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Pulsing signal cables (SVG vector overlays for packet flows) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Cable 1: Client to Gateway */}
          <motion.path
            d="M 120, 100 L 260, 100"
            stroke="rgba(16, 185, 129, 0.15)"
            strokeWidth="1"
            fill="none"
          />
          {/* Pulsing Data packet 1 */}
          <motion.circle
            r="3"
            fill="#34d399"
            filter="drop-shadow(0 0 4px #10b981)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            style={{ motionPath: "path('M 120, 100 L 260, 100')" }}
          />

          {/* Cable 2: Gateway to Microservices */}
          <motion.path
            d="M 330, 100 L 470, 60"
            stroke="rgba(16, 185, 129, 0.15)"
            strokeWidth="1"
            fill="none"
          />
          <motion.circle
            r="3"
            fill="#34d399"
            filter="drop-shadow(0 0 4px #10b981)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.5 }}
            style={{ motionPath: "path('M 330, 100 L 470, 60')" }}
          />

          {/* Cable 3: Gateway to Cache/Auth */}
          <motion.path
            d="M 330, 100 L 470, 140"
            stroke="rgba(16, 185, 129, 0.15)"
            strokeWidth="1"
            fill="none"
          />
          <motion.circle
            r="3"
            fill="#34d399"
            filter="drop-shadow(0 0 4px #10b981)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1.1 }}
            style={{ motionPath: "path('M 330, 100 L 470, 140')" }}
          />

          {/* Cable 4: Microservices to database */}
          <motion.path
            d="M 540, 60 L 680, 100"
            stroke="rgba(16, 185, 129, 0.15)"
            strokeWidth="1"
            fill="none"
          />
          <motion.circle
            r="3"
            fill="#34d399"
            filter="drop-shadow(0 0 4px #10b981)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: 0.8 }}
            style={{ motionPath: "path('M 540, 60 L 680, 100')" }}
          />

          {/* Cable 5: Cache to database */}
          <motion.path
            d="M 540, 140 L 680, 100"
            stroke="rgba(16, 185, 129, 0.15)"
            strokeWidth="1"
            fill="none"
          />
          <motion.circle
            r="3"
            fill="#34d399"
            filter="drop-shadow(0 0 4px #10b981)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 2.1, repeat: Infinity, ease: "linear", delay: 0.2 }}
            style={{ motionPath: "path('M 540, 140 L 680, 100')" }}
          />
        </svg>

        {/* Node 1: Client device */}
        <div className="flex flex-col items-center gap-1.5 z-10">
          <div className="w-12 h-12 rounded-sm border border-emerald-500/20 bg-zinc-950/95 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <Monitor size={20} />
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-zinc-400 uppercase">
            CLIENT_EDGE
          </span>
        </div>

        {/* Node 2: Gateway */}
        <div className="flex flex-col items-center gap-1.5 z-10">
          <div className="w-12 h-12 rounded-sm border border-emerald-500/40 bg-zinc-950/95 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
            <Cpu className="animate-pulse" size={20} />
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-zinc-400 uppercase">
            REVERSE_PROXY
          </span>
        </div>

        {/* Double Inner node stack: Core VM and Cache Node */}
        <div className="flex flex-col gap-5 z-10">
          {/* VM cluster */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-sm border border-emerald-500/20 bg-zinc-950/95 flex items-center justify-center text-emerald-400">
              <Activity size={16} className="animate-pulse text-emerald-400" />
            </div>
            <span className="font-mono text-[7px] sm:text-[8px] tracking-wider text-zinc-500 uppercase">
              VM_CORE_CLUSTER
            </span>
          </div>
          
          {/* Cache cluster */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 rounded-sm border border-emerald-500/20 bg-zinc-950/95 flex items-center justify-center text-emerald-400">
              <Network size={16} />
            </div>
            <span className="font-mono text-[7px] sm:text-[8px] tracking-wider text-zinc-500 uppercase">
              REDIS_CACHE
            </span>
          </div>
        </div>

        {/* Node 4: DB Layer */}
        <div className="flex flex-col items-center gap-1.5 z-10">
          <div className="w-12 h-12 rounded-sm border border-emerald-500/20 bg-zinc-950/95 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <Database size={20} />
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-zinc-400 uppercase">
            DB_REPLICAS
          </span>
        </div>

      </div>

      {/* Dynamic tech elements badges */}
      <div className="flex flex-wrap gap-2 pt-2">
        {stacks.map((tech, idx) => (
          <span
            key={idx}
            className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-sm font-mono text-[9px] tracking-wider text-zinc-300 uppercase"
          >
            {tech}
          </span>
        ))}
      </div>

    </div>
  );
}
