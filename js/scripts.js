/* ==========================================================================
   scripts.js - Site Pessoal / Portfólio - João Pedro Ribeiro Otreira
   Código JavaScript de todas as páginas (carregado no <head>).

   Conteúdo:
   - Armazenamento seguro em localStorage (utilitários)
   - Tema claro/escuro lembrado entre visitas (todas as páginas)
   - Gráfico de barras em <canvas> (graficos.html)
   ========================================================================== */
'use strict';

/* ---------- Utilitários de localStorage ----------
   O localStorage pode lançar erro (modo privado, armazenamento bloqueado ou
   cheio). Por isso toda leitura e escrita passa por try/catch: se falhar, o
   site continua funcionando, só não lembra a preferência. */

function lerArmazenamento(chave) {
    try {
        return window.localStorage.getItem(chave);
    } catch (erro) {
        return null;
    }
}

function gravarArmazenamento(chave, valor) {
    try {
        window.localStorage.setItem(chave, valor);
        return true;
    } catch (erro) {
        return false;
    }
}

function removerArmazenamento(chave) {
    try {
        window.localStorage.removeItem(chave);
    } catch (erro) {
        // sem armazenamento disponível: nada a remover
    }
}

/* ---------- Tema claro/escuro (todas as páginas) ----------
   Chave no localStorage: "portfolio:tema" -> "claro" | "escuro"
   Sem escolha salva, segue a preferência do sistema do visitante. */

const CHAVE_TEMA = 'portfolio:tema';

function temaInicial() {
    const salvo = lerArmazenamento(CHAVE_TEMA);
    if (salvo === 'claro' || salvo === 'escuro') {
        return salvo;
    }
    const sistemaEscuro = window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return sistemaEscuro ? 'escuro' : 'claro';
}

function aplicarTema(tema) {
    document.documentElement.setAttribute('data-tema', tema);

    const botao = document.getElementById('botao-tema');
    if (botao) {
        const escuro = tema === 'escuro';
        botao.setAttribute('aria-pressed', String(escuro));
        // ☀ (sol) no tema escuro leva ao claro; ☾ (lua) no claro leva ao escuro
        botao.firstElementChild.textContent = escuro ? '\u2600\uFE0E' : '\u263E';
    }
}

function alternarTema() {
    const atual = document.documentElement.getAttribute('data-tema');
    const novo = atual === 'escuro' ? 'claro' : 'escuro';
    aplicarTema(novo);
    gravarArmazenamento(CHAVE_TEMA, novo);
}

function iniciarTema() {
    aplicarTema(temaInicial()); // atualiza também o botão, que já existe no DOM

    const botao = document.getElementById('botao-tema');
    if (botao) {
        botao.addEventListener('click', alternarTema);
    }

    // Se o visitante trocar o tema em outra aba, esta aba acompanha
    window.addEventListener('storage', (evento) => {
        if (evento.key === CHAVE_TEMA && (evento.newValue === 'claro' || evento.newValue === 'escuro')) {
            aplicarTema(evento.newValue);
        }
    });
}

// Aplica o tema já na leitura do <head>, antes de a página ser desenhada,
// para não piscar o tema claro quando o visitante escolheu o escuro.
aplicarTema(temaInicial());

/* ---------- Gráfico de barras em canvas (graficos.html) ---------- */

function desenharGrafico() {
    const canvas = document.getElementById('grafico-niveis');
    if (!canvas) {
        return; // a página atual não tem o gráfico
    }

    const ctx = canvas.getContext('2d');

    const dados = [
        { rotulo: 'Python', nivel: 1 },
        { rotulo: 'Agentes de IA', nivel: 2 },
        { rotulo: 'Front-end', nivel: 1 },
        { rotulo: 'SQL', nivel: 1 }
    ];
    const nivelMaximo = 3; // 1 = Iniciante, 2 = Intermediário, 3 = Avançado

    const larguraBarra = 60;
    const espacoEntreBarras = 30;
    const alturaMaxima = 180;
    const baseY = 220;

    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';

    dados.forEach((item, indice) => {
        const x = 30 + indice * (larguraBarra + espacoEntreBarras);
        const alturaBarra = (item.nivel / nivelMaximo) * alturaMaxima;
        const y = baseY - alturaBarra;

        ctx.fillStyle = '#3A8DBF';
        ctx.fillRect(x, y, larguraBarra, alturaBarra);

        ctx.fillStyle = '#0B3D5C';
        ctx.fillText(item.rotulo, x + larguraBarra / 2, baseY + 16);
    });

    ctx.strokeStyle = '#2B2B2B';
    ctx.beginPath();
    ctx.moveTo(20, baseY);
    ctx.lineTo(360, baseY);
    ctx.stroke();
}

/* ---------- Inicialização (depois que o HTML foi carregado) ---------- */

document.addEventListener('DOMContentLoaded', () => {
    iniciarTema();
    desenharGrafico();
});
