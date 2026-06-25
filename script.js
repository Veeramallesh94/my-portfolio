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
            Copy its Service ID → replace YOUR_SERVICE_ID
   Step 3 → Create an Email Template.
            Map these variables inside the template:
              {{from_name}}   ← sender's name
              {{from_email}}  ← sender's email
              {{message}}     ← message body
              {{sent_at}}     ← date & time of submission
            Copy the Template ID → replace YOUR_TEMPLATE_ID
   Step 4 → Account → General → copy Public Key
            → replace YOUR_PUBLIC_KEY
   ============================================================ */

const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";   // ← replace this
const EMAILJS_SERVICE_ID  = "service_27bbx9i";   // ← replace this
const EMAILJS_TEMPLATE_ID = "template_fiq2ldv";  // ← replace this

// Initialise EmailJS only when real credentials are present
if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

/* ---------- CONTACT FORM — EmailJS ---------- */
const contactForm = document.getElementById("contactForm");
const formNote    = document.getElementById("formNote");
const submitBtn   = contactForm.querySelector("button[type='submit']");

// Tracks last submission time for rate limiting (30-second cooldown)
let lastSubmitTime = 0;

// Utility: show a note message below the button
function showNote(text, isError) {
  formNote.textContent = text;
  formNote.style.color = isError ? "#ff7b72" : "var(--teal)";
}

// Utility: highlight or clear a field border on validation error
function setFieldError(id, hasError) {
  const el = document.getElementById(id);
  if (el) el.style.borderColor = hasError ? "#ff7b72" : "";
}

// Utility: basic email format check
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  // ── 1. Gather values ──────────────────────────────────────
  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // ── 2. Rate limit: one submission per 30 seconds ──────────
  const now = Date.now();
  if (now - lastSubmitTime < 30000) {
    showNote("⚠ Please wait a moment before sending again.", true);
    return;
  }

  // ── 3. Reset field borders, then validate ─────────────────
  ["name", "email", "message"].forEach(id => setFieldError(id, false));

  if (!name) {
    showNote("Please enter your name.", true);
    setFieldError("name", true);
    document.getElementById("name").focus();
    return;
  }
  if (!email) {
    showNote("Please enter your email address.", true);
    setFieldError("email", true);
    document.getElementById("email").focus();
    return;
  }
  if (!isValidEmail(email)) {
    showNote("Please enter a valid email address.", true);
    setFieldError("email", true);
    document.getElementById("email").focus();
    return;
  }
  if (!message) {
    showNote("Please write a message.", true);
    setFieldError("message", true);
    document.getElementById("message").focus();
    return;
  }

  // ── 4. Loading state ──────────────────────────────────────
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
  showNote("", false);
  console.log("[EmailJS] Request started — sending message from:", email);

  // ── 5. Fallback: if credentials not yet set, open mailto ──
  if (!window.emailjs || EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
    console.warn("[EmailJS] Credentials not configured — falling back to mailto.");
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nMessage: ${message}\n\nSent: ${new Date().toLocaleString()}`
    );
    window.location.href = `mailto:veeramallesh48@gmail.com?subject=${subject}&body=${body}`;
    showNote("Opening your email client… (Add EmailJS credentials for automatic delivery.)", false);
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
    lastSubmitTime = now;
    return;
  }

  // ── 6. Send via EmailJS ───────────────────────────────────
  const templateParams = {
    from_name:  name,
    from_email: email,
    message:    message,
    sent_at:    new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
  };

  try {
    const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    // ── 7a. Success ───────────────────────────────────────
    console.log("[EmailJS] Email sent successfully:", response.status, response.text);
    showNote("✓ Message sent successfully!", false);
    contactForm.reset();
    ["name", "email", "message"].forEach(id => setFieldError(id, false));
    lastSubmitTime = now;
    setTimeout(() => { formNote.textContent = ""; }, 6000);
  } catch (error) {
    // ── 7b. Failure ───────────────────────────────────────
    console.error("[EmailJS] Email failed:", error);
    showNote("Failed to send message. Please try again later.", true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fa fa-paper-plane"></i> Send Message';
  }
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