function main() {
  var canvas = document.getElementById("canvas");
  var gl = canvas.getContext("webgl");

  var program = gl.createProgram();
  var vShader = gl.createShader(gl.VERTEX_SHADER);
  var fShader = gl.createShader(gl.FRAGMENT_SHADER);
  var vShaderSource = document.getElementById("vertex-shader").textContent;
  var fShaderSource = document.getElementById("fragment-shader").textContent;

  gl.shaderSource(vShader, vShaderSource);
  gl.compileShader(vShader);

  gl.shaderSource(fShader, fShaderSource);
  gl.compileShader(fShader);

  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);

  gl.linkProgram(program);
  gl.useProgram(program);

  var positionLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionLocation);

  var buffer = gl.createBuffer();
  var square_triangles = [ // quadrado
    0.4, 0.9, 
    0.4, 0.4,
    0.9, 0.9,
    0.9, 0.9, 
    0.4, 0.4,
    0.9, 0.4
  ]; 

  var diamond_triangles = [ // losango
    -0.5, 0.9, 
    -0.9, 0.5,
    -0.1, 0.5,
    -0.1, 0.5,
    -0.9, 0.5,
    -0.5, 0.1
  ]
  
  var half_circle_triangles = [ // meio circulo
    0.0, 0.0,   0.2, 0.4,   0.0, 0.5,
    0.0, 0.0,   0.4, 0.2,   0.2, 0.4,
    0.0, 0.0,   0.45, 0.0,  0.4, 0.2,
    0.0, 0.0,   0.45, 0.0,  0.4, -0.2,
    0.0, 0.0,   0.4, -0.2,  0.2, -0.4,
    0.0, 0.0,   0.2, -0.4,  0.0, -0.5,
  ] 

  // repositioning so the elements don't stay on top of each other
  half_circle_triangles = half_circle_triangles.map((point, i) => {
    if (i % 2 == 0)
      return point + 0.4; 
    else
      return point - 0.4;
  })

  var circle_triangle_fan = [
    0.0, 0.45,
    0.2, 0.4,
    0.4, 0.2,   
    0.45, 0.0,  
    0.4, -0.2,
    0.2, -0.4,
    0.0, -0.45,
    -0.2, -0.4,
    -0.4, -0.2,
    -0.45, 0.0,
    -0.4, 0.2,
    -0.2, 0.4,
    0.0, 0.45
  ]

  circle_triangle_fan = circle_triangle_fan.map((point) => {
    return Math.floor((point - 0.5)*1000)/1000;
  });

  var grid = []; 
  // 20x20 matrix
  // the positioning system varies from -1 to 1 in both directions
  // the distance between lines is going to be 0.1
  for (var i = -0.9; i < 1; i += 0.1) { // x-axis variation
      grid.push(Math.floor(i*10)/10);
      grid.push(1);
      grid.push(Math.floor(i*10)/10);
      grid.push(-1);
  }

  for (var i = -0.9; i < 1; i += 0.1) { // y-axis variation
    grid.push(1);
    grid.push(Math.floor(i*10)/10);
    grid.push(-1);
    grid.push(Math.floor(i*10)/10);
  }

  var center = [0.0, 0.0]; // origin point

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); 
  /* it can be:
      ARRAY_BUFFER: used for vertex atributes, as position and color
      ELEMENT_ARRAY_BUFFER: vertex's indexes  */

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grid), gl.STATIC_DRAW);
  /* it can be:
      STATIC_DRAW: define os dados 1x e eles não mudam
      DYNAMIC_DRAW: usa os dados muitas vezes, sendo reespecificados
      STREAM_DRAW: similar a Static, usa somente algumas vezes na aplicação */

  gl.clearColor(0.5, 0.5, 0.8, 1.0); // background color
  gl.clear(gl.COLOR_BUFFER_BIT);

  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  // primitive type can be:
  // POINTS    LINES    LINE_STRIP    LINE_LOOP
  // TRIANGLE    TRIANGLE_STRIP    TRIANGLE_FAN
  var primitiveType = gl.LINES;
  var offset = 0;
  var count = 80; // 20 lines in x-axis * 2 vertexes per line
                  // 40 + values from y-axis  
  gl.drawArrays(primitiveType, offset, count);  
  
  gl.deleteProgram(program);

  
  
  // changing fragment color

  fShaderSource = `
    void main() {
      gl_FragColor = vec4(0.9, 0.8, 0.1, 1.0);
    }
  `;
    
  program = gl.createProgram();
  fShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(fShader, fShaderSource);
  gl.compileShader(fShader);

  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);

  gl.linkProgram(program);
  gl.useProgram(program);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(center), gl.STATIC_DRAW);
  count = 1;
  primitiveType = gl.POINT;
  gl.drawArrays(primitiveType, offset, count);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square_triangles), gl.STATIC_DRAW);
  count = 6;  // count = 6 means our vertex shader will execute 6 times
              // 2 triangles with 3 vertex each
  primitiveType = gl.TRIANGLES;
  gl.drawArrays(primitiveType, offset, count);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(diamond_triangles), gl.STATIC_DRAW);
  gl.drawArrays(primitiveType, offset, count);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(half_circle_triangles), gl.STATIC_DRAW);
  count = 6*3; // 6 triangles with 3 vertexes each
  gl.drawArrays(primitiveType, offset, count); 

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circle_triangle_fan), gl.STATIC_DRAW);
  count = 12; // 
  primitiveType = gl.TRIANGLE_FAN;
  gl.drawArrays(primitiveType, offset, count);
  
  // if only one image should be printed
  // gl.clearColor() and gl.clear()
  // should be put in the code before drawArrays()

  // if the grid wasn't necessary, for example
  // the code mentioned should be put after the drawArrays()
  // from the grid. only the forms would be printed.

}

