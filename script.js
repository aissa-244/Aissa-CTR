const button   = document.getElementById("pdp-dark");
const xButton  = document.getElementById("x-button");
const panel    = document.getElementById("cv");
const bg       = document.getElementById("bg");
const namedesc = document.getElementById("namedesc");

// — Profile picture hover —
button.addEventListener("mouseenter", () => namedesc.textContent = "Click to see my bio");
button.addEventListener("mouseleave", () => namedesc.textContent = "High-CTR Thumbnail Designer");

// — CV panel open/close —
function openPanel() {
  if (panel.classList.contains("show")) return;
  panel.classList.add("show");
  bg.style.backgroundColor = "gray";
}

function closePanel() {
  panel.classList.remove("show");
  bg.style.backgroundColor = "white";
}

button.addEventListener("click", openPanel);
xButton.addEventListener("click", closePanel);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePanel();
});

document.addEventListener("click", (e) => {
  if (panel.classList.contains("show") && !panel.contains(e.target) && !button.contains(e.target)) {
    closePanel();
  }
});

// — Contact button ripple —
document.getElementById("contact-me").addEventListener("click", function () {
  this.querySelector(".ripple")?.remove();
  const ripple = document.createElement("span");
  ripple.classList.add("ripple");
  this.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
});

// — Comments carousel —
document.addEventListener("DOMContentLoaded", () => {
  const CARD_WIDTH = 285;
  const GAP        = 10;
  const STEP       = CARD_WIDTH + GAP;
  const INTERVAL   = 4000;
  const TRANSITION = 600;

  const track = document.querySelector(".comments-track");
  if (!track) return;

  const isMobile = () => window.innerWidth <= 480;

  // ── Mobile: native swipe ──
  if (isMobile()) {
    const container = track.closest("#comments-card");
    container.style.overflowX = "auto";
    container.style.overflowY = "hidden";
    container.style.scrollSnapType = "x mandatory";
    container.style.webkitOverflowScrolling = "touch";
    track.style.transition = "none";
    Array.from(track.children).forEach(card => {
      card.style.scrollSnapAlign = "start";
    });
    return;
  }

  // ── Desktop: auto-scroll ──
  const total = track.children.length;
  Array.from(track.children).forEach(card => track.appendChild(card.cloneNode(true)));

  let index = 0;
  let isTransitioning = false;

  setInterval(() => {
    if (isTransitioning) return;
    isTransitioning = true;

    index++;
    track.style.transition = `transform ${TRANSITION}ms cubic-bezier(0.65, 0, 0.35, 1)`;
    track.style.transform  = `translateX(-${index * STEP}px)`;

    setTimeout(() => {
      if (index >= total) {
        index = 0;
        track.style.transition = "none";
        track.style.transform  = "translateX(0)";
        track.getBoundingClientRect();
      }
      isTransitioning = false;
    }, TRANSITION);
  }, INTERVAL);
});

// — Tool mastery bars —
document.querySelectorAll(".tool").forEach(card => {
  const fill    = card.querySelector(".tool-fill");
  const edge    = card.querySelector(".tool-fill-edge");
  const counter = card.querySelector(".mastery p");
  const pct     = parseInt(card.dataset.pct, 10);
  let done      = false;

  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || done) return;
    done = true;

    setTimeout(() => {
      fill.style.width = pct + "%";
      edge.style.left  = pct + "%";

      const start = performance.now();
      (function tick(now) {
        const t = Math.min((now - start) / 1200, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        counter.textContent = Math.round(ease * pct) + "%";
        if (t < 1) requestAnimationFrame(tick);
      })(performance.now());
    }, 200);
  }, { threshold: 0.4 }).observe(card);
});

// -- FAQ text animation --

const cards = document.querySelectorAll(".FAQ-card");

cards.forEach(card => {
    const button = card.querySelector(".FAQ-button");
    const text = card.querySelector(".FAQ-text");

    const question = text.dataset.question;
    const answer = text.dataset.answer;

    let toggled = false;
    let typingTimeout;

    function typeWriter(content) {
        clearTimeout(typingTimeout);
        text.textContent = "";

        let index = 0;

        function typing() {
            if (index < content.length) {
                text.textContent += content.charAt(index);
                index++;
                typingTimeout = setTimeout(typing, 20);
            }
        }

        typing();
    }

    button.addEventListener("click", () => {
        toggled = !toggled;
        typeWriter(toggled ? answer : question);
    });
});

// hide control

const control = document.getElementById("control");
const trigger = document.getElementById("lastdiv");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      control.classList.add("hidden");
    } else {
      control.classList.remove("hidden");
    }
  });
}, {
  threshold: 0
});

observer.observe(trigger);

// send data

function sendToWhatsApp(btn) {
  const name     = document.getElementById('username');
  const contact  = document.getElementById('contact');
  const package_ = document.getElementById('package');
  const project  = document.getElementById('project');

  // clear old errors
  [name, contact, package_, project].forEach(el => clearError(el));

  let valid = true;

  if (!name.value.trim())     { showError(name,     "Please enter your name");            valid = false; }
  if (!contact.value.trim())  { showError(contact,  "Please enter your email or WhatsApp"); valid = false; }
  if (!package_.value)        { showError(package_, "Please choose a package");            valid = false; }
  if (!project.value.trim())  { showError(project,  "Tell me a bit about your project");   valid = false; }

  if (!valid) return;

  const message =
`Hello, I'm interested in your services!

Name: ${name.value.trim()}
Contact: ${contact.value.trim()}
Package: ${package_.value}
Project: ${project.value.trim()}`;

  const url = `https://wa.me/212753709716?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');

  btn.textContent = 'Sent!';
  setTimeout(() => btn.textContent = 'Send Message →', 2000);
}

function showError(input, message) {
  input.classList.add('input-error');
  const err = document.createElement('p');
  err.className = 'field-error';
  err.textContent = message;
  input.parentElement.appendChild(err);
}

function clearError(input) {
  input.classList.remove('input-error');
  input.parentElement.querySelector('.field-error')?.remove();
}

['username', 'contact', 'package', 'project'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('input', () => clearError(el));
});

// fade in animation

const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));