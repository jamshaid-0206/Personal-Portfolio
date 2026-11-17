/**
 * Vercel Function: GET /api/tts?text=...
 *
 * Turns assistant replies into speech with ElevenLabs, using the portfolio
 * owner's voice. The API key only ever lives on the server
 * (ELEVENLABS_API_KEY env var) — it is never shipped to the browser.
 *
 * Responses are cached on Vercel's CDN per unique text, so each canned
 * assistant reply is synthesised (and billed) only once.
 */

const DEFAULT_VOICE_ID = 'kyu5ji11Ocj3MIcc9vdQ';
const DEFAULT_MODEL_ID = 'eleven_flash_v2_5'; // lowest latency, lowest cost
const MAX_CHARS = 900;

function error(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export async function GET(request: Request): Promise<Response> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return error(503, 'Voice is not configured.');

  const url = new URL(request.url);
  const text = (url.searchParams.get('text') ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return error(400, 'Missing text.');
  if (text.length > MAX_CHARS) return error(413, 'Text too long.');

  // Only serve requests coming from this site (blocks casual hot-linking).
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      if (new URL(referer).host !== url.host) return error(403, 'Forbidden.');
    } catch {
      return error(403, 'Forbidden.');
    }
  }

  const voiceId = process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID;
  const modelId = process.env.ELEVENLABS_MODEL_ID || DEFAULT_MODEL_ID;

  let upstream: Response;
  try {
    upstream = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_64`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.0, use_speaker_boost: true },
        }),
      }
    );
  } catch {
    return error(502, 'Voice service unreachable.');
  }

  if (!upstream.ok || !upstream.body) {
    console.error('ElevenLabs TTS failed with status', upstream.status);
    return error(502, 'Voice generation failed.');
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      // Browser keeps it a day; Vercel's CDN keeps it for a year.
      'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
    },
  });
}
