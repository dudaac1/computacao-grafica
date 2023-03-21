"use strict";

function setGeometry(gl) {
  var positions = new Float32Array([
    10, 10,  10,
    10,  100,  10,
     100, 10,  10,
    10,  100,  10,
     100,  100,  10,
     100, 10,  10,

    10, 10,   100,
     100, 10,   100,
    10,  100,   100,
    10,  100,   100,
     100, 10,   100,
     100,  100,   100,

    10,   100, 10,
    10,   100,  100,
     100,   100, 10,
    10,   100,  100,
     100,   100,  100,
     100,   100, 10,

    10,  10, 10,
     100,  10, 10,
    10,  10,  100,
    10,  10,  100,
     100,  10, 10,
     100,  10,  100,

    10,  10, 10,
    10,  10,  100,
    10,   100, 10,
    10,  10,  100,
    10,   100,  100,
    10,   100, 10,

     100,  10, 10,
     100,   100, 10,
     100,  10,  100,
     100,  10,  100,
     100,   100, 10,
     100,   100,  100,
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

function setTexcoords(gl) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0   , 0  ,
      0   , 0.5,
      0.25, 0  ,
      0   , 0.5,
      0.25, 0.5,
      0.25, 0  ,
      
      0.25, 0  ,
      0.5 , 0  ,
      0.25, 0.5,
      0.25, 0.5,
      0.5 , 0  ,
      0.5 , 0.5,
      
      0.5 , 0  ,
      0.5 , 0.5,
      0.75, 0  ,
      0.5 , 0.5,
      0.75, 0.5,
      0.75, 0  ,
      
      0   , 0.5,
      0.25, 0.5,
      0   , 1  ,
      0   , 1  ,
      0.25, 0.5,
      0.25, 1  ,
      
      0.25, 0.5,
      0.25, 1  ,
      0.5 , 0.5,
      0.25, 1  ,
      0.5 , 1  ,
      0.5 , 0.5,

      0.5 , 0.5,
      0.75, 0.5,
      0.5 , 1  ,
      0.5 , 1  ,
      0.75, 0.5,
      0.75, 1  
    ]),
    gl.STATIC_DRAW);
}