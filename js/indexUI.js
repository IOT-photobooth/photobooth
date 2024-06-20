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
			UIpage.innerHTML = `
    <div class="UI-page" id="UIpage">
			<img
				class="logo"
				src="../images/ARTEVELDE_hs_logo RGB.png"
				alt="logo artevelde"
			/>
			<p class="welcome">Druk op de knop voor een nieuwe foto!</p>
			<button class="button-picture" id="take-picture">Neem foto</button>
		</div>
  `;

			client.publish("photobooth/AHS", "start");
		});
	}
});
