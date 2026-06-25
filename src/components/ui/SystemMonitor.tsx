import { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';

export function SystemMonitor() {
  const [cpu, setCpu] = useState(24);
  const [ram, setRam] = useState(42);
  const [temp, setTemp] = useState(41);
  const [uptime, setUptime] = useState('00:00:00');

  useEffect(() => {
    // Standard system monitor fluctuations
    const interval = setInterval(() => {
      setCpu((prev) => {
        const delta = Math.floor(Math.random() * 15) - 7; // -7 to +7
        return Math.max(12, Math.min(92, prev + delta));
      });

      setRam((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(38, Math.min(58, prev + delta));
      });

      setTemp((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1 to +1
        return Math.max(38, Math.min(48, prev + delta));
      });
    }, 1200);

    // Dynamic session uptime counter
    const startTime = Date.now();
    const timer = setInterval(() => {
      const elapsedMs = Date.now() - startTime;
      const secs = Math.floor(elapsedMs / 1000) % 60;
      const mins = Math.floor(elapsedMs / 60000) % 60;
      const hours = Math.floor(elapsedMs / 3600000);
      
      const pad = (n: number) => String(n).padStart(2, '0');
      setUptime(`${pad(hours)}:${pad(mins)}:${pad(secs)}`);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  // Helper to generate visual mini led bar
  const renderBar = (percent: number) => {
    const totalBlocks = 12;
    const activeBlocks = Math.round((percent / 100) * totalBlocks);
    return (
      <div className="flex gap-0.5 items-center h-2" aria-hidden="true">
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <span
            key={i}
            className={`w-1 h-1.5 rounded-[0.5px] transition-all duration-300 ${
              i < activeBlocks
                ? percent > 80
                  ? 'bg-rose-500 shadow-[0_0_4px_rgba(244,63,94,0.4)]'
                  : percent > 60
                  ? 'bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.4)]'
                  : 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.4)]'
                : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-zinc-950 px-4 py-2 border-b border-emerald-500/10 flex items-center justify-between font-mono text-[10px] text-zinc-400 select-none">
      {/* CPU Usage Block */}
      <div className="flex items-center gap-2">
        <Cpu size={12} className="text-emerald-500 animate-pulse" />
        <span className="text-zinc-500">CPU</span>
        <span className="text-emerald-400 font-medium min-w-[24px] text-right">{cpu}%</span>
        {renderBar(cpu)}
      </div>

      {/* RAM Usage Block */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-500">RAM</span>
        <span className="text-emerald-400 font-medium min-w-[24px] text-right">{ram}%</span>
        {renderBar(ram)}
      </div>

      {/* Stats and Uptime */}
      <div className="hidden xs:flex items-center gap-4 text-zinc-500">
        <div>
          TEMP <span className="text-emerald-500/80">{temp}°C</span>
        </div>
        <div className="h-2 w-px bg-zinc-800" />
        <div>
          UPTIME <span className="text-emerald-500/80">{uptime}</span>
        </div>
      </div>
    </div>
  );
}
