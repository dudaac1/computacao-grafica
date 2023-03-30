"use strict";

const NUMBER_OBJS = 8;
let cartCounter, cartCounterDiv, indexShapes;
var cartItems = [];

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
    btn.addEventListener("click", function () { buyButton(i) });
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

function buyButton(numCanvas) {
  console.log(`item ${numCanvas} comprado: R$ ${indexShapes[numCanvas].price}`);
  cartCounter++;
  cartCounterDiv.textContent = cartCounter;
  cartItems.push(indexShapes[numCanvas]);
  console.log(cartItems);
  // save object data in array
}

function index_start() {
  // get cartCounter number from local storage and update values in screen
  cartCounter = localStorage.getItem("cartCounter");
  if (cartCounter == null) cartCounter = 0;
  cartCounterDiv = document.getElementById("cart-counter");
  cartCounterDiv.textContent = cartCounter;

  // set function for cart button
  var cartBtn = document.getElementById("cart-button");
  cartBtn.addEventListener("click", function () {
    localStorage.setItem("cartCounter", cartCounter);
    location.href = "./cart.html";
  })

  // set update cartCounter in local storage before reload
  window.addEventListener("beforeunload", function () {
    localStorage.setItem("cartCounter", cartCounter)
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
      if (texAux == cubeTextures.element) texAux = 0;
      shapes.push({
        // translation: [Math.random() * mult1, Math.random() * mult1, 0],
        // translation: [0, 0, 0],
        // rotation: [50, 100, 50],
        // rotation: [degToRad(Math.random() * 75), degToRad(Math.random() * 75), degToRad(Math.random() * 75)],
        // scale: [0.2 * mult2, 0.2 * mult2, 0.2 * mult2],
        // color: [Math.random(), Math.random(), Math.random(), 1],
        texture: texAux++,
        price: Math.round(Math.random() * 50)
      });
    }
    return shapes;
  }
}

index_start();
