const navigationLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const trackedSections = Array.from(navigationLinks, (link) =>
  document.querySelector(link.getAttribute("href"))
).filter(Boolean);
const currentYear = document.querySelector("[data-current-year]");
const siteNav = document.querySelector(".nav");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

if (siteNav && navToggle && navMenu) {
  const closeMenu = () => {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  };

  const openMenu = () => {
    siteNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
  };

  navToggle.addEventListener("click", () => {
    if (siteNav.classList.contains("is-open")) {
      closeMenu();
      return;
    }
    openMenu();
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!siteNav.classList.contains("is-open") || siteNav.contains(event.target)) {
      return;
    }
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if ("IntersectionObserver" in window && trackedSections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navigationLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-20% 0px -65%", threshold: 0.05 }
  );

  trackedSections.forEach((section) => observer.observe(section));
}

const heroGallery = document.querySelector("[data-hero-gallery]");

if (heroGallery) {
  const slides = Array.from(heroGallery.querySelectorAll("[data-gallery-slide]"));
  const dots = Array.from(heroGallery.querySelectorAll("[data-gallery-dot]"));
  const mobileGallery = window.matchMedia("(max-width: 960px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let timerId;
  let paused = false;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
    dots.forEach((dot, dotIndex) => {
      const active = dotIndex === activeIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", String(active));
    });
  };

  const stopAutoplay = () => {
    window.clearInterval(timerId);
    timerId = undefined;
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!mobileGallery.matches || reducedMotion.matches || paused) {
      return;
    }
    timerId = window.setInterval(() => showSlide(activeIndex + 1), 5200);
  };

  const updateGalleryMode = () => {
    if (!mobileGallery.matches) {
      stopAutoplay();
      slides.forEach((slide) => slide.classList.remove("is-active"));
      slides[0].classList.add("is-active");
      return;
    }
    showSlide(activeIndex);
    startAutoplay();
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoplay();
    });
  });

  heroGallery.addEventListener("mouseenter", () => {
    paused = true;
    stopAutoplay();
  });
  heroGallery.addEventListener("mouseleave", () => {
    paused = false;
    startAutoplay();
  });
  heroGallery.addEventListener("focusin", () => {
    paused = true;
    stopAutoplay();
  });
  heroGallery.addEventListener("focusout", (event) => {
    if (heroGallery.contains(event.relatedTarget)) {
      return;
    }
    paused = false;
    startAutoplay();
  });

  mobileGallery.addEventListener("change", updateGalleryMode);
  reducedMotion.addEventListener("change", updateGalleryMode);
  updateGalleryMode();
}

const heroBackdrop = document.querySelector("[data-hero-backdrop]");

if (heroBackdrop) {
  const backdropSlides = Array.from(
    heroBackdrop.querySelectorAll("[data-backdrop-slide]")
  );
  const desktopHero = window.matchMedia("(min-width: 961px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let backdropIndex = 0;
  let backdropTimerId;

  const showBackdrop = (index) => {
    backdropIndex = (index + backdropSlides.length) % backdropSlides.length;
    backdropSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === backdropIndex);
    });
  };

  const stopBackdrop = () => {
    window.clearInterval(backdropTimerId);
    backdropTimerId = undefined;
  };

  const startBackdrop = () => {
    stopBackdrop();
    if (!desktopHero.matches || reducedMotion.matches || backdropSlides.length < 2) {
      showBackdrop(0);
      return;
    }
    backdropTimerId = window.setInterval(
      () => showBackdrop(backdropIndex + 1),
      6800
    );
  };

  desktopHero.addEventListener("change", startBackdrop);
  reducedMotion.addEventListener("change", startBackdrop);
  startBackdrop();
}

const mediaToggle = document.querySelector("[data-media-toggle]");
const mediaPanel = document.querySelector("[data-media-panel]");

if (mediaToggle && mediaPanel) {
  mediaToggle.addEventListener("click", () => {
    const expanded = mediaToggle.getAttribute("aria-expanded") === "true";
    mediaToggle.setAttribute("aria-expanded", String(!expanded));
    mediaPanel.hidden = expanded;

    if (!expanded) {
      mediaPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const contact = String(formData.get("contact") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !contact || !message) {
      if (formNote) {
        formNote.textContent = "Please fill in your name, contact, and event details.";
      }
      return;
    }

    const smsBody = encodeURIComponent(
      `Hi Tunde Girl, my name is ${name}.\n\nContact: ${contact}\n\nEvent details: ${message}`
    );

    window.location.href = `sms:+13053065669?&body=${smsBody}`;

    if (formNote) {
      formNote.textContent = "Your message is ready in your device messaging app.";
    }
  });
}
