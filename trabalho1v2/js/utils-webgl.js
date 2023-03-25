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
  if (success) 
    return program;

  console.log("Problema com programa WebGL.");
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return undefined;

  function createShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) 
      return shader;
  
    console.log(`Problema com Shader WebGL: ${type}.`);
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return undefined;
  }
}