import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Bot, X, Send, Sparkles, Terminal, ArrowUpRight, Cpu, HelpCircle, Code2, Volume2, VolumeX } from 'lucide-react';
import { photographerInfo } from '../../data/photographer';
import { projects } from '../../data/projects';
import { VoicePulseAnalyzer } from './VoicePulseAnalyzer';
import { SystemMonitor } from './SystemMonitor';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

const PRESET_PROMPTS = [
  { text: "Who is Jamshaid Ghafoor?", category: "intro" },
  { text: "Explain Project: Hostelmate", category: "project" },
  { text: "Explain Project: Readability Pro", category: "project" },
  { text: "What is his tech stack?", category: "skills" },
  { text: "Is he available for hire?", category: "hire" }
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "GREETINGS, EXPLORER. I am JG_HOLOGRAPHIC_COGNITIVE_INTERFACE_V4.\n\nI can introduce you to Jamshaid Ghafoor, dissect his core systems architectures, display his technical stack, or guide you to his portfolio blueprints.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('jg_ai_assistant_muted');
      return saved ? saved === 'true' : false; // Unmuted by default so they can hear speech immediately
    }
    return false;
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Load synthesis voices dynamically (crucial for Chrome and modern mobile browsers)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setAvailableVoices(allVoices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Handle saving of voice preferences to LocalStorage
  useEffect(() => {
    localStorage.setItem('jg_ai_assistant_muted', String(isMuted));
    if (isMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isMuted]);

  // Clean speech synthesis helper that strips formatting, underscores, and custom technical markup
  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // Terminate any active speech stream
    window.speechSynthesis.cancel();

    if (isMuted) {
      setIsSpeaking(false);
      return;
    }

    // Process and clean text so that it reads out naturally and elegantly
    let cleanText = text
      .replace(/JG_HOLOGRAPHIC_COGNITIVE_INTERFACE_V4/gi, 'Jamshaid Ghafoor Holographic Assistant')
      .replace(/JG_ASSISTANT_COGNITIVE_V4/gi, 'Jamshaid Ghafoor Cognitive Assistant')
      .replace(/SYSTEM DISSECTION:/gi, 'System dissection:')
      .replace(/JG_TECHNICAL_TELEMETRY:/gi, 'Technical telemetry:')
      .replace(/AVAILABILITY_STATUS:/gi, 'Availability status:')
      .replace(/ACTIVE_ACQUISITION/gi, 'Active Acquisition')
      .replace(/COMMUNICATION_SHELL_CHANNELS:/gi, 'Communication channels:')
      .replace(/ACADEMIC_CREDENTIALS:/gi, 'Academic credentials:')
      .replace(/PROFESSIONAL_TIMELINE:/gi, 'Professional timeline:')
      .replace(/CORE LOG: UNRECOGNIZED_QUERY/gi, 'Unrecognized query.')
      .replace(/[\*\[\]\-#_]/g, ' ') // Strip Markdown tags, lists, brackets, and underscores
      .replace(/\s+/g, ' ') // Collapse multiple whitespace blocks
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Filter available English voices
    const currentVoices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();
    const enVoices = currentVoices.filter((v) => v.lang.startsWith('en'));

    // High-fidelity natural human male voice scoring strategy
    const rateVoice = (voice: SpeechSynthesisVoice): number => {
      const name = voice.name.toLowerCase();
      let score = 0;

      // Human-sounding names
      const isMaleName = ['david', 'daniel', 'alex', 'mark', 'george', 'james', 'nathan', 'oliver', 'thomas', 'ravi', 'male'].some(p => name.includes(p));
      if (isMaleName) score += 40;

      // Google, Apple, Microsoft modern natural voices are exceptionally human-sounding
      if (name.includes('natural')) score += 50;
      if (name.includes('google')) score += 30;
      if (name.includes('apple')) score += 30;
      if (name.includes('microsoft')) score += 20;
      if (name.includes('premium') || name.includes('enhanced')) score += 15;

      return score;
    };

    // Sort voices to pick the one that sounds most human and masculine
    const sortedVoices = [...enVoices].sort((a, b) => rateVoice(b) - rateVoice(a));
    const selectedVoice = sortedVoices[0] || null;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Parameters optimized for an organic, smooth, and pleasant human delivery
    utterance.rate = 0.98; // Natural, comfortable reading speed
    utterance.pitch = 1.0; // Standard, organic human pitch to prevent robotic frequency artifacts

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Speak the introductory message once the user opens the panel
  useEffect(() => {
    if (isOpen && messages.length === 1 && messages[0].id === 'welcome') {
      const timer = setTimeout(() => {
        speakText(messages[0].text);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clean up synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speaking when the panel is closed
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (input: string): string => {
    const text = input.toLowerCase();

    if (text.includes('who') || text.includes('about') || text.includes('introduce') || text.includes('jamshaid') || text.includes('ghafoor') || text.includes('biography')) {
      return `Jamshaid Ghafoor is an innovative and detail-oriented Full-Stack Software Developer currently working as a Front-End Developer at Asian IT.\n\nHe is pursuing a Bachelor of Science in Computer Science at Abasyn University, Islamabad (Expected 2027) and specializes in building high-fidelity web and mobile platforms with clean architectures.`;
    }

    if (text.includes('hostelmate')) {
      const p = projects.find(proj => proj.slug === 'hostelmate');
      return `SYSTEM DISSECTION: Hostelmate\n\n- DESCRIPTION: ${p?.description || "A comprehensive cross-platform student residency solution."}\n- TECHNOLOGY: MERN, React Native, Firebase Auth, and offline-first Firestore syncing.\n- KEY OUTCOME: Optimized residence resource logging, admin oversight rails, and secure student accounts.`;
    }

    if (text.includes('readability') || text.includes('pro')) {
      const p = projects.find(proj => proj.slug === 'readability-pro');
      return `SYSTEM DISSECTION: Readability Pro\n\n- DESCRIPTION: ${p?.description || "An AI-powered writing analyzer and readability scoring platform."}\n- TECHNOLOGY: React, Node.js, Express, Google Gemini, and customized AST rule engines.\n- KEY OUTCOME: Accelerated written evaluation feedback speeds, custom AST processing, and core web vital optimization.`;
    }

    if (text.includes('stack') || text.includes('tech') || text.includes('skills') || text.includes('languages') || text.includes('frameworks')) {
      return `JG_TECHNICAL_TELEMETRY:\n\n- FRONTEND: React, React Native, Redux, HTML5, CSS3, Tailwind CSS\n- BACKEND: Node.js, Express.js, RESTful APIs, MVC architecture\n- DATABASES: MongoDB, Firestore (NoSQL)\n- TOOLING & CONTROLS: Git, GitHub, VS Code, agile sprint configurations\n\nAll architectures conform strictly to high-performance, responsive code standards.`;
    }

    if (text.includes('hire') || text.includes('available') || text.includes('work') || text.includes('job') || text.includes('freelance') || text.includes('opportunity')) {
      return `AVAILABILITY_STATUS: OPEN [ACTIVE_ACQUISITION]\n\nJamshaid is currently accepting freelance contracts, collaboration briefs, and long-term full-stack engineering roles.\n\nLocation: ${photographerInfo.location}\nEmail: ${photographerInfo.email}\nPhone: ${photographerInfo.phone}`;
    }

    if (text.includes('contact') || text.includes('email') || text.includes('phone') || text.includes('linkedin') || text.includes('social')) {
      return `COMMUNICATION_SHELL_CHANNELS:\n\n- EMAIL: ${photographerInfo.email}\n- PHONE: ${photographerInfo.phone}\n- LINKEDIN: ${photographerInfo.socialLinks.linkedin}\n\nFeel free to transmit a ping or schedule a diagnostic sync directly!`;
    }

    if (text.includes('education') || text.includes('university') || text.includes('college') || text.includes('bscs') || text.includes('abasyn')) {
      return `ACADEMIC_CREDENTIALS:\n\n- DEGREE: Bachelor of Science in Computer Science (BSCS)\n- INSTITUTION: Abasyn University, Islamabad\n- YEAR: 2023 - 2027 (Expected)`;
    }

    if (text.includes('experience') || text.includes('work') || text.includes('asian') || text.includes('job')) {
      return `PROFESSIONAL_TIMELINE:\n\n- FRONT-END DEVELOPER @ ASIAN IT (2024 – Present)\n  * Architected pixel-perfect frontends for diverse client websites.\n  * Integrated low-overhead REST APIs for high-throughput state syncing.\n  * Configured build code-splitting to maintain Lighthouse scores of 95+.`;
    }

    if (text.includes('hello') || text.includes('hi') || text.includes('greetings') || text.includes('hey')) {
      return `GREETINGS, HUMAN VOYAGER.\n\nI am ready to process questions about Jamshaid's technical blueprints. What system query shall we run first?`;
    }

    return `CORE LOG: UNRECOGNIZED_QUERY.\n\nI could not map that into my pre-loaded database. However, you can ask about: "tech stack", "Hostelmate project", "Readability Pro project", "availability", or "academic history".\n\nOr contact Jamshaid directly at: ${photographerInfo.email}`;
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Immediately stop any currently active speech when user initiates a new query
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate holographic projection latency
    setTimeout(() => {
      const responseText = generateAIResponse(text);
      const aiMsg: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      
      // Speak response
      speakText(responseText);
    }, 900);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Floating Hologram Orb Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 rounded-full bg-zinc-950 border border-emerald-500/40 hover:border-emerald-400 flex items-center justify-center text-emerald-400 cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.25)] group focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="ai-avatar-trigger"
        >
          {/* Holographic glowing orbits */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-[spin_8s_linear_infinite]" />
          <div className="absolute -inset-1.5 rounded-full border border-dashed border-emerald-500/10 animate-[spin_12s_linear_infinite_reverse]" />
          <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-emerald-500/0 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />

          {isOpen ? (
            <X size={20} className="relative z-10 transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <Bot size={22} className="relative z-10 animate-[pulse_2s_infinite]" />
          )}

          {/* Active status beacon */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full animate-ping pointer-events-none" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-zinc-950 rounded-full pointer-events-none" />
        </motion.button>
      </div>

      {/* Hologram Panel Interface Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[380px] h-[480px] bg-zinc-950/95 backdrop-blur-xl border border-emerald-500/20 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.7)] flex flex-col z-[99998] overflow-hidden"
            id="ai-avatar-panel"
          >
            {/* Corner Tech Lines */}
            <div className="absolute top-0 left-0 w-2 h-[1px] bg-emerald-500/40" />
            <div className="absolute top-0 left-0 w-[1px] h-2 bg-emerald-500/40" />
            <div className="absolute top-0 right-0 w-2 h-[1px] bg-emerald-500/40" />
            <div className="absolute top-0 right-0 w-[1px] h-2 bg-emerald-500/40" />
            <div className="absolute bottom-0 left-0 w-2 h-[1px] bg-emerald-500/40" />
            <div className="absolute bottom-0 left-0 w-[1px] h-2 bg-emerald-500/40" />
            <div className="absolute bottom-0 right-0 w-2 h-[1px] bg-emerald-500/40" />
            <div className="absolute bottom-0 right-0 w-[1px] h-2 bg-emerald-500/40" />

            {/* Glowing gradient atmosphere header */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

            {/* Header section */}
            <div className="p-4 border-b border-emerald-500/10 flex items-center justify-between bg-zinc-950/80">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Bot size={15} />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full border border-zinc-950 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-medium tracking-widest text-white uppercase flex items-center gap-1.5">
                    JG_ASSISTANT_COGNITIVE_V4
                  </h3>
                  <p className="text-[8px] font-mono tracking-wider text-emerald-500/60 uppercase">
                    // status: online (secure_node_3000)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Visual Speaking Frequency Waves */}
                {isSpeaking && !isMuted && (
                  <div className="flex items-center gap-0.5 h-3.5 px-1 select-none" title="Assistant is speaking">
                    <span className="w-0.5 h-2 bg-emerald-400 animate-[bounce_0.8s_infinite_100ms] rounded-full" />
                    <span className="w-0.5 h-3 bg-emerald-400 animate-[bounce_0.8s_infinite_300ms] rounded-full" />
                    <span className="w-0.5 h-1.5 bg-emerald-400 animate-[bounce_0.8s_infinite_200ms] rounded-full" />
                  </div>
                )}
                
                {/* Voice Toggle Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1.5 rounded-sm border transition-all cursor-pointer ${
                    isMuted 
                      ? 'border-transparent text-zinc-500 hover:text-zinc-300' 
                      : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                  }`}
                  title={isMuted ? "Unmute assistant voice" : "Mute assistant voice"}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-sm cursor-pointer"
                  title="Close panel"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Terminal voice pulse analyzer */}
            <VoicePulseAnalyzer isSpeaking={isSpeaking && !isMuted} />

            {/* System Monitor widget */}
            <SystemMonitor />

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono scrollbar-thin scrollbar-thumb-emerald-950/40 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 text-[8px] text-zinc-500 uppercase tracking-widest mb-1 select-none">
                    <span>{msg.sender === 'user' ? 'TRANSMITTING_NODE' : 'COGNITIVE_RESONANCE'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`max-w-[85%] rounded-sm px-3.5 py-2.5 text-xs font-light leading-relaxed whitespace-pre-wrap select-text ${
                      msg.sender === 'user'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                        : 'bg-zinc-900/60 border border-white/5 text-zinc-300'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1 text-[8px] text-zinc-500 uppercase tracking-widest mb-1 select-none">
                    <span>COGNITIVE_RESONANCE</span>
                    <span>•</span>
                    <span className="animate-pulse">THINKING_PROCS...</span>
                  </div>
                  <div className="bg-zinc-900/60 border border-white/5 rounded-sm px-4 py-2.5 text-xs flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Presets Grid */}
            <div className="p-3 bg-zinc-950 border-t border-emerald-500/10 flex flex-col gap-1.5">
              <span className="text-[8px] font-mono text-zinc-500 tracking-widest uppercase px-1">
                // SYSTEM_QUICK_PRESETS
              </span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                {PRESET_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(prompt.text)}
                    className="shrink-0 px-2.5 py-1 bg-zinc-900 hover:bg-emerald-500/5 hover:border-emerald-500/30 border border-white/5 text-[9px] font-mono text-zinc-400 hover:text-emerald-300 transition-all rounded-sm cursor-pointer whitespace-nowrap"
                  >
                    {prompt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input controls */}
            <div className="p-3 border-t border-emerald-500/10 bg-zinc-950/90 flex gap-2">
              <input
                type="text"
                placeholder="Ask about my projects, stack, availability..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-zinc-900 border border-white/5 hover:border-white/10 focus:border-emerald-500/30 text-xs font-mono px-3.5 py-2.5 rounded-sm text-white focus:outline-none placeholder-zinc-600 tracking-wide"
              />
              <button
                onClick={() => handleSendMessage(inputValue)}
                className="w-10 h-10 rounded-sm border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center cursor-pointer transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
