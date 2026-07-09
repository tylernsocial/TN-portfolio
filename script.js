const portfolioContent = document.querySelector("#portfolio-content");

// IntroVideo calls this page-owned callback when playback ends or the user skips.
new IntroVideo({
  root: document.querySelector("#intro-video"),
  onComplete: () => {
    portfolioContent.removeAttribute("inert");
    portfolioContent.removeAttribute("aria-hidden");
    portfolioContent.classList.add("portfolio-content--visible");
  },
}).mount();
