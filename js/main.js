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

// Project photo lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const lightboxClose = document.getElementById("lightboxClose");

let galleryImages = [];
let galleryIndex = 0;
let lastFocusedEl = null;

function renderLightbox() {
  const src = galleryImages[galleryIndex];
  lightboxImg.src = src;
  lightboxImg.alt = lightboxCaption.textContent || "";
  const multi = galleryImages.length > 1;
  lightboxPrev.hidden = !multi;
  lightboxNext.hidden = !multi;
  lightboxCounter.textContent = multi ? `${galleryIndex + 1} / ${galleryImages.length}` : "";
}

function openLightbox(images, caption, triggerEl) {
  if (!images.length) return;
  galleryImages = images;
  galleryIndex = 0;
  lightboxCaption.textContent = caption || "";
  lastFocusedEl = triggerEl || document.activeElement;
  renderLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  lightboxImg.src = "";
  if (lastFocusedEl) lastFocusedEl.focus();
}

function showNext(delta) {
  if (!galleryImages.length) return;
  galleryIndex = (galleryIndex + delta + galleryImages.length) % galleryImages.length;
  renderLightbox();
}

document.querySelectorAll(".project-card.is-clickable").forEach((card) => {
  const openFromCard = () => {
    let images = [];
    try {
      images = JSON.parse(card.dataset.gallery || "[]");
    } catch (e) {
      images = [];
    }
    openLightbox(images, card.dataset.caption, card);
  };

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
