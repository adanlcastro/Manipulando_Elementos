const html = document.querySelector('html');
const tempoNaTela = document.querySelector('#timer');
const startPauseBtn = document.getElementById('start-pause');
const playouPause = document.querySelector('#start-pause span');
const playouPauseImg = document.querySelector('.app__card-primary-butto-icon');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const botoes = document.querySelectorAll('.app__card-button');
const titulo = document.querySelector('.app__title');
const banner = document.querySelector('.app__image');
const musicaFocoInput = document.querySelector('#alternar-musica');

const musica = new Audio('/sons/luna-rise-part-one.mp3');
musica.loop = true;

musicaFocoInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
});

let tempoDecorridoEmSegundos = 1500;
let intervaloID = null;

const duracaoFoco = 1500;
const duracaoCurto = 900;
const duracaoLongo = 1800;

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoFoco;
    alterarContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoCurto;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
});

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = duracaoLongo;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
});

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach((botao) => botao.classList.remove('active'));
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);

    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `
                Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>`;
            break;
        case 'descanso-curto':
            titulo.innerHTML = `
                Que tal uma respirada?<br>
                <strong class="app__title-strong">faça uma pausa</strong>`;
            break;
        case 'descanso-longo':
            titulo.innerHTML = `
                Hora de voltar à superfície<br>
                <strong class="app__title-strong">faça uma pausa longa</strong>`;
            break;
        default:
            break;
    }
}

const somPause = new Audio('/sons/pause.mp3');
const somPlay = new Audio('/sons/play.wav');
const somBeep = new Audio('/sons/beep.mp3');

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        somBeep.play();
        alert('Tempo finalizado');
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return;
    }
    tempoDecorridoEmSegundos -= 1;
    mostrarTempo();
};

startPauseBtn.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloID) {
        zerar();
        somPause.play();
        return;
    }
    somPlay.play();
    intervaloID = setInterval(contagemRegressiva, 1000);
    playouPauseImg.src = "/imagens/pause.png";
    playouPause.textContent = 'Pausar';
}

function zerar() {
    clearInterval(intervaloID);
    intervaloID = null;
    playouPause.textContent = 'Começar';
    playouPauseImg.src = "/imagens/play_arrow.png";
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {
        minute: '2-digit',
        second: '2-digit'
    });
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
