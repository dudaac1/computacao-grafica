"use strict";

const vShader2 = `#version 300 es
  in vec4 a_position;
  uniform mat4 u_matrix;
  uniform float u_PointSize;
  in vec4 a_color;
  out vec4 v_color;
  void main() {
    gl_Position = u_matrix * a_position;
    gl_PointSize = u_PointSize;
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

var program = null;
var vao = null;
var positionAttribLocation = null;
var matrixLocation = null;
var colorAttribLocation = null;
var u_PointSize = null;
// var resolutionUniformLocation = null;

var shape = {
  translation: [200, 200, 0],
  rotation: [degToRad(180), degToRad(120), degToRad(150)],
  scale: [0.5, 0.5, 1],
  color: [Math.random(), Math.random(), Math.random(), 1]
}

function main() {
  var gl = getGLContext("card-canvas");
  program = createProgram(gl, vShader2, fShader);

  const pointSize = 10.0; // set point size to 10 pixels
  u_PointSize = gl.getUniformLocation(program, "u_PointSize");
  positionAttribLocation = gl.getAttribLocation(program, "a_position");
  colorAttribLocation =  gl.getAttribLocation(program, "a_color");
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
  
  size = 3;          // 3 components per iteration
  type = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
  normalize = true;  // convert from 0-255 to 0.0-1.0
  stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
  offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(colorAttribLocation, size, type, normalize, stride, offset);
  // draw scene

  // drawScene(gl);

  // var startTime = new Date().getTime();
  // var currentTime;
  var deltaTime;
  // var previousTime = new Date().getTime();
  var then = 0;

  // requestAnimationFrame(function() { drawScene(gl)});
  requestAnimationFrame(drawScene);



  function drawScene(now) {
    now *= 0.001;
    deltaTime = now - then;
    // console.log(deltaTime)
    then = now;;


    // var currentTime = new Date().getTime();
    // var deltaTime = (currentTime - previousTime) * 0.001;
    // previousTime = currentTime;

    // shape.rotation[0] += 1.2 * deltaTime;
    // shape.rotation[1] += 1.8 * deltaTime;
    shape.rotation[1] += 1.5 * deltaTime;
    // shape.rotation[2] += 1.4 * deltaTime;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    // gl.uniform4fv(colorLocation, shape.color); 
    gl.uniform1f(u_PointSize, 10);
  
    var matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
    matrix = m4.translate(matrix, shape.translation[0], shape.translation[1], shape.translation[2]);
    matrix = m4.xRotate(matrix, shape.rotation[0]);
    matrix = m4.yRotate(matrix, shape.rotation[1]);
    matrix = m4.zRotate(matrix, shape.rotation[2]);
    matrix = m4.scale(matrix, shape.scale[0], shape.scale[1], shape.scale[2]);
  
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
  
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 12 * 3;
    gl.drawArrays(primitiveType, offset, count);
  
    // requestAnimationFrame(function() { drawScene(gl)});
    requestAnimationFrame(drawScene);
  }
  
}



function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

main();