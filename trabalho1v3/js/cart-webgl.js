"use strict";

const vertexShaderCart = `#version 300 es
uniform mat4 u_matrix;

  in vec4 a_position;
  // in vec4 a_color;
  in vec2 a_texcoord;
  
  // out vec4 v_color;
  out vec2 v_texcoord;
  
  void main() {
    gl_Position = u_matrix * a_position;
    // v_color = a_color;
    v_texcoord = a_texcoord;
  }
`;

const fragmentShaderCart = `#version 300 es
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

let loadedImages = [], saveImages = 1, numItems;
let cGl, cProgram, cPosAttribLoc, cTextCoordAttribLoc, cMatrixLoc, cVao, cCamera, cTexture;

function cart_main(cartItems, textures) {
  loadImages(textures, drawCartShapes); //load imgs async

  numItems = cartItems.length;

  cGl = getGlContext("cart-canvas");
  cProgram = webglUtils.createProgramFromSources(cGl, [vertexShaderCart, fragmentShaderCart]);
  cPosAttribLoc = cGl.getAttribLocation(cProgram, "a_position");
  // var cColorAttribLoc = cGl.getAttribLocation(cProgram, "a_color");
  cTextCoordAttribLoc = cGl.getAttribLocation(cProgram, "a_texcoord");
  cMatrixLoc = cGl.getUniformLocation(cProgram, "u_matrix");

  cVao = cGl.createVertexArray();
  cGl.bindVertexArray(cVao);

  var cPositionBuffer = cGl.createBuffer();
  cGl.bindBuffer(cGl.ARRAY_BUFFER, cPositionBuffer);
  cGl.enableVertexAttribArray(cPosAttribLoc);
  setCubeGeometry(cGl);
  cGl.vertexAttribPointer(cPosAttribLoc, 3, cGl.FLOAT, false, 0, 0);

  /* 
  var colorBuffer = cGl.createBuffer();
  cGl.bindBuffer(cGl.ARRAY_BUFFER, colorBuffer);
  cGl.enableVertexAttribArray(cColorAttribLoc);
  setCubeColors(cGl);
  cGl.vertexAttribPointer(cColorAttribLoc, 3, cGl.UNSIGNED_BYTE, true, 0, 0); 
  */

  var cTexcoordBuffer = cGl.createBuffer();
  cGl.bindBuffer(cGl.ARRAY_BUFFER, cTexcoordBuffer);
  cGl.enableVertexAttribArray(cTextCoordAttribLoc);
  setCubeTexCoords(cGl);
  var normalize = true;  // convert from 0-255 to 0.0-1.0
  cGl.vertexAttribPointer(cTextCoordAttribLoc, 2, cGl.FLOAT, normalize, 0, 0);

  cTexture = cGl.createTexture();
  cGl.activeTexture(cGl.TEXTURE0 + 0);
  cGl.bindTexture(cGl.TEXTURE_2D, cTexture);
  cGl.texImage2D(cGl.TEXTURE_2D, 0, cGl.RGBA, 1, 1, 0, cGl.RGBA, cGl.UNSIGNED_BYTE, new Uint8Array([255, 192, 0, 1]));
  cGl.texParameteri(cGl.TEXTURE_2D, cGl.TEXTURE_MIN_FILTER, cGl.LINEAR_MIPMAP_LINEAR);
  cGl.bindTexture(cGl.TEXTURE_2D, cTexture);


  // setup ui
  cCamera = [degToRad(0), degToRad(0), degToRad(0), numItems * 3];

  webglLessonsUI.setupSlider("#xCamera", { value: radToDeg(cCamera[0]), slide: updateCameraAngle(0), min: -180, max: 180 });
  webglLessonsUI.setupSlider("#yCamera", { value: radToDeg(cCamera[1]), slide: updateCameraAngle(1), min: -180, max: 180 });
  webglLessonsUI.setupSlider("#zCamera", { value: radToDeg(cCamera[2]), slide: updateCameraAngle(2), min: -180, max: 180 });
  webglLessonsUI.setupSlider("#distance", { value: cCamera[3], slide: updateDistance(), min: 0, max: cCamera[3] });

  function updateCameraAngle(index) {
    return function (event, ui) {
      cCamera[index] = degToRad(ui.value);
      drawCartShapes(loadedImages);
    }
  }

  function updateDistance() {
    return function (event, ui) {
      cCamera[3] = ui.value;
      drawCartShapes(loadedImages);
    }
  }
}

function drawCartShapes(images) {
  if (saveImages) {
    loadedImages = images;
    saveImages = 0;
  }

  // var FOVRadians = degToRad(60);
  // var numItems = cartItems.length;

  webglUtils.resizeCanvasToDisplaySize(cGl.canvas);
  cGl.viewport(0, 0, cGl.canvas.width, cGl.canvas.height);
  cGl.clearColor(0, 0, 0, 0);
  cGl.clear(cGl.COLOR_BUFFER_BIT | cGl.DEPTH_BUFFER_BIT);
  cGl.enable(cGl.DEPTH_TEST);
  //gl.enable(gl.CULL_TEST);
  cGl.useProgram(cProgram);
  cGl.bindVertexArray(cVao);

  var aspect = cGl.canvas.clientWidth / cGl.canvas.clientHeight;
  // var zNear = 1;
  // var zFar = 100 * numItems;
  // field of view radians - aspect - z near - z far
  var projMatrix = m4.perspective(degToRad(60), aspect, 1, 100 * numItems);

  var camMatrix = m4.xRotation(cCamera[0]);
  camMatrix = m4.yRotate(camMatrix, cCamera[1]);
  camMatrix = m4.zRotate(camMatrix, cCamera[2]);
  camMatrix = m4.translate(camMatrix, 0, 0, cCamera[3]);
  var viewMatrix = m4.inverse(camMatrix);
  var viewProjectionMatrix = m4.multiply(projMatrix, viewMatrix);

  var x, y, z;
  // var auxX = 0, auxY = 0, auxZ = 0;
  for (let index = 0; index < numItems; ++index) {
    
    cGl.texImage2D(cGl.TEXTURE_2D, 0, cGl.RGBA, cGl.RGBA, cGl.UNSIGNED_BYTE, images[cartItems[index].texture]);
    cGl.generateMipmap(cGl.TEXTURE_2D);

    var angle = index * Math.PI  / numItems;
    x = Math.sin(angle) * numItems;
    y = Math.cos(angle) * numItems;
    // z = 0
    var matrix = m4.translate(viewProjectionMatrix, x, y, 0);

    // x = 0;
    // y = -(15 - 1) + auxY++ * 2;
    // z = -1 + auxZ * 2;
    // if (y > 15) {
    //   --auxZ;
    //   auxY = 0;
    // }
    // var matrix = m4.translate(viewProjectionMatrix, 0, y, z);

    cGl.uniformMatrix4fv(cMatrixLoc, false, matrix);
    cGl.drawArrays(cGl.TRIANGLES, 0, 36);
  }
}