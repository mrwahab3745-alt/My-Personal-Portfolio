const gsapLib = window.gsap;
const scrollTriggerPlugin = window.ScrollTrigger;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (gsapLib && scrollTriggerPlugin) {
    gsapLib.registerPlugin(scrollTriggerPlugin);
    console.info(`GSAP verified: v${gsapLib.version}`);
} else {
    console.warn("GSAP or ScrollTrigger could not be loaded in the browser.");
}

function initRevealObserver() {
    const observerOptions = {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToAnimate = document.querySelectorAll(".reveal-on-scroll, .fade-in, .service-card, .project-card");
    elementsToAnimate.forEach((element) => observer.observe(element));
}

function initHeroCanvas() {
    const canvas = document.getElementById("hero-canvas");
    const hero = document.querySelector(".hero");

    if (!canvas || !hero || prefersReducedMotion) {
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
            const particle = particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
            if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(0, 180, 255, 0.75)";
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const nextParticle = particles[j];
                const dx = particle.x - nextParticle.x;
                const dy = particle.y - nextParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const alpha = (1 - distance / 120) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(nextParticle.x, nextParticle.y);
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

        pageSections.forEach((section) => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (marker >= top && marker < bottom) {
                activeId = section.id;
            }
        });

        navAnchors.forEach((anchor) => {
            const target = anchor.getAttribute("href")?.replace("#", "");
            const shouldActivate = target && target === activeId;
            anchor.classList.toggle("active-link", Boolean(shouldActivate));
        });
    }

    updateNavbarState();
    window.addEventListener("scroll", updateNavbarState, { passive: true });
    window.addEventListener("resize", updateNavbarState);
}

function initMobileMenu() {
    const menuBtn = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuBtn || !navLinks) {
        return;
    }

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuBtn.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuBtn.classList.remove("active");
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const formSubmitEndpoint = "https://formsubmit.co/ajax/mrwahab3745@gmail.com";

    if (!contactForm || !formStatus) {
        return;
    }

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const formData = new FormData(contactForm);
        const name = formData.get("name")?.toString().trim();
        const email = formData.get("email")?.toString().trim();
        const message = formData.get("message")?.toString().trim();

        if (!name || !email || !message) {
            formStatus.textContent = "Please fill out all fields.";
            return;
        }

        submitButton.disabled = true;
        formStatus.textContent = "Sending message...";

        try {
            const response = await fetch(formSubmitEndpoint, {
                method: "POST",
                headers: {
                    Accept: "application/json"
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "Failed to send message.");
            }

            formStatus.textContent = "Message sent successfully. I will contact you soon, InshaAllah.";
            contactForm.reset();
        } catch (error) {
            formStatus.textContent = error.message || "Something went wrong. Please try again.";
        } finally {
            submitButton.disabled = false;
        }
    });
}

function initTypingEffect() {
    const texts = ["Frontend Developer", "UI/UX Designer", "Web Developer", "Freelancer"];
    const typingElement = document.getElementById("typing");

    if (!typingElement) {
        return;
    }

    let index = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentText = texts[index];

        charIndex += isDeleting ? -1 : 1;
        typingElement.textContent = currentText.substring(0, charIndex);

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            speed = 1500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            index = (index + 1) % texts.length;
            speed = 500;
        }

        window.setTimeout(typeEffect, speed);
    }

    typeEffect();
}

function initGsapAnimations() {
    if (!gsapLib || prefersReducedMotion) {
        return;
    }

    const heroTimeline = gsapLib.timeline({ defaults: { ease: "power3.out" } });

    heroTimeline
        .from(".logo-container", { y: -24, opacity: 0, duration: 0.7 }, 0)
        .from(".nav-links li", { y: -18, opacity: 0, duration: 0.45, stagger: 0.08 }, 0.1)
        .from(".hero h1", { y: 40, opacity: 0, duration: 0.9 }, 0.25)
        .from(".hero p", { y: 28, opacity: 0, duration: 0.8 }, 0.45)
        .from(".hero-btns button", { y: 20, opacity: 0, duration: 0.55, stagger: 0.12 }, 0.62);

    gsapLib.utils.toArray(".service-card").forEach((card, index) => {
        gsapLib.from(card, {
            y: 64,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.05,
            scrollTrigger: {
                trigger: card,
                start: "top 82%"
            }
        });
    });

    gsapLib.utils.toArray(".project-card").forEach((card, index) => {
        gsapLib.from(card, {
            y: 72,
            opacity: 0,
            scale: 0.94,
            duration: 0.95,
            ease: "power3.out",
            delay: index * 0.08,
            scrollTrigger: {
                trigger: card,
                start: "top 84%"
            }
        });
    });

    gsapLib.utils.toArray(".about p, .contact-connect, .contact form").forEach((element) => {
        gsapLib.from(element, {
            y: 42,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: element,
                start: "top 84%"
            }
        });
    });

    gsapLib.to("#hero-canvas", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.2
        }
    });
}

function initInteractiveCards() {
    if (!gsapLib || prefersReducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return;
    }

    const interactiveCards = document.querySelectorAll(".project-card, .service-card");

    interactiveCards.forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const bounds = card.getBoundingClientRect();
            const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
            const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -10;

            gsapLib.to(card, {
                rotateX,
                rotateY,
                y: -10,
                transformPerspective: 900,
                transformOrigin: "center",
                duration: 0.35,
                ease: "power2.out"
            });
        });

        card.addEventListener("mouseleave", () => {
            gsapLib.to(card, {
                rotateX: 0,
                rotateY: 0,
                y: 0,
                duration: 0.45,
                ease: "power3.out"
            });
        });
    });
}

initRevealObserver();
initHeroCanvas();
initNavbarAnimations();
initMobileMenu();
initContactForm();
initTypingEffect();
initGsapAnimations();
initInteractiveCards();