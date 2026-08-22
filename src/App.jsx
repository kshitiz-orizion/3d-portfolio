import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { FaBook, FaHospital, FaMouse, FaMusic, FaShip } from "react-icons/fa";
import { FaHouse, FaNoteSticky } from "react-icons/fa6";
import { FcSurvey } from "react-icons/fc";

/* ============================================================
   BLUEPRINT PORTFOLIO — placeholder content, swap freely:
   - name, role, tagline, about copy
   - PROJECTS array
   - contact email / links
   ============================================================ */

const PROJECTS = [
  {
    code: "FIG. 01",
    title: "Cruise Booking Platform",
    year: "Oct 2025 — Present",
    medium: "Royal Cyber Inc.",
    desc: "Built the customer-facing site for a major cruise line — end-to-end booking flow, responsive UI, and performance work — plus a CMS-driven admin panel with notifications and content tooling.",
    icon: FaShip
  },
  {
    code: "FIG. 02",
    title: "Condé Nast Brand Sites",
    year: "Jun — Dec 2023",
    medium: "Condé Nast Technology Labs",
    desc: "Rebuilt 404 pages across Vogue.com, Allure.com, TeenVogue.com, and them.us from the ground up, cutting load time from 1000ms to 500ms for a ~1.5B MAU audience, with 100% test coverage.",
    icon: FaBook
  },
  {
    code: "FIG. 03",
    title: "Performance & Engagement",
    year: "Jun 2021 — Mar 2023",
    medium: "Housing.com",
    desc: "Pushed 70% of pages into Google's 'Good' performance tier for 500M MAUs, lifted App Store rating 4.0 → 4.7, and integrated MoEngage, QuickBlox Chat, and WhatsApp for ~50M users.",
    icon: FaHouse
  },
  {
    code: "FIG. 04",
    title: "Telehealth Platform",
    year: "Mar 2020 — Feb 2021",
    medium: "Navia Life Care",
    desc: "Led frontend for a virtual-consultation product — patient interface, appointment scheduling, and EMR prescriptions — driving roughly 200% growth in active users.",
    icon: FaHospital
  },
  {
    code: "FIG. 05",
    title: "Atlassian Plugins & Extensions",
    year: "Mar 2019 — Mar 2020",
    medium: "Quarks Technosoft",
    desc: "Built JIRA and Confluence plugins plus cross-browser extensions (Chrome, Firefox, Edge, IE), reaching ~4,000 installs and helping land ~$4M in client revenue.",
    icon: FaNoteSticky
  },
  {
    code: "FIG. 06",
    title: "Multi-Stream Learning Tool",
    year: "Jun 2018 — Feb 2019",
    medium: "KindKonnect Technologies",
    desc: "Shipped a synchronized video + 3–4 channel audio streaming page for music students, on a project that went on to receive a Global AI AICRA award.",
    icon: FaMusic
  },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ------------------------------------------------------------
   Hero avatar — now the real R3F Experience component (Avatar +
   Sky + Environment + ContactShadows + ground mesh), mounted
   inside its own <Canvas>. This fully replaces the old
   procedural wireframe mannequin; the ground mesh / lighting /
   contact shadows already live inside <Experience />, untouched.
   ------------------------------------------------------------ */

function HeroCanvas() {
  return (
    <div className="hero-canvas-wrap">
      <Canvas
        className="hero-canvas"
        shadows
        camera={{ position: [0, 1, 6], fov: 30 }}
      >
        <color attach="background" args={["#0e3a5c"]} />
        <Experience />
      </Canvas>
    </div>
  );
}


function ProjectCard({ p, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [ref, visible] = useReveal();

  function onMouseMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  }
  function onMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      ref={(node) => {
        cardRef.current = node;
        ref.current = node;
      }}
      className={`project-card ${visible ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 90}ms` }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="project-card-inner"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div className="project-container">
          <div className="project-glyph">
            {<p.icon color="var(--ember)" />}
          </div>
          <div className="project-meta">
            <span className="project-code">{ }</span>
            <span className="project-year">{p.year}</span>
          </div>
        </div>
        <h3 className="project-title">{p.title}</h3>
        <p className="project-desc">{p.desc}</p>
        <span className="project-medium">{p.medium}</span>
      </div>
    </div>
  );
}

