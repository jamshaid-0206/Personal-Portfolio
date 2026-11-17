/**
 * Vercel Function: POST /api/chat
 * Body: { messages: { role: 'user' | 'assistant', content: string }[] }
 *
 * Streams a reply from Google Gemini as plain text. The assistant's persona and
 * facts come from src/data/assistant.ts. The API key lives only on the server
 * (GEMINI_API_KEY). If it isn't set the client falls back to its local brain.
 */
import { buildSystemPrompt } from '../src/data/assistant';

const DEFAULT_MODEL = 'gemini-2.5-flash';
const MAX_MESSAGES = 12; // conversation turns sent upstream
const MAX_CHARS_PER_MESSAGE = 600;
const MAX_TOTAL_CHARS = 5000;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

function error(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function sanitize(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const msgs: ChatMessage[] = [];
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const role = (m as ChatMessage)?.role;
    const content = (m as ChatMessage)?.content;
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
    const text = content.trim().slice(0, MAX_CHARS_PER_MESSAGE);
    if (text) msgs.push({ role, content: text });
  }
  // Gemini needs the conversation to start with a user turn and end with one.
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return null;
  if (msgs.reduce((n, m) => n + m.content.length, 0) > MAX_TOTAL_CHARS) return null;
  return msgs;
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return error(503, 'Assistant AI is not configured.');

  const url = new URL(request.url);
  const referer = request.headers.get('referer');
  if (referer) {
    try {
      if (new URL(referer).host !== url.host) return error(403, 'Forbidden.');
    } catch {
      return error(403, 'Forbidden.');
    }
  }

  let messages: ChatMessage[] | null;
  try {
    messages = sanitize(await request.json());
  } catch {
    messages = null;
  }
  if (!messages) return error(400, 'Invalid conversation.');

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const generationConfig: Record<string, unknown> = { temperature: 0.5, maxOutputTokens: 450 };
  // 2.5 Flash "thinks" by default; this assistant answers from a fact sheet, so skip it for speed.
  if (/2\.5-flash/.test(model)) generationConfig.thinkingConfig = { thinkingBudget: 0 };

  let upstream: Response;
  try {
    upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
          contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
          generationConfig,
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ],
        }),
      }
    );
  } catch {
    return error(502, 'Assistant AI unreachable.');
  }

  if (!upstream.ok || !upstream.body) {
    let reason = '';
    try {
      const b = await upstream.json();
      reason = [b?.error?.status, b?.error?.message].filter(Boolean).join(' — ');
    } catch {
      /* not JSON */
    }
    console.error(`Gemini request failed with status ${upstream.status}${reason ? `: ${reason}` : ''}`);
    return error(502, 'Assistant AI failed.');
  }

  // Convert Gemini's SSE stream into a plain-text stream of reply chunks.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = '';
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        let nl: number;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line.startsWith('data:')) continue;
          try {
            const evt = JSON.parse(line.slice(5));
            const parts = evt?.candidates?.[0]?.content?.parts ?? [];
            const text = parts.map((p: { text?: string; thought?: boolean }) => (p.thought ? '' : p.text ?? '')).join('');
            if (text) controller.enqueue(encoder.encode(text));
          } catch {
            /* ignore partial / keep-alive lines */
          }
        }
      },
    })
  );

  return new Response(stream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}
