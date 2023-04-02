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

function loadImage(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}

function loadImages(urls, callback) {
  var images = [];
  var imagesToLoad = urls.length;

  const onImageLoad = () => {
    --imagesToLoad;
    if (!imagesToLoad) {
      callback(images);
      return images;
    }
  };

  for (let i = 0; i < imagesToLoad; ++i) {
    var image = loadImage(urls[i], onImageLoad);
    images.push(image);
  }
}



// local storage
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