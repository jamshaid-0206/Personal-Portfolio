import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

/**
 * Dev-only: serve the Vercel functions in /api (tts, chat) with `npm run dev`
 * too, streaming responses through. Reads ELEVENLABS_* / GEMINI_* from .env.local.
 */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const m = req.url?.match(/^\/api\/([a-z]+)(?:\?|$)/);
        if (!m) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${m[1]}.ts`);
          const handler = mod[req.method ?? 'GET'];
          if (typeof handler !== 'function') {
            res.statusCode = 405;
            return res.end();
          }
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const headers: Record<string, string> = {};
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers[k] = v;
          const r: Response = await handler(
            new Request(`http://${req.headers.host}${req.url}`, {
              method: req.method,
              headers,
              body: chunks.length ? Buffer.concat(chunks) : undefined,
            })
          );
          res.statusCode = r.status;
          r.headers.forEach((v, k) => res.setHeader(k, v));
          if (r.body) {
            const reader = r.body.getReader();
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
          }
          res.end();
        } catch (e) {
          res.statusCode = 500;
          res.end(String(e));
        }
      });
    },
  };
}

/**
 * Social link previews (WhatsApp, LinkedIn, X…) read static HTML only and need
 * absolute image URLs. On Vercel the production domain is known at build time.
 */
function socialMeta(): Plugin {
  const site =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
  return {
    name: 'social-meta',
    transformIndexHtml(html) {
      if (!site) return html;
      const base = site.replace(/\/$/, '');
      const title = 'Jamshaid Ghafoor — Full-Stack Developer';
      const desc = 'Full-stack developer building fast, beautiful web and mobile products with React, React Native, Node.js and WordPress.';
      const tags = [
        `<meta property="og:type" content="website" />`,
        `<meta property="og:url" content="${base}/" />`,
        `<meta property="og:title" content="${title}" />`,
        `<meta property="og:description" content="${desc}" />`,
        `<meta property="og:image" content="${base}/images/jamshaid-og.jpg" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:image" content="${base}/images/jamshaid-og.jpg" />`,
      ].join('\n    ');
      return html.replace('</head>', `    ${tags}\n  </head>`);
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), ['ELEVENLABS_', 'GEMINI_']);
  Object.assign(process.env, env);
  return {
    plugins: [react(), tailwindcss(), devApi(), socialMeta()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-dom/client', 'react-router-dom', 'react-helmet-async'],
            motion: ['motion', 'motion/react'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
