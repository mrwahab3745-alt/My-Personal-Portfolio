function About() {
  return (
    <section id="about" className="section about reveal-on-scroll">
      <div className="section-head">
        <p className="eyebrow">About</p>
        <h2>Precision UI, pragmatic engineering</h2>
      </div>
      <div className="about-grid">
        <div className="glass-card about-card">
          <p>
            I am a frontend developer who enjoys turning complex requirements into calm, intuitive interfaces.
            Whether it is a modular portfolio, a conversion-focused landing page, or a bulletproof email signature, I
            care about accessibility, performance, and maintainable code.
          </p>
          <ul className="about-highlights">
            <li><i className="fas fa-bolt" aria-hidden="true"></i> Performance-minded delivery</li>
            <li><i className="fas fa-layer-group" aria-hidden="true"></i> Design systems &amp; reusable UI</li>
            <li><i className="fas fa-handshake" aria-hidden="true"></i> Clear communication &amp; deadlines</li>
          </ul>
        </div>
        <div className="glass-card about-meta">
          <div className="meta-block">
            <span className="meta-label">Focus</span>
            <span className="meta-value">Web apps &amp; marketing sites</span>
          </div>
          <div className="meta-block">
            <span className="meta-label">Stack</span>
            <span className="meta-value">HTML · CSS · JS · React · Node</span>
          </div>
          <div className="meta-block">
            <span className="meta-label">Based in</span>
            <span className="meta-value">Remote / Worldwide</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;