"use strict";

const vShader2 = `#version 300 es
  uniform mat4 u_matrix;
  // uniform float u_PointSize;

  in vec4 a_position;
  // in vec4 a_color;
  // out vec4 v_color;

  void main() {
    gl_Position = u_matrix * a_position;
    // gl_PointSize = u_PointSize;
    // v_color = a_color;
    // u_color = v_color;
  }
`;

const fShader = `#version 300 es
    precision highp float;

    // in vec4 v_color;
    uniform vec4 u_color;
    out vec4 outColor;

    void main() {
      // outColor = v_color;
      outColor = u_color;
    }
`;

var shapes, cartCounter;

var gl;
var program = null;
var vao = null;
var positionAttribLocation = null;
var matrixLocation = null;
// var colorAttribLocation = null;
var colorLocation = null;
var u_PointSize = null;
// var resolutionUniformLocation = null;

// var shape = {
//   translation: [200, 200, 0],
//   rotation: [degToRad(180), degToRad(120), degToRad(150)],
//   scale: [0.5, 0.5, 1],
//   color: [Math.random(), Math.random(), Math.random(), 1]
// }



function main() {
  
  gl = getGLContext("card-canvas");
  program = createProgram(gl, vShader2, fShader);

  // const pointSize = 10.0; // set point size to 10 pixels
  // u_PointSize = gl.getUniformLocation(program, "u_PointSize");
  positionAttribLocation = gl.getAttribLocation(program, "a_position");
  // colorAttribLocation =  gl.getAttribLocation(program, "a_color");
  colorLocation =  gl.getUniformLocation(program, "u_color");
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

  /*
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);
  gl.enableVertexAttribArray(colorAttribLocation);
  
  size = 3;          // 3 components per iteration
  type = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
  normalize = true;  // convert from 0-255 to 0.0-1.0
  stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
  offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(colorAttribLocation, size, type, normalize, stride, offset);
  */

  // var startTime = new Date().getTime();
  // var currentTime;
  // var previousTime = new Date().getTime();
  
  // var then = 0;
  // var deltaTime;

  // requestAnimationFrame(function() { drawScene(gl)});
  // requestAnimationFrame(drawScene);
  // for (let i = 0; i < cartCounter; ++i)
    requestAnimationFrame(drawScene);

    // drawScene();
}

var then = 0;
var deltaTime;

function drawScene(now) {
  // console.log(index)
  now *= 0.001;
  deltaTime = now - then;
  then = now;

  // currentTime = new Date().getTime();
  // deltaTime = (currentTime - previousTime) * 0.001;
  // previousTime = currentTime;
  
  
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  
  for (let i = 0; i < cartCounter; ++i) {
    shapes[i].rotation[0] += Math.sin(0.2 * deltaTime);
    shapes[i].rotation[1] += 1.5 * deltaTime;
    
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.useProgram(program);
    gl.bindVertexArray(vao);

    gl.uniform4fv(colorLocation, shapes[i].color); 
    // gl.uniform1f(u_PointSize, 10);
    
    var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 1000);
    matrix = m4.translate(matrix, shapes[i].translation[0], shapes[i].translation[1], shapes[i].translation[2]);
    matrix = m4.xRotate(matrix, shapes[i].rotation[0]);
    matrix = m4.yRotate(matrix, shapes[i].rotation[1]);
    matrix = m4.zRotate(matrix, shapes[i].rotation[2]);
    matrix = m4.scale(matrix, shapes[i].scale[0], shapes[i].scale[1], shapes[i].scale[2]);
  
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
    gl.drawArrays(gl.TRIANGLES, 0, 12*3);
  }
  requestAnimationFrame(drawScene);


}

function start() {
  cartCounter = localStorage.getItem("cartCounter");
  console.log(cartCounter)
  if (cartCounter == null || cartCounter == 0)
    cartCounter = 0
  setCartItensValue();
  shapes = generateShapes(cartCounter);

  var clearCartBtn = document.getElementById("clear-cart");
  clearCartBtn.addEventListener("click", function() {
    cartCounter = 0; 
    localStorage.setItem("cartCounter", cartCounter);
    setCartItensValue();

    console.log(cartCounter)
    // if (!cartCounter)
    //   for (let i = 0; i < cartCounter; ++i)
    //     drawScene(i);
    // else {
    //   webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    //   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    //   gl.clearColor(0, 0, 0, 0);
    //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // }

  });

  main();

  function setCartItensValue() {
    var cartCounterDiv = document.getElementById("cart-counter");
    cartCounterDiv.textContent = cartCounter;
    var cartCounterSpan = document.getElementById("cart-counter-span");
    cartCounterSpan.textContent = cartCounter;
  }

}

function generateShapes(number) {
  var shapes = [];
  for (let i = 0; i < number; ++i) {
    shapes.push({
      translation: [50 + (i*100), Math.random() * 200, 0],
      rotation: [degToRad(Math.random() * 100), degToRad(Math.random() * 100), degToRad(Math.random() * 100)],
      scale: [0.2, 0.2, 0.2],
      color: [Math.random(), Math.random(), Math.random(), 1],
      price: Math.round(Math.random() * 50)
    });
  }
  return shapes;
}

start();


