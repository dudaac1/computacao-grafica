"use strict";

var vertexShaderSource = `#version 300 es
  in vec4 a_position;
  in vec2 a_texcoord;
  uniform mat4 u_matrix;
  out vec2 v_texcoord;
  void main() {
    gl_Position = u_matrix * a_position;
    v_texcoord = a_texcoord;
  }
`;

var fragmentShaderSource = `#version 300 es
precision highp float;
in vec2 v_texcoord;
uniform sampler2D u_texture;
out vec4 outColor;
void main() {
  outColor = texture(u_texture, v_texcoord);
}
`;

var gl;
var program;
var positionAttributeLocation;
var texcoordAttributeLocation
var matrixLocation;
var vao;

var cameraRadiansX = degToRad(0);
var cameraRadiansY = degToRad(0);
var cameraRadiansZ = degToRad(0);

function main() {
  gl = getGLContext("canvas");
  program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
  matrixLocation = gl.getUniformLocation(program, "u_matrix");

  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  var positionBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);
  var size = 3;          // 3 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

  /*var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);
  gl.enableVertexAttribArray(textcoordAttributeLocation);
  var size = 3;          // 3 components per iteration
  var type = gl.UNSIGNED_BYTE;   // the data is 8bit unsigned bytes
  var normalize = true;  // convert from 0-255 to 0.0-1.0
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(textcoordAttributeLocation, size, type, normalize, stride, offset);
  */

  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.enableVertexAttribArray(texcoordAttributeLocation);
  setTexcoords(gl);
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floating point values
  var normalize = true;  // convert from 0-255 to 0.0-1.0
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(texcoordAttributeLocation, size, type, normalize, stride, offset);
  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  // Asynchronously load an image
  var image = new Image();
  image.src = "./resources/texture-rocky.png";
  image.addEventListener('load', function () {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    drawScene();
  });


  // Setup a ui.
  webglLessonsUI.setupSlider("#cameraAngleX", { value: radToDeg(cameraRadiansX), slide: updateAngleX, min: -360, max: 360 });
  webglLessonsUI.setupSlider("#cameraAngleY", { value: radToDeg(cameraRadiansY), slide: updateAngleY, min: -360, max: 360 });
  webglLessonsUI.setupSlider("#cameraAngleZ", { value: radToDeg(cameraRadiansZ), slide: updateAngleZ, min: -360, max: 360 });

  document.querySelector("#rockyTex").addEventListener('click', function () {
    image.src = "./resources/texture-rocky.png";
    drawScene();
  });  // eslint-disable-line
  document.querySelector("#jjuliarTex").addEventListener('click', function () {
    image.src = "./resources/texture-jjuliar.png";
    drawScene();
  });  // eslint-disable-line
  document.querySelector("#skyTex").addEventListener('click', function () {
    image.src = "./resources/texture-sky.png";
    drawScene();
  });  // eslint-disable-line

  drawScene();

  function updateAngleX(event, ui) {
    cameraRadiansX = degToRad(ui.value);
    drawScene();
  }
  function updateAngleY(event, ui) {
    cameraRadiansY = degToRad(ui.value);
    drawScene();
  }
  function updateAngleZ(event, ui) {
    cameraRadiansZ = degToRad(ui.value);
    drawScene();
  }
}

// Draw the scene.
function drawScene() {
  var numFs = 5;
  var radius = 200;

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  // gl.enable(gl.CULL_FACE);
  gl.useProgram(program);
  gl.bindVertexArray(vao);

  // Compute the matrix
  var fieldOfViewRadians = degToRad(60);
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var zNear = 1;
  var zFar = 1000;
  var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

  // Use matrix math to compute a position on the circle.
  var cameraMatrix = m4.xRotation(cameraRadiansX);
  cameraMatrix = m4.yRotate(cameraMatrix, cameraRadiansY);
  cameraMatrix = m4.zRotate(cameraMatrix, cameraRadiansZ);
  cameraMatrix = m4.translate(cameraMatrix, 0, 50, radius * 1.5);

  // Compute the position of the first F
  var fPosition = [radius, 0, 0];

  // Get the camera's postion from the matrix we computed
  var cameraPosition = [
    cameraMatrix[12],
    cameraMatrix[13],
    cameraMatrix[14],
  ];

  var up = [0, 1, 0];

  var cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);
  var viewMatrix = m4.inverse(cameraMatrix);
  var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

  for (var ii = 0; ii < numFs; ++ii) {
    var angle = ii * Math.PI * 2 / numFs;

    var x = Math.cos(angle) * radius;
    var z = Math.sin(angle) * radius;
    var matrix = m4.translate(viewProjectionMatrix, x, 0, z);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 12 * 3;
    gl.drawArrays(primitiveType, offset, count);
  }
}

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

function setBtnEvent() {
  var btn = document.getElementById("btn");
  btn.addEventListener("click", fAnimate);
}

function fAnimate(event) {
  event.srcElement.disabled = true;
  event.srcElement.textContent = "Eu avisei!";
  var timeInput = document.getElementById("time");
  var time = timeInput.value * 1000;
  timeInput.value = 0;

  var start = new Date().getTime();
  var then = start;
  var now, deltaTime, sum = 0;
  requestAnimationFrame(animation);

  function animation() {
    now = new Date().getTime();
    deltaTime = (now - then) * 0.001;
    then = now;
    cameraRadiansX += 1 * deltaTime;
    cameraRadiansY += 3 * deltaTime;
    // cameraRadiansZ += 2 * deltaTime;
    drawScene();
    timeInput.value = Math.round(sum += deltaTime); // this is bad
    if (now < start + time)
      requestAnimationFrame(animation);
    else {
      var btn = document.getElementById("btn");
      btn.textContent = "NÃO CLIQUE";
      btn.disabled = false;
    }
    // how to update ui while animation is on
  }
}

setBtnEvent();
main();
