function getGlContext(idCanvas) {
  var gl = document.getElementById(idCanvas).getContext("webgl2");
  if (!gl) {
    console.log("WebGL não encontrado.");
    return undefined;
  }
  return gl;
}

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

function getCartItems() {
  let cartItems = localStorage.getItem("cartItems");
  if (cartItems == undefined) 
    return [];
  return JSON.parse(cartItems);
}

function saveCartItems(cartItems) {
  // var items = cartItems.map((item) => {
    // return [item.]
  // })
  console.log(cartItems)
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}