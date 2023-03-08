// original code from https://webgl2fundamentals.org/webgl/lessons/webgl-2d-scale.html
// updated code with matrices from https://webgl2fundamentals.org/webgl/lessons/webgl-2d-matrices.html
// challenge: 
//      show two F without duplicating the mesh
//      animate when button clicked

"use strict";

// GLOBAL VARIABLES
var numberFs = 2; 
var shapes = [];

// must use something struct-like to avoid global variables
// and then pass the struct and shapes array
var gl = null;
var program = null;
var vao = null;
var resolutionUniformLocation = null;
var colorLocation = null;
var matrixLocation = null;

// SHADERS
var vertexShaderSource = `#version 300 es
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

var fragmentShaderSource = `#version 300 es
    precision highp float;
    uniform vec4 u_color;
    out vec4 outColor;
    void main() {
        outColor = u_color;
    }
`;

function main() {
    gl = document.querySelector("#canvas").getContext("webgl2");
    if (!gl) return;
    
    program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    colorLocation = gl.getUniformLocation(program, "u_color");
    matrixLocation = gl.getUniformLocation(program, "u_matrix");

    var positionBuffer = gl.createBuffer();

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(positionAttributeLocation);

    shapes = createShapesAndUI(numberFs);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); 
    setGeometry();
    
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    
    drawScene(shapes);

    for (var i = 0; i < numberFs; ++i)
        setupUI(i);
    
    function setupUI(index) {
        webglLessonsUI.setupSlider("#x" + index, { value: shapes[index].translation[0], slide: updatePosition(index, 0), max: gl.canvas.width });
        webglLessonsUI.setupSlider("#y" + index, { value: shapes[index].translation[1], slide: updatePosition(index, 1), max: gl.canvas.height });
        webglLessonsUI.setupSlider("#angle" + index, { slide: updateAngle(index), max: 360 });
        webglLessonsUI.setupSlider("#scaleX" + index, { value: shapes[index].scale[0], slide: updateScale(index, 0), min: -5, max: 5, step: 0.01, precision: 2 });
        webglLessonsUI.setupSlider("#scaleY" + index, { value: shapes[index].scale[1], slide: updateScale(index, 1), min: -5, max: 5, step: 0.01, precision: 2 });

        function updatePosition(i, j) {
            return function (event, ui) {
                shapes[i].translation[j] = ui.value;
                drawScene(shapes);
            };
        }

        function updateAngle(i) {
            return function (event, ui) {
                var angleInDegrees = 360 - ui.value;
                shapes[i].rotation = angleInDegrees * Math.PI / 180;
                drawScene(shapes);
            }
        }

        function updateScale(i, j) {
            return function (event, ui) {
                shapes[i].scale[j] = ui.value;
                drawScene(shapes);
            };
        }
    }
}

// OTHER FUNCTIONS
function createShapesAndUI(number) {
    var shapes = [];
    var uiDiv = document.getElementById("ui");
    for (var i = 0; i < number; ++i) {
        var x = document.createElement("div");
        x.setAttribute("id", "x" + i);
        uiDiv.appendChild(x);
        var y = document.createElement("div");
        y.setAttribute("id", "y" + i);
        uiDiv.appendChild(y);
        var angle = document.createElement("div");
        angle.setAttribute("id", "angle" + i);
        uiDiv.appendChild(angle);
        var scaleX = document.createElement("div");
        scaleX.setAttribute("id", "scaleX" + i);
        uiDiv.appendChild(scaleX);
        var scaleY = document.createElement("div");
        scaleY.setAttribute("id", "scaleY" + i);
        uiDiv.appendChild(scaleY);
        shapes.push({
            translation: [150 + (i * 10), 150 + (i * 10)],
            rotation: 0,
            scale: [1, 1],
            color: [Math.random(), Math.random(), Math.random(), 1]
        });
    }
    return shapes;
}

function setBtnEvent() {
    if (numberFs > 0) {
        var btn = document.getElementById("btn");
        btn.addEventListener("click", fAnimate);
    }
}
setBtnEvent();

function fAnimate(event) {
    event.srcElement.disabled = true;
    var start = new Date().getTime();
    var then = start;
    var now, deltaTime;
    requestAnimationFrame(animation);

    function animation() {
        now = new Date().getTime();
        deltaTime = (now - then) * 0.001;
        then = now;
        shapes[numberFs-1].rotation += 1.2 * deltaTime;
        drawScene(shapes);
        if (now < start + 5000) // 5 seconds
            requestAnimationFrame(animation);
        else {
            var btn = document.getElementById("btn");
            btn.disabled = false;
        }
    
        // how to update ui while animation is on
    }
}

// CALLING
main();