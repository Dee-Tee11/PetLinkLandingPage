import { render } from '../dist-ssr/entry.js';

const routes = [
  '/', '/registo', '/inicio', '/animal/p-boris', '/animal/p-flora', '/pesquisa',
  '/cuidador/u-rita', '/cuidador/u-carla', '/cuidador/u-tomas', '/agendar',
  '/confirmado', '/acompanhar/b-001', '/acompanhar/b-003', '/conversa/b-001',
  '/agendamentos', '/lembretes', '/conta',
  '/cuidar', '/cuidar/pedido/b-002', '/cuidar/pedido/naoexiste', '/cuidar/servico',
  '/cuidar/ganhos', '/cuidar/perfil', '/rota-inexistente',
];

let failed = 0;
for (const r of routes) {
  try {
    const html = render(r);
    console.log(`ok    ${r.padEnd(26)} ${html.length} chars`);
  } catch (e) {
    failed++;
    console.log(`FALHA ${r.padEnd(26)} ${e.message}`);
  }
}
process.exit(failed ? 1 : 0);
