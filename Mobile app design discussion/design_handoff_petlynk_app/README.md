# Handoff: Pet Lynk — aplicação móvel (19 ecrãs)

## Overview
Pet Lynk é um marketplace português (PT-PT) que liga tutores de animais a cuidadores
verificados. Esta entrega cobre a aplicação móvel completa: **14 ecrãs do lado do tutor**
e **5 ecrãs do lado do cuidador/prestador**, numa só conta com um interruptor de papel
("Modo cuidador") nas definições.

O que o produto tem de acertar, por ordem: **confiança** (identidade e registo criminal
validados, referências contactadas, avaliações com foto), **pagamento seguro** (o valor
fica retido pelo Pet Lynk e só é libertado quando o serviço termina) e o **registo médico**
do animal, que é partilhado com o cuidador no momento da reserva.

## About the Design Files
Os ficheiros em `design/` são **referências de design escritas em HTML** — protótipos que
mostram aparência e comportamento pretendidos. **Não são código de produção para copiar.**
A tarefa é **recriar estes ecrãs no ambiente existente da app** (React Native, Flutter,
SwiftUI, Kotlin/Compose…) usando os padrões e bibliotecas já estabelecidos nesse projeto.
Se ainda não existir base de código, escolhe a stack mais adequada — sendo um produto
móvel PT com MB WAY e Apple Pay, React Native ou Flutter são as escolhas naturais — e
implementa lá.

Nota sobre a mecânica dos ficheiros: são "Design Components" (`.dc.html`) com um pequeno
runtime (`support.js`), template + classe de lógica. Abre-os num browser para ver os ecrãs;
ignora completamente essa mecânica na implementação — só o desenho interessa.

## Fidelity
**Alta fidelidade (hifi).** Cores, tipografia, espaçamento, raios e estados estão finais e
devem ser reproduzidos fielmente com os componentes da base de código. Todos os valores
exatos estão em *Design Tokens* mais abaixo.

Um único elemento é deliberadamente representativo e não final: o **mapa** no ecrã 10
(Acompanhamento) é um SVG desenhado à mão a simular um mapa. Substituir por mapa real
(MapKit / Google Maps / Mapbox) com a rota GPS do passeio.

---

## Design Tokens

### Cores
| Papel | Valor | Onde |
| --- | --- | --- |
| Fundo da app | `#fdffe6` | fundo de todos os ecrãs de telefone |
| Fundo do quadro de apresentação | `#f3f1e7` | só a página de revisão, não a app |
| Texto principal | `#1a1a18` | títulos, corpo, botões primários (fundo) |
| Texto secundário | `#6b6b60` | legendas, metadados, labels |
| Texto terciário / placeholder | `#9a9a8c` | placeholders, timestamps |
| Verde musgo (accent) | `#7a9e6e` | ícones ativos, confirmações, links, toggles |
| Verde musgo escuro | `#5f7f55` | texto e ícones sobre fundo verde claro |
| Verde musgo profundo | `#4f6b46` | corpo de texto em painéis verdes |
| Sage (blob / avatar) | `#b8cba0` | blob de fundo, avatares |
| Lavanda (blob / cuidador) | `#c5c3e0` | blob de fundo, avatares, chrome do modo cuidador |
| Lavanda escura | `#3c3a5c` | inicial dentro de avatar lavanda |
| Areia | `#e8cdb5` | blob de fundo, avatares |
| Terracota (aviso) | `#c67139` | pontos de notificação, avisos |
| Terracota escura | `#a85c2c` / `#8f4f26` | ícone e texto de aviso |
| Superfície de cartão | `rgba(255,255,240,0.82)` a `0.92` | todos os cartões |
| Bordo de cartão | `0.5px solid rgba(100,110,80,0.16)` | todos os cartões |
| Bordo de campo | `0.5px solid rgba(100,110,80,0.25)` | inputs |
| Régua interna | `0.5px solid rgba(100,110,80,0.14)` | separadores dentro de listas |
| Ícone de separador inativo | `rgba(60,62,50,0.42)` | barra inferior |
| Fill verde claro | `rgba(120,158,110,0.14)` / bordo `0.3` | selos "Verificado", "Em dia" |
| Fill terracota claro | `rgba(198,113,57,0.10)` / bordo `0.30` | avisos de vacina |
| Fill lavanda claro | `rgba(197,195,224,0.22)` / bordo `rgba(120,115,180,0.25)` | cartão "Modo cuidador" |

