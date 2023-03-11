"use strict";

const NUM_BG_OBJS = 3;
const NUMBER_OBJS = 9;
const MAX_VALUE = 100;
// let GL;


// canvas do fundo
function generateBackground() {
  var main = document.getElementById("main-container");
  var canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas-main-bg");
  canvas.classList = "bg-canvas";
  main.appendChild(canvas);
}

function generateCards() {
  var main = document.getElementById("main-container");
  
  var card, canvas, btn, text, info;
  for (let i = 0; i < NUMBER_OBJS; ++i) {
    card = document.createElement("div");
    card.classList = "card";
    card.setAttribute("id", `card${i}`);
    
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", `canvas${i}`);
    canvas.classList = "canvas";
    card.appendChild(canvas);

    info = document.createElement("div");
    info.classList = "info";
    text = document.createElement("h3");
    text.textContent = `R$ ${cardShapes[i].price}`;
    info.appendChild(text);

    btn = document.createElement("button");
    btn.textContent = "comprar";
    btn.classList = "btn";
    btn.addEventListener("click", function() { buyButton(i)});
    info.appendChild(btn);
    card.appendChild(info);

    main.appendChild(card);
  }
}

function generateShapes(number,  mult1, mult2) {
  var shapes = [];
  var translation;
  var scale;
  
  for (let i = 0; i < number; ++i) {
    if (mult1 == 1) 
      translation = [100, 100];
    else 
      translation = [(i * mult1) + 100, (i * mult1) + 100];

    if (mult2 == 1)
      scale = [0.2, 0.2];
    else 
      scale = [0.2 * mult2, 0.2 * mult2];

    shapes.push({
      translation,
      rotation: 0,
      scale,
      color: [Math.random(), Math.random(), Math.random(), 1],
      price: Math.round(Math.random() * 50)
    });
  }
  return shapes;
}

function buyButton(numCanvas) {
  console.log(`item ${numCanvas} comprado: R$ ${cardShapes[numCanvas].price}`);
}


// calling functions

generateBackground();
var bgShapes = generateShapes(NUM_BG_OBJS, 95, 5);
var cardShapes = generateShapes(NUMBER_OBJS, 1, 1);
generateCards();

main(NUMBER_OBJS, NUM_BG_OBJS, bgShapes, cardShapes);
