let cartItems, cartCounter = 0, cartPrice = 0, cartTextures;

function cart_start() {
  cartTextures = getCubeTexturesList();

  cartItems = getCartItems();
  if (cartItems.length != 0) {
    calculeCartPrice();
    cartCounter = cartItems.length;
  }
  setVisualValues();

  var removeItemBtn = document.getElementById("remove-item-btn");
  removeItemBtn.addEventListener("click", () => removeItemFromCart());

  var clearCartBtn = document.getElementById("clear-cart");
  clearCartBtn.addEventListener("click", function () {
    if (cartCounter != 0) {
      cartItems = [];
      cartPrice = 0;
      saveCartItems([]);
      setVisualValues();
      cart_main(cartItems, cartTextures);
    }
  });

  cart_main(cartItems, cartTextures);
}

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
    option.textContent = `Cubo ${index+1}: textura ${item.texture}, R$ ${item.price}`;
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

cart_start();