### Fundo dos ecrãs (assinatura visual — replicar)
Sobre `#fdffe6`, três círculos desfocados de tamanhos diferentes, em `position:absolute`,
mais uma camada de grão:
- lavanda `#c5c3e0`, 400×400, `blur(70px)`, opacidade 0.50, `top:-120px; left:-140px`
- sage `#b8cba0`, 360×360, `blur(70px)`, opacidade 0.45, `bottom:-60px; right:-120px`
- areia `#e8cdb5`, 280×280, `blur(70px)`, opacidade 0.40, `top:38%; left:40%`
- grão: ruído fractal (`feTurbulence baseFrequency 0.85, 3 octaves`), opacidade 0.30,
  `mix-blend-mode: multiply`, em tile de 160×160

Em nativo: um gradiente radial em camadas ou uma imagem de fundo pré-renderizada por
tema, com uma textura de ruído em cima. Os blobs não se movem nem reagem ao scroll.

### Tipografia
- **Display:** Averia Libre (700, e 300 itálico para ênfase). Nomes de animais e pessoas
  aparecem em **itálico peso 400** — é a assinatura da marca ("*Boris*", "*petsitting*").
- **Corpo/UI:** DM Sans (300, 400, 500).
- Escala usada: 34px título de onboarding · 26–28px títulos de ecrã · 19px títulos de
  cartão · 15px corpo forte · 13.5px item de lista · 12.5px corpo secundário ·
  11.5px metadados · **11px labels de secção** (peso 500, `letter-spacing:0.16em`,
  MAIÚSCULAS) · 10.5px labels dentro de cartão (`letter-spacing:0.10–0.14em`).
- `letter-spacing:-0.02em` a `-0.03em` nos títulos display; `line-height` 1.5–1.65 no corpo,
  1.1–1.2 nos títulos.

### Espaçamento, raios, alvos
- Margem lateral dos ecrãs: **20px** (24px no ecrã de registo).
- Gap entre cartões: 10–12px · entre secções: 18–22px.
- Raios: cartão grande 22–24px · cartão médio 18–20px · cartão pequeno/chip interno 14–16px
  · pílula e avatar `999px` · caixa de verificação 5–6px · bolha de chat 20px com o canto
  do lado do emissor a 6px.
- Alvos de toque: botões primários **52px**, secundários 48px, botões de ícone e itens de
  separador **44px**. Nunca abaixo de 44px.
- Ícones: Lucide, **stroke-width 2.75**, tamanhos 12 / 13 / 16 / 17 / 18 / 19 / 20 / 23px.
- Sombras: os ecrãs em si não usam sombra; só as molduras de telefone na página de revisão.

### Chrome
- **Barra de estado:** 44px, "9:41" à esquerda a 13px/500, ícones de sinal, wifi e bateria
  à direita. É maquete — usar a barra real do sistema.
- **Barra de separadores (tutor):** 64px, `rgba(253,255,230,0.9)` com `blur(12px)`, bordo
  superior `0.5px rgba(100,110,80,0.14)`, 4 itens — Início, Agendamentos, Pesquisa,
  Lembretes. Ativo em `#7a9e6e`, inativo em `rgba(60,62,50,0.42)`.
- **Barra de separadores (cuidador):** mesma métrica mas fundo `rgba(197,195,224,0.35)` e
  bordo `rgba(120,115,180,0.22)` — a mudança de cor é o sinal de que estás do outro lado.
  4 itens — Início, Pedidos (com ponto terracota), Ganhos, Perfil.
- **Sem barra de separadores:** onboarding, criar conta, confirmado, conversa.

---

## Screens / Views

### Lado do tutor

**01 · Onboarding** — `screen="intro"`
Ancorado em baixo, centrado: logótipo 96px, título display 34px "Pet Lynk — o lugar para
*almas gémeas* patudas" (ênfase em itálico 300 verde musgo), parágrafo 14.5px, botão
primário "Começar" (52px, preto, texto creme), botão fantasma "Já tenho conta".
→ "Começar" leva a 02; "Já tenho conta" leva a 03.

