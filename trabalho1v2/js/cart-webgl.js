"use strict";

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

// var cartShapes;

function cart_main(cartShapes, cartCounter) {
  // var cCamera = [1, 1, 1, 1];
  // var cGl, cProgram, cVao, cColorAttribLoc, cPosAttribLoc, cMatrixLoc;
  var cGl, cProgram, cVao, cColorLoc, cPosAttribLoc, cMatrixLoc;

  cGl = getGLContext("cart-canvas");
  cProgram = createProgram(cGl, vertexShaderCart, fragmentShaderCart);
  setCartWebGl();
  console.log(cartShapes)
  requestAnimationFrame(drawCartShape);

  function setCartWebGl() {
    cPosAttribLoc = cGl.getAttribLocation(cProgram, "a_position");
    // cColorAttribLoc = cGl.getAttribLocation(cProgram, "a_color");
    cColorLoc = cGl.getUniformLocation(cProgram, "u_color");
    cMatrixLoc = cGl.getUniformLocation(cProgram, "u_matrix");

    var cPositionBuffer = cGl.createBuffer();
    cVao = cGl.createVertexArray();
    cGl.bindVertexArray(cVao);
    cGl.enableVertexAttribArray(cPosAttribLoc);
    cGl.bindBuffer(cGl.ARRAY_BUFFER, cPositionBuffer);
    setCubeGeometry(cGl);

    var size = 3;          // 2 components per iteration
    var type = cGl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    cGl.vertexAttribPointer(cPosAttribLoc, size, type, normalize, stride, offset);

    /*
    var colorBuffer = cGl.createBuffer();
    cGl.bindBuffer(cGl.ARRAY_BUFFER, colorBuffer);
    setCubeColors(cGl);
    cGl.enableVertexAttribArray(cColorAttribLoc);
    cGl.vertexAttribPointer(cColorAttribLoc, 3, cGl.UNSIGNED_BYTE, true, 0, 0);
    */
  }

  var then = 0;
  var deltaTime;

  function drawCartShape(now) {
    // console.log(cartCounter);
    now *= 0.001;
    deltaTime = now - then;
    then = now;

    webglUtils.resizeCanvasToDisplaySize(cGl.canvas);
    cGl.viewport(0, 0, cGl.canvas.width, cGl.canvas.height);
    cGl.clearColor(0, 0, 0, 0);
    cGl.clear(cGl.COLOR_BUFFER_BIT | cGl.DEPTH_BUFFER_BIT);
    cGl.enable(cGl.DEPTH_TEST);
    //gl.enable(gl.CULL_TEST);
    for (let index = 0; index < cartCounter; ++index) {
      cartShapes[index].rotation[0] += Math.sin(0.2 * deltaTime);
      cartShapes[index].rotation[1] += 1.5 * deltaTime;
      cGl.useProgram(cProgram);
      cGl.bindVertexArray(cVao);

      // var FOVRadians = degToRad(60);
      // var aspect = cGl.canvas.clientWidth / cGl.canvas.clientHeight;
      // var zNear = 1;
      // var zFar = 500;
      // var projMatrix = m4.perspective(FOVRadians, aspect, zNear, zFar);

      cGl.uniform4fv(cColorLoc, cartShapes[index].color);

      var cMatrix = m4.projection(cGl.canvas.clientWidth, cGl.canvas.clientHeight, 500);
      cMatrix = m4.translate(cMatrix, cartShapes[index].translation[0], cartShapes[index].translation[1], cartShapes[index].translation[2]);
      cMatrix = m4.xRotate(cMatrix, cartShapes[index].rotation[0]);
      cMatrix = m4.yRotate(cMatrix, cartShapes[index].rotation[1]);
      cMatrix = m4.zRotate(cMatrix, cartShapes[index].rotation[2]);
      cMatrix = m4.scale(cMatrix, cartShapes[index].scale[0], cartShapes[index].scale[1], cartShapes[index].scale[2]);
      cGl.uniformMatrix4fv(cMatrixLoc, false, cMatrix);


      /* 
      var radius = 0;
    
      var camMatrix = m4.xRotation(cCamera[0]);
      camMatrix = m4.yRotate(camMatrix, cCamera[1]);
      camMatrix = m4.zRotate(camMatrix, cCamera[2]);
      camMatrix = m4.translate(camMatrix, 2, cCamera[3], 0.5);
    
      // console.log(camMatrix)
    
      var cubePos = [radius, 0, 0];
      var camPos = [camMatrix[12], camMatrix[13], camMatrix[14]];
      var up = [0, 1, 0];
    
      var camMatrix = m4.lookAt(camPos, cubePos, up);
      var viewMatrix = m4.inverse(camMatrix);
      var viewProjectionMatrix = m4.multiply(projMatrix, viewMatrix);
      var matrix = m4.translate(viewProjectionMatrix, 0, 0, 0);
      cGl.uniformMatrix4fv(cMatrixLoc, false, matrix); 
      */


      cGl.drawArrays(cGl.TRIANGLES, 0, 12 * 3);
    }
    requestAnimationFrame(drawCartShape);
  }
}