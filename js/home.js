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
  if (document.getElementsByClassName("spotify-slide-link").length > 0) {
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

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
      if (!isClickInsideNav && navMenu.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 60;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Active navigation link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.pageYOffset >= sectionTop - 100) {
        current = section.getAttribute('id');
      }
    });

    navLinksAll.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink);
  highlightNavLink();
});

// Prevent body scroll when mobile menu is open
document.addEventListener('DOMContentLoaded', function() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
          } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
          }
        }
      });
    });
    observer.observe(navMenu, { attributes: true });
  }
});
