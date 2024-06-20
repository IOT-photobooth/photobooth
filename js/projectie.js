const bucketName = "photobooth_ahs"; // Replace with your bucket name
const apiUrl = `https://storage.googleapis.com/storage/v1/b/${bucketName}/o?alt=media`;

/* async function fetchImages() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const images = data.items.map((item) => `https://storage.googleapis.com/${bucketName}/${item.name}`);
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
} */

/* async function fetchImages() {
  try {
    // Generating a list of placeholder images from Picsum
    const images = Array.from({ length: 10 }, (_, index) => `https://picsum.photos/seed/${index}/800/600`);
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
} */

// get png's from images/examples folder, it's not json but actual images

function fetchImages() {
  const images = Array.from({ length: 3 }, (_, index) => `../images/examples/${index}.png`);
  return images;
}

function createSlideshow(images) {
  const slideshow = document.getElementById("slideshow");

  images.forEach((image, index) => {
    const slideDiv = document.createElement("div");
    slideDiv.className = "slide";
    if (index === 0) {
      slideDiv.style.display = "block";
    }

    const img = document.createElement("img");
    img.className = "slide-image";
    img.src = image;

    slideDiv.appendChild(img);
    slideshow.appendChild(slideDiv);
  });

  //createNavigationButtons();
  startSlideshow();
}

function createNavigationButtons() {
  const slideshow = document.getElementById("slideshow");

  const prevButton = document.createElement("a");
  prevButton.className = "prev";
  prevButton.textContent = "❮";
  prevButton.onclick = () => showSlides(currentSlide - 1);

  const nextButton = document.createElement("a");
  nextButton.className = "next";
  nextButton.textContent = "❯";
  nextButton.onclick = () => showSlides(currentSlide + 1);

  slideshow.appendChild(prevButton);
  slideshow.appendChild(nextButton);
}

let currentSlide = 0;

function showSlides(n) {
  const slides = document.getElementsByClassName("slide");
  if (n >= slides.length) {
    currentSlide = 0;
  } else if (n < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = n;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[currentSlide].style.display = "block";
}

function startSlideshow() {
  showSlides(currentSlide);
  setInterval(() => showSlides(currentSlide + 1), 5000); // Change slide every 5 seconds
}

document.addEventListener("DOMContentLoaded", async () => {
  const images = await fetchImages();
  createSlideshow(images);
});
