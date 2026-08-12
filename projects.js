const lightbox = document.querySelector("#project-lightbox");
const lightboxImage = lightbox?.querySelector(".lightbox-image");
const lightboxVideo = lightbox?.querySelector(".lightbox-video");
const lightboxCaption = lightbox?.querySelector(".lightbox-caption");
const lightboxCount = lightbox?.querySelector(".lightbox-count");
const closeButton = lightbox?.querySelector(".lightbox-close");
const previousButton = lightbox?.querySelector(".lightbox-arrow--previous");
const nextButton = lightbox?.querySelector(".lightbox-arrow--next");

let activeGallery = [];
let activeIndex = 0;
let triggerButton = null;

function galleryButtonsFor(button) {
  const galleryName = button.dataset.gallery;
  return [...document.querySelectorAll(".gallery-button")].filter(
    (galleryButton) => galleryButton.dataset.gallery === galleryName,
  );
}

function renderActiveMedia() {
  const activeButton = activeGallery[activeIndex];
  if (!activeButton || !lightboxImage || !lightboxVideo || !lightboxCaption || !lightboxCount) return;

  const thumbnail = activeButton.querySelector("img");
  const isVideo = activeButton.dataset.type === "video";

  lightboxVideo.pause();

  if (isVideo) {
    lightboxImage.hidden = true;
    lightboxImage.src = "";
    lightboxImage.alt = "";
    lightboxVideo.hidden = false;
    lightboxVideo.src = activeButton.dataset.full || "";
    lightboxVideo.load();
  } else {
    lightboxVideo.hidden = true;
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
    lightboxImage.hidden = false;
    lightboxImage.src = activeButton.dataset.full || thumbnail?.src || "";
    lightboxImage.alt = thumbnail?.alt || "Project screenshot";
  }

  lightboxCaption.textContent = activeButton.dataset.caption || thumbnail?.alt || "";
  lightboxCount.textContent = `${activeIndex + 1} / ${activeGallery.length}`;

  const hasMultipleImages = activeGallery.length > 1;
  previousButton.hidden = !hasMultipleImages;
  nextButton.hidden = !hasMultipleImages;
}

function openLightbox(button) {
  if (!lightbox) return;

  activeGallery = galleryButtonsFor(button);
  activeIndex = activeGallery.indexOf(button);
  triggerButton = button;
  renderActiveMedia();

  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  closeButton.focus();
}

function closeLightbox() {
  if (!lightbox || lightbox.hidden) return;

  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  lightboxImage.src = "";
  lightboxVideo.pause();
  lightboxVideo.removeAttribute("src");
  lightboxVideo.load();
  triggerButton?.focus();
  triggerButton = null;
}

function showImage(offset) {
  if (!activeGallery.length) return;
  activeIndex = (activeIndex + offset + activeGallery.length) % activeGallery.length;
  renderActiveMedia();
}

document.querySelectorAll(".gallery-button").forEach((button) => {
  button.addEventListener("click", () => openLightbox(button));
});

closeButton?.addEventListener("click", closeLightbox);
previousButton?.addEventListener("click", () => showImage(-1));
nextButton?.addEventListener("click", () => showImage(1));

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(-1);
  if (event.key === "ArrowRight") showImage(1);

  if (event.key === "Tab") {
    const focusableControls = [...lightbox.querySelectorAll("button:not([hidden])")];
    const firstControl = focusableControls[0];
    const lastControl = focusableControls.at(-1);

    if (event.shiftKey && document.activeElement === firstControl) {
      event.preventDefault();
      lastControl.focus();
    } else if (!event.shiftKey && document.activeElement === lastControl) {
      event.preventDefault();
      firstControl.focus();
    }
  }
});
