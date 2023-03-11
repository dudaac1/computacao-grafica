"use strict";

const vShader2D = `#version 300 es
    in vec2 a_position;
    uniform vec2 u_resolution;
    uniform mat3 u_matrix;
    void main() {
        vec2 position = (u_matrix * vec3(a_position, 1)).xy;
        vec2 zeroToOne = position / u_resolution;
        vec2 zeroToTwo = zeroToOne * 2.0;
        vec2 clipSpace = zeroToTwo - 1.0;
        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
`;

const vShader3D = `#version 300 es
  in vec4 a_position;
  uniform mat4 u_matrix;
  void main() {
    gl_Position = u_matrix * a_position;
  }
`;

const fShader = `#version 300 es
    precision highp float;
    uniform vec4 u_color;
    out vec4 outColor;
    void main() {
        outColor = u_color;
    }
`;

var program = null;

function main(NUMBER_OBJS, NUM_BG_OBJ, bgShapes, shapes) {
  var bgGl = getGLContext("canvas-main-bg");
  program = createProgram(bgGl, vShader2D, fShader);
  webGl(bgGl, program);
  for (let j = 0; j < NUM_BG_OBJ; ++j) 
    drawShape(bgGl, bgShapes[j]);

  // como animar o fundo?

  // cards shapes
  var gl;
  for (let i = 0; i < NUMBER_OBJS; ++i) {
    gl = getGLContext(`canvas${i}`);
    program = createProgram(gl, vShader2D, fShader);
    webGl(gl, program);
    drawShape(gl, shapes[i]);
  }

  function webGl(gl, program) {
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    colorLocation = gl.getUniformLocation(program, "u_color");
    matrixLocation = gl.getUniformLocation(program, "u_matrix");
  
    var positionBuffer = gl.createBuffer();
  
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
    setGeometry(gl);
    
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  }
  
  function drawShape(gl, shape) {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    // gl.clearColor(0, 0, 0, 0); // Clear the canvas
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  
    gl.uniform4fv(colorLocation, shape.color); 
    var translationMatrix = m3.translation(shape.translation[0], shape.translation[1]);
    var rotationMatrix = m3.rotation(shape.rotation);
    var scaleMatrix = m3.scaling(shape.scale[0], shape.scale[1]);
    var matrix = m3.multiply(translationMatrix, rotationMatrix);
    matrix = m3.multiply(matrix, scaleMatrix);
    gl.uniformMatrix3fv(matrixLocation, false, matrix);
  
    // var primitiveType = gl.TRIANGLES;
    // var offset = 0;
    // var count = 18;
    // gl.drawArrays(primitiveType, offset, count); 
    gl.drawArrays(gl.TRIANGLES, 0, 18); 
  }
}

function getGLContext(canvas) {
  var gl = document.getElementById(canvas).getContext("webgl2");
  if (!gl) {
    console.log("WebGL não encontrado.");
    return undefined;
  }
  return gl;
}

function createProgram(gl, vertex, fragment) {
  var vShader = createShader(gl, vertex, gl.VERTEX_SHADER);
  var fShader = createShader(gl, fragment, gl.FRAGMENT_SHADER);

	var program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;

  console.log("Problema com programa WebGL.");
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return undefined;

  function createShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;
  
    console.log(`Problema com Shader WebGL: ${type}.`);
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return undefined;
  }
}

var vao = null;
var resolutionUniformLocation = null;
var colorLocation = null;
var matrixLocation = null;