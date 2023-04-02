"use strict";

const vertexShaderIndex = `#version 300 es
  uniform mat4 u_matrix;

  in vec4 a_position;
  in vec2 a_texcoord;
  // in vec4 a_color;
  
  out vec4 v_color;
  out vec2 v_texcoord;
  
  void main() {
    gl_Position = u_matrix * a_position;
    // v_color = a_color;
    v_texcoord = a_texcoord;
  }
`;

const fragmentShaderIndex = `#version 300 es
  precision highp float;
  uniform sampler2D u_texture;
  
  // in vec4 v_color;
  in vec2 v_texcoord;

  out vec4 outColor;

  void main() {
    // outColor = v_color;
    outColor = texture(u_texture, v_texcoord);
  }
`;

var iGl, iProgram, iVao, iColorAttribLoc, iPosAttribLoc, iTextCoordAttribLoc, iMatrixLoc;

var cubeTextures, tAux = 0;

var iCamera = [degToRad(0), degToRad(0), degToRad(0), 4];

function setIndexWebGl(gl, shapes, index) {
  iPosAttribLoc = gl.getAttribLocation(iProgram, "a_position");
  iColorAttribLoc = gl.getAttribLocation(iProgram, "a_color");
  iTextCoordAttribLoc = gl.getAttribLocation(iProgram, "a_texcoord");
  iMatrixLoc = gl.getUniformLocation(iProgram, "u_matrix");

  // positions and vertices
  var iPositionBuffer = gl.createBuffer();
  iVao = gl.createVertexArray();
  gl.bindVertexArray(iVao);
  gl.enableVertexAttribArray(iPosAttribLoc);
  gl.bindBuffer(gl.ARRAY_BUFFER, iPositionBuffer);
  setCubeGeometry(gl);
  var size = 3;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(iPosAttribLoc, size, type, normalize, stride, offset);

  // colors
  // var colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // setCubeColors(gl);
  // gl.enableVertexAttribArray(iColorAttribLoc);
  // gl.vertexAttribPointer(iColorAttribLoc, 3, gl.UNSIGNED_BYTE, true, 0, 0);

  // textures
  var iTexcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, iTexcoordBuffer);
  gl.enableVertexAttribArray(iTextCoordAttribLoc);
  setCubeTexCoords(gl);
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;
  var normalize = true;  // convert from 0-255 to 0.0-1.0
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(iTextCoordAttribLoc, size, type, normalize, stride, offset);
  var iTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + 0);
  gl.bindTexture(gl.TEXTURE_2D, iTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 192, 0, 1]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  // Asynchronously load an image
  var image = new Image();
  image.src = cubeTextures[shapes[index].texture];
  image.addEventListener('load', function () {
    gl.bindTexture(gl.TEXTURE_2D, iTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    // mainCalls(index, shapes);
    drawIndexShape(gl, shapes, index);
    // iProgram = createProgram(gl, vertexShaderIndex, fragmentShaderIndex);
  });

}

function drawIndexShape(gl) {
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
  var zFar = 10;
  var projMatrix = m4.perspective(FOVRadians, aspect, zNear, zFar);

  var camMatrix = m4.xRotation(iCamera[0]);
  camMatrix = m4.yRotate(camMatrix, iCamera[1]);
  camMatrix = m4.zRotate(camMatrix, iCamera[2]);
  camMatrix = m4.translate(camMatrix, 0, 0, iCamera[3]);

  var viewMatrix = m4.inverse(camMatrix);
  var viewProjectionMatrix = m4.multiply(projMatrix, viewMatrix);
  var matrix = m4.translate(viewProjectionMatrix, 0, 0, 0);
  gl.uniformMatrix4fv(iMatrixLoc, false, matrix);

  gl.drawArrays(gl.TRIANGLES, 0, 12 * 3);
}

function setupUI(shapes, index) {
  webglLessonsUI.setupSlider(`#x${index}`, { value: radToDeg(iCamera[0]), slide: updateAngleX(index), min: 0, max: 360 });
  webglLessonsUI.setupSlider(`#y${index}`, { value: radToDeg(iCamera[1]), slide: updateAngleY(index), min: 0, max: 360 });
  webglLessonsUI.setupSlider(`#z${index}`, { value: radToDeg(iCamera[2]), slide: updateAngleZ(index), min: 0, max: 360 });
  webglLessonsUI.setupSlider(`#zoom${index}`, { value: iCamera[3], slide: updateZoom(index), min: 0, max: 12 });

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
  iGl = getGlContext(`canvas${index}`);
  iProgram = webglUtils.createProgramFromSources(iGl, [vertexShaderIndex, fragmentShaderIndex]);
  setIndexWebGl(iGl, SHAPES, index);
  // drawIndexShape(iGl, SHAPES, index);
  return iGl;
}

function index_main(NUMBER_OBJS, SHAPES) {
  cubeTextures = getCubeTexturesList();
  var gl;
  for (let i = 0; i < NUMBER_OBJS; ++i) {
    gl = mainCalls(i, SHAPES);
    setupUI(SHAPES, i);
    drawIndexShape(gl, SHAPES, i);
  }
}