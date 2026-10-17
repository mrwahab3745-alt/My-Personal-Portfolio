import { useEffect, useRef } from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Icon from "./components/Icon";
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
    const revealElements = app.querySelectorAll(
      ".reveal-on-scroll, .fade-in, .reveal-block, .reveal-item"
    );
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

    return () => {
      revealObserver?.disconnect();
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

      if (Math.abs(targetX - ringX) > 0.1 || Math.abs(targetY - ringY) > 0.1) {
        frameId = window.requestAnimationFrame(render);
      } else {
        frameId = 0;
      }
    };
    const scheduleRender = () => {
      if (!frameId && !document.hidden) {
        frameId = window.requestAnimationFrame(render);
      }
    };
    const onPointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      scheduleRender();
    };
    const onVisibilityChange = () => {
      if (document.hidden && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (!document.hidden) {
        scheduleRender();
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

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
            <article className="service-card glass-card reveal-item" style={{ "--reveal-delay": "0ms" }}>
              <div className="service-icon"><Icon name="code" /></div>
              <h3>Web design &amp; UI</h3>
              <p>Modern interfaces with crisp hierarchy, motion, and conversion-focused layout.</p>
            </article>
            <article className="service-card glass-card reveal-item" style={{ "--reveal-delay": "50ms" }}>
              <div className="service-icon"><Icon name="smartphone" /></div>
              <h3>Responsive builds</h3>
              <p>Flawless scaling from mobile to ultrawide with accessible, touch-friendly interactions.</p>
            </article>
            <article className="service-card glass-card reveal-item" style={{ "--reveal-delay": "100ms" }}>
              <div className="service-icon"><Icon name="briefcase" /></div>
              <h3>Portfolios &amp; brands</h3>
              <p>Showcase sites that highlight your story, metrics, and featured work with style.</p>
            </article>
            <article className="service-card glass-card reveal-item" style={{ "--reveal-delay": "150ms" }}>
              <div className="service-icon"><Icon name="signature" /></div>
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