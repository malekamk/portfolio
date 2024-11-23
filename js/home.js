let currentSlideIndex = 0;
  showSlide(currentSlideIndex);

  function changeSlide(n) {
    showSlide(currentSlideIndex += n);
  }

  function currentSlide(n) {
    showSlide(currentSlideIndex = n);
  }

  function showSlide(n) {
    let slides = document.getElementsByClassName("slide");
    let indicators = document.getElementsByClassName("indicator");

    if (n >= slides.length) {
      currentSlideIndex = 0;
    }
    if (n < 0) {
      currentSlideIndex = slides.length - 1;
    }

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (let i = 0; i < indicators.length; i++) {
      indicators[i].className = indicators[i].className.replace(" active", "");
    }

    slides[currentSlideIndex].style.display = "block";
    indicators[currentSlideIndex].className += " active";
  }

  setInterval(() => { changeSlide(1); }, 5000);

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
