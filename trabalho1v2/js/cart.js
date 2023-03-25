var cartCounter;

function c_start() {
  cartCounter = localStorage.getItem("cartCounter", cartCounter);
  if (!cartCounter)
    cartCounter = 0
  setCartItensValue();
  shapes = generateCartShapes(cartCounter);

  var clearCartBtn = document.getElementById("clear-cart");
  clearCartBtn.addEventListener("click", function() {
    cartCounter = 0; 
    localStorage.setItem("cartCounter", cartCounter);
    setCartItensValue();

    // if (!cartCounter)
    //   for (let i = 0; i < cartCounter; ++i)
    //     drawScene(i);
    // else {
    //   webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    //   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    //   gl.clearColor(0, 0, 0, 0);
    //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // }

  });

  c_main();

  function setCartItensValue() {
    var cartCounterDiv = document.getElementById("cart-counter");
    cartCounterDiv.textContent = cartCounter;
    var cartCounterSpan = document.getElementById("cart-counter-span");
    cartCounterSpan.textContent = cartCounter;
  }
}

function generateCartShapes(cartCounter) {
  console.log("uhhh! shapessss");
}

function c_main() {
  console.log("blah");
}

c_start();