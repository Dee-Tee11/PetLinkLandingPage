# Pet Lynk — webapp

Os 19 ecrãs do handoff móvel (`../Mobile app design discussion/design_handoff_petlynk_app/`),
recriados como **webapp para telemóvel**: 14 ecrãs do lado do tutor e 5 do lado do cuidador,
com todos os trajetos de navegação a funcionar.

**Protótipo navegável, com dados falsos.** Não há login real, servidor, nem pagamentos —
o estado vive em memória e volta ao início quando recarregas a página. O esquema da base de
dados que isto vai consumir está em [`../db/`](../db/).

A landing page em [`../index.html`](../index.html) não é tocada — continua a funcionar tal como está.

## Correr

```bash
npm install
npm run dev              # http://localhost:5173
npm run dev -- --host    # para abrir pelo IP num telemóvel na mesma rede
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção para `dist/` |
| `npm run preview` | serve o build |
| `npm run smoke` | renderiza as 25 rotas em Node (SSR) e falha se alguma rebentar |

## Rotas

| Ecrã | Rota | Ecrã | Rota |
| --- | --- | --- | --- |
| 01 Onboarding | `/` | 11 Conversa | `/conversa/:bookingId` |
| 02 Criar conta | `/registo` | 12 Agendamentos | `/agendamentos` |
| 03 Início | `/inicio` | 13 Lembretes | `/lembretes` |
| 04 Registo médico | `/animal/:petId` | 14 Conta | `/conta` |
| 05 Pesquisa | `/pesquisa` | 15 Agenda do cuidador | `/cuidar` |
| 06 Cuidador | `/cuidador/:caregiverId` | 16 Pedido | `/cuidar/pedido/:bookingId` |
| 07 Agendar | `/agendar` | 17 Serviço a decorrer | `/cuidar/servico` |
| 08 Pagamento | `/pagamento` | 18 Ganhos | `/cuidar/ganhos` |
| 09 Confirmado | `/confirmado` | 19 Perfil do cuidador | `/cuidar/perfil` |
| 10 Acompanhamento | `/acompanhar/:bookingId` | | |

A barra de separadores desaparece em `/`, `/registo`, `/confirmado` e `/conversa/*`, e passa
a lavanda em todas as rotas `/cuidar/*` — a mudança de cor é o sinal de que estás do outro lado.

**Como chegar ao lado do cuidador:** `/conta` → interruptor "Modo cuidador" → botão
"Ir para o modo cuidador".

## Percursos para experimentar

**Reserva ponta a ponta** — `/` → Começar → Criar conta → escolher um serviço no início →
um cuidador → Agendar (escolhe data e hora) → Pagamento → Confirmado → Acompanhar → Conversa.

**Lado do cuidador** — `/conta` → Modo cuidador → `/cuidar` → abrir o pedido a aguardar →
Aceitar → enviar uma foto e uma nota → Terminar serviço → os 12,00€ aparecem em Ganhos.

## Estrutura

```
src/
  App.jsx              # as 19 rotas
  state/AppState.jsx   # sessão, animais, cuidadores, reservas, conversas, preferências
  data/mock.js         # os dados falsos (Bia, Rita, Boris, Flora)
  lib/format.js        # euros, datas, horas e plurais em PT-PT
  styles/tokens.css    # os tokens do handoff — a fonte de verdade das cores
  styles/base.css      # reset, escala tipográfica, foco
  styles/components.css
  components/          # AppShell, TabBar, StatusBar, Icon + primitivos em ui.jsx
  screens/tutor/       # 14 ecrãs
  screens/caregiver/   # 5 ecrãs
```

## Notas de implementação

- **O `_ds/` do handoff é outro tema.** `design/_ds/styles.css` descreve o sistema "Organic"
  (Caprasimo + Figtree, fundo `#f5ead8`) que **não corresponde aos ecrãs**. A fonte de verdade
  é a secção *Design Tokens* do README do handoff e os estilos de `PetLynkScreen.dc.html`.
- **Barra de estado.** A maqueta "9:41" do design só aparece com `?statusbar=1` — numa webapp
  real quem a desenha é o sistema.
- **Mapa do ecrã 10.** É o SVG placeholder do handoff. Substituir por mapa real
  (MapKit / Google Maps / Mapbox) com a rota GPS — há um `TODO` em `screens/tutor/Tracking.jsx`.
- **Apple Pay falha de propósito** no ecrã de pagamento, para o estado de erro do handoff ser
  visível sem inventar um servidor de pagamentos. MB WAY e cartão passam.
- **Câmara e notas** no ecrã 17 usam uma foto de placeholder e um `prompt()` do browser;
  aceitar e terminar serviço usam `confirm()` no lugar da confirmação nativa.
- **Preços no cliente.** O total é calculado em `AppState.jsx` só para o ecrã ter o que
  mostrar. Em produção vem sempre do servidor — nunca do cliente.
- **Ícones.** Lucide a stroke-width 2.75, importados um a um em `components/Icon.jsx`
  (`import * as lucide` traz o pacote inteiro, +800 kB). Ícone novo → acrescentar ao mapa.
- **Fotografias.** `public/images/pets/` são placeholders de conteúdo, não assets de produto.

## Instalar no telemóvel

Há um `manifest.webmanifest` com `display: standalone`, por isso "Adicionar ao ecrã principal"
dá ícone próprio e ecrã inteiro. Não há service worker — sem dados reais não há nada para
guardar em cache offline.

## Passos seguintes

1. Ligar ao esquema de [`../db/`](../db/) através de uma API, substituindo `data/mock.js`.
2. Autenticação a sério e o papel ativo vindo da sessão.
3. Tempo real na conversa e no acompanhamento (websocket ou push).
4. Pagamentos reais com escrow (MB WAY tem fluxo próprio de confirmação na app do banco).
5. Se for para as lojas: Capacitor por cima deste mesmo código.
