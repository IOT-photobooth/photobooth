const client = mqtt.connect(`wss://mqtt.eclipseprojects.io/mqtt`);

client.on("connect", () => {
  client.subscribe("photobooth/AHS", (err) => {
    if (!err) {
      client.publish("presence", "Hello from photobooth");
      console.log("we have connected");
    }
  });
});

const video = document.querySelector("#videoElement");
const canvas = document.getElementById("canvas");
const photo = document.getElementById("photo");

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      video.srcObject = stream;
      video.play();
    })
    .catch(function (error) {
      console.log("Something went wrong!");
      console.log(error);
    });
}

const width = 320; // We will scale the photo width to this
let height = 0; // This will be computed based on the input stream

let streaming = false;

video.addEventListener(
  "canplay",
  (ev) => {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width);
      if (isNaN(height)) {
        height = width / (4 / 3);
      }

      video.setAttribute("width", width);
      video.setAttribute("height", height);
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
      streaming = true;
    }
  },
  false
);

function clearphoto() {
  const context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  const data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
}

function takepicture() {
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;

    context.drawImage(video, 0, 0, width, height);
    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);

    // Send the image to broker
  } else {
    clearphoto();
  }
}

client.on("message", (topic, message) => {
  console.log("message received: ", message.toString());
  if (message.toString() === "flash") {
    /* for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        document.getElementById("timer").innerText = 5 - i;
      }, i * 1000);
    } */
    setTimeout(() => {
      //document.getElementById("timer").innerText = "Smile!";
      takepicture();
    }, 5500);
    console.log("flash");
    console.log("picture taken");
  }
});

$(".video-container").customWebCam();
