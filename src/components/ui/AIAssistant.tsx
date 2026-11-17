import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUp, Mic, RotateCcw, Sparkles, Square, Volume2, VolumeX, X } from 'lucide-react';
import { ASSISTANT_NAME, STARTER_PROMPTS, WELCOME } from '../../data/assistant';
import { AssistantAction, localReply, parseActions, suggestionsFor } from '../../lib/assistantBrain';
import { speakWithClonedVoice, stopVoice } from '../../lib/voice';
import { cn } from '../../lib/utils';

/* ------------------------------------------------------------------ */
/* Types & persistence                                                 */
/* ------------------------------------------------------------------ */
interface Msg {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  actions?: AssistantAction[];
  suggestions?: string[];
  streaming?: boolean;
}

const STORE_KEY = 'jg_ai_chat_v2';
const MUTE_KEY = 'jg_ai_assistant_muted';
const NUDGE_KEY = 'jg_ai_nudged';
const uid = () => Math.random().toString(36).slice(2);
const welcomeMsg = (): Msg => ({ id: 'welcome', role: 'assistant', text: WELCOME });

const load = (): Msg[] => {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Msg[]) : null;
    if (parsed?.length) return parsed.filter((m) => m.text).map((m) => ({ ...m, streaming: false }));
  } catch {
    /* storage unavailable */
  }
  return [welcomeMsg()];
};
const safeGet = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const safeSet = (kind: 'local' | 'session', k: string, v: string) => {
  try {
    (kind === 'local' ? localStorage : sessionStorage).setItem(k, v);
  } catch {
    /* storage unavailable */
  }
};

/* ------------------------------------------------------------------ */
/* AI transport: streamed Gemini via /api/chat, local brain fallback   */
/* ------------------------------------------------------------------ */
let aiUnavailable = false;

async function streamAI(history: Msg[], onChunk: (full: string) => void, signal: AbortSignal): Promise<string | null> {
  if (aiUnavailable) return null;
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        messages: history.filter((m) => m.id !== 'welcome' && m.text).map((m) => ({ role: m.role, content: m.text })),
      }),
    });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !res.body || !type.startsWith('text/plain')) {
      aiUnavailable = true; // not deployed / not configured / upstream error → local brain this visit
      return null;
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let full = '';
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      full += dec.decode(value, { stream: true });
      onChunk(full);
    }
    return full.trim() || null;
  } catch (e) {
    if ((e as Error)?.name !== 'AbortError') aiUnavailable = true;
    return null;
  }
}

/** Short, speakable version of a reply (keeps voice credits low). */
function toSpeech(text: string): string {
  const plain = text
    .replace(/\*\*/g, '')
    .replace(/^- /gm, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s*\n+\s*/g, '. ')
    .replace(/([.!?])\s*\./g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= 360) return plain;
  const cut = plain.slice(0, 360);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  return end > 120 ? cut.slice(0, end + 1) : cut + '…';
}

/* ------------------------------------------------------------------ */
/* Lightweight rich text (bold, bullets, links) — no innerHTML          */
/* ------------------------------------------------------------------ */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|[\w.+-]+@[\w-]+\.[\w.]+|https?:\/\/[^\s)]+)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^\*\*[^*]+\*\*$/.test(p))
          return (
            <strong key={i} className="font-semibold">
              {p.slice(2, -2)}
            </strong>
          );
        if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(p))
          return (
            <a key={i} href={`mailto:${p}`} className="underline decoration-emerald-500/60 underline-offset-2 hover:text-emerald-500">
              {p}
            </a>
          );
        if (/^https?:\/\//.test(p))
          return (
            <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="break-all underline decoration-emerald-500/60 underline-offset-2 hover:text-emerald-500">
              {p.replace(/^https?:\/\//, '')}
            </a>
          );
        return <React.Fragment key={i}>{p}</React.Fragment>;
      })}
    </>
  );
}

