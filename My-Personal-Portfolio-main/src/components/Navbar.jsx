import { useEffect, useRef, useState } from "react";

const navigationItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" }
];

function Navbar() {
  const navbarRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    let frameId = 0;
    const sections = Array.from(document.querySelectorAll("main section[id]"));

    const updateNavigation = () => {
      frameId = 0;
      const navbar = navbarRef.current;
      if (!navbar) {
        return;
      }

      setScrolled(window.scrollY > 18);
      const marker = window.scrollY + (navbar.offsetHeight || 72) + 48;
      const active = sections.find((section) => marker >= section.offsetTop && marker < section.offsetTop + section.offsetHeight);
      setActiveSection(active?.id || "");
    };
    const scheduleNavigationUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateNavigation);
      }
    };

    const visibleFrameId = window.requestAnimationFrame(() => setNavVisible(true));
    scheduleNavigationUpdate();
    window.addEventListener("scroll", scheduleNavigationUpdate, { passive: true });
    window.addEventListener("resize", scheduleNavigationUpdate, { passive: true });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.cancelAnimationFrame(visibleFrameId);
      window.removeEventListener("scroll", scheduleNavigationUpdate);
      window.removeEventListener("resize", scheduleNavigationUpdate);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    if (!menuOpen) {
      return () => document.body.classList.remove("nav-open");
    }

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    const closeOutsideNavbar = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("click", closeOutsideNavbar);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("click", closeOutsideNavbar);
      document.body.classList.remove("nav-open");
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <nav
          className={`navbar${navVisible ? " nav-visible" : ""}${scrolled ? " scrolled" : ""}`}
          aria-label="Primary"
          ref={navbarRef}
        >
          <a href="#home" className="logo-container">
            <img src="/assets/LOGO-OFFICIAL.webp" alt="" className="nav-logo" width="40" height="40" />
            <span className="logo-text">Wahab Ahmad</span>
          </a>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            className={`mobile-menu-toggle${menuOpen ? " active" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="bar" aria-hidden="true"></span>
            <span className="bar" aria-hidden="true"></span>
            <span className="bar" aria-hidden="true"></span>
          </button>
          <ul className={`nav-links${menuOpen ? " active" : ""}`} id="primary-nav">
            {navigationItems.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className={activeSection === href.slice(1) ? "active-link" : undefined}
                  onClick={closeMenu}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}

export default Navbar;