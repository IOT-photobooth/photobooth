const photo = document.getElementById("photo");

client.on("message", (topic, message) => {
  console.log("message received: ", message.toString());
  // if message is base64 encoded image, redirect to goedkeuring.html and pass the image as a query parameter
  if (message.toString().startsWith("data:image/png;base64")) {
    window.location.href = `goedkeuring.html?`;
    console.log(message.toString());
    photo.setAttribute("src", message.toString());
  }
});
