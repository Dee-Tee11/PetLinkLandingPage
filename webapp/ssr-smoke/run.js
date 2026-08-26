import { render } from '../dist-ssr/entry.js';

const routes = [
  '/', '/registo', '/inicio', '/animal/p-boris', '/animal/p-flora', '/pesquisa',
  '/cuidador/u-rita', '/cuidador/u-carla', '/cuidador/u-tomas', '/agendar',
  '/confirmado', '/acompanhar/b-001', '/acompanhar/b-003', '/conversa/b-001',
  '/agendamentos', '/lembretes', '/conta',
  '/cuidar', '/cuidar/pedido/b-002', '/cuidar/pedido/naoexiste', '/cuidar/servico',
  '/cuidar/ganhos', '/cuidar/perfil', '/rota-inexistente',
];

/* O layout depende da largura da janela. Em Node não há window, por isso
   simulamos as duas: sem window = telemóvel, com matchMedia a dar true = desktop. */
function withViewport(desktop, fn) {
  if (!desktop) return fn();
  globalThis.window = {
    matchMedia: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }),
    location: { search: '' },
  };
  try {
    return fn();
  } finally {
    delete globalThis.window;
  }
}

let failed = 0;
for (const [label, desktop] of [['telemóvel', false], ['desktop', true]]) {
  console.log(`\n── ${label} ──`);
  for (const r of routes) {
    try {
      const html = withViewport(desktop, () => render(r));
      console.log(`ok    ${r.padEnd(26)} ${html.length} chars`);
    } catch (e) {
      failed++;
      console.log(`FALHA ${r.padEnd(26)} ${e.message}`);
    }
  }
}
process.exit(failed ? 1 : 0);
