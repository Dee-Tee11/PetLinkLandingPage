import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

/**
 * Um só site: a landing page estática (../index.html) em `/`, a app em `/app/`.
 * Em produção o script scripts/assemble-site.mjs junta as duas em dist/.
 * Em desenvolvimento é este middleware que serve a landing e as imagens
 * partilhadas, para `npm run dev` dar o site inteiro num só servidor.
 */
function landingSite() {
  return {
    name: 'petlynk-landing',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url || '/').split('?')[0]);

        if (url === '/' || url === '/index.html') {
          res.setHeader('Content-Type', MIME['.html']);
          res.end(fs.readFileSync(path.join(repoRoot, 'index.html')));
          return;
        }

        // As fotografias e o logótipo são partilhados pela landing e pela app.
        if (url.startsWith('/images/')) {
          const file = path.join(repoRoot, url);
          if (file.startsWith(path.join(repoRoot, 'images')) && fs.existsSync(file)) {
            res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream');
            res.end(fs.readFileSync(file));
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig({
  base: '/app/',
  plugins: [react(), landingSite()],
  build: {
    outDir: path.join(repoRoot, 'dist/app'),
    emptyOutDir: true,
  },
  server: { port: 5173 },
});