function RevealBlock({ children, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`${className} reveal ${visible ? "is-visible" : ""}`}>
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`bp-root ${loaded ? "loaded" : ""}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --ink-bg: #0e3a5c;
          --ink-bg-deep: #082a45;
          --line: #eaf4fb;
          --grid-line: rgba(234,244,251,0.09);
          --grid-line-strong: rgba(234,244,251,0.16);
          --ember: #ff7a45;
          --slate: #9fb8cc;
        }

        .bp-root {
          background: var(--ink-bg);
          color: var(--line);
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .bp-root.loaded { opacity: 1; }

        .bp-root * { box-sizing: border-box; }

        .bp-root::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image:
            linear-gradient(var(--grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
          background-size: 44px 44px;
          z-index: 0;
        }

        .crop {
          position: fixed;
          width: 18px;
          height: 18px;
          border-color: var(--slate);
          opacity: 0.6;
          z-index: 5;
          pointer-events: none;
        }
        .crop.tl { top: 20px; left: 20px; border-top: 1px solid; border-left: 1px solid; }
        .crop.tr { top: 20px; right: 20px; border-top: 1px solid; border-right: 1px solid; }
        .crop.bl { bottom: 20px; left: 20px; border-bottom: 1px solid; border-left: 1px solid; }
        .crop.br { bottom: 20px; right: 20px; border-bottom: 1px solid; border-right: 1px solid; }

        section { position: relative; z-index: 1; }

        .topbar {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 28px 52px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: var(--slate);
        }
        .topbar .mark { color: var(--line); font-weight: 500; }
        .topbar nav { display: flex; gap: 28px; }
        .topbar nav a { color: var(--slate); text-decoration: none; transition: color 0.2s ease; }
        .topbar nav a:hover, .topbar nav a:focus-visible { color: var(--ember); }

        /* HERO */
        .hero {
          position: relative;
          min-height: 88vh;
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          align-items: center;
          padding: 0 52px;
          gap: 24px;
        }
        .hero-copy { position: relative; z-index: 2; }
        .hero-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          color: var(--ember);
          text-transform: uppercase;
          display: block;
          margin-bottom: 22px;
        }
        .hero-name {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(2.6rem, 6vw, 5.4rem);
          line-height: 0.98;
          margin: 0 0 22px 0;
          letter-spacing: -0.01em;
        }
        .hero-tagline {
          font-size: 1.05rem;
          color: var(--slate);
          max-width: 440px;
          line-height: 1.6;
          margin: 0 0 34px 0;
        }
        .hero-actions { display: flex; gap: 16px; align-items: center; }
        .btn {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.06em;
          text-decoration: none;
          padding: 13px 22px;
          border: 1px solid var(--line);
          color: var(--line);
          transition: all 0.2s ease;
          display: inline-block;
        }
        .btn:hover, .btn:focus-visible { background: var(--line); color: var(--ink-bg-deep); }
        .btn.ghost { border-color: var(--grid-line-strong); color: var(--slate); }
        .btn.ghost:hover, .btn.ghost:focus-visible { border-color: var(--ember); color: var(--ember); background: transparent; }

        .hero-canvas-wrap {
          position: relative;
          z-index: 1;
          height: 62vh;
          min-height: 380px;
        }
        .hero-canvas { width: 100%; height: 100%; }
        .hero-canvas-caption {
          position: absolute;
          bottom: 4px;
          right: 4px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.08em;
          color: var(--slate);
          opacity: 0.65;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--grid-line-strong);
          border: 1px solid var(--grid-line-strong);
          margin-bottom: 60px;
        }
        .skill-col {
          background: var(--ink-bg);
          padding: 26px 24px;
        }
        .skill-cat {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ember);
          margin-bottom: 12px;
        }
        .skill-col p {
          color: var(--slate);
          font-size: 0.88rem;
          line-height: 1.6;
          margin: 0;
        }

        .scroll-cue {
  position: absolute;
  bottom: 10px;
  left: 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  color: var(--slate);
  letter-spacing: 0.1em;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  justify-content: center;

  animation: bounce 2s infinite;
}
  @keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }

  40% {
    transform: translateY(-10px);
  }

  60% {
    transform: translateY(-5px);
  }
}
        .scroll-cue .line { width: 32px; height: 1px; background: var(--slate); }

        /* SECTION LABEL */
        .section-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          color: var(--ember);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
        }
        .section-label::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--grid-line-strong);
        }

        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.is-visible { opacity: 1; transform: translateY(0); }

        /* ABOUT */
        .about {
          padding: 120px 52px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 64px;
          border-top: 1px solid var(--grid-line-strong);
        }
        .about-text p {
          font-size: 1.2rem;
          line-height: 1.7;
          color: var(--line);
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 400;
          max-width: 620px;
        }
        .about-facts {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: var(--slate);
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .about-facts .fact { display: flex; justify-content: space-between; border-bottom: 1px dashed var(--grid-line-strong); padding-bottom: 12px; }
        .about-facts .fact b { color: var(--line); font-weight: 500; }

        /* WORK */
        .work { padding: 40px 52px 120px; border-top: 1px solid var(--grid-line-strong); }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--grid-line-strong);
          border: 1px solid var(--grid-line-strong);
        }
        .project-card { background: var(--ink-bg); perspective: 900px; opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .project-card.is-visible { opacity: 1; transform: translateY(0); }
        .project-card-inner {
          padding: 40px;
          height: 100%;
          transition: transform 0.15s ease-out;
          transform-style: preserve-3d;
        }
        .project-container{display: flex; justify-content: space-between;}
        .project-glyph { width: 46px; height: 46px; color: var(--slate); margin-bottom: 26px; }
        .project-meta { display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--ember); letter-spacing: 0.08em; margin-bottom: 14px; }
        .project-title { font-family: 'Space Grotesk', sans-serif; font-size: 1.6rem; font-weight: 600; margin: 0 0 12px 0; }
        .project-desc { color: var(--slate); font-size: 0.94rem; line-height: 1.6; margin: 0 0 20px 0; max-width: 420px; }
        .project-medium { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--slate); letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.8; }

        /* CONTACT / TITLE BLOCK */
        .contact { border-top: 1px solid var(--grid-line-strong); padding: 100px 52px 60px; }
        .contact-headline {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: clamp(2rem, 4.4vw, 3.6rem);
          line-height: 1.05;
          max-width: 780px;
          margin: 0 0 44px 0;
        }
        .contact-headline a { color: var(--ember); text-decoration: none; border-bottom: 1px solid currentColor; }
        .contact-headline a:hover, .contact-headline a:focus-visible { color: var(--line); }

        .title-block {
          margin-top: 60px;
          border: 1px solid var(--grid-line-strong);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .title-block .cell {
          padding: 16px 20px;
          border-right: 1px solid var(--grid-line-strong);
          font-family: 'IBM Plex Mono', monospace;
        }
        .title-block .cell:last-child { border-right: none; }
        .title-block .cell .k { display: block; font-size: 10px; color: var(--slate); letter-spacing: 0.1em; margin-bottom: 6px; text-transform: uppercase; }
        .title-block .cell .v { font-size: 13px; color: var(--line); }
        .title-block .cell a { color: var(--line); text-decoration: none; }
        .title-block .cell a:hover, .title-block .cell a:focus-visible { color: var(--ember); }

        .footer-note {
          margin-top: 40px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--slate);
          opacity: 0.6;
          letter-spacing: 0.05em;
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .project-card { transition: none !important; opacity: 1 !important; transform: none !important; }
        }

        @media (max-width: 900px) {
          .topbar { padding: 20px 24px; }
          .topbar nav { display: none; }
          .hero { grid-template-columns: 1fr; padding: 0 24px; min-height: auto; padding-top: 60px; padding-bottom: 40px; }
          .hero-canvas { height: 320px; order: -1; }
          .scroll-cue { display: none; }
          .about { grid-template-columns: 1fr; padding: 70px 24px; gap: 36px; }
          .work { padding: 20px 24px 70px; }
          .project-grid { grid-template-columns: 1fr; }
          .contact { padding: 70px 24px 40px; }
          .title-block { grid-template-columns: repeat(2, 1fr); }
          .title-block .cell:nth-child(2) { border-right: none; }
          .skills-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="crop tl" />
      <div className="crop tr" />
      <div className="crop bl" />
      <div className="crop br" />

      <div className="topbar">
        <span className="mark"></span>
        <nav>
          <a href="#work">Experience</a>
          <a href="#stack">Stack</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">Frontend Engineer</span>
          <h1 className="hero-name">Kshitiz</h1>
          <p className="hero-tagline">
            6+ years building scalable, high-performance web and mobile
            products with React, TypeScript, and Node.js &mdash; from
            AI-powered developer tools to platforms serving hundreds of
            millions of users.
          </p>
          <div className="hero-actions">
            <a className="btn" href="#work">View Experience</a>
            <a className="btn ghost" href="#contact">Get in touch</a>
          </div>
        </div>
        <HeroCanvas />
        <div className="scroll-cue">
          <FaMouse color="var(--ember)" />
        </div>
      </section>

      <section className="about" id="about">
        <RevealBlock>
          <span className="section-label">About</span>
          <div className="about-text">
            <p>
              Senior frontend-focused engineer with a track record of
              architecting customer-facing platforms and leading
              cross-functional teams, from healthcare and real estate to
              media and travel. Recent focus on building AI-powered tooling
              with Claude, OpenAI, and Gemini to speed up how teams ship
              software.
            </p>
          </div>
        </RevealBlock>
        <RevealBlock className="about-facts">
          <div className="fact"><span>Currently</span><b>Sr. Software Engineer, Royal Cyber Inc.</b></div>
          <div className="fact"><span>Core Stack</span><b>React, React Native, TypeScript, Node.js</b></div>
          <div className="fact"><span>Based</span><b>Bangalore, Karnataka</b></div>
          <div className="fact"><span>Education</span><b>B.E. Information Science, VTU '15</b></div>
        </RevealBlock>
      </section>

      <section className="work" id="stack">
        <RevealBlock>
          <span className="section-label">Stack</span>
        </RevealBlock>
        <div className="skills-grid">
          <div className="skill-col">
            <span className="skill-cat">Frontend</span>
            <p>React, React Native, TypeScript, JavaScript, HTML5 / CSS3, WCAG accessibility, JAWS, web performance</p>
          </div>
          <div className="skill-col">
            <span className="skill-cat">Backend &amp; Cloud</span>
            <p>Node.js, Express.js, REST, GraphQL, MongoDB, Firebase, AWS, Docker, Kubernetes, CI/CD</p>
          </div>
          <div className="skill-col">
            <span className="skill-cat">AI &amp; Productivity</span>
            <p>Anthropic Claude, OpenAI, Azure OpenAI, Google Gemini, GitHub Copilot, prompt engineering</p>
          </div>
          <div className="skill-col">
            <span className="skill-cat">Testing &amp; Process</span>
            <p>Jest, RTL, Enzyme, Mocha, JMeter, Agile / Scrum, Jira, Confluence, system design</p>
          </div>
        </div>
      </section>

      <section className="work" id="work">
        <RevealBlock>
          <span className="section-label">Experience</span>
        </RevealBlock>
        <div className="project-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} p={p} index={i} />
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <RevealBlock>
          <span className="section-label">Contact</span>
          <h2 className="contact-headline">
            Building something that needs a frontend engineer who can also
            ship the backend?{" "}
            <a href="mailto:kshitiz.orizion@gmail.com">Let's talk &rarr;</a>
          </h2>
          <div className="title-block">
            <div className="cell">
              <span className="k">Email</span>
              <span className="v"><a href="mailto:kshitiz.orizion@gmail.com">kshitiz.orizion@gmail.com</a></span>
            </div>
            <div className="cell">
              <span className="k">Linkedin</span>
              <span className="v"><a href="https://www.linkedin.com/in/kshitiz-orizion">https://www.linkedin.com/in/kshitiz-orizion</a></span>
            </div>
            <div className="cell">
              <span className="k">GitHub</span>
              <span className="v"><a href="https://github.com/kshitiz-orizion">https://github.com/kshitiz-orizion</a></span>
            </div>
            <div className="cell">
              <span className="k">Location</span>
              <span className="v">Bangalore, Karnataka, IN</span>
            </div>
          </div>
          <div className="footer-note">DRAWN 2026 &nbsp;/&nbsp; SCALE 1:1 &nbsp;/&nbsp; ALL RIGHTS RESERVED</div>
        </RevealBlock>
      </section>
    </div>
  );
}