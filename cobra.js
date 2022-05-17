// Jogo da Cobra (Snake Game)
// Autor: Jan Bodnar
// Adaptado por: Gilson Pereira
// Código fonte original: http://zetcode.com/javascript/snake/

// Declaração de variáveis e constantes

var tela;
var ctx;
var time;
var lives;

var cabeca;
var maca;
var bola;
var obstaculo;

var pontos;
var maca_x;
var maca_y;
var obst_x;
var obst_y;

var tempo = 30;
var vidas = 5;

var paraEsquerda = false;
var paraDireita = false;
var paraCima = false;
var paraBaixo = false;
var noJogo = true;

const TAMANHO_PONTO = 10;
const ALEATORIO_MAXIMO = 29;
const ATRASO = 140;
const C_ALTURA = 300;
const C_LARGURA = 300;

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;
const TECLA_ABAIXO = 40;

var x = [];
var y = [];
var macas = [];
var obstaculos = [];

onkeydown = verificarTecla; // Define função chamada ao se pressionar uma tecla

iniciar(); // Chama função inicial do jogo

// Definição das funções

function iniciar() {
  time = document.getElementById("time");
  lives = document.getElementById("lives");

  tela = document.getElementById("tela");
  ctx = tela.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

  carregarImagens();
  criarCobra();
  localizarMaca();
  localizarObstaculo();
  setTimeout("cicloDeJogo()", ATRASO);
  setTimeout("tempoDeJogo()", 1000);
}

function carregarImagens() {
  cabeca = new Image();
  cabeca.src = "img/cabeca.png";

  bola = new Image();
  bola.src = "img/ponto.png";

  maca = new Image();
  maca.src = "img/maca.png";

  obstaculo = new Image();
  obstaculo.src = "img/obstaculo.png";
}

function criarCobra() {
  pontos = 3;

  for (let z = 0; z < pontos; z++) {
    x[z] = 100 - z * TAMANHO_PONTO;
    y[z] = 100;
  }

  let r = Math.floor(Math.random() * 4);
  switch (r) {
    case 0:
      paraEsquerda = true;
      break;
    case 1:
      paraDireita = true;
      break;
    case 2:
      paraCima = true;
      break;
    case 3:
      paraBaixo = true;
  }
}

function localizarMaca() {
  for (let i = 0; i < 15; i++) {
    let r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    maca_x = r * TAMANHO_PONTO;

    r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    maca_y = r * TAMANHO_PONTO;

    macas[i] = [maca_x, maca_y];
  }
}

function localizarObstaculo() {
  for (let i = 0; i < 10; i++) {
    let r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    obst_x = r * TAMANHO_PONTO;

    r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    obst_y = r * TAMANHO_PONTO;

    obstaculos[i] = [obst_x, obst_y];
  }
}

function cicloDeJogo() {
  if (noJogo) {
    verificarMaca();
    verificarColisao();
    mover();
    fazerDesenho();
    setTimeout("cicloDeJogo()", ATRASO);
  }
}

function tempoDeJogo() {
  if (noJogo) {
    tempo--;
    time.innerHTML = `Tempo: ${tempo}s`;
    setTimeout("tempoDeJogo()", 1000);

    if (tempo <= 0) {
      noJogo = false;
      fazerDesenho();
    }
  }
}

function verificarMaca() {
  for (let i in macas) {
    if (x[0] == macas[i][0] && y[0] == macas[i][1]) {
      pontos++;
      macas.splice(i, 1);

      if (macas.length % 3 == 0) {
        vidas++;
        lives.innerHTML = "Vidas: " + vidas;
      }
    }
  }

  if (macas.length == 0) {
    noJogo = false;
  }
}

function verificarColisao() {
  for (let z = pontos; z > 0; z--) {
    if (z > 4 && x[0] == x[z] && y[0] == y[z]) {
      vidas--;
      lives.innerHTML = "Vidas: " + vidas;
    }
  }

  for (let i in obstaculos) {
    if (x[0] == obstaculos[i][0] && y[0] == obstaculos[i][1]) {
      vidas--;
      obstaculos.splice(i, 1);
      lives.innerHTML = "Vidas: " + vidas;
    }
  }

  if (vidas == 0) {
    noJogo = false;
  }

  if (y[0] >= C_ALTURA) {
    y[0] = 0;
  }

  if (y[0] < 0) {
    y[0] = C_ALTURA;
  }

  if (x[0] >= C_LARGURA) {
    x[0] = 0;
  }

  if (x[0] < 0) {
    x[0] = C_LARGURA;
  }
}

function mover() {
  for (var z = pontos; z > 0; z--) {
    x[z] = x[z - 1];
    y[z] = y[z - 1];
  }

  if (paraEsquerda) {
    x[0] -= TAMANHO_PONTO;
  }

  if (paraDireita) {
    x[0] += TAMANHO_PONTO;
  }

  if (paraCima) {
    y[0] -= TAMANHO_PONTO;
  }

  if (paraBaixo) {
    y[0] += TAMANHO_PONTO;
  }
}

function fazerDesenho() {
  ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
  ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

  if (noJogo) {
    for (let m of macas) {
      ctx.drawImage(maca, m[0], m[1]);
    }

    for (let obs of obstaculos) {
      ctx.drawImage(obstaculo, obs[0], obs[1]);
    }

    for (let z = 0; z < pontos; z++) {
      if (z == 0) {
        ctx.drawImage(cabeca, x[z], y[z]);
      } else {
        ctx.drawImage(bola, x[z], y[z]);
      }
    }
  } else {
    fimDeJogo();
  }
}

function fimDeJogo() {
  ctx.fillStyle = "white";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = "normal bold 18px serif";

  if (macas.length == 0) {
    ctx.fillText("Você Ganhou", C_LARGURA / 2, C_ALTURA / 2);
  } else {
    ctx.fillText("Fim de Jogo", C_LARGURA / 2, C_ALTURA / 2);
  }
}

function verificarTecla(e) {
  var tecla = e.keyCode;

  if (tecla == TECLA_ESQUERDA && !paraDireita) {
    paraEsquerda = true;
    paraCima = false;
    paraBaixo = false;
  }

  if (tecla == TECLA_DIREITA && !paraEsquerda) {
    paraDireita = true;
    paraCima = false;
    paraBaixo = false;
  }

  if (tecla == TECLA_ACIMA && !paraBaixo) {
    paraCima = true;
    paraDireita = false;
    paraEsquerda = false;
  }

  if (tecla == TECLA_ABAIXO && !paraCima) {
    paraBaixo = true;
    paraDireita = false;
    paraEsquerda = false;
  }
}
