// const client = mqtt.connect(`ws://mqtt.eclipseprojects.io:80/mqtt`);
const client = mqtt.connect(`wss://mqtt.eclipseprojects.io/mqtt`); // secure connection to the broker (port 443 is default for secure connections, it's not necessary to specify)

const btnTakePic = document.querySelector("#take-picture");

client.on("connect", () => {
  client.subscribe("photobooth/AHS", (err) => {
    if (!err) {
      client.publish("presence", "Hello mqtt");
      console.log("we have connected");
      //client.publish
    }
  });
});

client.on("message", (topic, message) => {
  const msg = message.toString();
  const time = new Date().toLocaleTimeString();
  console.log(`${time} - ${msg}`);
});

btnTakePic.addEventListener("click", (e) => {
  client.publish("photobooth/AHS", "flash");
  console.log("button clicked");
});
