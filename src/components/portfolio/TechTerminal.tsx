import { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { playType, playBlip } from '../../lib/audio';

interface TerminalLine {
  type: 'input' | 'output';
  prompt?: string;
  text: string;
}

export function TechTerminal() {
  const shouldReduceMotion = useReducedMotion();
  const [displayedLines, setDisplayedLines] = useState<TerminalLine[]>([]);
  const [currentCommand, setCurrentCommand] = useState<string>('');
  const [caretVisible, setCaretVisible] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  // Terminal Script Definition
  const script = [
    {
      type: 'command',
      prompt: '$ ',
      command: 'whoami',
      output: 'jamshaid_ghafoor'
    },
    {
      type: 'command',
      prompt: '$ ',
      command: 'cat stack.json',
      output: `{ "frontend": ["React","React Native","Redux"],\n  "backend":  ["Node.js","Express","MongoDB","Firebase"],\n  "language": ["JavaScript (ES6+)","TypeScript"],\n  "tooling":  ["Git","REST APIs","MVC"] }`
    },
    {
      type: 'command',
      prompt: '$ ',
      command: 'ls projects/',
      output: 'hostelmate  readability-pro  asian-it-clients  mern-api-platform'
    },
    {
      type: 'command',
      prompt: '$ ',
      command: 'echo "open to opportunities" | base64',
      output: 'b3BlbiB0byBvcHBvcnR1bml0aWVz'
    }
  ];

  // Caret Blinking interval: 530ms
  useEffect(() => {
    const caretInterval = setInterval(() => {
      setCaretVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(caretInterval);
  }, []);

  // Main typewriter state machine
  useEffect(() => {
    if (shouldReduceMotion) {
      // Instantly render everything if reduced motion is set
      const lines: TerminalLine[] = [];
      script.forEach((item) => {
        lines.push({ type: 'input', prompt: item.prompt, text: item.command });
        lines.push({ type: 'output', text: item.output });
      });
      setDisplayedLines(lines);
      setIsFinished(true);
      return;
    }

    let scriptIndex = 0;
    let charIndex = 0;
    let timer: NodeJS.Timeout;

    const processScript = () => {
      if (scriptIndex >= script.length) {
        setIsFinished(true);
        return;
      }

      const currentItem = script[scriptIndex];
      const fullCommand = currentItem.command;

      if (charIndex < fullCommand.length) {
        // Type the command letter-by-letter
        const char = fullCommand[charIndex];
        setCurrentCommand((prev) => prev + char);
        playType(0.008);
        charIndex++;
        timer = setTimeout(processScript, 22); // Char interval ~22ms
      } else {
        // Command completed typing. Add to lines list
        timer = setTimeout(() => {
          setDisplayedLines((prev) => [
            ...prev,
            { type: 'input', prompt: currentItem.prompt, text: fullCommand },
            { type: 'output', text: currentItem.output }
          ]);
          playBlip(0.01, true); // Play quick system completion blip
          setCurrentCommand('');
          scriptIndex++;
          charIndex = 0;
          timer = setTimeout(processScript, 280); // Line delay ~280ms
        }, 280);
      }
    };

    // Begin typing
    timer = setTimeout(processScript, 400);

    return () => clearTimeout(timer);
  }, [shouldReduceMotion]);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-md overflow-hidden bg-black/85 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] font-mono text-xs md:text-sm leading-relaxed text-left">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 select-none">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
        </div>
        <div className="text-zinc-400 text-xs tracking-wide">
          ~/jamshaid — zsh
        </div>
        <div className="w-12" /> {/* spacer balance */}
      </div>

      {/* Terminal Content Body */}
      <div className="p-4 md:p-6 space-y-4 min-h-[320px] max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 select-all">
        {displayedLines.map((line, idx) => (
          <div key={idx} className="space-y-1">
            {line.type === 'input' ? (
              <p className="flex items-start">
                <span className="text-emerald-400 mr-2 shrink-0">{line.prompt}</span>
                <span className="text-white break-all">{line.text}</span>
              </p>
            ) : (
              <pre className="text-emerald-300/80 whitespace-pre-wrap break-all pl-4 border-l border-emerald-500/10 font-sans tracking-wide leading-relaxed">
                {line.text}
              </pre>
            )}
          </div>
        ))}

        {/* Current Command Input Line */}
        {!isFinished && (
          <div className="flex items-center">
            <span className="text-emerald-400 mr-2 shrink-0">$ </span>
            <span className="text-white break-all">{currentCommand}</span>
            <span 
              className={`inline-block w-2 h-4 ml-0.5 bg-emerald-400 ${
                caretVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              ▮
            </span>
          </div>
        )}

        {/* Finished Active Prompt with Cursor */}
        {isFinished && (
          <div className="flex items-center text-emerald-400 select-none">
            <span className="mr-2">$ </span>
            <span 
              className={`inline-block w-2 h-4 bg-emerald-400 ${
                caretVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              ▮
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
