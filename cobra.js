// Jogo da Cobra (Snake Game)
// Autor: Jan Bodnar
// Adaptado por: Gilson Pereira
// Código fonte original: http://zetcode.com/javascript/snake/
// Música de fundo: https://www.youtube.com/watch?v=0HxZn6CzOIo

// Declaração de variáveis e constantes

var tela;
var ctx;
var pageLives;
var pageTime;
var pageScore;
var pageList;

var cabeca;
var maca;
var bola;
var obstaculo;

var coletar;
var dano;
var morte;
var ganhou;
var fundo;

var pontos;
var maca_x;
var maca_y;
var obst_x;
var obst_y;

const tempoTotal = 65;
var tempoRestante = tempoTotal;
var vidas = 5;
var pontuacao = 0;

var paraEsquerda = false;
var paraDireita = false;
var paraCima = false;
var paraBaixo = false;
var noJogo = false;

const TAMANHO_PONTO = 10;
const ALEATORIO_MAXIMO = 49;
const ATRASO = 140;
const C_ALTURA = 500;
const C_LARGURA = 500;

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;
const TECLA_ABAIXO = 40;

var x = [];
var y = [];
var listaDeMacas = [];
var listaDeObstaculos = [];

var ranque;

onkeydown = verificarTecla; // Define função chamada ao se pressionar uma

setup(); // Seta as config iniciais

// Definição das funções

function setup() {
  pageTime = document.getElementById("time");
  pageLives = document.getElementById("lives");
  pageScore = document.getElementById("score");
  pageList = document.getElementsByTagName("li");
  tela = document.getElementById("tela");
  ctx = tela.getContext("2d");

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

  ctx.fillStyle = "white";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = "normal bold 18px courier";
  ctx.fillText(
    "Aperte qualquer tecla para iniciar",
    C_LARGURA / 2,
    C_ALTURA / 2
  );

  carregarRanque();
}

function iniciar() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

  noJogo = true;

  carregarImagens();
  carregarAudio();
  fundo.play();
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

function carregarAudio() {
  coletar = new Audio("audio/pickup.wav");

  dano = new Audio("audio/hit.wav");

  morte = new Audio("audio/death.wav");

  ganhou = new Audio("audio/win.wav");

  fundo = new Audio("audio/background.wav");
}

function carregarRanque() {
  ranque = JSON.parse(localStorage.getItem("players"));

  if (ranque === null) {
    let defaultPlayer = {
      nome: "___",
      score: 0,
    };

    ranque = [
      defaultPlayer,
      defaultPlayer,
      defaultPlayer,
      defaultPlayer,
      defaultPlayer,
    ];
  }

  for (let i in ranque) {
    pageList[i].innerHTML = ranque[i].score + " - " + ranque[i].nome;
  }
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
  for (let i = 0; i < 27; i++) {
    let r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    maca_x = r * TAMANHO_PONTO;

    r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    maca_y = r * TAMANHO_PONTO;

    listaDeMacas[i] = [maca_x, maca_y];
  }
}

function localizarObstaculo() {
  for (let i = 0; i < 60; i++) {
    let r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    obst_x = r * TAMANHO_PONTO;

    r = Math.floor(Math.random() * ALEATORIO_MAXIMO);
    obst_y = r * TAMANHO_PONTO;

    listaDeObstaculos[i] = [obst_x, obst_y];
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
    tempoRestante--;
    pontuacao += vidas * 10;

    pageScore.innerHTML = `Score:<br/>${pontuacao}`;
    pageTime.innerHTML = `Tempo:<br/>${tempoRestante}s`;
    setTimeout("tempoDeJogo()", 1000);

    if (tempoRestante <= 0) {
      noJogo = false;
      fazerDesenho();
    }
  }
}

function verificarMaca() {
  for (let i in listaDeMacas) {
    if (x[0] == listaDeMacas[i][0] && y[0] == listaDeMacas[i][1]) {
      pontos++;
      coletar.play();
      listaDeMacas.splice(i, 1);

      if (listaDeMacas.length % 3 == 0) {
        vidas++;
        pageLives.innerHTML = `Vidas:<br/>${vidas}`;
      }
    }
  }

  if (listaDeMacas.length == 0) {
    noJogo = false;
  }
}

function verificarColisao() {
  for (let z = pontos; z > 0; z--) {
    if (z > 4 && x[0] == x[z] && y[0] == y[z]) {
      vidas--;
      pageLives.innerHTML = `Vidas:<br/>${vidas}`;
      dano.play();
    }
  }

  for (let i in listaDeObstaculos) {
    if (x[0] == listaDeObstaculos[i][0] && y[0] == listaDeObstaculos[i][1]) {
      vidas--;
      listaDeObstaculos.splice(i, 1);
      pageLives.innerHTML = `Vidas:<br/>${vidas}`;
      dano.play();
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
    for (let obs of listaDeObstaculos) {
      ctx.drawImage(obstaculo, obs[0], obs[1]);
    }

    for (let m of listaDeMacas) {
      ctx.drawImage(maca, m[0], m[1]);
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
  ctx.font = "normal bold 18px courier";
  fundo.pause();

  if (listaDeMacas.length == 0) {
    ganhou.play();
    ctx.fillText("Você Ganhou", C_LARGURA / 2, C_ALTURA / 2);

    pontuacao += tempoRestante * 200;
    pageScore.innerHTML = `Score:<br/>${pontuacao}`;
  } else {
    morte.play();
    ctx.fillText("Fim de Jogo", C_LARGURA / 2, C_ALTURA / 2);
  }

  ordenarRanque();
}

function ordenarRanque() {
  if (pontuacao < ranque[4].score) {
    return;
  }

  let player = {
    nome: prompt("Digite seu nome"),
    score: pontuacao,
  };

  ranque[5] = player;

  for (var j = 4; j > 0 && ranque[j - 1].score < pontuacao; j--) {
    ranque[j] = ranque[j - 1];
  }
  ranque[j] = player;

  ranque.length = 5;

  for (let i in ranque) {
    pageList[i].innerHTML = ranque[i].score + " - " + ranque[i].nome;
  }

  localStorage.setItem("players", JSON.stringify(ranque));
}

function verificarTecla(e) {
  var tecla = e.keyCode;

  if (!noJogo && tempoRestante == tempoTotal) {
    iniciar(); // Chama função inicial do jogo
  }

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
