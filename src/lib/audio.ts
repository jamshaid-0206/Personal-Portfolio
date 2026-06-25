/**
 * Sound synthesis library using Web Audio API for performance-optimized, 
 * zero-dependency retro-futuristic terminal audio feedback.
 */

let audioCtx: AudioContext | null = null;

/**
 * Safely initializes and resumes the shared browser AudioContext on demand.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      // Create with a high latencyHint for efficient performance
      audioCtx = new AudioContextClass({ latencyHint: 'interactive' });
    }
  }
  
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Silent catch if user has not interacted with document yet
    });
  }
  
  return audioCtx;
}

/**
 * Plays a clean, high-tech electronic blip sound, perfect for button clicks or major page transitions.
 */
export function playBlip(volume = 0.025, isHigh = false) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    
    osc.type = 'sine';
    const startFreq = isHigh ? 1320 : 880;
    const endFreq = isHigh ? 1760 : 587.33; // D5 to D6 or A5 to D5
    
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.07);

    // Exponential sound decay envelope
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (error) {
    console.warn('Audio playBlip failed:', error);
  }
}

/**
 * Plays a low-frequency, extremely subtle hover blip sound for micro-interactions on links/buttons.
 */
export function playHoverBlip(volume = 0.008) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(349.23, now + 0.03); // F4

    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch (error) {
    // Fail silently
  }
}

/**
 * Plays a realistic, crisp mechanical keyboard typing click.
 * Randomized frequency values simulate organic human typing of different keys.
 */
export function playType(volume = 0.015) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    
    osc.type = 'triangle';
    // Add randomized pitch variation for organic keyboard sensation
    const baseFreq = 1600 + Math.random() * 500;
    const endFreq = 220 + Math.random() * 50;

    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.012);

    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.014);

    osc.start(now);
    osc.stop(now + 0.015);
  } catch (error) {
    // Fail silently
  }
}

/**
 * Plays a mechanical Spacebar click sound (slightly deeper and longer than normal keys).
 */
export function playSpacebar(volume = 0.02) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.025);

    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.start(now);
    osc.stop(now + 0.028);
  } catch (error) {
    // Fail silently
  }
}

/**
 * Plays a dramatic cybernetic explosion sweep, ideal for loading completion.
 */
export function playExplosionSweep(volume = 0.06) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const noiseGain = ctx.createGain();

    osc.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    const now = ctx.currentTime;
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.4);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.9);

    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(volume, now + 0.2);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc.start(now);
    osc.stop(now + 1.0);
  } catch (error) {
    // Fail silently
  }
}
