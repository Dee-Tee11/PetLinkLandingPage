/**
 * Junta a landing page e a app numa só pasta dist/, para deploy único:
 *
 *   dist/index.html   → a landing page (../index.html, sem alterações)
 *   dist/images/      → fotografias e logótipos, partilhados pelas duas
 *   dist/app/         → a webapp (produzida pelo `vite build`)
 *
 * Corre depois do `vite build` — ver o script "build" do package.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '../..');
const dist = path.join(repoRoot, 'dist');

if (!fs.existsSync(path.join(dist, 'app'))) {
  console.error('dist/app não existe — corre o `vite build` primeiro.');
  process.exit(1);
}

fs.copyFileSync(path.join(repoRoot, 'index.html'), path.join(dist, 'index.html'));
fs.cpSync(path.join(repoRoot, 'images'), path.join(dist, 'images'), { recursive: true });

const count = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true, recursive: true }).filter((e) => e.isFile()).length;

console.log(`site pronto em dist/ — landing + ${count(path.join(dist, 'images'))} imagens + app`);