**02 · Criar conta** — `screen="signup"`
Botão voltar circular 40px. Kicker "CRIAR CONTA", título "Bem-vindo ao *Pet Lynk*".
Três campos em pílula (48px): Nome, Correio eletrónico, Telemóvel (placeholder
`+351 9XX XXX XXX`). Depois "Quero usar como" — dois cartões lado a lado, Tutor
(selecionado: fundo preto, texto creme) e Cuidador, cada um com subtítulo. Nota:
"Podes ativar os dois mais tarde nas definições." Botão "Criar conta" + linha legal.
Validação: nome não vazio; email formato válido; telemóvel PT de 9 dígitos começado por 9.

**03 · Início** — `screen="home"`
Saudação "Olá, Bia" + "As tuas almas gémeas:"; à direita campânula com ponto terracota
e avatar 44px. Carrossel horizontal de animais: cartões de 150px com foto 104px (raio
16px, `filter: saturate(0.85) contrast(0.95)`), nome em display itálico 19px, raça e idade;
termina num cartão tracejado "Adicionar" de 96px. Depois o cartão preto do próximo
agendamento (kicker, título display, data/hora/local, chevron, e um rodapé com ponto sage
"A Rita chega em 2h — acompanhar em direto"). Grelha de 3 serviços (Passeio, Banho,
Petsitting). No fim, banda de aviso terracota: "A vacina antirrábica do Boris expira em
**12 dias**".
→ cartão de animal → 04 · cartão preto → 10 · serviço → 05 · aviso → 13.

