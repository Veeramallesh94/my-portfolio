/* ============================================================
   VEERA MALLESH PORTFOLIO — script.js
   ============================================================ */

/* ---------- TYPED TEXT EFFECT ---------- */
const phrases = [
  "AIML Student",
  "Python Developer",
  "Data Analyst Fresher",
  "ML Engineer (Learning)",
  "Flask App Builder"
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById("typedText");

function typeLoop() {
  const currentPhrase = phrases[phraseIndex];

  if (!isDeleting) {
    typedEl.textContent = currentPhrase.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typedEl.textContent = currentPhrase.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  const speed = isDeleting ? 50 : 75;
  setTimeout(typeLoop, speed);
}

typeLoop();


/* ---------- NAVBAR SCROLL EFFECT ---------- */
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  // Scrolled state
  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Active link highlight
  let current = "";
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.getAttribute("id");
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});


/* ---------- HAMBURGER MENU ---------- */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navMenu.classList.toggle("open");
});

// Close menu on link click
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navMenu.classList.remove("open");
  });
});


/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll(
  ".skill-card, .project-card, .about-grid, .about-stats, .contact-grid, .stat"
);

revealEls.forEach(el => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));


/* ---------- SKILL BAR ANIMATION ---------- */
const skillFills = document.querySelectorAll(".skill-fill");

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const pct = entry.target.getAttribute("data-pct");
      entry.target.style.width = pct + "%";
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

skillFills.forEach(el => skillObserver.observe(el));


/* ---------- CONTACT FORM (local demo) ---------- */
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    formNote.textContent = "Please fill all fields.";
    formNote.style.color = "#ff7b72";
    return;
  }

  // Simulate form submission (replace with your backend / EmailJS / Formspree)
  formNote.textContent = "✓ Thanks " + name + "! I'll get back to you soon.";
  formNote.style.color = "var(--teal)";
  contactForm.reset();
  setTimeout(() => formNote.textContent = "", 5000);
});


/* ---------- SMOOTH SECTION OFFSET FOR FIXED NAV ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  });
});
