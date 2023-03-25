"use strict";

const vertexShaderBg = `#version 300 es
  in vec4 a_position;
  uniform mat4 u_matrix;

  in vec4 a_color;
  out vec4 v_color;
  
  void main() {
    gl_Position = u_matrix * a_position;
    v_color = a_color;
  }
`;

const fragmentShaderBg = `#version 300 es
  precision highp float;
  
  in vec4 v_color;
  out vec4 outColor;

  void main() {
    outColor = v_color;
  }
`;

function bg_main(gl, shape) {
  var bProgram = createProgram(gl, vertexShaderBg, fragmentShaderBg);
  var bPosAttribLoc = gl.getAttribLocation(bProgram, "a_position");
  var bColorAttribLoc = gl.getAttribLocation(bProgram, "a_color");
  var bMatrixLoc = gl.getUniformLocation(bProgram, "u_matrix");

  var bPositionBuffer = gl.createBuffer();
  var bVao = gl.createVertexArray();
  gl.bindVertexArray(bVao);
  gl.enableVertexAttribArray(bPosAttribLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, bPositionBuffer);
  setCubeGeometry(gl);
  gl.vertexAttribPointer(bPosAttribLoc, 3, gl.FLOAT, false, 0, 0);

  var bColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bColorBuffer);
  setCubeColors(gl);
  gl.enableVertexAttribArray(bColorAttribLoc);
  gl.vertexAttribPointer(bColorAttribLoc, 3, gl.UNSIGNED_BYTE, true, 0, 0);

  drawScene();

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_TEST);
    gl.useProgram(bProgram);
    gl.bindVertexArray(bVao);
    
    var bMatrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 500);
    bMatrix = m4.translate(bMatrix, shape.translation[0], shape.translation[1], shape.translation[2]);
    bMatrix = m4.xRotate(bMatrix, shape.rotation[0]);
    bMatrix = m4.yRotate(bMatrix, shape.rotation[1]);
    bMatrix = m4.zRotate(bMatrix, shape.rotation[2]);
    bMatrix = m4.scale(bMatrix, shape.scale[0], shape.scale[1], shape.scale[2]);
    gl.uniformMatrix4fv(bMatrixLoc, false, bMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 12 * 3); 
  }
}

function bg_start() {
  var main = document.getElementById("main-container");
  var canvas = document.createElement("canvas");
  canvas.setAttribute("id", "bg-canvas");
  canvas.classList = "bg-canvas";
  main.appendChild(canvas);

  var b_shape = {
    translation: [200, 200, 200],
    rotation: [20, 15, 10],
    scale: [1, 1, 1],
    color: [Math.random(), Math.random(), Math.random(), 1]
  }

  var b_gl = canvas.getContext("webgl2");
  bg_main(b_gl, b_shape);
}

bg_start();

