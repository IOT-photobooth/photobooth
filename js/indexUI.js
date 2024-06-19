client.on("message", (topic, message) => {
  console.log("message received: ", message.toString());
  // if message is base64 encoded image, redirect to goedkeuring.html and pass the image as a query parameter
  if (message.toString().startsWith("data:image/png;base64")) {
    console.log(message.toString());
    //window.location.href = `goedkeuring.html?image=${message.toString()}`;
  }
});
