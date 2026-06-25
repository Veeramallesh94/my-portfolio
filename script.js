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


/* ============================================================
   EMAILJS CONFIGURATION
   ─────────────────────────────────────────────────────────────
   Step 1 → Go to https://www.emailjs.com and sign up (free).
   Step 2 → Add an Email Service (Gmail, Outlook, etc.)
            and copy the Service ID  →  replace YOUR_SERVICE_ID
   Step 3 → Create an Email Template and copy the Template ID
            →  replace YOUR_TEMPLATE_ID
            Template variables to map in your EmailJS dashboard:
              {{from_name}}   ← sender's name
              {{from_email}}  ← sender's email
              {{message}}     ← message body
   Step 4 → Go to Account → copy your Public Key
            →  replace YOUR_PUBLIC_KEY
   ============================================================ */

const EMAILJS_PUBLIC_KEY   = "YOUR_PUBLIC_KEY";   // ← replace this
const EMAILJS_SERVICE_ID   = "service_27bbx9i";   // ← replace this
const EMAILJS_TEMPLATE_ID  = "YOUR_TEMPLATE_ID";  // ← replace this

// Initialise EmailJS with your public key
(function () {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
})();

/* ---------- CONTACT FORM — EmailJS ---------- */
const contactForm = document.getElementById("contactForm");
const formNote    = document.getElementById("formNote");
const submitBtn   = contactForm.querySelector("button[type='submit']");

// Utility: show a message in the note paragraph
function showNote(text, isError) {
  formNote.textContent = text;
  formNote.style.color = isError ? "#ff7b72" : "var(--teal)";
}

// Utility: basic email format check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // ── 1. Gather values ──────────────────────────────────────
  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // ── 2. Validate ───────────────────────────────────────────
  if (!name) {
    showNote("Please enter your name.", true);
    document.getElementById("name").focus();
    return;
  }
  if (!email) {
    showNote("Please enter your email address.", true);
    document.getElementById("email").focus();
    return;
  }
  if (!isValidEmail(email)) {
    showNote("Please enter a valid email address.", true);
    document.getElementById("email").focus();
    return;
  }
  if (!message) {
    showNote("Please enter a message.", true);
    document.getElementById("message").focus();
    return;
  }

  // ── 3. Loading state ──────────────────────────────────────
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
  showNote("", false);
  console.log("[EmailJS] Request started — sending message from:", email);

  // ── 4. Send via EmailJS ───────────────────────────────────
  const templateParams = {
    from_name:  name,
    from_email: email,
    message:    message
  };

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
    .then(function (response) {
      // ── 5a. Success ───────────────────────────────────────
      console.log("[EmailJS] Email sent successfully:", response.status, response.text);
      showNote("✓ Message sent successfully!", false);
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
      // Clear success note after 6 seconds
      setTimeout(() => { formNote.textContent = ""; }, 6000);
    })
    .catch(function (error) {
      // ── 5b. Failure ───────────────────────────────────────
      console.error("[EmailJS] Email failed:", error);
      showNote("Failed to send message. Please try again later.", true);
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
    });
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