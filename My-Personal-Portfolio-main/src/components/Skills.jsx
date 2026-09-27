import { useEffect, useRef, useState } from "react";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const skills = [
  { key: "html", name: "HTML", label: "HTML & semantics", percentage: 95 },
  { key: "css", name: "CSS", label: "CSS / responsive layout", percentage: 92 },
  { key: "js", name: "JavaScript", label: "JavaScript (ES6+)", percentage: 88 },
  { key: "react", name: "React", label: "React", percentage: 85 },
  { key: "node", name: "Node.js", label: "Node.js", percentage: 80 },
  { key: "mongo", name: "MongoDB", label: "MongoDB", percentage: 78 },
  { key: "sql", name: "SQL", label: "SQL", percentage: 76 }
];

function Skills() {
  const skillsRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeSkill, setActiveSkill] = useState(null);

  useEffect(() => {
    const rows = skillsRef.current?.querySelectorAll(".skill-row");
    if (!rows?.length) {
      return undefined;
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      rows.forEach((row) => row.classList.add("is-visible"));
      return undefined;
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
    rows.forEach((row) => observer.observe(row));

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section id="skills" className="section skills reveal-on-scroll" ref={skillsRef}>
      <div className="section-head">
        <p className="eyebrow">Skills</p>
        <h2>Tools I ship with</h2>
        <p className="section-lead">
          Interactive proficiency bars — tap a badge to spotlight a skill (reduced motion respects your OS
          settings).
        </p>
      </div>
      <div className="skills-badges" role="group" aria-label="Highlight a skill">
        {skills.map((skill) => (
          <button
            key={skill.key}
            type="button"
            className={`skill-badge${activeSkill === skill.key ? " is-active" : ""}`}
            data-skill={skill.key}
            aria-pressed={activeSkill === skill.key}
            onClick={() => setActiveSkill((current) => current === skill.key ? null : skill.key)}
          >
            {skill.name}
          </button>
        ))}
      </div>
      <div className="skills-panel glass-card">
        <div className="skill-rows">
          {skills.map((skill) => (
            <div
              className={`skill-row${activeSkill && activeSkill !== skill.key ? " dimmed" : ""}`}
              data-skill-row={skill.key}
              key={skill.key}
            >
              <div className="skill-row-top">
                <span>{skill.label}</span>
                <span className="skill-pct">{skill.percentage}%</span>
              </div>
              <div className="skill-track" role="presentation">
                <div className="skill-fill" style={{ "--fill": `${skill.percentage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;