function RichText({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (!list.length) return;
    const items = list;
    blocks.push(
      <ul key={`l${blocks.length}`} className="my-1.5 space-y-1 [&:not(:first-child)]:mt-2">
        {items.map((li, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>
              <Inline text={li} />
            </span>
          </li>
        ))}
      </ul>
    );
    list = [];
  };
  text.split('\n').forEach((line) => {
    const l = line.trim();
    if (/^[-*•]\s+/.test(l)) list.push(l.replace(/^[-*•]\s+/, ''));
    else {
      flush();
      if (l)
        blocks.push(
          <p key={`p${blocks.length}`} className="[&:not(:first-child)]:mt-2">
            <Inline text={l} />
          </p>
        );
    }
  });
  flush();
  return <>{blocks}</>;
}

/* ------------------------------------------------------------------ */
/* Small visual pieces                                                 */
/* ------------------------------------------------------------------ */
function Avatar({ size = 40 }: { size?: number }) {
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-400 font-bold text-black"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
      aria-hidden="true"
    >
      JG
      {size >= 36 && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-400" />}
    </span>
  );
}

function SpeakingBars() {
  return (
    <span className="inline-flex h-3 items-end gap-[2px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="h-full w-[3px] origin-bottom rounded-full bg-emerald-500 animate-[eq_0.9s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
    </span>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1.5" role="status" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-[typing_1.2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

/* Web Speech API (voice input) — minimal typing */
type SRResult = ArrayLike<{ transcript: string }> & { isFinal: boolean };
interface SR {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<SRResult> }) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
type SRCtor = new () => SR;
const getRecognition = (): SRCtor | null => {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export function AIAssistant() {
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(load);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [muted, setMuted] = useState(() => safeGet(MUTE_KEY) === 'true');
  const [nudge, setNudge] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recRef = useRef<SR | null>(null);
  const greetedRef = useRef(false);
  const [micSupported] = useState(() => !!getRecognition());

  /* persistence */
  useEffect(() => {
    safeSet('session', STORE_KEY, JSON.stringify(messages.filter((m) => !m.streaming).slice(-30)));
  }, [messages]);
  useEffect(() => {
    safeSet('local', MUTE_KEY, String(muted));
    if (muted) {
      stopVoice();
      setSpeaking(false);
    }
  }, [muted]);

  /* gentle one-time nudge bubble */
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(NUDGE_KEY) === '1';
    } catch {
      /* ignore */
    }
    if (seen) return;
    const id = window.setTimeout(() => setNudge(true), 9000);
    return () => window.clearTimeout(id);
  }, []);
  const dismissNudge = () => {
    setNudge(false);
    safeSet('session', NUDGE_KEY, '1');
  };

  /* auto-scroll */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [messages, busy, open, reduce]);

  /* voice output: Chris (ElevenLabs) → browser voice fallback */
  const speak = useCallback(
    (text: string) => {
      stopVoice();
      if (muted || !text) return;
      const spoken = toSpeech(text);
      speakWithClonedVoice(spoken, { onStart: () => setSpeaking(true), onEnd: () => setSpeaking(false) }).then((ok) => {
        if (ok || !window.speechSynthesis) return;
        const u = new SpeechSynthesisUtterance(spoken);
        const voices = window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'));
        u.voice = voices.find((v) => /natural|google|daniel|alex/i.test(v.name)) ?? voices[0] ?? null;
        u.onstart = () => setSpeaking(true);
        u.onend = u.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
      });
    },
    [muted]
  );

  /* open / close side effects */
  useEffect(() => {
    if (!open) {
      stopVoice();
      setSpeaking(false);
      recRef.current?.stop();
      return;
    }
    dismissNudge();
    if (!greetedRef.current && messages.length === 1) {
      greetedRef.current = true;
      window.setTimeout(() => speak(WELCOME), 350);
    }
    if (window.matchMedia('(hover: hover)').matches) window.setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    const mobile = window.matchMedia('(max-width: 639px)').matches;
    if (mobile) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      if (mobile) document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => () => stopVoice(), []);

  /* send a message */
  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim().slice(0, 600);
      if (!text || busy) return;
      stopVoice();
      setSpeaking(false);
      setInput('');

      const userMsg: Msg = { id: uid(), role: 'user', text };
      const botId = uid();
      const history = [...messages.map((m) => ({ ...m, suggestions: undefined })), userMsg];
      setMessages([...history, { id: botId, role: 'assistant', text: '', streaming: true }]);
      setBusy(true);

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const timeout = window.setTimeout(() => ctrl.abort(), 20000);
      const update = (patch: Partial<Msg>) => setMessages((ms) => ms.map((m) => (m.id === botId ? { ...m, ...patch } : m)));

      let partial = '';
      const final = await streamAI(
        history,
        (full) => {
          partial = full;
          update({ text: parseActions(full).text });
        },
        ctrl.signal
      );
      window.clearTimeout(timeout);
      if (ctrl.signal.aborted && abortRef.current !== ctrl) return; // replaced by reset / newer message

      // Stopped or timed out mid-stream → keep what was already written.
      let reply = final ? parseActions(final) : partial.trim() ? parseActions(partial) : null;
      if (!reply) {
        await new Promise((r) => setTimeout(r, 450)); // brief "thinking" beat for the local brain
        reply = localReply(text);
      }
      update({ text: reply.text, actions: reply.actions, suggestions: suggestionsFor(text), streaming: false });
      setBusy(false);
      speak(reply.text);
    },
    [busy, messages, speak]
  );

  const reset = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    stopVoice();
    setSpeaking(false);
    setBusy(false);
    setMessages([welcomeMsg()]);
  };

  /* voice input */
  const toggleMic = () => {
    const Rec = getRecognition();
    if (!Rec) return;
    if (listening) {
      recRef.current?.stop();
      return;
    }
    stopVoice();
    const rec = new Rec();
    rec.lang = /^ur/i.test(navigator.language) ? 'ur-PK' : 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    let finalText = '';
    rec.onresult = (e) => {
      let interim = '';
      finalText = '';
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interim += r[0].transcript;
      }
      setInput((finalText + interim).trim());
    };
    rec.onend = () => {
      setListening(false);
      recRef.current = null;
      if (finalText.trim()) send(finalText);
    };
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  };

  /* action buttons */
  const runAction = (a: AssistantAction) => {
    if (a.href.endsWith('.pdf')) {
      const link = document.createElement('a');
      link.href = a.href;
      link.download = 'Jamshaid_Ghafoor_Resume.pdf';
      link.click();
    } else if (a.href.startsWith('/')) {
      navigate(a.href);
      if (window.matchMedia('(max-width: 639px)').matches) setOpen(false);
    } else if (a.href.startsWith('mailto:')) {
      window.location.href = a.href;
    } else {
      window.open(a.href, '_blank', 'noopener,noreferrer');
    }
  };

  const onlyWelcome = messages.length === 1;
  const last = messages[messages.length - 1];
  const status = listening ? 'Listening…' : busy ? 'Thinking…' : speaking ? 'Speaking' : 'Online · ask me anything';

  return (
    <>
      {/* Launcher */}
      <div className={cn('fixed bottom-5 right-5 z-40 flex items-end gap-3', open && 'pointer-events-none opacity-0 sm:pointer-events-auto sm:opacity-100')}>
        <AnimatePresence>
          {nudge && !open && (
            <motion.button
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              onClick={() => setOpen(true)}
              className="mb-2 hidden max-w-[230px] rounded-2xl rounded-br-md border border-foreground/10 bg-background px-4 py-3 text-left text-sm text-foreground shadow-xl sm:block"
            >
              <span className="font-semibold">Got questions?</span>
              <span className="block text-muted-foreground">Ask my AI about my work — it talks back.</span>
            </motion.button>
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setOpen((o) => !o)}
          whileHover={reduce ? undefined : { scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-14 items-center gap-2.5 rounded-full bg-foreground p-1.5 text-background shadow-[0_15px_40px_-10px_rgba(16,185,129,0.6)] sm:pr-5"
          aria-label={open ? 'Close assistant' : 'Open AI assistant'}
          aria-expanded={open}
          aria-controls="ai-assistant"
          id="ai-avatar-trigger"
        >
          {!open && !reduce && <span className="absolute inset-0 -z-10 rounded-full bg-emerald-500/40 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />}
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-400 text-black">
            {open ? <X size={20} /> : <Sparkles size={20} />}
          </span>
          <span className="hidden text-sm font-semibold sm:inline">{open ? 'Close' : 'Ask my AI'}</span>
        </motion.button>
      </div>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.section
            id="ai-assistant"
            role="dialog"
            aria-label={`${ASSISTANT_NAME} chat`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[70] flex origin-bottom-right flex-col overflow-hidden bg-background sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(660px,calc(100svh-8rem))] sm:w-[400px] sm:rounded-[28px] sm:border sm:border-foreground/10 sm:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]"
          >
            {/* Header */}
            <header className="relative flex items-center gap-3 border-b border-foreground/10 px-4 py-3.5 pt-[max(0.875rem,env(safe-area-inset-top))]">
              <div className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(16,185,129,0.25),transparent)]" />
              <Avatar />
              <div className="relative min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">{ASSISTANT_NAME}</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {speaking ? <SpeakingBars /> : <span className={cn('h-1.5 w-1.5 rounded-full', busy || listening ? 'bg-amber-400' : 'bg-emerald-500')} />}
                  {status}
                </div>
              </div>
              <button
                onClick={() => setMuted((m) => !m)}
                className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label={muted ? 'Turn voice on' : 'Turn voice off'}
                aria-pressed={!muted}
                title={muted ? 'Voice off' : 'Voice on'}
              >
                {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
              <button onClick={reset} className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="New conversation" title="New conversation">
                <RotateCcw size={16} />
              </button>
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground" aria-label="Close assistant">
                <X size={18} />
              </button>
            </header>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite" aria-busy={busy}>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn('flex gap-2.5', m.role === 'user' && 'justify-end')}
                >
                  {m.role === 'assistant' && <Avatar size={28} />}
                  <div className={cn('max-w-[84%]', m.role === 'user' && 'flex flex-col items-end')}>
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed [overflow-wrap:anywhere]',
                        m.role === 'user' ? 'rounded-tr-md bg-emerald-500 text-black' : 'rounded-tl-md bg-secondary text-foreground'
                      )}
                    >
                      {m.text ? <RichText text={m.text} /> : <TypingDots />}
                    </div>
                    {!!m.actions?.length && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.actions.map((a) => (
                          <button
                            key={a.href + a.label}
                            onClick={() => runAction(a)}
                            className="group inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-[13px] font-medium text-emerald-700 transition-colors hover:bg-emerald-500 hover:text-black dark:text-emerald-300"
                          >
                            {a.label}
                            <ArrowUp size={13} className="rotate-45 transition-transform group-hover:rotate-90" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {onlyWelcome && (
                <div className="grid gap-2 pl-[38px]">
                  {STARTER_PROMPTS.map((p, i) => (
                    <motion.button
                      key={p}
                      initial={reduce ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                      onClick={() => send(p)}
                      className="rounded-2xl border border-foreground/10 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:border-emerald-500 hover:bg-emerald-500/5"
                    >
                      {p}
                    </motion.button>
                  ))}
                </div>
              )}

              {!busy && !onlyWelcome && last?.role === 'assistant' && !!last.suggestions?.length && (
                <div className="flex flex-wrap gap-2 pl-[38px]">
                  {last.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-foreground/15 px-3.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-foreground/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              <div
                className={cn(
                  'flex items-center gap-2 rounded-full border bg-secondary/60 py-1.5 pl-4 pr-1.5 transition-colors',
                  listening ? 'border-rose-500' : 'border-foreground/10 focus-within:border-emerald-500'
                )}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={listening ? 'Listening… speak now' : 'Ask about projects, skills, hiring…'}
                  maxLength={600}
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
                  aria-label="Message"
                />
                {micSupported && (
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors',
                      listening ? 'animate-pulse bg-rose-500 text-white' : 'text-muted-foreground hover:bg-background hover:text-foreground'
                    )}
                    aria-label={listening ? 'Stop listening' : 'Ask with your voice'}
                    title="Ask with your voice"
                  >
                    <Mic size={17} />
                  </button>
                )}
                {busy ? (
                  <button type="button" onClick={() => abortRef.current?.abort()} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-foreground text-background" aria-label="Stop">
                    <Square size={13} fill="currentColor" />
                  </button>
                ) : (
                  <button type="submit" disabled={!input.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-500 text-black transition-opacity disabled:opacity-40" aria-label="Send">
                    <ArrowUp size={17} />
                  </button>
                )}
              </div>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">Answers are based on Jamshaid's portfolio · AI can make mistakes</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
