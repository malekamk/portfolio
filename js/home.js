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
  let slideLinks = document.getElementsByClassName("spotify-slide-link");
  let indicators = document.getElementsByClassName("spotify-indicator");

  if (slideLinks.length === 0) return;

  if (n >= slideLinks.length) {
    currentSpotifySlideIndex = 0;
  }
  if (n < 0) {
    currentSpotifySlideIndex = slideLinks.length - 1;
  }

  for (let i = 0; i < slideLinks.length; i++) {
    slideLinks[i].classList.remove("active");
    slideLinks[i].style.display = "none";
  }
  for (let i = 0; i < indicators.length; i++) {
    indicators[i].classList.remove("active");
  }

  if (slideLinks[currentSpotifySlideIndex]) {
    slideLinks[currentSpotifySlideIndex].style.display = "block";
    slideLinks[currentSpotifySlideIndex].classList.add("active");
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