**04 · Perfil e registo médico** — `screen="pet"`
Cabeçalho com foto 76px redonda, nome display itálico 28px, "Golden Retriever · macho ·
4 anos" e selo "Microchip registado". Três estatísticas (Peso 31,2 kg +0,4 · Vacinas 4/5,
1 a expirar · Idade 4 anos). Lista de vacinas com estado por linha (terracota "Renovar
30/05", verde "Em dia"). Medicação ativa num cartão com ícone lavanda. Dois cartões
lado a lado: Alergias, Veterinário. Linha final: Relatórios médicos · 3 ficheiros.

**05 · Pesquisa e filtros** — `screen="search"`
Título display itálico minúsculo "petsitting" + "14 cuidadores verificados perto de
Espinho". Barra de pesquisa em pílula com localização e raio. Chips de serviço com
scroll horizontal (ativo preto). Três cartões de cuidador: avatar colorido com inicial,
nome + escudo verde de verificação, estrela terracota + nota + nº de serviços + tempo de
resposta, bio de 2 linhas, e rodapé separado por régua com selos ("Verificada",
"Primeiros socorros") e preço em display.

**06 · Cuidadora verificada** — `screen="caregiver"`
Voltar + ações (conversa, favorito). Bloco centrado: avatar 88px, nome display 26px,
pílula "Cuidadora verificada", bio. Três estatísticas (4,9 · 98% taxa resposta · 5 anos).
**Painel "Confiança"** — quatro linhas com visto verde: identidade confirmada (Cartão de
Cidadão), registo criminal validado com data, curso de primeiros socorros, 3 referências
de tutores contactadas. Lista de serviços com preços fixos. Avaliação com autor, serviço,
data, nota, texto e **fotos do serviço** (duas de 62px + "+4"). Botão "Agendar com a Rita".

**07 · Agendar** — `screen="book"`
Título "Agendar com Rita". Um cartão único dividido por réguas: seletor de animal (foto
26px + nome + chevron); "Serviço" em chips com preço fixo (Passeio · 12€ selecionado);
Data e Hora em duas colunas; "Infos importantes" — caixa de texto de 74px com placeholder
"Insere aqui informações que possam ser relevantes ao cuidador"; caixa de verificação
verde marcada "Partilhar registo médico do Boris com a Rita". Fora do cartão: Total 12€
em display 24px, botão "Continuar para pagamento", link "voltar".

**08 · Pagamento seguro** — `screen="pay"`
Título "Pagamento *seguro*". Resumo: avatar + "Passeio com a Rita · Boris" + data/hora/
duração, depois Serviço 12,00€ · Taxa Pet Lynk 1,20€ (10%) · **Total 13,20€** em display.
Métodos, um selecionado com bordo verde de 1.5px e visto redondo: **MB WAY** (com número
mascarado), **Cartão ···· 4218** (Visa, validade), **Apple Pay**. Banda verde de garantia:
"O valor fica retido pelo Pet Lynk e só é entregue à Rita quando o serviço terminar."
Botão "Pagar 13,20€ com MB WAY".

**09 · Confirmado** — `screen="confirmed"`
Centrado vertical: círculo verde 76px com visto, título "Agendamento *confirmado*",
parágrafo com nome, dia e hora. Cartão de recibo: Referência PL-4821 · Pago com MB WAY ·
13,20€ · Registo médico **Partilhado**. Botão "Acompanhar serviço" + link "Voltar ao
início". Sem barra de separadores.

**10 · Acompanhamento** — `screen="tracking"`
Voltar + pílula verde "Passeio a decorrer · 22 min" com ponto. **Mapa** de 198px, raio 22px
(placeholder — substituir por mapa real) com rota tracejada verde, marcador de início em
anel e posição atual em disco preto com halo, e um cartão flutuante "Percurso ao vivo ·
1,8 km · Parque de Espinho". Linha do cuidador com botão preto de conversa. **Cronologia**
com pontos e linha vertical: "Pausa na fonte 💧" (17:54, com foto 112px), "Check-in —
saímos de casa" (17:32), "Pagamento retido · 13,20€" (17:20, Pet Lynk).

**11 · Conversa** — `screen="chat"`
Cabeçalho com voltar, avatar 40px, nome + escudo verde, e presença em verde "a passear o
Boris agora". Mensagens: recebidas em cartão creme com canto inferior esquerdo a 6px;
enviadas em preto com canto inferior direito a 6px; foto dentro da bolha; timestamps
10.5px. Indicador de escrita com três pontos. Barra de composição fixa: campo em pílula
46px + botão de envio preto 46px. Sem barra de separadores.

**12 · Agendamentos** — `screen="bookings"`
Três filtros (A decorrer / Próximos / Histórico). Cartão preto do serviço a decorrer com
ponto sage e duração. Cartão "Confirmado" (verde). Dois cartões "Concluído" (neutro), um
com rodapé "Avaliaste 5,0 ★" e ação "Agendar outra vez".

**13 · Vacinas e medicação** — `screen="reminders"`
Cartão terracota em destaque: "A EXPIRAR EM 12 DIAS", "Antirrábica · Boris", data limite e
clínica, botão "Marcar check-up". Secção "Hoje": duas doses de Apoquel, uma com caixa
verde marcada ("08:00 · dado") e outra vazia ("20:00 · a seguir"). Secção "Próximas
semanas" com duas linhas navegáveis.

**14 · Conta e modo cuidador** — `screen="settings"`
Cartão de perfil (avatar 56px, nome display, email · cidade, chevron). **Cartão lavanda
"Modo cuidador"** com toggle ligado (50×29px, calha verde, botão creme 23px) e explicação —
é aqui que se troca de papel. "Confiança e segurança": identidade Concluída (verde),
registo criminal A validar (terracota), métodos de pagamento. "Preferências": três toggles
— lembretes (on), fotos durante o serviço (on), partilhar registo médico (off).

### Lado do cuidador / prestador
Chrome lavanda. Todos estes ecrãs usam a mesma linguagem de cartões.

**15 · Agenda e pedidos** — `screen="cgHome"`
Kicker verde "MODO CUIDADORA" + "Olá, Rita"; à direita pílula verde "Disponível". Três
estatísticas (Esta semana 148€ · Serviços 9 · Avaliação 4,9). "Pedidos a aguardar": o
primeiro com bordo terracota de 1.5px e contagem decrescente "Responde em 4h 12m", foto do
animal, serviço · nome, tutor · cidade · data, preço em display; o segundo em estilo
neutro. "Agenda de hoje": horas em display à esquerda + serviço e local.

**16 · Pedido a aguardar** — `screen="cgRequest"`
Kicker terracota "NOVO PEDIDO · RESPONDE EM 4H", título "Passeio com o *Boris*". Cartão de
detalhe: animal (foto 52px, raça, idade, peso, sexo), data e hora, duração, ponto de
recolha, e **"Recebes 12,00€"** em display 21px. **Painel verde "Registo médico
partilhado"** — alergias, medicação com horas, estado das vacinas: o cuidador vê isto
*antes* de aceitar. Cartão "Nota da Bia" com o pedido em texto livre. Botão primário
"Aceitar pedido", depois dois botões lado a lado: "Perguntar algo" (abre 11) e "Recusar".

**17 · Serviço a decorrer** — `screen="cgActive"`
Pílula verde "Serviço a decorrer" + cronómetro em display "22:14". Linha do serviço com
foto, tutor, hora de início e duração, e botão preto de conversa. "Enviar atualização":
dois botões grandes lado a lado, Foto e Nota. "Enviado à Bia": a atualização com foto e
estado "entregue", e o check-in com "GPS ativo". Botão "Terminar serviço" + nota
"Ao terminar, o Pet Lynk liberta os 12,00€ para a tua conta."

**18 · Ganhos e transferências** — `screen="cgEarnings"`
Cartão preto: "SALDO DISPONÍVEL", **148,40€** em display 36px, "Transferência automática às
sextas para o IBAN ···· 3092", botão creme "Transferir agora". Banda verde: "Passeio do
Boris concluído — 12,00€ libertados às 18:19". Lista "Julho" com três serviços e valores.
Dois cartões: Taxa Pet Lynk 10% por serviço · Recibos 9 emitidos.

**19 · Perfil, preços, disponibilidade** — `screen="cgProfile"`
Cartão de perfil com selo "Verificada" e ação "Editar". Cartão terracota "Falta 1
documento" — enviar certificado de primeiros socorros para obter o selo completo e subir na
pesquisa (liga a confiança à visibilidade). "Serviços e preços" — três linhas editáveis.
"Disponibilidade" — sete pílulas de dia da semana (ativas em verde musgo com texto creme,
inativas em cinza-verde claro) e um toggle "Aceitar pedidos automáticos · De clientes com
3+ serviços" (desligado).

---

## Interactions & Behavior

### Navegação
Um só estado de ecrã conduz tudo (`screen`), com estes trajetos:

Tutor: `intro → signup → home`; `home → pet | tracking | search | reminders | settings`;
`search → caregiver → book → pay → confirmed → tracking`; `caregiver → chat`;
`tracking → chat`; `bookings → tracking`; `reminders → search`.
Voltar: `signup→intro`, `pet→home`, `caregiver→search`, `book→caregiver`, `pay→book`,
`chat→tracking`, `tracking→home`.

Cuidador: `cgHome → cgRequest → cgActive → cgEarnings`; `cgRequest → chat`;
`cgActive → chat`; separadores entre `cgHome | cgRequest | cgEarnings | cgProfile`.
Entrada: toggle "Modo cuidador" no ecrã 14.

### Estados e transições
- Transições entre ecrãs: empurrar horizontal (~250–300ms, curva de saída padrão da
  plataforma). Manter a posição de scroll de cada separador.
- Barra de separadores: o ícone ativo passa a verde musgo; nenhum outro efeito.
- Pressionado: escurecer o botão um passo (preto → `#2c2c2a`; verde → `#5f7f55`); cartões
  clicáveis a 0.97 de opacidade. Foco de teclado/leitor: anel de 2px verde musgo, offset 2px.
- Botão primário desativado: 45% de opacidade.
- Pagamento: enquanto processa, botão em spinner e desativado; sucesso → 09 (círculo verde
  entra com escala 0.9→1 em 220ms); falha → banda terracota sobre os métodos, "Pagamento
  não concluído — tenta outro método", sem sair do ecrã.
- Contagem decrescente do pedido (16): atualizar a cada minuto; abaixo de 1h fica terracota;
  a zero o pedido expira e sai da lista de 15.
- "Aceitar pedido" (16): confirmação nativa antes de aceitar; ao aceitar, o pedido passa a
  17 e o tutor recebe notificação push.
- "Terminar serviço" (17): confirmação nativa; ao confirmar, liberta o pagamento e mostra a
  banda de 18.
- Cronologia e conversa: chegam em tempo real (websocket ou push) — o tutor não deve ter de
  puxar para atualizar durante um serviço ativo.
- Estado de escrita na conversa: três pontos, aparece com 400ms de debounce.

### Estados vazios e de erro que faltam desenhar (não estão nos ecrãs)
Sem animais no 03 · sem cuidadores no raio de pesquisa no 05 · sem agendamentos no 12 ·
sem pedidos no 15 · sem saldo no 18 · sem rede na conversa e no acompanhamento.
Vale desenhar antes de implementar.

### Responsivo
Os ecrãs foram desenhados a **360×760pt**. Larguras maiores esticam os cartões e o carrossel
mostra mais um animal; nada muda de estrutura. Suportar tipo grande (Dynamic Type / escala
de fonte) — os cartões têm de crescer em altura, não truncar. Respeitar as áreas seguras:
o conteúdo termina acima da barra de separadores, que assenta na safe area inferior.

## State Management
- `session`: utilizador, papel ativo (`tutor` | `cuidador`), papéis disponíveis.
- `pets[]`: id, nome, espécie, raça, sexo, data de nascimento, peso (série temporal), foto,
  microchip, alergias[], veterinário, vacinas[] (nome, data, próxima dose, estado),
  medicação[] (nome, dose, horas[], fim), relatórios[] (ficheiro, data).
- `caregivers[]`: perfil, bio, zona, raio, serviços[] (tipo, duração, preço fixo), badges
  de verificação[], taxa e tempo de resposta, avaliação, avaliações[] (autor, nota, texto,
  fotos[]), disponibilidade semanal, aceitação automática.
- `bookings[]`: id, animal, cuidador, serviço, data/hora, duração, local, nota do tutor,
  `shareHealthRecord`, preço, taxa, total, estado
  (`pendente | aceite | a_decorrer | concluído | recusado | cancelado | expirado`),
  estado do pagamento (`retido | libertado | reembolsado`), atualizações[] (tipo, texto,
  foto, hora), rota GPS.
- `conversations[]` / `messages[]`: por reserva, com estado de entrega.
- `reminders[]`: derivados de vacinas e medicação; doses com estado dado/pendente.
- `earnings`: saldo, calendário de transferências, IBAN mascarado, movimentos[], recibos.

Dados: 03/05/12/15 precisam de lista paginada; 10/11/17 precisam de subscrição em tempo
real; 08 precisa de intenção de pagamento no servidor (nunca calcular o total no cliente).

## Assets
- `design/images/logo/` — `logo.svg` e `logo_and_name.svg`, do repositório
  `Dee-Tee11/PetLinkLandingPage`. Usar estes; não redesenhar.
- `design/images/ImagesPets/pet1–4.jpeg` — fotografias do mesmo repositório, usadas como
  Boris, Flora e fotos de serviço. **São placeholders de conteúdo**, não assets de produto.
  Tratamento: `filter: saturate(0.85) contrast(0.95)`, cantos arredondados.
- Ícones: **Lucide**, stroke-width 2.75. Todos os ícones dos ecrãs são Lucide
  (`bell`, `chevron-right`, `arrow-left`, `map-pin`, `shield-check`, `check`, `star`,
  `message-circle`, `heart`, `clock`, `file-text`, `camera`, `credit-card`, `search`,
  `home`, `user`, `pill`, `calendar`, `droplet`, `plus`, `arrow-right`, `chevron-down`).
  Exceção: o glifo da Apple Pay é um path próprio.
- Tipos de letra: **Averia Libre** (300/400/700 + itálicos) e **DM Sans** (300/400/500),
  ambos Google Fonts — empacotar na app, não carregar da rede.

## Files
- `design/Pet Lynk App.dc.html` — a página de revisão: turno 2 (cuidador) no topo, turno 1
  (tutor) abaixo, com o protótipo clicável e a parede dos 14 ecrãs. Abre este primeiro.
- `design/PetLynkScreen.dc.html` — **todos os 19 ecrãs**, um por bloco `<sc-if>` com o
  nome em `screen="…"`. É aqui que estão as medidas e as cores exatas de cada ecrã.
- `design/support.js` — runtime dos ficheiros de design. Irrelevante para a implementação.
- `design/_ds/styles.css` + `readme.md` — o sistema de design Organic (tokens de cor,
  tipografia, espaçamento, raios, sombras e as suas classes de componente). A app segue esta
  direção: creme quente, cantos muito arredondados, pílulas, fotografia lavada.
- `design/github.md` — de onde vieram os mockups originais e o mapeamento ecrã → ficheiro
  de origem.

## Notas de implementação
- **Nunca** calcular o preço ou a taxa no cliente; o servidor devolve serviço, taxa e total.
- O pagamento é **retido** (escrow): autorizar na reserva, capturar/libertar ao concluir.
  MB WAY tem fluxo próprio de confirmação na app do banco — prever o estado de espera.
- A partilha do registo médico é uma permissão por reserva, com fim quando o serviço acaba.
  O toggle global no 14 é o valor por omissão, não uma autorização permanente.
- Os selos de verificação são estado do servidor, nunca introduzidos pelo cuidador.
- Copy em **PT-PT** (não PT-BR): "telemóvel", "correio eletrónico", "morada". Valores em
  euros com **vírgula decimal** e o símbolo depois do número (`13,20€`); datas
  `DD/MM/AAAA`; horas em 24h.
