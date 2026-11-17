import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

/**
 * Dev-only: serve the Vercel function at /api/tts so the cloned voice works
 * with `npm run dev` too (reads ELEVENLABS_* from .env.local).
 */
function devApi(): Plugin {
  return {
    name: 'dev-api-tts',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/tts.ts');
          const r: Response = await mod.GET(
            new Request(`http://${req.headers.host}${req.originalUrl}`, {
              headers: req.headers.referer ? { referer: req.headers.referer } : {},
            })
          );
          res.statusCode = r.status;
          r.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(Buffer.from(await r.arrayBuffer()));
        } catch (e) {
          res.statusCode = 500;
          res.end(String(e));
        }
      });
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), 'ELEVENLABS_');
  Object.assign(process.env, env);
  return {
    plugins: [react(), tailwindcss(), devApi()],
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
