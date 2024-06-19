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

let data = "";

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

  data = canvas.toDataURL("");
  photo.setAttribute("src", data);
  console.log("test clear");
}

function takepicture() {
  const context = canvas.getContext("2d");
  if (width && height) {
    canvas.width = width;
    canvas.height = height;

    // Mirror the image
    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -width, 0, width, height);
    context.restore();

    data = canvas.toDataURL("image/png");
    client.publish("photobooth/AHS", data);

    /*let blob = dataURItoBlob(data);
    client.publish("photobooth/AHS", blob);
    photo.setAttribute("src", data);*/

    // Send the image to broker
  } else {
    clearphoto();
  }
}

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
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
  } else if (message.toString() === data) {
    console.log(data);
    window.location.href = "../beeldscherm/loading.html";
  }
});

// $(".video-container").customWebCam();
