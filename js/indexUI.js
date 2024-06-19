client.on("message", (topic, message) => {
  console.log("message received: ", message);
  // if message is base64 encoded image, redirect to goedkeuring.html and pass the image as a query parameter
  if (message.startsWith("data:image/png;base64")) {
    console.log(message);
    console.log(message.toString());
    // wait 5 s
    setTimeout(() => {
      window.location.href = `goedkeuring.html?image=${message}`;
    }, 5000);
    //window.location.href = `goedkeuring.html?image=${message}`;
  }
});
