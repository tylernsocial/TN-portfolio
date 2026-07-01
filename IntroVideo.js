
class IntroVideo {
  constructor({ root, onComplete = () => {} }) {
    this.root = root;
    this.video = root?.querySelector("video");
    this.audio = root?.querySelector("audio");
    this.enterButton = root?.querySelector(".intro-video__enter");
    this.soundButton = root?.querySelector(".intro-video__sound");
    this.onComplete = onComplete;
    this.hasCompleted = false;
    this.soundAttempted = false;
    this.autoplayCheck = null;
  }

  mount() {
    if (!this.root || !this.video || !this.enterButton) return this;

    document.body.classList.add("intro-active");
    this.video.muted = true;
    // Keep the startup cue gentle even when the device volume is set high.
    if (this.audio) this.audio.volume = 0.12;

    // The native ended event is the primary route into the portfolio.
    this.video.addEventListener("ended", () => this.complete());
    this.video.addEventListener("error", () => this.showFallback());
    this.video.addEventListener("playing", () => this.hideFallback());
    this.video.addEventListener("timeupdate", () => this.maybeStartSound());
    this.enterButton.addEventListener("click", () => this.complete());
    this.soundButton?.addEventListener("click", () => this.startSound());

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

  maybeStartSound() {
    // Change this value to start the sound earlier or later in the video.
    const soundStartTime = 1;
    if (!this.audio || this.soundAttempted || this.video.currentTime < soundStartTime) return;

    this.soundAttempted = true;
    this.startSound(soundStartTime);
  }

  startSound(soundStartTime = 1) {
    if (!this.audio || this.hasCompleted) return;

    // Keep the sound aligned if the user enables it after autoplay was blocked.
    this.audio.volume = 0.12;
    this.audio.currentTime = Math.max(0, this.video.currentTime - soundStartTime);
    const soundAttempt = this.audio.play();

    if (soundAttempt) {
      soundAttempt
        .then(() => {
          if (this.soundButton) this.soundButton.hidden = true;
        })
        .catch(() => {
          if (this.soundButton) this.soundButton.hidden = false;
        });
    }
  }

  complete() {
    if (this.hasCompleted) return;
    this.hasCompleted = true;
    window.clearTimeout(this.autoplayCheck);
    this.video.pause();
    this.audio?.pause();
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
