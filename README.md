# CP2 — Site Pessoal / Portfólio responsivo

**Aluno:** João Pedro Ribeiro Otreira
**Disciplina:** Desenvolvimento Front-End Para Web
**Checkpoint:** CP2 — Responsividade (Flexbox, Grid e media queries)

Evolução do site do CP1: todas as páginas foram mantidas e adaptadas.

## Estrutura do projeto

```
CP2_Joao_Pedro_Otreira/
├── index.html        → quem sou eu, foto e resumo de interesses
├── curriculo.html    → formação, experiência, tecnologias e contato
├── formulario.html   → formulário de contato
├── multimidia.html   → áudio, vídeo e mapa
├── graficos.html     → canvas (JS) e SVG
├── css/estilos.css   → folha de estilos única (mobile-first)
├── img/              → foto, música e prints do CP1
└── README.md
```

## O que foi feito no CP2

**Flexbox**
- Cabeçalho/menu: `display: flex` com `flex-wrap`; no mobile os itens quebram
  de linha e ocupam a largura toda, no desktop o menu fica à direita do título.
- Perfil (index), lista de interesses em cartões, campos do formulário e
  contêineres de mídia também usam Flexbox.

**Grid**
- `curriculo.html`: `grid-template-areas` — 1 coluna (mobile), 2 colunas (768 px)
  e 3 colunas (1024 px).
- `multimidia.html`: 2 colunas a partir de 1024 px (vídeo e mapa lado a lado).
- `graficos.html`: 2 colunas a partir de 640 px.

**Media queries (somente `min-width`)** — 640 px, 768 px e 1024 px.

**Mídias responsivas** — `img, video { max-width: 100%; height: auto; }`,
canvas e SVG também se ajustam à largura.

**Acessibilidade no toque** — links, botões e campos com altura mínima de ~44 px.

## Correções pendentes do CP1

- Foto de perfil: o caminho `C:\Users\...` foi trocado por `img/foto-perfil.jpg`.
- Arquivos `foto-perfil.jpg.jpg` e `musica-favorita.mp3.mp3` renomeados e
  movidos para `img/`, conforme referenciado no HTML.

## Como testar

Abra `index.html` e use o Device Toolbar do DevTools (`Ctrl + Shift + M`)
em 320 px, 768 px e 1024 px.

## Validação

- HTML: [W3C Markup Validator](https://validator.w3.org/)
- CSS: [W3C CSS Validator](https://jigsaw.w3.org/css-validator/)
