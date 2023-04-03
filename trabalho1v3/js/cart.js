let cartItems, cartCounter = 0, cartPrice = 0, cartTextures;

function calculeCartPrice() {
  cartPrice = cartItems.reduce((sum, curr) => {
    return sum += curr.price
  }, 0);
}

function setVisualValues() {
  var cartCounter = cartItems.length;
  var cartCounterDiv = document.getElementById("cart-counter");
  cartCounterDiv.textContent = cartCounter;
  var cartCounterSpan = document.getElementById("cart-counter-span");
  cartCounterSpan.textContent = cartCounter;
  var cartPriceSpan = document.getElementById("cart-price-span");
  cartPriceSpan.textContent = cartPrice;

  var select = document.getElementById("cart-items-select");
  var option;

  select.innerHTML = "";
  option = document.createElement("option");
  option.textContent = "-- ESCOLHA UM ITEM --";
  select.appendChild(option);

  cartItems.forEach((item, index) => {
    option = document.createElement("option");
    option.setAttribute("value", `${index}`);
    option.textContent = `Cubo ${index + 1}: textura ${item.texture}, R$ ${item.price}`;
    select.appendChild(option);
  });
}

function removeItemFromCart() {
  if (cartCounter != 0) {
    var select = document.getElementById("cart-items-select");
    var index = select.value;
    cartItems.splice(index, 1);
    saveCartItems(cartItems);
    calculeCartPrice();
    setVisualValues();
    cart_main(cartItems, cartTextures);
  }
}

function clearCart() {
  if (cartCounter != 0) {
    cartItems = [];
    cartPrice = 0;
    saveCartItems([]);
    setVisualValues();
    cart_main(cartItems, cartTextures);
  }
}

function animate(event) {
  console.log(event)
  var aux1 = 5, aux2 = 3, aux3 = 0, x, y;
  event.srcElement.disabled = true;
  var start = new Date().getTime();
  var then = start;
  var now, deltaTime, speed = 2, mult;
  if (!saveImages) {
    requestAnimationFrame(animation);
  } else {
    alert("Tivemos um problema no momento. Tente novamente em alguns segundos.");
  }

  function animation() {
    now = new Date().getTime();
    deltaTime = (now - then) * 0.001;
    then = now;
    mult = deltaTime * speed;

    if (now < start + 10000) {
      cCamera[0] = Math.cos(aux3) * aux1;
      cCamera[1] = Math.sin(aux3) * aux2;
      cCamera[3] += aux3;
      aux3 += 0.01;
      drawCartShapes(loadedImages);
      requestAnimationFrame(animation);
    }
    else {
      var btn = document.getElementById("animate-btn");
      btn.disabled = false;
    }
  }
}

function cart_start() {
  cartTextures = getCubeTexturesList();

  var animateBtn = document.getElementById("animate-btn");
  animateBtn.addEventListener("click", () => animate(event));

  cartItems = getCartItems();
  if (cartItems.length != 0) {
    calculeCartPrice();
    cartCounter = cartItems.length;
  }
  setVisualValues();
  cart_main(cartItems, cartTextures);
}

cart_start();