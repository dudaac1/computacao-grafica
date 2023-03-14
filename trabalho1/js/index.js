"use strict";

const vShader2D = `#version 300 es
    in vec2 a_position;
    uniform vec2 u_resolution;
    uniform mat3 u_matrix;
    void main() {
        vec2 position = (u_matrix * vec3(a_position, 1)).xy;
        vec2 zeroToOne = position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
`;

const fShader = `#version 300 es
    precision highp float;
    uniform vec4 u_color;
    out vec4 outColor;
    void main() {
        outColor = u_color;
    }
`;

var program = null;
var vao = null;
var resolutionUniformLocation = null;
var colorLocation = null;
var matrixLocation = null;

function main(NUMBER_OBJS, NUM_BG_OBJ, bgShapes, shapes) {
  var bgGl = getGLContext("canvas-main-bg");
  program = createProgram(bgGl, vShader2D, fShader);
  setWebGl(bgGl, program);
  for (let j = 0; j < NUM_BG_OBJ; ++j) 
    drawShape(bgGl, bgShapes[j]);

  // como animar o fundo?

  // cards shapes
  var gl;
  for (let i = 0; i < NUMBER_OBJS; ++i) {
    gl = getGLContext(`canvas${i}`);
    program = createProgram(gl, vShader2D, fShader);
    setWebGl(gl, program);
    drawShape(gl, shapes[i]);
  }

  function setWebGl(gl, program) {
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    colorLocation = gl.getUniformLocation(program, "u_color");
    matrixLocation = gl.getUniformLocation(program, "u_matrix");
  
    var positionBuffer = gl.createBuffer();
  
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
    setGeometry(gl);
    
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  }
  
  function drawShape(gl, shape) {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    // gl.clearColor(0, 0, 0, 0); // Clear the canvas
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  
    gl.uniform4fv(colorLocation, shape.color); 
    var translationMatrix = m3.translation(shape.translation[0], shape.translation[1]);
    var rotationMatrix = m3.rotation(shape.rotation);
    var scaleMatrix = m3.scaling(shape.scale[0], shape.scale[1]);
    var matrix = m3.multiply(translationMatrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
  
    // var primitiveType = gl.TRIANGLES;
    // var offset = 0;
    // var count = 18;
    // gl.drawArrays(primitiveType, offset, count); 
    gl.drawArrays(gl.TRIANGLES, 0, 18); 
  }
}

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




