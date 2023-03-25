"use strict";

const NUM_OBJS_BG = 3;
var bgShapes;

var bgProgram = null;
// var vao = null;
// var colorAttribLocation = null;
// var positionAttribLocation = null;
// var matrixLocation = null;

function main_bg() {
  var bgGl = getGLContext("canvas-main-bg");
  bgProgram = createProgram(bgGl, vShader, fShader);
  setWebGl(bgGl, bgProgram);
  for (let j = 0; j < NUM_OBJS_BG; ++j) 
    drawShape(bgGl, bgShapes, j);

  // como animar o fundo?
}

function start_bg() {
  var main = document.getElementById("main-container");
  var canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas-main-bg");
  canvas.classList = "bg-canvas";
  main.appendChild(canvas);

  bgShapes = generateShapes(NUM_OBJS_BG, 500, 5);

  main_bg();
}


start_bg();