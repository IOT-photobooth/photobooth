// get image from url query parameter
const urlParams = new URLSearchParams(window.location.search);
const image = urlParams.get("image");
// display image
document.getElementById("image").src = image;
