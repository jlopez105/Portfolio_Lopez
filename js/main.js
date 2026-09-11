// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");

navToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

primaryNav.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Scroll reveal animations
const revealTargets = document.querySelectorAll(
  ".project-card, .timeline-item, .about-card, .skills-card, .contact-card"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el) => observer.observe(el));

// Nudge card video previews to paint a frame instead of staying blank
document.querySelectorAll(".card-video-preview").forEach((video) => {
  video.addEventListener("loadedmetadata", () => {
    try {
      video.currentTime = 0.1;
    } catch (e) {
      /* ignore */
    }
  });
});

// Project detail lightbox
const lightbox = document.getElementById("lightbox");
const lightboxMediaInner = document.getElementById("lightboxMediaInner");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxTags = document.getElementById("lightboxTags");
const lightboxDetail = document.getElementById("lightboxDetail");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxClose = document.getElementById("lightboxClose");

let galleryItems = [];
let galleryIndex = 0;
let lastFocusedEl = null;

function renderLightboxMedia() {
  const item = galleryItems[galleryIndex];
  lightboxMediaInner.innerHTML = "";
  if (!item) return;

  let el;
  if (item.type === "video") {
    el = document.createElement("video");
    el.src = item.src;
    el.controls = true;
    el.playsInline = true;
    el.autoplay = true;
  } else {
    el = document.createElement("img");
    el.src = item.src;
    el.alt = lightboxCaption.textContent || "";
  }
  lightboxMediaInner.appendChild(el);

  const multi = galleryItems.length > 1;
  lightboxPrev.hidden = !multi;
  lightboxNext.hidden = !multi;
  lightboxCounter.textContent = multi ? `${galleryIndex + 1} / ${galleryItems.length}` : "";
}

function openLightbox(card, triggerEl) {
  let items = [];
  try {
    items = JSON.parse(card.dataset.gallery || "[]");
  } catch (e) {
    items = [];
  }
  if (!items.length) return;

  galleryItems = items;
  galleryIndex = 0;
  lightboxCaption.textContent = card.dataset.caption || "";

  const tagsSource = card.querySelector(".project-tags");
  lightboxTags.innerHTML = tagsSource ? tagsSource.innerHTML : "";

  const detailSource = card.querySelector(".full-description");
  lightboxDetail.innerHTML = detailSource ? detailSource.innerHTML : "";

  lastFocusedEl = triggerEl || document.activeElement;
  renderLightboxMedia();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  lightboxMediaInner.innerHTML = "";
  if (lastFocusedEl) lastFocusedEl.focus();
}

function showNext(delta) {
  if (!galleryItems.length) return;
  galleryIndex = (galleryIndex + delta + galleryItems.length) % galleryItems.length;
  renderLightboxMedia();
}

document.querySelectorAll(".project-card.is-clickable").forEach((card) => {
  const openFromCard = () => openLightbox(card, card);

  card.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    openFromCard();
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFromCard();
    }
  });
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", () => showNext(-1));
lightboxNext.addEventListener("click", () => showNext(1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showNext(-1);
  if (e.key === "ArrowRight") showNext(1);
});
