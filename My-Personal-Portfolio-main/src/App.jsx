import { useEffect, useRef } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import usePrefersReducedMotion from "./hooks/usePrefersReducedMotion";

function App() {
  const appRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const app = appRef.current;
    if (!app) {
      return undefined;
    }

    document.body.classList.add("js-enabled");
    const revealElements = app.querySelectorAll(".reveal-on-scroll, .fade-in");
    let revealObserver;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("show"));
    } else {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      revealElements.forEach((element) => revealObserver.observe(element));
    }

    const gsap = window.gsap;
    const scrollTrigger = window.ScrollTrigger;
    let animationContext;
    const cardListeners = [];

    if (gsap && scrollTrigger && !prefersReducedMotion) {
      gsap.registerPlugin(scrollTrigger);
      animationContext = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".logo-container", { y: -18, opacity: 0, duration: 0.65 }, 0)
          .from(".nav-links li", { y: -14, opacity: 0, duration: 0.42, stagger: 0.07 }, 0.08)
          .from(".hero-inner", { y: 36, opacity: 0, duration: 0.95 }, 0.18)
          .from(".hero-btns .btn", { y: 18, opacity: 0, duration: 0.55, stagger: 0.1 }, 0.45);

        app.querySelectorAll(".service-card").forEach((card, index) => {
          gsap.from(card, {
            y: 56,
            opacity: 0,
            duration: 0.75,
            ease: "power3.out",
            delay: index * 0.05,
            scrollTrigger: { trigger: card, start: "top 86%" }
          });
        });

        app.querySelectorAll(".project-card").forEach((card, index) => {
          gsap.from(card, {
            y: 64,
            opacity: 0,
            scale: 0.96,
            duration: 0.85,
            ease: "power3.out",
            delay: index * 0.06,
            scrollTrigger: { trigger: card, start: "top 88%" }
          });
        });

        app.querySelectorAll(".about-grid, .skills-panel, .contact-layout").forEach((block) => {
          gsap.from(block, {
            y: 36,
            opacity: 0,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: { trigger: block, start: "top 86%" }
          });
        });

        gsap.to("#hero-canvas", {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.1
          }
        });
      }, app);

      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (finePointer) {
        app.querySelectorAll(".project-card, .service-card").forEach((card) => {
          const rotateXTo = gsap.quickTo(card, "rotationX", { duration: 0.35, ease: "power2.out" });
          const rotateYTo = gsap.quickTo(card, "rotationY", { duration: 0.35, ease: "power2.out" });
          const moveYTo = gsap.quickTo(card, "y", { duration: 0.35, ease: "power2.out" });
          const onPointerMove = (event) => {
            const bounds = card.getBoundingClientRect();
            rotateYTo(((event.clientX - bounds.left) / bounds.width - 0.5) * 9);
            rotateXTo(((event.clientY - bounds.top) / bounds.height - 0.5) * -9);
            moveYTo(-6);
          };
          const onPointerLeave = () => {
            gsap.to(card, {
              rotationX: 0,
              rotationY: 0,
              y: 0,
              duration: 0.45,
              ease: "power3.out"
            });
          };

          card.addEventListener("pointermove", onPointerMove, { passive: true });
          card.addEventListener("pointerleave", onPointerLeave);
          cardListeners.push(() => {
            card.removeEventListener("pointermove", onPointerMove);
            card.removeEventListener("pointerleave", onPointerLeave);
            gsap.killTweensOf(card);
            gsap.set(card, { clearProps: "transform" });
          });
        });
      }
    }

    return () => {
      revealObserver?.disconnect();
      cardListeners.forEach((removeListeners) => removeListeners());
      animationContext?.revert();
      document.body.classList.remove("js-enabled");
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!finePointer || prefersReducedMotion) {
      return undefined;
    }

    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    if (!dot || !ring) {
      return undefined;
    }

    document.body.classList.add("use-custom-cursor");
    let ringX = 0;
    let ringY = 0;
    let targetX = 0;
    let targetY = 0;
    let frameId = 0;

    const render = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frameId = window.requestAnimationFrame(render);
    };
    const onPointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    const onVisibilityChange = () => {
      if (document.hidden && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (!document.hidden && !frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.cancelAnimationFrame(frameId);
      document.body.classList.remove("use-custom-cursor");
    };
  }, [prefersReducedMotion]);

  return (
    <div className="app-shell" ref={appRef}>
      <div className="cursor-dot" aria-hidden="true"></div>
      <div className="cursor-ring" aria-hidden="true"></div>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <section id="services" className="section services reveal-on-scroll">
          <div className="section-head">
            <p className="eyebrow">Services</p>
            <h2>What I can build for you</h2>
          </div>
          <div className="service-grid">
            <article className="service-card glass-card">
              <div className="service-icon"><i className="fas fa-code" aria-hidden="true"></i></div>
              <h3>Web design &amp; UI</h3>
              <p>Modern interfaces with crisp hierarchy, motion, and conversion-focused layout.</p>
            </article>
            <article className="service-card glass-card">
              <div className="service-icon"><i className="fas fa-mobile-screen" aria-hidden="true"></i></div>
              <h3>Responsive builds</h3>
              <p>Flawless scaling from mobile to ultrawide with accessible, touch-friendly interactions.</p>
            </article>
            <article className="service-card glass-card">
              <div className="service-icon"><i className="fas fa-briefcase" aria-hidden="true"></i></div>
              <h3>Portfolios &amp; brands</h3>
              <p>Showcase sites that highlight your story, metrics, and featured work with style.</p>
            </article>
            <article className="service-card glass-card">
              <div className="service-icon"><i className="fas fa-signature" aria-hidden="true"></i></div>
              <h3>Email signatures</h3>
              <p>Branded, bulletproof signatures that render consistently across major email clients.</p>
            </article>
          </div>
        </section>
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;