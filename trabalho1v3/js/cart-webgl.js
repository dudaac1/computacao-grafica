"use strict";

/*
const vertexShaderCart = `#version 300 es
  in vec4 a_position;
  uniform mat4 u_matrix;

  // in vec4 a_color;
  // out vec4 v_color;
  
  void main() {
    gl_Position = u_matrix * a_position;
    // v_color = a_color;
  }
`;

const fragmentShaderCart = `#version 300 es
  precision highp float;
  
  // in vec4 v_color;
  uniform vec4 u_color;
  out vec4 outColor;

  void main() {
    // outColor = v_color;
    outColor = u_color;
  }
`;
*/

const vertexShaderCart = `#version 300 es
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

// var cartShapes;

function cart_main(cartItems, textures) {
  // var cGl, cProgram, cVao, cColorAttribLoc, cPosAttribLoc, cMatrixLoc;
  // var cGl, cProgram, cVao, cColorLoc, cPosAttribLoc, cMatrixLoc;
  var cCamera = [1, 1, 1, 3];
  var cGl, cProgram, cVao, cColorAttribLoc, cPosAttribLoc, cTextCoordAttribLoc, cMatrixLoc;
  var cTexture, cImage;


  cGl = getGlContext("cart-canvas");
  cProgram = webglUtils.createProgramFromSources(cGl, [vertexShaderCart, fragmentShaderCart]);
  cPosAttribLoc = cGl.getAttribLocation(cProgram, "a_position");
  cColorAttribLoc = cGl.getAttribLocation(cProgram, "a_color");
  cTextCoordAttribLoc = cGl.getAttribLocation(cProgram, "a_texcoord");
  cMatrixLoc = cGl.getUniformLocation(cProgram, "u_matrix");

  var cPositionBuffer = cGl.createBuffer();
  cVao = cGl.createVertexArray();
  cGl.bindVertexArray(cVao);
  cGl.enableVertexAttribArray(cPosAttribLoc);
  cGl.bindBuffer(cGl.ARRAY_BUFFER, cPositionBuffer);
  setCubeGeometry(cGl);
  cGl.vertexAttribPointer(cPosAttribLoc, 3, cGl.FLOAT, false, 0, 0);

  var cTexcoordBuffer = cGl.createBuffer();
  cGl.bindBuffer(cGl.ARRAY_BUFFER, cTexcoordBuffer);
  cGl.enableVertexAttribArray(cTextCoordAttribLoc);
  setCubeTexCoords(cGl);
  var normalize = true;  // convert from 0-255 to 0.0-1.0
  cGl.vertexAttribPointer(cTextCoordAttribLoc, 2, cGl.FLOAT, normalize, 0, 0);

  drawCartShape();

  // requestAnimationFrame(drawCartShape);
  // drawCartShape(0);



  /*
  var colorBuffer = cGl.createBuffer();
  cGl.bindBuffer(cGl.ARRAY_BUFFER, colorBuffer);
  setCubeColors(cGl);
  cGl.enableVertexAttribArray(cColorAttribLoc);
  cGl.vertexAttribPointer(cColorAttribLoc, 3, cGl.UNSIGNED_BYTE, true, 0, 0);
  */


  // cTexture = cGl.createTexture();
  // cGl.activeTexture(cGl.TEXTURE0 + 0);
  // cGl.bindTexture(cGl.TEXTURE_2D, cTexture);
  // cGl.texImage2D(cGl.TEXTURE_2D, 0, cGl.RGBA, 1, 1, 0, cGl.RGBA, cGl.UNSIGNED_BYTE, new Uint8Array([255, 192, 0, 1]));
  // cGl.texParameteri(cGl.TEXTURE_2D, cGl.TEXTURE_MIN_FILTER, cGl.LINEAR_MIPMAP_LINEAR);
  // // console.log(index)
  // if (cartItems.length != 0) {
  //   cImage = new Image(); // Asynchronously load an image
  //   cImage.src = textures[cartItems[index].texture];
  //   cImage.addEventListener('load', function () {
  //     cGl.bindTexture(cGl.TEXTURE_2D, cTexture);
  //     cGl.texImage2D(cGl.TEXTURE_2D, 0, cGl.RGBA, cGl.RGBA, cGl.UNSIGNED_BYTE, cImage);
  //     cGl.generateMipmap(cGl.TEXTURE_2D);
  //     drawCartShape(0);
  //     // mainCalls(index, shapes);
  //     // iProgram = createProgram(gl, vertexShaderIndex, fragmentShaderIndex);
  //   });
  // }
  // }

  // var objOffset = new Float32Array(1, 1, 1);
  // let initialScale = [1, 1, 1];
  // var translation = [0, 0, 0];
  // var rotation = [1, 1, 1];

  // var then = 0;
  // var deltaTime;

  function drawCartShape() {
  // function drawCartShape(now) {
    // now *= 0.001;
    // deltaTime = now - then;
    // then = now;



    webglUtils.resizeCanvasToDisplaySize(cGl.canvas);
    cGl.viewport(0, 0, cGl.canvas.width, cGl.canvas.height);
    cGl.clearColor(0, 0, 0, 0);
    cGl.clear(cGl.COLOR_BUFFER_BIT | cGl.DEPTH_BUFFER_BIT);
    cGl.enable(cGl.DEPTH_TEST);
    //gl.enable(gl.CULL_TEST);
    cGl.useProgram(cProgram);
    cGl.bindVertexArray(cVao);

    var radius = 200;

    var FOVRadians = degToRad(60);
    var aspect = cGl.canvas.clientWidth / cGl.canvas.clientHeight;
    var zNear = 1;
    var zFar = 500;
    var projMatrix = m4.perspective(FOVRadians, aspect, zNear, zFar);

    var camMatrix = m4.yRotation(0);
    camMatrix = m4.translate(camMatrix, 0, 0, radius * 1.5)

    var viewMatrix = m4.inverse(camMatrix);
    var viewProjectionMatrix = m4.multiply(projMatrix, viewMatrix);
    for (let index = 0; index < cartItems.length; ++index) {

      // cartItems[index].rotation[0] += Math.sin(0.2 * deltaTime);
      // cartItems[index].rotation[1] += 1.5 * deltaTime;

      cTexture = cGl.createTexture();
      cGl.activeTexture(cGl.TEXTURE0 + 0);
      cGl.bindTexture(cGl.TEXTURE_2D, cTexture);
      cGl.texImage2D(cGl.TEXTURE_2D, 0, cGl.RGBA, 1, 1, 0, cGl.RGBA, cGl.UNSIGNED_BYTE, new Uint8Array([255, 192, 0, 1]));
      cGl.texParameteri(cGl.TEXTURE_2D, cGl.TEXTURE_MIN_FILTER, cGl.LINEAR_MIPMAP_LINEAR);
      // console.log(index)
      if (cartItems.length != 0) {
        cImage = new Image(); // Asynchronously load an image
        cImage.src = textures[cartItems[index].texture];
        cImage.addEventListener('load', function () {
          cGl.bindTexture(cGl.TEXTURE_2D, cTexture);
          cGl.texImage2D(cGl.TEXTURE_2D, 0, cGl.RGBA, cGl.RGBA, cGl.UNSIGNED_BYTE, cImage);
          cGl.generateMipmap(cGl.TEXTURE_2D);
          drawCartShape();
          // mainCalls(index, shapes);
          // iProgram = createProgram(gl, vertexShaderIndex, fragmentShaderIndex);
        });
      }


      var cartLength = cartItems.length;
      for (var ii = 0; ii < cartLength; ++ii) {
        var angle = ii * Math.PI * 2 / cartLength;
  
        var x = Math.cos(angle) * radius;
        var z = Math.sin(angle) * radius;
        var matrix = m4.translate(viewProjectionMatrix, x, 0, z);
  
        // Set the matrix.
        cGl.uniformMatrix4fv(cMatrixLoc, false, matrix);
  
        // Draw the geometry.
        var primitiveType = cGl.TRIANGLES;
        var offset = 0;
        var count = 16 * 6;
        cGl.drawArrays(primitiveType, offset, count);
      }
    }
    // requestAnimationFrame(drawCartShape);
  }



}
