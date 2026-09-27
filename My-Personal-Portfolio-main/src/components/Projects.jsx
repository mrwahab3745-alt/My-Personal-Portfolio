const projects = [
  {
    id: "email-signature",
    title: "Creative email signature",
    description: "Clickable, branded signature with social links and a polished corporate look.",
    image: "/assets/Email_temp.webp",
    imageAlt: "Creative email signature preview",
    imageWidth: 967,
    imageHeight: 491,
    badges: ["HTML", "CSS", "JavaScript"],
    actions: [
      { label: "Live demo", href: "https://mrwahab3745-alt.github.io/Email-Template/#", style: "primary" },
      { label: "Source", href: "https://github.com/mrwahab3745-alt", style: "ghost" }
    ]
  },
  {
    id: "bmw-portfolio",
    title: "BMW themed portfolio",
    description: "Cinematic, dark UI with bold typography and immersive hero treatments.",
    image: "/assets/Portfolio_img.webp",
    imageAlt: "BMW themed portfolio preview",
    imageWidth: 1920,
    imageHeight: 885,
    badges: ["HTML", "CSS", "JavaScript", "GSAP"],
    actions: [
      { label: "Live demo", href: "https://mrwahab3745-alt.github.io/BMW_Themed_Portfolio/", style: "primary" },
      { label: "Source", href: "https://github.com/mrwahab3745-alt", style: "ghost" }
    ]
  },
  {
    id: "landing-page",
    title: "Landing page",
    description: "High-conversion layout with trust blocks, CTAs, and a minimal modern aesthetic.",
    image: "/assets/Landing_Page.webp",
    imageAlt: "Landing page preview",
    imageWidth: 1920,
    imageHeight: 881,
    badges: ["HTML", "CSS", "JavaScript"],
    actions: [
      { label: "Live demo", href: "https://mrwahab3745-alt.github.io/Landing-Page/", style: "primary" },
      { label: "Source", href: "https://github.com/mrwahab3745-alt", style: "ghost" }
    ]
  },
  {
    id: "car-showroom",
    title: "Car showroom management",
    description: "Inventory-focused workflow concept: listings, status, and showroom-ready presentation layer.",
    placeholderClass: "ph-emerald",
    placeholderIcon: "fas fa-car",
    placeholderLabel: "Car showroom system",
    badges: ["React", "Node.js", "MongoDB"],
    actions: [
      { label: "Live demo", href: "https://github.com/mrwahab3745-alt", style: "primary", title: "Replace with your live deployment URL" },
      { label: "Source", href: "https://github.com/mrwahab3745-alt", style: "ghost", title: "Replace with your repository URL" }
    ]
  },
  {
    id: "digital-clock",
    title: "Digital clock",
    description: "A sleek real-time clock UI — ideal for practicing DOM updates, theming, and responsive layout.",
    placeholderClass: "ph-violet",
    placeholderIcon: "fas fa-clock",
    placeholderLabel: "Digital clock",
    badges: ["HTML", "CSS", "JavaScript"],
    actions: [
      { label: "Live demo", href: "https://github.com/mrwahab3745-alt", style: "primary", title: "Replace with your live deployment URL" },
      { label: "Source", href: "https://github.com/mrwahab3745-alt", style: "ghost", title: "Replace with your repository URL" }
    ]
  }
];

function Projects() {
  return (
    <section id="projects" className="section projects reveal-on-scroll">
      <div className="section-head">
        <p className="eyebrow">Projects</p>
        <h2>Selected work</h2>
        <p className="section-lead">Hover a card for depth, glow, and quick actions.</p>
      </div>
      <div className="project-grid">
        {projects.map((project) => (
          <article className="project-card glass-card" key={project.id}>
            <div className={project.image ? "project-media" : `project-media project-media--placeholder ${project.placeholderClass}`}>
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  width={project.imageWidth}
                  height={project.imageHeight}
                  loading="lazy"
                />
              ) : (
                <>
                  <span className="ph-icon" aria-hidden="true"><i className={project.placeholderIcon}></i></span>
                  <span className="ph-label">{project.placeholderLabel}</span>
                </>
              )}
            </div>
            <div className="project-body">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-badges">
                {project.badges.map((badge) => <span className="tech-badge" key={badge}>{badge}</span>)}
              </div>
              <div className="project-actions">
                {project.actions.map((action) => (
                  <a
                    className={`btn btn-sm btn-${action.style}`}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={action.title}
                    key={action.label}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;