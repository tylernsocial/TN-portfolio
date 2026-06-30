
class IntroVideo {
  constructor({ root, onComplete = () => {} }) {
    this.root = root;
    this.video = root?.querySelector("video");
    this.enterButton = root?.querySelector(".intro-video__enter");
    this.onComplete = onComplete;
    this.hasCompleted = false;
    this.autoplayCheck = null;
  }

  mount() {
    if (!this.root || !this.video || !this.enterButton) return this;

    document.body.classList.add("intro-active");
    this.video.muted = true;

    // The native ended event is the primary route into the portfolio.
    this.video.addEventListener("ended", () => this.complete());
    this.video.addEventListener("error", () => this.showFallback());
    this.video.addEventListener("playing", () => this.hideFallback());
    this.enterButton.addEventListener("click", () => this.complete());

    const playAttempt = this.video.play();
    if (playAttempt) {
      playAttempt.catch(() => this.showFallback());
    }

    // Some browsers neither resolve nor reject play() promptly.
    this.autoplayCheck = window.setTimeout(() => {
      if (this.video.paused && !this.video.ended) this.showFallback();
    }, 1400);

    return this;
  }

  showFallback() {
    if (this.hasCompleted) return;
    this.enterButton.hidden = false;
    this.root.classList.add("intro-video--needs-entry");
  }

  hideFallback() {
    if (this.hasCompleted) return;
    this.enterButton.hidden = true;
    this.root.classList.remove("intro-video--needs-entry");
  }

  complete() {
    if (this.hasCompleted) return;
    this.hasCompleted = true;
    window.clearTimeout(this.autoplayCheck);
    this.video.pause();
    this.root.classList.add("intro-video--exiting");
    this.onComplete();

    const removeIntro = () => {
      this.root?.remove();
      document.body.classList.remove("intro-active");
      this.root = null;
    };

    this.root.addEventListener("animationend", removeIntro, { once: true });
    window.setTimeout(removeIntro, 700);
  }
}

window.IntroVideo = IntroVideo;
