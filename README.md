# Pet Lynk — Landing Page

Landing page de captação para o teste beta do **Pet Lynk**, uma aplicação de gestão de cuidados para animais de estimação (perfil do animal, cuidadores próximos, agendamentos e histórico de saúde).

Site de uma única página, estático, escrito inteiramente em `index.html` — sem build, sem dependências, sem gestor de pacotes.

## Estrutura

```
.
├── index.html          # página completa: markup + CSS + JS inline (~680 linhas)
└── images/
    ├── logo/           # logo.svg (favicon e nav) e logo_and_name.svg
    ├── imagesDemo/     # mockups SVG dos ecrãs da app (início, serviços, pets)
    ├── imagesFounders/ # fotos dos três fundadores
    └── ImagesPets/     # fotos dos animais para o mosaico "Bastidores"
```

## Secções da página

| Secção | Descrição |
| --- | --- |
| Nav | Fixa, com blur de fundo e CTA para o formulário (`#beta`) |
| Hero | Título, subtítulo e pill animada; blobs coloridos em animação de fundo |
| Mockup strip | Nove mockups SVG em molduras de telemóvel, com hover em escala |
| O que é | Quatro cartões de funcionalidades |
| Quem somos | Cartões dos três cofundadores (Rita, Bia, Diogo) |
| Bastidores | Mosaico de fotos de animais em grelha, com lightbox ao clicar |
| Teste beta | Formulário de candidatura ao beta |
| Rodapé | Cartões da equipa com LinkedIn + créditos |

## Detalhes técnicos

**Estilo** — CSS puro com variáveis em `:root` (paleta `--cream`, `--sage`, `--lavender`, `--moss`, `--charcoal`). Tipografia via Google Fonts: *Averia Libre* (títulos) e *DM Sans* (corpo). Responsivo através de media queries (breakpoints principais a 900px e 480px).

**JavaScript** — três blocos inline, sem bibliotecas:
- Lightbox do mosaico de animais (clique para abrir, `✕`/clique fora/`Esc` para fechar)
- `IntersectionObserver` que aplica a classe `.visible` aos elementos `.reveal` à medida que entram no viewport (animações de entrada escalonadas com `.reveal-delay-1..3`)
- `submitForm()` — valida nome, email, telemóvel e checkbox de consentimento, depois faz `POST` em JSON para a [Web3Forms](https://web3forms.com) API e troca o formulário por uma mensagem de sucesso

**Formulário** — o `access_key` do Web3Forms está em `index.html` como `input` escondido; é uma chave pública destinada a ficar no cliente, mas ao rodá-la é preciso atualizá-la aqui. Os campos enviados são: nome, email, telemóvel, cidade, número de animais, tipo de animal, perfil de utilização e mensagem livre.

**Analytics** — Vercel Web Analytics via `/_vercel/insights/script.js`, injetado apenas quando servido na Vercel.

**Idioma** — todo o conteúdo está em português europeu (`<html lang="pt">`).

## Como correr localmente

Basta abrir o ficheiro:

```bash
xdg-open index.html
```

Para testar com caminhos absolutos e o comportamento real de servidor, serve a pasta:

```bash
python3 -m http.server 8000
# depois: http://localhost:8000
```

O script de analytics da Vercel dará 404 em local — é esperado e não afeta a página.

## Deploy

Deployment estático na **Vercel**, a partir do repositório [Dee-Tee11/PetLinkLandingPage](https://github.com/Dee-Tee11/PetLinkLandingPage) (branch `main`). Não há passo de build: a raiz do repositório é servida tal como está.

## Editar conteúdos

- **Textos** — diretamente no markup em `index.html` (a partir da linha 304).
- **Mockups** — substituir os SVG em `images/imagesDemo/` e ajustar as `.phone-caption` correspondentes.
- **Fotos de animais** — colocar em `images/ImagesPets/` e adicionar um `.pet-tile`; nota que a grelha do mosaico usa regras `nth-child` fixas (`.pet-tile:nth-child(1|6|7|8)` ocupam duas colunas), portanto mudar o número de fotos obriga a rever essas regras.
- **Paleta** — variáveis CSS no bloco `:root`, no topo do `<style>`.
