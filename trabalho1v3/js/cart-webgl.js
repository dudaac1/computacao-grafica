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

let loadedImages = [], saveImages = 1;

function cart_main(cartItems, textures) {
  loadImages(textures, drawCartShapes); //load imgs async

  var cGl = getGlContext("cart-canvas");
  var cProgram = webglUtils.createProgramFromSources(cGl, [vertexShaderCart, fragmentShaderCart]);
  var cPosAttribLoc = cGl.getAttribLocation(cProgram, "a_position");
  // var cColorAttribLoc = cGl.getAttribLocation(cProgram, "a_color");
  var cTextCoordAttribLoc = cGl.getAttribLocation(cProgram, "a_texcoord");
  var cMatrixLoc = cGl.getUniformLocation(cProgram, "u_matrix");

  var cVao = cGl.createVertexArray();
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


  // setup ui

  var FOVRadians = degToRad(60);
  var numItems = cartItems.length;

  var camera = [degToRad(0), degToRad(90), degToRad(0), 20];

  webglLessonsUI.setupSlider("#xCamera", { value: radToDeg(camera[0]), slide: updateCameraAngle(0), min: -180, max: 180 });
  webglLessonsUI.setupSlider("#yCamera", { value: radToDeg(camera[1]), slide: updateCameraAngle(1), min: -180, max: 180 });
  webglLessonsUI.setupSlider("#zCamera", { value: radToDeg(camera[2]), slide: updateCameraAngle(2), min: -180, max: 180 });
  webglLessonsUI.setupSlider("#distance", { value: camera[3], slide: updateDistance(), min: 0, max: 100 });

  function updateCameraAngle(index) {
    return function (event, ui) {
      camera[index] = degToRad(ui.value);
      drawCartShapes(loadedImages);
    }
  }

  function updateDistance() {
    return function (event, ui) {
      camera[3] = ui.value;
      drawCartShapes(loadedImages);
    }
  }

  // var then = 0;
  // var deltaTime;

  function drawCartShapes(images) {
    // function drawCartShape(now) {
    // now *= 0.001;
    // deltaTime = now - then;
    // then = now;

    if (saveImages) {
      loadedImages = images;
      saveImages = 0;
    }

    webglUtils.resizeCanvasToDisplaySize(cGl.canvas);
    cGl.viewport(0, 0, cGl.canvas.width, cGl.canvas.height);
    cGl.clearColor(0, 0, 0, 0);
    cGl.clear(cGl.COLOR_BUFFER_BIT | cGl.DEPTH_BUFFER_BIT);
    cGl.enable(cGl.DEPTH_TEST);
    //gl.enable(gl.CULL_TEST);
    cGl.useProgram(cProgram);
    cGl.bindVertexArray(cVao);

    var aspect = cGl.canvas.clientWidth / cGl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 100 * numItems;
    var projMatrix = m4.perspective(FOVRadians, aspect, zNear, zFar);

    var camMatrix = m4.xRotation(camera[0]);
    camMatrix = m4.yRotate(camMatrix, camera[1]);
    camMatrix = m4.zRotate(camMatrix, camera[2]);
    // camMatrix = m4.translate(camMatrix, 0, 0, numItems * 1.5);
    camMatrix = m4.translate(camMatrix, 0, 0, camera[3]);
    var viewMatrix = m4.inverse(camMatrix);
    var viewProjectionMatrix = m4.multiply(projMatrix, viewMatrix);

    var texture, x, y, z, auxX = 0, auxY = 0, auxZ = 3;
    for (let index = 0; index < numItems; ++index) {
      // cartItems[index].rotation[0] += Math.sin(0.2 * deltaTime);
      // cartItems[index].rotation[1] += 1.5 * deltaTime;

      texture = cGl.createTexture();
      cGl.activeTexture(cGl.TEXTURE0 + 0);
      cGl.bindTexture(cGl.TEXTURE_2D, texture);
      cGl.texImage2D(cGl.TEXTURE_2D, 0, cGl.RGBA, 1, 1, 0, cGl.RGBA, cGl.UNSIGNED_BYTE, new Uint8Array([255, 192, 0, 1]));
      cGl.texParameteri(cGl.TEXTURE_2D, cGl.TEXTURE_MIN_FILTER, cGl.LINEAR_MIPMAP_LINEAR);

      cGl.bindTexture(cGl.TEXTURE_2D, texture);
      cGl.texImage2D(cGl.TEXTURE_2D, 0, cGl.RGBA, cGl.RGBA, cGl.UNSIGNED_BYTE, images[cartItems[index].texture]);
      cGl.generateMipmap(cGl.TEXTURE_2D);

      // var angle = index * Math.PI * 2 / numItems;
      // var x = Math.cos(angle) * numItems;
      // var z = Math.sin(angle) * numItems;
      // var matrix = m4.translate(viewProjectionMatrix, x, 0, z);

      x = 0;
      y = -(camera[3]-1) + auxY++ * 2;
      z = -1 + auxZ * 2;
      if (y > camera[3]-2) {
        --auxZ;
        auxY = 0;
      }

      var matrix = m4.translate(viewProjectionMatrix, x, y, z);

      cGl.uniformMatrix4fv(cMatrixLoc, false, matrix);
      cGl.drawArrays(cGl.TRIANGLES, 0, 36);
    }

  }
  // requestAnimationFrame(drawCartShape);
}