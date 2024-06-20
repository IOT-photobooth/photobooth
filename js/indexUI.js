const UIpage = document.getElementById("UIpage");

client.on("message", (topic, message) => {
	console.log("message received: ", message.toString());
	// if message is base64 encoded image, redirect to goedkeuring.html and pass the image as a query parameter
	if (message.toString().startsWith("data:image/png;base64")) {
		UIpage.innerHTML = `
      <img class="logo" src="../images/ARTEVELDE_hs_logo RGB.png" alt="logo artevelde" />
      <img id="image" class="container__img container__img--rect" src="" alt="" />
      <p class="question" id="question">Vind je deze foto goed?</p>
      <div class="buttons" id="approval-buttons">
        <button class="answer-button" id="photo-yes">Ja, love it!</button>
        <button class="answer-button" id="photo-no">Nee, opnieuw!</button>
      </div>
    `;

		const photo = document.getElementById("image");
		console.log(message.toString());
		photo.setAttribute("src", message.toString());

		const photoGood = document.getElementById("photo-yes");
		const photoBad = document.getElementById("photo-no");

		photoBad.addEventListener("click", () => {
			window.location.href = "../UI/index.html";

			client.publish("photobooth/AHS", "start");
		});

		photoGood.addEventListener("click", () => {
			const question = document.getElementById("question");
			const buttons = document.getElementById("approval-buttons");

			question.innerText = "Mogen we deze tonen op de projectie?";
			buttons.innerHTML = `
        <button class="answer-button" id="photo-public">Ja</button>
        <button class="answer-button" id="photo-private">Nee</button>
      `;

			const photoPublic = document.getElementById("photo-public");
			const photoPrivate = document.getElementById("photo-private");

			photoPublic.addEventListener("click", () => {
				console.log("deze foto is public");
			});

			photoPrivate.addEventListener("click", () => {
				console.log("deze foto is private");
			});
		});
	}
});
