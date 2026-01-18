// Spotify Clone Carousel
let currentSpotifySlideIndex = 0;
showSpotifySlide(currentSpotifySlideIndex);

function changeSpotifySlide(n) {
  showSpotifySlide(currentSpotifySlideIndex += n);
}

function currentSpotifySlide(n) {
  showSpotifySlide(currentSpotifySlideIndex = n);
}

function showSpotifySlide(n) {
  let slides = document.getElementsByClassName("spotify-slide");
  let indicators = document.getElementsByClassName("spotify-indicator");

  if (slides.length === 0) return;

  if (n >= slides.length) {
    currentSpotifySlideIndex = 0;
  }
  if (n < 0) {
    currentSpotifySlideIndex = slides.length - 1;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
    slides[i].style.display = "none";
  }
  for (let i = 0; i < indicators.length; i++) {
    indicators[i].classList.remove("active");
  }

  if (slides[currentSpotifySlideIndex]) {
    slides[currentSpotifySlideIndex].style.display = "block";
    slides[currentSpotifySlideIndex].classList.add("active");
  }
  if (indicators[currentSpotifySlideIndex]) {
    indicators[currentSpotifySlideIndex].classList.add("active");
  }
}

// Auto-advance Spotify carousel
setInterval(() => { 
  if (document.getElementsByClassName("spotify-slide").length > 0) {
    changeSpotifySlide(1); 
  }
}, 4000);

  window.addEventListener("resize", adjustAnimationSpeed);

function adjustAnimationSpeed() {
  const container = document.querySelector(".tech-container");
  const speed = window.innerWidth > 768 ? "30s" : "60s"; // Adjust speed for larger and smaller screens
  container.style.animationDuration = speed;
}

// Run on load
adjustAnimationSpeed();
// Get the video element
//const video = document.getElementById('video-background');
//
//// Set the playback speed to 0.5 (50% slower than normal speed)
//video.playbackRate = 0.1;
