import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

function localChatApiPlugin(env: Record<string, string>) {
  return {
    name: 'local-chat-api',
    configureServer(server: any) {
      server.middlewares.use('/api/chat', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }

        let body = '';
        req.on('data', (chunk: any) => { body += chunk; });
        req.on('end', async () => {
          try {
            const { messages } = JSON.parse(body || '{}');
            const apiKey = env.OPENROUTER_API_KEY || env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
            if (!apiKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: 'No API key configured' }));
            }

            const candidateModels = [
              "openrouter/auto",
              "deepseek/deepseek-chat",
              "meta-llama/llama-3.3-70b-instruct",
              "google/gemini-2.0-flash-001"
            ];

            for (const model of candidateModels) {
              try {
                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Vikings Gym AI Coach"
                  },
                  body: JSON.stringify({
                    model,
                    messages,
                    temperature: 0.4,
                    max_tokens: 220
                  })
                });

                if (!response.ok) continue;

                const data = await response.json();
                const reply = data?.choices?.[0]?.message?.content?.trim();
                if (reply) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  return res.end(JSON.stringify({ reply }));
                }
              } catch {
                continue;
              }
            }

            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'Upstream models failed' }));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), localChatApiPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
                return 'vendor-react';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              if (id.includes('motion')) {
                return 'vendor-motion';
              }
            }
          },
        },
      },
    },
    esbuild: {
      drop: ['debugger'],
      legalComments: 'none',
    },
  };
});
