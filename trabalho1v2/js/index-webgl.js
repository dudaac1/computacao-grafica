"use strict";

const vertexShaderIndex = `#version 300 es
  in vec4 a_position;
  uniform mat4 u_matrix;

  in vec4 a_color;
  out vec4 v_color;
  
  void main() {
    gl_Position = u_matrix * a_position;
    v_color = a_color;
  }
`;

const fragmentShaderIndex = `#version 300 es
  precision highp float;
  
  in vec4 v_color;
  out vec4 outColor;

  void main() {
    outColor = v_color;
  }
`;

var iGl, iProgram, iVao, iColorAttribLoc, iPosAttribLoc, iMatrixLoc;

var iCamera = [3, 3.5, 4, 300];

function setIndexWebGl(gl) {
  iPosAttribLoc = gl.getAttribLocation(iProgram, "a_position");
  iColorAttribLoc = gl.getAttribLocation(iProgram, "a_color");
  iMatrixLoc = gl.getUniformLocation(iProgram, "u_matrix");

  var iPositionBuffer = gl.createBuffer();
  iVao = gl.createVertexArray();
  gl.bindVertexArray(iVao);
  gl.enableVertexAttribArray(iPosAttribLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, iPositionBuffer); 
  setCubeGeometry(gl);
  
  var size = 3;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(iPosAttribLoc, size, type, normalize, stride, offset);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setCubeColors(gl);
  gl.enableVertexAttribArray(iColorAttribLoc);
  gl.vertexAttribPointer(iColorAttribLoc, 3, gl.UNSIGNED_BYTE, true, 0, 0);
}

function drawIndexShape(gl, shapes, index) {
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  //gl.enable(gl.CULL_TEST);
  gl.useProgram(iProgram);
  gl.bindVertexArray(iVao);

  var FOVRadians = degToRad(60);
  var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  var zNear = 1;
  var zFar = 500;
  var projMatrix = m4.perspective(FOVRadians, aspect, zNear, zFar);

  /*
  var iMatrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 500);
  iMatrix = m4.translate(iMatrix, shapes[index].translation[0], shapes[index].translation[1], shapes[index].translation[2]);
  iMatrix = m4.xRotate(iMatrix, shapes[index].rotation[0]);
  iMatrix = m4.yRotate(iMatrix, shapes[index].rotation[1]);
  iMatrix = m4.zRotate(iMatrix, shapes[index].rotation[2]);
  iMatrix = m4.scale(iMatrix, shapes[index].scale[0], shapes[index].scale[1], shapes[index].scale[2]);
  gl.uniformMatrix4fv(iMatrixLoc, false, iMatrix);
  */

  var radius = 0;

  var camMatrix = m4.xRotation(iCamera[0]);
  camMatrix = m4.yRotate(camMatrix, iCamera[1]);
  camMatrix = m4.zRotate(camMatrix, iCamera[2]);
  camMatrix = m4.translate(camMatrix, 2, iCamera[3], 0.5);

  // console.log(camMatrix)

  var cubePos = [radius, 0, 0];
  var camPos = [camMatrix[12], camMatrix[13], camMatrix[14]];
  var up = [0, 1, 0];

  var camMatrix = m4.lookAt(camPos, cubePos, up);
  var viewMatrix = m4.inverse(camMatrix);
  var viewProjectionMatrix = m4.multiply(projMatrix, viewMatrix);
  var matrix = m4.translate(viewProjectionMatrix, 0, 0, 0);
  gl.uniformMatrix4fv(iMatrixLoc, false, matrix);

  gl.drawArrays(gl.TRIANGLES, 0, 12 * 3); 
}

// function setupUI(gl, shapes, index) {
function setupUI(shapes, index) {
  webglLessonsUI.setupSlider(`#x${index}`, {value: radToDeg(iCamera[0]), slide: updateAngleX(index), min: -360, max: 360});
  webglLessonsUI.setupSlider(`#y${index}`, {value: radToDeg(iCamera[1]), slide: updateAngleY(index), min: -360, max: 360});
  webglLessonsUI.setupSlider(`#z${index}`, {value: radToDeg(iCamera[2]), slide: updateAngleZ(index), min: -360, max: 360});
  webglLessonsUI.setupSlider(`#zoom${index}`, {value: iCamera[3], slide: updateZoom(index), min: 0, max: 500});

  // drawScene();

  function updateAngleX(i) {
    return function (event, ui) {
      iCamera[0] = degToRad(ui.value);
      mainCalls(i, shapes);
    }
  }

  function updateAngleY(i) {
    return function (event, ui) {
      iCamera[1] = degToRad(ui.value);
      mainCalls(i, shapes);
    }
  }

  function updateAngleZ(i) {
    return function (event, ui) {
      iCamera[2] = degToRad(ui.value);
      mainCalls(i, shapes);
    }
  }

  function updateZoom(i) {
    return function (event, ui) {
      iCamera[3] = ui.value;
      mainCalls(i, shapes);
    }
  }
}


function mainCalls(index, SHAPES) {
  iGl = getGLContext(`canvas${index}`);
  iProgram = createProgram(iGl, vertexShaderIndex, fragmentShaderIndex);
  setIndexWebGl(iGl);
  drawIndexShape(iGl, SHAPES, index);
}

function index_main(NUMBER_OBJS, SHAPES) {
  // var iGl;
  for (let i = 0; i < NUMBER_OBJS; ++i) {
    mainCalls(i, SHAPES);
    setupUI(SHAPES, i);

  }
}