"use strict";

const vShader = `#version 300 es
  in vec4 a_position;
  uniform mat4 u_matrix;

  in vec4 a_color;
  out vec4 v_color;
  
  void main() {
    gl_Position = u_matrix * a_position;
    v_color = a_color;
  }
`;

const fShader = `#version 300 es
    precision highp float;
    
    in vec4 v_color;
    out vec4 outColor;

    void main() {
      outColor = v_color;
    }
    `;
    
const NUMBER_OBJS = 8;
const MAX_VALUE = 100;

var cartCounter, cartCounterDiv; // html: js
var bgShapes, cardShapes; // html: webgl

var program = null;
var vao = null;
var colorAttribLocation = null;
var positionAttribLocation = null;
var matrixLocation = null;

function main(NUMBER_OBJS, shapes) {
  // background
  // var bgGl = getGLContext("canvas-main-bg");
  // program = createProgram(bgGl, vShader, fShader);
  // setWebGl(bgGl, program);
  // for (let j = 0; j < NUM_BG_OBJ; ++j) 
  //   drawShape(bgGl, bgShapes, j);

  

  // cards shapes
  var gl;
  for (let i = 0; i < NUMBER_OBJS; ++i) {
    gl = getGLContext(`canvas${i}`);
    program = createProgram(gl, vShader, fShader);
    setWebGl(gl, program);
    drawShape(gl, shapes, i);

    // for (var j = 0; j < NUMBER_OBJS; ++j) {

    // }
  }

  
}

function setWebGl(gl, program) {
  positionAttribLocation = gl.getAttribLocation(program, "a_position");
  colorAttribLocation = gl.getAttribLocation(program, "a_color");
  matrixLocation = gl.getUniformLocation(program, "u_matrix");

  var positionBuffer = gl.createBuffer();
  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
  setGeometry(gl);
  
  var size = 3;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttribLocation, size, type, normalize, stride, offset);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);
  gl.enableVertexAttribArray(colorAttribLocation);
  gl.vertexAttribPointer(colorAttribLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);
}
  
function drawShape(gl, shapes, index) {
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
  gl.clearColor(0, 0, 0, 0); // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  //gl.enable(gl.CULL_TEST);
  
  gl.useProgram(program);
  gl.bindVertexArray(vao);
  // gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // gl.uniform4fv(colorLocation, shape.color); 
  // var translationMatrix = m3.translation(shape.translation[0], shape.translation[1]);
  // var rotationMatrix = m3.rotation(shape.rotation);
  // var scaleMatrix = m3.scaling(shape.scale[0], shape.scale[1]);
  // var matrix = m3.multiply(translationMatrix, rotationMatrix);
  // matrix = m3.multiply(matrix, scaleMatrix);
  var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 500);
  matrix = m4.translate(matrix, shapes[index].translation[0], shapes[index].translation[1], shapes[index].translation[2]);
  matrix = m4.xRotate(matrix, shapes[index].rotation[0]);
  matrix = m4.yRotate(matrix, shapes[index].rotation[1]);
  matrix = m4.zRotate(matrix, shapes[index].rotation[2]);
  matrix = m4.scale(matrix, shapes[index].scale[0], shapes[index].scale[1], shapes[index].scale[2]);

  gl.uniformMatrix4fv(matrixLocation, false, matrix);

  gl.drawArrays(gl.TRIANGLES, 0, 12 * 3); 
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

    var uiC = document.createElement("div");
    uiC.setAttribute("id", "uiContainer");
    var ui = document.createElement("div");
    ui.setAttribute("id", "ui");
    
    var x = document.createElement("div");
    x.setAttribute("id", "x" + i);
    x.textContent = i;
    ui.appendChild(x);

    uiC.appendChild(ui);
    card.appendChild(uiC);
    
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

function setupUI(gl, shapes, index) {
  webglLessonsUI.setupSlider("#x" + index, { value: shapes[index].translation[0], slide: updatePosition(index, 0), max: gl.canvas.width });
  
  function updatePosition(i, j) {
    return function (event, ui) {
      shapes[i].translation[j] = ui.value;
      // drawScene(gl, shapes, i);
    };
  }
}

function generateShapes(number, mult1, mult2) {
  var shapes = [];
  for (let i = 0; i < number; ++i) {
    shapes.push({
      translation: [Math.random() * mult1, Math.random() * mult1, 0],
      rotation: [degToRad(Math.random() * 75), degToRad(Math.random() * 75), degToRad(Math.random() * 75)],
      scale: [0.2 * mult2, 0.2 * mult2, 0.2 * mult2],
      // color: [Math.random(), Math.random(), Math.random(), 1],
      price: Math.round(Math.random() * 50)
    });
  }
  return shapes;
}


// canvas do fundo
// function generateBackground() {
//   var main = document.getElementById("main-container");
//   var canvas = document.createElement("canvas");
//   canvas.setAttribute("id", "canvas-main-bg");
//   canvas.classList = "bg-canvas";
//   main.appendChild(canvas);
// }

function buyButton(numCanvas) {
  console.log(`item ${numCanvas} comprado: R$ ${cardShapes[numCanvas].price}`);
  cartCounter++;
  cartCounterDiv.textContent = cartCounter;
  // salvar dados do objeto em array
}

function start() {
  cartCounter = localStorage.getItem("cartCounter");
  if (cartCounter == null) cartCounter = 0;
  cartCounterDiv = document.getElementById("cart-counter");
  cartCounterDiv.textContent = cartCounter;

  var cartBtn = document.getElementById("cart-button");

  cartBtn.addEventListener("click", function() {
    localStorage.setItem("cartCounter", cartCounter);
    location.href = "./cart.html";
  })

  window.addEventListener("beforeunload", function() {
    localStorage.setItem("cartCounter", cartCounter)
  });

  // generateBackground();
  // bgShapes = generateShapes(NUM_BG_OBJS, 500, 5);
  cardShapes = generateShapes(NUMBER_OBJS, 100, 1);
  generateCards();
  
  main(NUMBER_OBJS, cardShapes);
}

start();




