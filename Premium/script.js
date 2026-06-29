const root = document.documentElement;
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const backToTop = document.querySelector("[data-back-to-top]");
const toast = document.querySelector("[data-toast]");

const programs = {
  elementary: {
    kicker: "Elementary Program",
    title: "Strong fundamentals, warm guidance.",
    copy: "Foundational learning is paired with routines that build confidence, responsibility, and curiosity.",
    points: [
      "Literacy and numeracy foundations",
      "Classroom habits and learner confidence",
      "Teacher-guided academic support",
    ],
  },
  secondary: {
    kicker: "Secondary Program",
    title: "Readiness for the next academic step.",
    copy: "Learners move into more independent study while strengthening discipline, collaboration, and personal direction.",
    points: [
      "Subject mastery and study systems",
      "Communication and leadership practice",
      "Preparation for senior pathways",
    ],
  },
  formation: {
    kicker: "Student Formation",
    title: "Care that supports the whole learner.",
    copy: "Guidance, values formation, and community support help students feel known while they keep growing.",
    points: [
      "Learner guidance and family touchpoints",
      "Character-building school routines",
      "Community-centered activities",
    ],
  },
};

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("blun-theme", theme);
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
}

const savedTheme = localStorage.getItem("blun-theme");
const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
setTheme(savedTheme || preferredTheme);

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeMenu() {
  mobileNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("no-scroll");
}

menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  document.body.classList.toggle("no-scroll", isOpen);
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) closeMenu();
});

window.addEventListener("scroll", () => {
  const scrolled = window.scrollY > 16;
  header.classList.toggle("scrolled", scrolled);
  backToTop.classList.toggle("visible", window.scrollY > 600);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
  revealObserver.observe(element);
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counter = entry.target;
      const target = Number(counter.dataset.count);
      const duration = 850;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(eased * target);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
      counterObserver.unobserve(counter);
    });
  },
  { threshold: 0.5 },
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

const panel = document.querySelector("[data-program-panel]");

document.querySelectorAll("[data-program]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.program;
    const program = programs[key];

    document.querySelectorAll("[data-program]").forEach((tab) => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });

    panel.classList.add("is-changing");

    window.setTimeout(() => {
      panel.innerHTML = `
        <p class="program-kicker">${program.kicker}</p>
        <h3>${program.title}</h3>
        <p>${program.copy}</p>
        <ul>${program.points.map((point) => `<li>${point}</li>`).join("")}</ul>
      `;
      panel.classList.remove("is-changing");
    }, 140);
  });
});

const gallery = document.querySelector("[data-gallery]");

function moveGallery(direction) {
  const amount = gallery.clientWidth * 0.82;
  gallery.scrollBy({ left: amount * direction, behavior: "smooth" });
}

document.querySelector("[data-gallery-prev]").addEventListener("click", () => moveGallery(-1));
document.querySelector("[data-gallery-next]").addEventListener("click", () => moveGallery(1));

document.querySelectorAll("[data-step]").forEach((step) => {
  step.addEventListener("click", () => {
    document.querySelectorAll("[data-step]").forEach((item) => item.classList.toggle("active", item === step));
  });
});

const faqButtons = document.querySelectorAll(".faq-item");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    const isOpen = button.classList.contains("open");

    faqButtons.forEach((item) => {
      item.classList.remove("open");
      item.setAttribute("aria-expanded", "false");
      item.nextElementSibling.classList.remove("open");
    });

    if (!isOpen) {
      button.classList.add("open");
      button.setAttribute("aria-expanded", "true");
      answer.classList.add("open");
    }
  });
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

document.querySelector("[data-inquiry-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  form.reset();
  showToast("Inquiry noted. Please connect through the official Facebook page for live school response.");
});
