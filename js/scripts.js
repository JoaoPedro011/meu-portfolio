/* ==========================================================================
   scripts.js - Site Pessoal / Portfólio - João Pedro Ribeiro Otreira
   Código JavaScript de todas as páginas (carregado no <head>).

   Conteúdo:
   - Armazenamento seguro em localStorage (utilitários)
   - Tema claro/escuro lembrado entre visitas (todas as páginas)
   - Formulário de contato: validação com mensagens na tela (formulario.html)
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

/* ---------- Formulário de contato (formulario.html) ---------- */

const CAMPOS_VALIDADOS = ['nome', 'email', 'telefone', 'assunto', 'data-contato', 'mensagem'];

// Data de hoje no formato AAAA-MM-DD (o mesmo valor que o <input type="date"> usa)
function dataDeHojeISO() {
    const hoje = new Date();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${hoje.getFullYear()}-${mes}-${dia}`;
}

// Cada regra recebe o valor do campo e devolve a mensagem de erro ('' = válido)
const REGRAS = {
    'nome': (valor) => {
        const texto = valor.trim();
        if (texto === '') {
            return 'Informe seu nome completo.';
        }
        if (texto.length < 3 || !/\S+\s+\S+/.test(texto)) {
            return 'Informe nome e sobrenome.';
        }
        return '';
    },

    'email': (valor) => {
        const texto = valor.trim();
        if (texto === '') {
            return 'Informe seu e-mail.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(texto)) {
            return 'Digite um e-mail válido, como voce@exemplo.com.';
        }
        return '';
    },

    // Opcional, exceto quando o visitante prefere ser contatado por telefone
    'telefone': (valor, formulario) => {
        const digitos = valor.replace(/\D/g, '');
        if (digitos === '') {
            const preferiuTelefone = formulario.elements['preferencia'].value === 'telefone';
            return preferiuTelefone ? 'Você escolheu contato por telefone: informe um número.' : '';
        }
        if (digitos.length < 10 || digitos.length > 13) {
            return 'Informe o telefone com DDD, por exemplo (11) 91234-5678.';
        }
        return '';
    },

    'assunto': (valor) => (valor === '' ? 'Escolha um assunto.' : ''),

    // Opcional: se preenchida, não pode ser uma data que já passou
    'data-contato': (valor) => (
        valor !== '' && valor < dataDeHojeISO()
            ? 'Escolha a data de hoje ou uma data futura.'
            : ''
    ),

    'mensagem': (valor) => {
        const texto = valor.trim();
        if (texto === '') {
            return 'Escreva sua mensagem.';
        }
        if (texto.length < 10) {
            return `A mensagem precisa ter pelo menos 10 caracteres (você digitou ${texto.length}).`;
        }
        return '';
    }
};

// Valida um campo, mostra (ou apaga) o erro embaixo dele e devolve true se estiver válido
function validarCampo(formulario, id) {
    const campo = document.getElementById(id);
    const area = document.getElementById(`erro-${id}`);
    const mensagem = REGRAS[id](campo.value, formulario);

    area.textContent = mensagem;
    if (mensagem === '') {
        campo.removeAttribute('aria-invalid');
    } else {
        campo.setAttribute('aria-invalid', 'true');
    }
    return mensagem === '';
}

function mostrarStatus(tipo, texto) {
    const status = document.getElementById('status-formulario');
    status.textContent = texto;
    status.className = `status-formulario status-${tipo}`; // tipo: 'erro' ou 'sucesso'
}

function limparStatus() {
    const status = document.getElementById('status-formulario');
    status.textContent = '';
    status.className = 'status-formulario';
}

function nomeDoCampo(id) {
    const rotulo = document.querySelector(`label[for="${id}"]`);
    return rotulo ? rotulo.textContent.trim() : id;
}

function aoEnviarFormulario(evento, formulario) {
    evento.preventDefault(); // não há servidor: a validação e o feedback acontecem aqui

    const invalidos = CAMPOS_VALIDADOS.filter((id) => !validarCampo(formulario, id));

    if (invalidos.length > 0) {
        const nomes = invalidos.map(nomeDoCampo).join(', ');
        const rotuloCampos = invalidos.length > 1 ? 'os campos' : 'o campo';
        mostrarStatus('erro', `Revise ${rotuloCampos}: ${nomes}.`);
        document.getElementById(invalidos[0]).focus();
        return;
    }

    const primeiroNome = formulario.elements['nome'].value.trim().split(/\s+/)[0];
    formulario.reset();
    CAMPOS_VALIDADOS.forEach((id) => {
        document.getElementById(id).removeAttribute('aria-invalid');
        document.getElementById(`erro-${id}`).textContent = '';
    });

    mostrarStatus(
        'sucesso',
        `Tudo certo, ${primeiroNome}! Sua mensagem foi validada. Como este é um projeto acadêmico sem servidor, ela não é enviada a ninguém.`
    );
    document.getElementById('status-formulario').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function iniciarFormulario() {
    const formulario = document.getElementById('form-contato');
    if (!formulario) {
        return; // a página atual não tem o formulário
    }

    document.getElementById('data-contato').min = dataDeHojeISO();

    formulario.addEventListener('submit', (evento) => aoEnviarFormulario(evento, formulario));

    CAMPOS_VALIDADOS.forEach((id) => {
        const campo = document.getElementById(id);
        const revalidarSeComErro = () => {
            if (campo.getAttribute('aria-invalid') === 'true') {
                validarCampo(formulario, id);
            }
        };

        campo.addEventListener('blur', () => validarCampo(formulario, id)); // ao sair do campo
        campo.addEventListener('input', revalidarSeComErro);                // some o erro ao corrigir
        campo.addEventListener('change', revalidarSeComErro);
    });

    // Trocar a forma de contato pode tornar o telefone obrigatório (ou opcional)
    formulario.querySelectorAll('input[name="preferencia"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            if (document.getElementById('telefone').getAttribute('aria-invalid') === 'true') {
                validarCampo(formulario, 'telefone');
            }
        });
    });

    // A confirmação de envio some quando o visitante volta a editar
    formulario.addEventListener('input', () => {
        if (document.getElementById('status-formulario').classList.contains('status-sucesso')) {
            limparStatus();
        }
    });
}

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
    iniciarFormulario();
    desenharGrafico();
});
