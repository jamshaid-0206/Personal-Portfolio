/**
 * Plays assistant replies in the portfolio owner's ElevenLabs voice via the
 * /api/tts server function. Falls back (returns false) when the voice
 * service isn't available so callers can use browser speech instead.
 */

let current: HTMLAudioElement | null = null;
let token = 0;
let remoteUnavailable = false;
const cache = new Map<string, string>(); // text -> object URL

export function stopVoice() {
  token++;
  if (current) {
    current.pause();
    current = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
}

export async function speakWithClonedVoice(
  text: string,
  handlers: { onStart?: () => void; onEnd?: () => void } = {}
): Promise<boolean> {
  if (remoteUnavailable || !text) return false;
  const my = ++token;

  try {
    let src = cache.get(text);
    if (!src) {
      const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
      const type = res.headers.get('content-type') || '';
      if (!res.ok || !type.includes('audio')) {
        // Not deployed, not configured or rejected upstream (plan/quota) →
        // use browser speech for the rest of this visit instead of retrying.
        remoteUnavailable = true;
        return false;
      }
      src = URL.createObjectURL(await res.blob());
      cache.set(text, src);
    }
    if (my !== token) return true; // a newer request replaced this one

    const audio = new Audio(src);
    current = audio;
    audio.onplay = () => handlers.onStart?.();
    audio.onended = audio.onerror = audio.onpause = () => {
      if (current === audio) current = null;
      handlers.onEnd?.();
    };
    await audio.play();
    return true;
  } catch {
    return false;
  }
}
