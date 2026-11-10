/* ==========================================================================
   scripts.js - Site Pessoal / Portfólio - João Pedro Ribeiro Otreira
   Código JavaScript de todas as páginas (carregado no <head>).

   Conteúdo:
   - Gráfico de barras em <canvas> (graficos.html)
   ========================================================================== */
'use strict';

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
    desenharGrafico();
});
