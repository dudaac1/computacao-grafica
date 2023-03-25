var cartCounter;

function cart_start() {
  cartCounter = localStorage.getItem("cartCounter", cartCounter);
  if (!cartCounter)
  cartCounter = 0
  setCartItensValue();
  
  var canvasWidth = document.getElementById("cart-canvas").getBoundingClientRect().width;
  var cartShapes = generateCartShapes(2, canvasWidth);

  var clearCartBtn = document.getElementById("clear-cart");
  clearCartBtn.addEventListener("click", function() {
    cartCounter = 0; 
    localStorage.setItem("cartCounter", cartCounter);
    cartShapes = [];
    setCartItensValue();
    cart_main(cartShapes, cartCounter);
  });

  cart_main(cartShapes, cartCounter);

  function setCartItensValue() {
    var cartCounterDiv = document.getElementById("cart-counter");
    cartCounterDiv.textContent = cartCounter;
    var cartCounterSpan = document.getElementById("cart-counter-span");
    cartCounterSpan.textContent = cartCounter;
  }
}

function generateCartShapes(mult2, canvasWidth) {
  var shapes = [], aux = 0, j = 0;
  var txBase = 50, tyBase = 100, tMult = 150, tx, ty;
  for (let i = 0; i < cartCounter; ++i) {
    tx = txBase + (tMult * aux);
    ++aux;
    ty = tyBase + tMult * j;
    if (tx + tMult > canvasWidth) {
      j++;
      aux = 0;
    }
    shapes.push({
      translation: [tx, ty, 0],
      // rotation: [0, 0, 0],
      rotation: [degToRad(Math.random() * 75), degToRad(Math.random() * 75), degToRad(Math.random() * 75)],
      scale: [0.2 * mult2, 0.2 * mult2, 0.2 * mult2],
      color: [Math.random(), Math.random(), Math.random(), 1],
      price: Math.round(Math.random() * 50)
    });
  }
  return shapes;
  }



cart_start();