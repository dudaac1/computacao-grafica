function createProgram(gl, vertex, fragment) {
  var vShader = createShader(gl, vertex, gl.VERTEX_SHADER);
  var fShader = createShader(gl, fragment, gl.FRAGMENT_SHADER);

  // console.log("aaaa");

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


function drawScene (shapes) {
  webglUtils.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
  // gl.clearColor(0, 0, 0, 0); // Clear the canvas
  // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  gl.useProgram(program);
  gl.bindVertexArray(vao);
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  for (var i = 0; i < numberFs; ++i)
      drawShape(i, shapes);

  var translationMatrix;
  var rotationMatrix;
  var scaleMatrix;
  var matrix;

  function drawShape(index) {
      gl.uniform4fv(colorLocation, shapes[index].color); 
      translationMatrix = m3.translation(shapes[index].translation[0], shapes[index].translation[1]);
      rotationMatrix = m3.rotation(shapes[index].rotation);
      scaleMatrix = m3.scaling(shapes[index].scale[0], shapes[index].scale[1]);
      matrix = m3.multiply(translationMatrix, rotationMatrix);
      matrix = m3.multiply(matrix, scaleMatrix);
      gl.uniformMatrix3fv(matrixLocation, false, matrix);
  
      // var primitiveType = gl.TRIANGLES;
      // var offset = 0;
      // var count = 18;
      // gl.drawArrays(primitiveType, offset, count); 
      gl.drawArrays(gl.TRIANGLES, 0, 18); 
  }
}