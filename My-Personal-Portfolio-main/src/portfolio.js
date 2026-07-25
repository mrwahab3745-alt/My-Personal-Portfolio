/* global gsap, ScrollTrigger */
/* eslint-disable no-undef -- GSAP and ScrollTrigger load from CDN in index.html before this bundle */
(function () {
  if (window.__portfolioAnimationsStarted) {
    return;
  }
  window.__portfolioAnimationsStarted = true;

  const gsapLib = window.gsap;
  const scrollTriggerPlugin = window.ScrollTrigger;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = motionQuery.matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (gsapLib && scrollTriggerPlugin) {
    gsapLib.registerPlugin(scrollTriggerPlugin);
  }

  function initDynamicFormNext() {
    const nextInput = document.querySelector("#contact-form [data-dynamic-next]");
    if (!nextInput) {
      return;
    }
    const origin = window.location.origin || "";
    const path = window.location.pathname || "/";
    nextInput.value = `${origin}${path}#contact`;
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

      formStatus.classList.remove("is-error", "is-success");

      if (!name || !email || !message) {
        formStatus.textContent = "Please fill out all fields.";
        formStatus.classList.add("is-error");
        return;
      }

      submitButton.disabled = true;
      formStatus.textContent = "Sending message...";

      try {
        const response = await fetch(formSubmitEndpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Failed to send message.");
        }

        formStatus.textContent = "Message sent successfully. I will get back to you shortly.";
        formStatus.classList.add("is-success");
        contactForm.reset();
        initDynamicFormNext();
      } catch (error) {
        formStatus.textContent = error?.message || "Something went wrong. Please try again.";
        formStatus.classList.add("is-error");
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  function initTypingEffect() {
    const texts = ["Frontend Developer", "UI Engineer", "React Developer", "Full-Stack Builder", "Freelancer"];
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
      typingElement.textContent = currentText.substring(0, Math.max(charIndex, 0));

      let speed = isDeleting ? 45 : 95;

      if (!isDeleting && charIndex === currentText.length) {
        speed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex <= 0) {
        isDeleting = false;
        charIndex = 0;
        index = (index + 1) % texts.length;
        speed = 420;
      }

      // Store timeout id for cleanup (performance + prevents leaked timers).
      typingTimeoutId = window.setTimeout(typeEffect, speed);
    }

    typeEffect();
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

    // Store handles for cleanup to avoid leaked animations/listeners.
    let animationId = null;

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 1.6 + 0.9
      };
    }

    function resizeCanvas() {
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width;
      canvas.height = height;

      const particleCount = Math.max(26, Math.min(64, Math.floor((width * height) / 26000)));
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
        ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const nextParticle = particles[j];
          const dx = particle.x - nextParticle.x;
          const dy = particle.y - nextParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 118) {
            const alpha = (1 - distance / 118) * 0.32;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(nextParticle.x, nextParticle.y);
            ctx.strokeStyle = "rgba(168, 85, 247, " + alpha + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationId = window.requestAnimationFrame(drawFrame);
    }

    resizeCanvas();
    drawFrame();

    // Expose handlers so cleanup can remove them.
    heroResizeHandler = resizeCanvas;
    heroAnimationFrameId = animationId;

    window.addEventListener("resize", heroResizeHandler);

    heroVisibilityHandler = () => {
      if (document.hidden && heroAnimationFrameId) {
        window.cancelAnimationFrame(heroAnimationFrameId);
        heroAnimationFrameId = null;
        animationId = null;
        return;
      }

      if (!document.hidden && !heroAnimationFrameId) {
        drawFrame();
      }
    };

    document.addEventListener("visibilitychange", heroVisibilityHandler);
  }

  function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const menuBtn = document.querySelector(".mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navAnchors = document.querySelectorAll(".nav-links a");
    const pageSections = document.querySelectorAll("main section[id]");

    if (navbar) {
      window.requestAnimationFrame(() => navbar.classList.add("nav-visible"));
    }

    function closeMenu() {
      if (!menuBtn || !navLinks) {
        return;
      }
      navLinks.classList.remove("active");
      menuBtn.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");
      document.body.classList.remove("nav-open");
    }

    function updateNavbarState() {
      if (!navbar) {
        return;
      }

      const scrolled = window.scrollY > 18;
      navbar.classList.toggle("scrolled", scrolled);

      const navHeight = navbar.offsetHeight || 72;
      const marker = window.scrollY + navHeight + 48;
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
        anchor.classList.toggle("active-link", Boolean(target && target === activeId));
      });
    }

    updateNavbarState();
    // Store handlers for cleanup.
    navbarScrollHandler = updateNavbarState;
    navbarResizeHandler = updateNavbarState;

    window.addEventListener("scroll", navbarScrollHandler, { passive: true });
    window.addEventListener("resize", navbarResizeHandler);

    if (menuBtn && navLinks) {
      menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("active");
        menuBtn.classList.toggle("active", isOpen);
        menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
        menuBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
        document.body.classList.toggle("nav-open", isOpen);
      });

      navAnchors.forEach((link) => {
        link.addEventListener("click", () => closeMenu());
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
        }
      });

      document.addEventListener("click", (event) => {
        if (!navLinks.classList.contains("active")) {
          return;
        }
        if (navbar.contains(event.target)) {
          return;
        }
        closeMenu();
      });
    }
  }

  function initRevealObserver() {
    const selector = ".reveal-on-scroll, .fade-in";
    const elementsToAnimate = document.querySelectorAll(selector);

    if (!("IntersectionObserver" in window)) {
      elementsToAnimate.forEach((element) => element.classList.add("show"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elementsToAnimate.forEach((element) => observer.observe(element));
  }

  function initSkillBars() {
    const fills = document.querySelectorAll(".skill-row .skill-fill");
    if (!fills.length) {
      return;
    }

    if (prefersReducedMotion) {
      document.querySelectorAll(".skill-row").forEach((row) => row.classList.add("is-visible"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".skill-row").forEach((row) => row.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    document.querySelectorAll(".skill-row").forEach((row) => observer.observe(row));
  }

  function initSkillBadges() {
    const badges = document.querySelectorAll(".skill-badge");
    const rows = document.querySelectorAll(".skill-row");
    if (!badges.length || !rows.length) {
      return;
    }

    let active = null;

    function applyState() {
      badges.forEach((badge) => {
        const key = badge.getAttribute("data-skill");
        badge.classList.toggle("is-active", Boolean(active && key === active));
      });

      rows.forEach((row) => {
        const key = row.getAttribute("data-skill-row");
        if (!active) {
          row.classList.remove("dimmed");
          return;
        }
        row.classList.toggle("dimmed", key !== active);
      });
    }

    badges.forEach((badge) => {
      badge.addEventListener("click", () => {
        const key = badge.getAttribute("data-skill");
        if (!key) {
          return;
        }
        active = active === key ? null : key;
        applyState();
      });
    });

    applyState();
  }

  function initCustomCursor() {
    if (!finePointer || prefersReducedMotion) {
      return;
    }

    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) {
      return;
    }

    document.body.classList.add("use-custom-cursor");

    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = null;

    function render() {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      rafId = window.requestAnimationFrame(render);
    }

    function onMove(event) {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    }

    // Store handler for cleanup.
    customCursorPointerMoveHandler = onMove;
    window.addEventListener("pointermove", customCursorPointerMoveHandler, { passive: true });
    rafId = window.requestAnimationFrame(render);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && !rafId) {
        rafId = window.requestAnimationFrame(render);
      }
    });
  }

  function initGsapAnimations() {
    if (!gsapLib || prefersReducedMotion) {
      return;
    }

    // Scope GSAP animations to allow cleanup via gsap.context().
    gsapCtx = gsapLib.context(() => {
      gsapLib
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".logo-container", { y: -18, opacity: 0, duration: 0.65 }, 0)
        .from(".nav-links li", { y: -14, opacity: 0, duration: 0.42, stagger: 0.07 }, 0.08)
        .from(".hero-inner", { y: 36, opacity: 0, duration: 0.95 }, 0.18)
        .from(".hero-btns .btn", { y: 18, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.45);

      gsapLib.utils.toArray(".service-card").forEach((card, index) => {
        gsapLib.from(card, {
          y: 56,
          opacity: 0,
          duration: 0.75,
          ease: "power3.out",
          delay: index * 0.05,
          scrollTrigger: { trigger: card, start: "top 86%" }
        });
      });

      gsapLib.utils.toArray(".project-card").forEach((card, index) => {
        gsapLib.from(card, {
          y: 64,
          opacity: 0,
          scale: 0.96,
          duration: 0.85,
          ease: "power3.out",
          delay: index * 0.06,
          scrollTrigger: { trigger: card, start: "top 88%" }
        });
      });

      gsapLib.utils.toArray(".about-grid, .skills-panel, .contact-layout").forEach((block) => {
        gsapLib.from(block, {
          y: 36,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: { trigger: block, start: "top 86%" }
        });
      });

      if (scrollTriggerPlugin) {
        gsapLib.to("#hero-canvas", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.1
          }
        });
      }
    });
  }

  function initInteractiveCards() {
    if (!gsapLib || prefersReducedMotion || !finePointer) {
      return;
    }

    const cards = document.querySelectorAll(".project-card, .service-card");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const bounds = card.getBoundingClientRect();
        const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 9;
        const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -9;

        gsapLib.to(card, {
          rotateX,
          rotateY,
          y: -6,
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

  function initApp() {
    document.body.classList.add("js-enabled");
    initDynamicFormNext();
    initContactForm();
    initTypingEffect();
    initHeroCanvas();
    initNavbar();
    initRevealObserver();
    initSkillBars();
    initSkillBadges();
    initCustomCursor();
    initGsapAnimations();
    initInteractiveCards();
  }

  let cleanup = null;

  function initAppOnce() {
    if (cleanup) return;
    initApp();
    cleanup = function () {
      try {
        if (typingTimeoutId) {
          window.clearTimeout(typingTimeoutId);
          typingTimeoutId = null;
        }
        if (heroAnimationFrameId) {
          window.cancelAnimationFrame(heroAnimationFrameId);
          heroAnimationFrameId = null;
        }
        if (heroResizeHandler) {
          window.removeEventListener("resize", heroResizeHandler);
          heroResizeHandler = null;
        }
        if (heroVisibilityHandler) {
          document.removeEventListener("visibilitychange", heroVisibilityHandler);
          heroVisibilityHandler = null;
        }

        if (navbarScrollHandler) {
          window.removeEventListener("scroll", navbarScrollHandler);
          navbarScrollHandler = null;
        }
        if (navbarResizeHandler) {
          window.removeEventListener("resize", navbarResizeHandler);
          navbarResizeHandler = null;
        }

        if (customCursorPointerMoveHandler) {
          window.removeEventListener("pointermove", customCursorPointerMoveHandler);
          customCursorPointerMoveHandler = null;
        }

        if (gsapCtx) {
          gsapCtx.revert();
          gsapCtx = null;
        }
      } catch {
        // ignore cleanup errors
      }
    };
  }

  let typingTimeoutId = null;
  let heroAnimationFrameId = null;
  let heroResizeHandler = null;
  let heroVisibilityHandler = null;
  let navbarScrollHandler = null;
  let navbarResizeHandler = null;
  let customCursorPointerMoveHandler = null;
  let gsapCtx = null;

  // Patch a few initializers to store cleanup handles.
  // (Logic is unchanged; this only prevents leaked listeners/animations.)
  const origInitTypingEffect = initTypingEffect;
  initTypingEffect = function () {
    const typingElement = document.getElementById("typing");
    if (!typingElement) return;

    const texts = ["Frontend Developer", "UI Engineer", "React Developer", "Full-Stack Builder", "Freelancer"];
    let index = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentText = texts[index];
      charIndex += isDeleting ? -1 : 1;
      typingElement.textContent = currentText.substring(0, Math.max(charIndex, 0));

      let speed = isDeleting ? 45 : 95;

      if (!isDeleting && charIndex === currentText.length) {
        speed = 1500;
        isDeleting = true;
      } else if (isDeleting && charIndex <= 0) {
        isDeleting = false;
        charIndex = 0;
        index = (index + 1) % texts.length;
        speed = 420;
      }

      typingTimeoutId = window.setTimeout(typeEffect, speed);
    }

    typeEffect();
  };

  const origInitHeroCanvas = initHeroCanvas;
  initHeroCanvas = function () {
    const canvas = document.getElementById("hero-canvas");
    const hero = document.querySelector(".hero");

    if (!canvas || !hero || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 1.6 + 0.9
      };
    }

    function resizeCanvas() {
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = width;
      canvas.height = height;

      const particleCount = Math.max(26, Math.min(64, Math.floor((width * height) / 26000)));
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
        ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const nextParticle = particles[j];
          const dx = particle.x - nextParticle.x;
          const dy = particle.y - nextParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 118) {
            const alpha = (1 - distance / 118) * 0.32;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(nextParticle.x, nextParticle.y);
            ctx.strokeStyle = "rgba(168, 85, 247, " + alpha + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      heroAnimationFrameId = window.requestAnimationFrame(drawFrame);
    }

    resizeCanvas();
    drawFrame();

    heroResizeHandler = resizeCanvas;
    window.addEventListener("resize", heroResizeHandler);

    heroVisibilityHandler = () => {
      if (document.hidden && heroAnimationFrameId) {
        window.cancelAnimationFrame(heroAnimationFrameId);
        heroAnimationFrameId = null;
        return;
      }

      if (!document.hidden && !heroAnimationFrameId) {
        drawFrame();
      }
    };

    document.addEventListener("visibilitychange", heroVisibilityHandler);
  };

  function wrapInitGsapAnimations() {
    // Keep existing behavior but ensure GSAP can be reverted.
    const original = initGsapAnimations;
    initGsapAnimations = function () {
      if (!gsapLib || prefersReducedMotion) return;

      // @ts-ignore
      gsapCtx = gsapLib.context(() => {
        original();
      });
    };
  }
  wrapInitGsapAnimations();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAppOnce);
  } else {
    initAppOnce();
  }

  window.addEventListener("pagehide", () => {
    if (cleanup) cleanup();
  });
})();
