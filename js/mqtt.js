// const client = mqtt.connect(`ws://mqtt.eclipseprojects.io:80/mqtt`);
const client = mqtt.connect(`wss://mqtt.eclipseprojects.io/mqtt`); // secure connection to the broker (port 443 is default for secure connections, it's not necessary to specify)

const btnTakePic = document.querySelector("#take-picture");

client.on("connect", () => {
	client.subscribe("photobooth/AHS", (err) => {
		if (!err) {
			client.publish("presence", "Hello from smartphone control");
			client.publish("photobooth/AHS", "start");
			console.log("we have connected");
			//client.publish
		}
	});
});

client.on("reconnect", () => {
	console.log("Reconnecting...");
});

client.on("offline", () => {
	console.log("Went offline...");
});

window.addEventListener("load", () => {
	client.publish("photobooth/AHS", "start");
});

client.on("message", (topic, message) => {
	const msg = message.toString();
	const time = new Date().toLocaleTimeString();
	console.log(`${time} - ${msg}`);
});

btnTakePic.addEventListener("click", (e) => {
	// disable button for 10 seconds
	btnTakePic.disabled = true;
	client.publish("photobooth/AHS", "flash");
	console.log("button clicked");
	setTimeout(() => {
		btnTakePic.disabled = false;
	}, 10000);
});
