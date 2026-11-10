# Site Pessoal / Portfólio — CP3

**Aluno:** João Pedro Ribeiro Otreira
**Disciplina:** Desenvolvimento Front-End Para Web
**Checkpoint:** CP3 — Git, deploy com HTTPS e JavaScript com `localStorage`

Evolução do site do CP2 (responsivo, mobile-first). As 5 páginas foram mantidas
e ganharam interatividade com JavaScript.

## Links da entrega

- **Site publicado (HTTPS):** `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`
- **Repositório:** `https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO`
- **Tag da entrega:** `cp3-entrega`

> Substitua os endereços acima pelos seus links reais antes de entregar.

## Estrutura do projeto

```
├── index.html        → quem sou eu, foto e resumo de interesses
├── curriculo.html    → formação, experiência, tecnologias e contato
├── formulario.html   → formulário de contato (validação + rascunho)
├── multimidia.html   → áudio, vídeo e mapa
├── graficos.html     → gráfico em canvas e ícone SVG
├── css/estilos.css   → estilos mobile-first + paleta do tema escuro
├── js/scripts.js     → todo o JavaScript do site
├── img/              → foto de perfil e música favorita
├── .gitignore
└── README.md
```

## Features com JavaScript

### 1. Tema claro/escuro (todas as páginas)

O botão com ícone de lua/sol, no final do menu de **todas** as páginas, alterna
entre o tema claro e o escuro. A escolha é lembrada nas próximas visitas e vale
para o site inteiro.

- Na primeira visita, o site segue a preferência do sistema do visitante.
- O tema é aplicado ainda no `<head>`, para a página não "piscar" no tema errado.
- Se o visitante trocar o tema em outra aba, as abas abertas acompanham.

### 2. Formulário com validação e feedback na tela (`formulario.html`)

- Cada campo mostra a mensagem de erro logo abaixo e fica com borda vermelha.
- Ao enviar com erro, aparece um resumo ("Revise os campos: ...") e o foco vai
  para o primeiro campo inválido.
- Regras: nome e sobrenome; e-mail válido; assunto escolhido; mensagem com pelo
  menos 10 caracteres; telefone com DDD (obrigatório só se a forma de contato
  preferida for telefone); data de retorno não pode estar no passado.
- Os erros somem sozinhos conforme o visitante corrige cada campo.
- Não há servidor: ao enviar com tudo certo, o site mostra uma confirmação na
  tela e limpa o formulário, mas a mensagem não é enviada a ninguém.

### 3. Rascunho do formulário

O que o visitante digita é salvo automaticamente. Se ele recarregar ou fechar a
página, os campos voltam preenchidos com o aviso "Recuperamos o rascunho..." e o
botão **Descartar rascunho**. O rascunho é apagado ao enviar o formulário.

## O que é persistido no `localStorage`

| Chave | Conteúdo | Quando muda |
|---|---|---|
| `portfolio:tema` | `"claro"` ou `"escuro"` | ao clicar no botão de tema |
| `portfolio:rascunho-contato` | JSON com nome, e-mail, telefone, assunto, data, forma de contato, interesses, mensagem e `salvoEm` | enquanto digita; removida ao enviar ou descartar |

Os dados ficam **somente no navegador** do visitante e nunca são enviados a um servidor.

## Como testar

1. Abra o site (publicado ou com `index.html` no navegador).
2. **Tema:** clique no botão de lua/sol no menu, recarregue a página e navegue
   por outras páginas: o tema escolhido continua.
3. **Validação:** em `formulario.html`, clique em *Enviar mensagem* com o
   formulário vazio e depois digite um e-mail inválido (ex.: `joao@x`).
4. **Rascunho:** digite um nome e uma mensagem, aguarde um instante e recarregue
   a página: os campos voltam preenchidos.
5. **Conferir no DevTools:** `F12` → *Application* → *Local Storage* → selecione o
   endereço do site e veja as chaves `portfolio:tema` e `portfolio:rascunho-contato`.
6. **Responsivo:** `Ctrl + Shift + M` e teste em 320 px, 768 px e 1024 px.

## Versionamento

- `main`: versão estável do site.
- `feature/tema-escuro`: tema claro/escuro com `localStorage` (mesclada na `main`).
- `feature/validacao-formulario`: validação e rascunho do formulário (mesclada na `main`).
- Tag `cp3-entrega`: marca o estado exato do código entregue no CP3.

## Validação

- HTML: [W3C Markup Validator](https://validator.w3.org/nu/) — sem erros nem avisos.
- CSS: [W3C CSS Validator](https://jigsaw.w3.org/css-validator/) — sem erros (use *upload de arquivo* com `css/estilos.css`).
