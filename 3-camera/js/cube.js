"use strict";

function setGeometry(gl) {
  var positions = new Float32Array([
    // front face
    10, 10, 0.0,
    10, 90, 0.0,
    90, 90, 0.0,
    
    10, 10, 0.0,
    90, 90, 0.0,
    90, 10, 0.0,

    // left face
    10, 10, 90,
    10, 90, 90,
    10, 90, 0.0,

    10, 10, 90, 
    10, 90, 0.0,
    10, 10, 0.0,

     // bottom face
     10, 10, 0.0,
     90, 10, 0.0,
     90, 10, 90,

     90, 10, 90, 
     10, 10, 90,
     10, 10, 0.0,

    //back face
    90, 90, 90,
    90, 10, 90,
    10, 10, 90,

    10, 10, 90,
    10, 90, 90, 
    90, 90, 90,

    // right face
    90, 90, 0.0,
    90, 10, 0.0,
    90, 10, 90,

    90, 10, 90,
    90, 90, 90,
    90, 90, 0.0,

    // up face
    10, 90, 0.0,
    90, 90, 90,
    10, 90, 90,

    90, 90, 0.0,
    90, 90, 90, 
    10, 90, 0.0
  ]);

  var matrix = m4.xRotation(Math.PI);
  matrix = m4.translate(matrix, -50, -75, -15);

  for (var ii = 0; ii < positions.length; ii += 3) {
    var vector = m4.transformVector(matrix, [positions[ii + 0], positions[ii + 1], positions[ii + 2], 1]);
    positions[ii + 0] = vector[0];
    positions[ii + 1] = vector[1];
    positions[ii + 2] = vector[2];
  }

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

}


  // Fill the current ARRAY_BUFFER buffer with colors for the 'F'.
function setColors(gl) {
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