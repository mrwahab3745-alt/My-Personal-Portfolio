import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const roleTitles = ["Frontend Developer", "UI Engineer", "React Developer", "Full-Stack Builder", "Freelancer"];

function Hero() {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [typedTitle, setTypedTitle] = useState(prefersReducedMotion ? roleTitles[0] : "");

  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedTitle(roleTitles[0]);
      return undefined;
    }

    let wordIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    let timeoutId;

    const typeNextCharacter = () => {
      const currentTitle = roleTitles[wordIndex];
      characterIndex += deleting ? -1 : 1;
      setTypedTitle(currentTitle.substring(0, Math.max(characterIndex, 0)));

      let delay = deleting ? 45 : 95;
      if (!deleting && characterIndex === currentTitle.length) {
        delay = 1500;
        deleting = true;
      } else if (deleting && characterIndex <= 0) {
        deleting = false;
        characterIndex = 0;
        wordIndex = (wordIndex + 1) % roleTitles.length;
        delay = 420;
      }

      timeoutId = window.setTimeout(typeNextCharacter, delay);
    };

    typeNextCharacter();
    return () => window.clearTimeout(timeoutId);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const hero = heroRef.current;
    const canvas = canvasRef.current;
    if (!hero || !canvas || prefersReducedMotion) {
      return undefined;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return undefined;
    }

    let width = 0;
    let height = 0;
    let particles = [];
    let frameId = 0;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      width = hero.clientWidth;
      height = hero.clientHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const particleCount = Math.max(26, Math.min(64, Math.floor((width * height) / 26000)));
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 1.6 + 0.9
      }));
    };

    const drawFrame = () => {
      context.clearRect(0, 0, width, height);

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
        if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;

        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(56, 189, 248, 0.75)";
        context.fill();

        for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
          const nextParticle = particles[nextIndex];
          const deltaX = particle.x - nextParticle.x;
          const deltaY = particle.y - nextParticle.y;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance < 118) {
            const alpha = (1 - distance / 118) * 0.32;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(nextParticle.x, nextParticle.y);
            context.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            context.lineWidth = 1;
            context.stroke();
          }
        }
      }

      frameId = window.requestAnimationFrame(drawFrame);
    };

    const onVisibilityChange = () => {
      if (document.hidden && frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      } else if (!document.hidden && !frameId) {
        frameId = window.requestAnimationFrame(drawFrame);
      }
    };

    resizeCanvas();
    frameId = window.requestAnimationFrame(drawFrame);
    const resizeObserver = "ResizeObserver" in window ? new ResizeObserver(resizeCanvas) : null;
    resizeObserver?.observe(hero);
    if (!resizeObserver) {
      window.addEventListener("resize", resizeCanvas, { passive: true });
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [prefersReducedMotion]);

  return (
    <section id="home" className="hero" ref={heroRef}>
      <canvas id="hero-canvas" aria-hidden="true" ref={canvasRef}></canvas>
      <div className="hero-glow hero-glow--one" aria-hidden="true"></div>
      <div className="hero-glow hero-glow--two" aria-hidden="true"></div>
      <div className="hero-inner glass-panel reveal-hero">
        <p className="hero-kicker"><span className="dot-live"></span> Available for freelance &amp; collaborations</p>
        <h1 className="hero-title">
          I build <span className="text-gradient">digital experiences</span><br />
          that feel fast, sharp, and unforgettable.
        </h1>
        <p className="hero-line">
          <span className="hero-prefix">I am a</span>
          <span id="typing" className="typing" aria-live="polite">{typedTitle}</span>
        </p>
        <p className="hero-sub">
          Frontend-first engineer focused on performance, responsive UI, and clean architecture — from
          landing pages to full-stack tools.
        </p>
        <div className="hero-btns">
          <a className="btn btn-primary" href="#contact">Hire me</a>
          <a className="btn btn-ghost" href="#projects">View work</a>
          <a className="btn btn-link" href="https://github.com/mrwahab3745-alt" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-github" aria-hidden="true"></i> GitHub
          </a>
        </div>
        <p className="hero-scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <i className="fas fa-arrow-down"></i>
        </p>
      </div>
    </section>
  );
}

export default Hero;