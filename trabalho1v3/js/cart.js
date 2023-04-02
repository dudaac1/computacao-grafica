var cartItems;

function cart_start() {
  let cartCounter = 0, cartPrice = 0;
  let textures = getCubeTexturesList();
  // var cubeTextures = getCubeTexturesList();
  
  cartItems = getCartItems();
  if (cartItems.length != 0) {
    cartPrice = cartItems.reduce((sum, curr) => {
      return sum += curr.price
    }, 0);
    cartCounter = cartItems.length;
  } 

  setCartItensValue();

  var clearCartBtn = document.getElementById("clear-cart");
  clearCartBtn.addEventListener("click", function () {
    if (cartCounter != 0) {
      // cartShapes = [];
      cartItems = [];
      cartCounter = 0;
      cartPrice = 0;
      setCartItensValue();
      saveCartItems([]);
      cart_main(cartItems, textures);
    }
  });

  cart_main(cartItems, textures);

  function setCartItensValue() {
    var cartCounterDiv = document.getElementById("cart-counter");
    cartCounterDiv.textContent = cartCounter;
    var cartCounterSpan = document.getElementById("cart-counter-span");
    cartCounterSpan.textContent = cartCounter;
    var cartPriceSpan = document.getElementById("cart-price-span");
    cartPriceSpan.textContent = cartPrice;
  }
}

// function generateCartShapes(mult2, canvasWidth) {
//   var shapes = [], aux = 0, j = 0;
//   var txBase = 50, tyBase = 100, tMult = 150, tx, ty;
//   for (let i = 0; i < cartCounter; ++i) {
//     tx = txBase + (tMult * aux);
//     ++aux;
//     ty = tyBase + tMult * j;
//     if (tx + tMult > canvasWidth) {
//       j++;
//       aux = 0;
//     }
//     shapes.push({
//       translation: [tx, ty, 0],
//       // rotation: [0, 0, 0],
//       rotation: [degToRad(Math.random() * 75), degToRad(Math.random() * 75), degToRad(Math.random() * 75)],
//       scale: [0.2 * mult2, 0.2 * mult2, 0.2 * mult2],
//       color: [Math.random(), Math.random(), Math.random(), 1],
//       price: Math.round(Math.random() * 50)
//     });
//   }
//   return shapes;
// }

cart_start();