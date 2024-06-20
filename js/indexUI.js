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
        question.style.display = "none";
        saveImage(image.src);
        showDownloadButton();
        client.publish("photobooth/AHS", "qr");
      });

      photoPrivate.addEventListener("click", () => {
        console.log("deze foto is private");
        question.style.display = "none";
        showDownloadButton();
        client.publish("photobooth/AHS", "qr");
      });

      function showDownloadButton() {
        buttons.innerHTML = `
		<button class="download-button" id="download-button">Download</button>
		`;

        const downloadButton = document.getElementById("download-button");
        downloadButton.addEventListener("click", () => {
          downloadImage(message.toString());
        });
      }

      function downloadImage(dataUrl) {
        // Create a temporary link element
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "photo.png"; // You can change the default name of the downloaded file

        // Append link to the body
        document.body.appendChild(link);

        // Programmatically click the link to trigger the download
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);
      }
    });
  }
 	const image = new Image();
  image.src = message.toString();

  function base64ToBlob(base64) {
    console.log("test start deze log");
    const base64Data = base64.split(",")[1];
    const contentType = base64.split(",")[0].split(":")[1].split(";")[0];
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  async function saveImage(image) {
    const blob = base64ToBlob(image);
    console.log("Saving image as blob:", blob);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Client-ID 38805418d6bc3a6953d40fe167384128635e424a");

    const formdata = new FormData();
    formdata.append("image", blob, "image.png");
    formdata.append("type", "file");
    formdata.append("title", "Simple upload");
    formdata.append("description", "This is a simple image upload to Imgur");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch("https://api.imgur.com/3/image", requestOptions);
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
});
