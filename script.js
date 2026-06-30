const year = document.querySelector("#year");
const portfolioContent = document.querySelector("#portfolio-content");

year.textContent = new Date().getFullYear();

// IntroVideo calls this page-owned callback when playback ends or the user skips.
new IntroVideo({
  root: document.querySelector("#intro-video"),
  onComplete: () => {
    portfolioContent.removeAttribute("inert");
    portfolioContent.removeAttribute("aria-hidden");
    portfolioContent.classList.add("portfolio-content--visible");
  },
}).mount();
