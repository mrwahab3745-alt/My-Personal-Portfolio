// --- 1. Scroll Animations (Intersection Observer) ---
const observerOptions = {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const elementsToAnimate = document.querySelectorAll('.reveal-on-scroll, .fade-in, .service-card, .project-card');
elementsToAnimate.forEach(el => observer.observe(el));

// --- 1.1 Hero Canvas Background Animation ---
function initHeroCanvas() {
    const canvas = document.getElementById("hero-canvas");
    const hero = document.querySelector(".hero");

    if (!canvas || !hero) {
        return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
        return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }

    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 1.8 + 1
        };
    }

    function resizeCanvas() {
        width = hero.clientWidth;
        height = hero.clientHeight;
        canvas.width = width;
        canvas.height = height;

        const particleCount = Math.max(28, Math.min(60, Math.floor((width * height) / 24000)));
        particles = Array.from({ length: particleCount }, createParticle);
    }

    function drawFrame() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x <= 0 || p.x >= width) p.vx *= -1;
            if (p.y <= 0 || p.y >= height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 180, 255, 0.75)";
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(138, 43, 226, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        animationId = window.requestAnimationFrame(drawFrame);
    }

    resizeCanvas();
    drawFrame();
    window.addEventListener("resize", resizeCanvas);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden && animationId) {
            window.cancelAnimationFrame(animationId);
            animationId = null;
            return;
        }

        if (!document.hidden && !animationId) {
            drawFrame();
        }
    });
}

function initNavbarAnimations() {
    const navbar = document.querySelector(".navbar");
    const navAnchors = document.querySelectorAll(".nav-links a");
    const pageSections = document.querySelectorAll("section[id]");

    if (!navbar || !navAnchors.length || !pageSections.length) {
        return;
    }

    window.requestAnimationFrame(() => {
        navbar.classList.add("nav-visible");
    });

    function updateNavbarState() {
        const scrolled = window.scrollY > 28;
        navbar.classList.toggle("scrolled", scrolled);

        const navHeight = navbar.offsetHeight;
        const marker = window.scrollY + navHeight + 70;
        let activeId = "";

        pageSections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (marker >= top && marker < bottom) {
                activeId = section.id;
            }
        });

        navAnchors.forEach(anchor => {
            const target = anchor.getAttribute("href")?.replace("#", "");
            const shouldActivate = target && target === activeId;
            anchor.classList.toggle("active-link", Boolean(shouldActivate));
        });
    }

    updateNavbarState();
    window.addEventListener("scroll", updateNavbarState, { passive: true });
    window.addEventListener("resize", updateNavbarState);
}


// --- 2. Mobile Menu Toggle Logic ---
const menuBtn = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    // Menu ko open/close karo
    navLinks.classList.toggle('active');
    
    // Button ko 'X' animation do
    menuBtn.classList.toggle('active');
});

// --- 3. Close menu when a link is clicked (Mobile UX) ---
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
    });
});


// --- 4. Contact Form Submission ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const formSubmitEndpoint = 'https://formsubmit.co/ajax/mrwahab3745@gmail.com';

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);
        const name = formData.get('name')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const message = formData.get('message')?.toString().trim();

        if (!name || !email || !message) {
            formStatus.textContent = 'Please fill out all fields.';
            return;
        }

        submitButton.disabled = true;
        formStatus.textContent = 'Sending message...';

        try {
            const response = await fetch(formSubmitEndpoint, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Failed to send message.');
            }

            formStatus.textContent = 'Message sent successfully. I will contact you soon, InshaAllah.';
            contactForm.reset();
        } catch (error) {
            formStatus.textContent = error.message || 'Something went wrong. Please try again.';
        } finally {
            submitButton.disabled = false;
        }
    });
}

// --- 5. Typing Effect ---
const texts = ["Frontend Developer", "UI/UX Designer", "Web Developer", "Freelancer"];
let index = 0;
let charIndex = 0;
let isDeleting = false;

const typingElement = document.getElementById("typing");

function typeEffect() {
  const currentText = texts[index];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingElement.textContent = currentText.substring(0, charIndex);

  let speed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentText.length) {
    speed = 1500; // pause after typing
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    index = (index + 1) % texts.length;
    speed = 500;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();
initHeroCanvas();
initNavbarAnimations();
