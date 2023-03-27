"use strict";

function setCubeGeometry(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([

      // front face
      -100, -100, 0.0,
      -100, 100, 0.0,
      100, 100, 0.0,

      -100, -100, 0.0,
      100, 100, 0.0,
      100, -100, 0.0,

      // left face
      -100, -100, 100,
      -100, 100, 100,
      -100, 100, 0.0,

      -100, -100, 100,
      -100, 100, 0.0,
      -100, -100, 0.0,

      // bottom face
      -100, -100, 0.0,
      100, -100, 0.0,
      100, -100, 100,

      100, -100, 100,
      -100, -100, 100,
      -100, -100, 0.0,

      //back face
      100, 100, 100,
      100, -100, 100,
      -100, -100, 100,

      -100, -100, 100,
      -100, 100, 100,
      100, 100, 100,

      // right face
      100, 100, 0.0,
      100, -100, 0.0,
      100, -100, 100,

      100, -100, 100,
      100, 100, 100,
      100, 100, 0.0,

      // up face
      -100, 100, 0.0,
      100, 100, 100,
      -100, 100, 100,

      100, 100, 0.0,
      100, 100, 100,
      -100, 100, 0.0
    ]),
    gl.STATIC_DRAW);
}

// Fill the current ARRAY_BUFFER buffer with colors for the 'F'.
function setCubeColors(gl) {
  var r1 = Math.random() * 255;
  var r2 = Math.random() * 255;
  var g1 = Math.random() * 255;
  var g2 = Math.random() * 255;
  var b1 = Math.random() * 255;
  var b2 = Math.random() * 255;

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([
      // front face 
      r1, g1, b1,
      r1, g1, b1,
      r1, g1, b1,

      r1, g1, b1,
      r1, g1, b1,
      r1, g1, b1,

      // right face 
      r2, g2, b2,
      r2, g2, b2,
      r2, g2, b2,

      r2, g2, b2,
      r2, g2, b2,
      r2, g2, b2,

      //back face 
      r1, g2, b1,
      r1, g2, b1,
      r1, g2, b1,

      r1, g2, b1,
      r1, g2, b1,
      r1, g2, b1,

      // up face 
      r2, g1, b2,
      r2, g1, b2,
      r2, g1, b2,

      r2, g1, b2,
      r2, g1, b2,
      r2, g1, b2,

      // left face 
      r1, g1, b2,
      r1, g1, b2,
      r1, g1, b2,

      r1, g1, b2,
      r1, g1, b2,
      r1, g1, b2,

      // bottom face :: ORANGE
      r1, g2, b2,
      r1, g2, b2,
      r1, g2, b2,

      r1, g2, b2,
      r1, g2, b2,
      r1, g2, b2
    ]),
    gl.STATIC_DRAW);
}

function setCubeTexCoords(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0   , 0.5, 
      0   , 0  ,
      0.25, 0  ,
      0   , 0.5,
      0.25, 0  ,
      0.25, 0.5,
    
      0.5 , 0  , 
      0.25, 0  ,
      0.25, 0.5,
      0.5 , 0  ,
      0.25, 0.5,
      0.5 , 0.5,
      
      0.5 , 0.5, 
      0.75, 0.5,
      0.75, 0  ,
      0.75, 0  ,
      0.5 , 0  ,
      0.5 , 0.5,
      
      0.25, 0.5, 
      0   , 0.5,
      0   , 1  ,
      0   , 1  ,
      0.25, 1  ,
      0.25, 0.5,
      
      0.5 , 0.5,
      0.5 , 1  ,
      0.25, 1  ,
      0.25, 1  ,
      0.25, 0.5,
      0.5 , 0.5,

      0.5 , 1  ,
      0.75, 0.5,
      0.75, 1  ,
      0.5 , 0.5,
      0.75, 0.5,
      0.5 , 1  
    ]),
    gl.STATIC_DRAW);
}

function getCubeTexturesList() {
  return [
    "./resources/textures/cube/rocky.png",
    "./resources/textures/cube/jjuliar.png",
    "./resources/textures/cube/puppies.png",
    "./resources/textures/cube/paintings.png",
    "./resources/textures/cube/flower.png",
    "./resources/textures/cube/fabrics.png",
    "./resources/textures/cube/rocky.png",
    "./resources/textures/cube/jjuliar.png",
  ]
}