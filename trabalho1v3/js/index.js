"use strict";

const NUMBER_OBJS = 8;
let cartCounter, cartCounterDiv, indexShapes;
var cartItems;

function generateIndexCards() {
  var main = document.getElementById("main-container");
  var card, canvas, btn, text, info, uiC, ui, camX, camY, camZ, zoom;
  for (let i = 0; i < NUMBER_OBJS; ++i) {
    card = generateElement("div", `card${i}`);
    card.classList = "card";
    canvas = generateElement("canvas", `canvas${i}`)
    canvas.classList = "canvas";
    card.appendChild(canvas);
    uiC = generateElement("div", "uiContainer");
    ui = generateElement("div", "ui");
    camX = generateElement("div", `x${i}`);
    ui.appendChild(camX);
    camY = generateElement("div", `y${i}`);
    ui.appendChild(camY);
    camZ = generateElement("div", `z${i}`);
    ui.appendChild(camZ);
    zoom = generateElement("div", `zoom${i}`);
    ui.appendChild(zoom);
    uiC.appendChild(ui);
    card.appendChild(uiC);

    info = document.createElement("div");
    info.classList = "info";
    text = document.createElement("h3");
    text.textContent = `R$ ${indexShapes[i].price}`;
    info.appendChild(text);

    btn = document.createElement("button");
    btn.textContent = "comprar";
    btn.classList = "btn";
    btn.addEventListener("click", function () { buyItem(i) });
    info.appendChild(btn);
    card.appendChild(info);

    main.appendChild(card);
  }

  function generateElement(type, id) {
    var element = document.createElement(type);
    element.setAttribute("id", id);
    return element;
  }
}

function buyItem(numItem) {
  console.log(`item ${numItem} comprado: R$ ${indexShapes[numItem].price}`);
  cartCounter++;
  cartCounterDiv.textContent = cartCounter;
  cartItems.push(indexShapes[numItem]);
}

function index_start() {
  cartItems = JSON.parse(localStorage.getItem("cartItems"));
  if (cartItems != null) 
    cartCounter = cartItems.length;
  else {
    cartItems = [];
    cartCounter = 0;
  }
  
  cartCounterDiv = document.getElementById("cart-counter");
  cartCounterDiv.textContent = cartCounter;

  // set function for cart button
  var cartBtn = document.getElementById("cart-button");
  cartBtn.addEventListener("click", function () {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    location.href = "./cart.html";
  })

  // set update cartCounter in local storage before reload
  window.addEventListener("beforeunload", function () {
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  });

  // creating objects from index page and calling main()
  indexShapes = generateIndexShapes(NUMBER_OBJS, 100, 1);
  generateIndexCards();

  index_main(NUMBER_OBJS, indexShapes);

  function generateIndexShapes(number, mult1, mult2) {
    var cubeTextures = getCubeTexturesList();
    var shapes = [];
    var texAux = 0;
    for (let i = 0; i < number; ++i) {
      if (texAux >= cubeTextures.length)
        texAux = 0;

      shapes.push({
        color: [Math.random(), Math.random(), Math.random(), 1],
        texture: texAux++,
        price: Math.round(Math.random() * 50)
      });
    }
    return shapes;
  }
}

index_start();
