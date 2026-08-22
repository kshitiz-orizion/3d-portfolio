import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ============================================================
   BLUEPRINT PORTFOLIO — placeholder content, swap freely:
   - name, role, tagline, about copy
   - PROJECTS array
   - contact email / links
   ============================================================ */

const PROJECTS = [
  {
    code: "FIG. 01",
    title: "Prism Study",
    year: "2025",
    medium: "WebGL / GLSL",
    desc: "A refracting light installation rebuilt as a browser sketch — real-time caustics driven by cursor position.",
  },
  {
    code: "FIG. 02",
    title: "Tidal Forms",
    year: "2024",
    medium: "Three.js / Physics",
    desc: "Procedural terrain that responds to simulated tide tables, rendered as a slowly breathing wireframe field.",
  },
  {
    code: "FIG. 03",
    title: "Glass Archive",
    year: "2024",
    medium: "WebXR",
    desc: "An archive of 40 scanned objects, viewable in AR — each one annotated like a museum specimen card.",
  },
  {
    code: "FIG. 04",
    title: "Nocturne Interface",
    year: "2023",
    medium: "Shader / Audio-reactive",
    desc: "A generative visualizer built for a single ambient album, matching frequency bands to particle depth.",
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

function HeroCanvas() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Core wireframe: icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xeaf4fb,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Inner accent shape: small torus knot, ember colored
    const knotGeo = new THREE.TorusKnotGeometry(0.55, 0.14, 90, 12);
    const knotMat = new THREE.MeshBasicMaterial({
      color: 0xff7a45,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    group.add(knot);

    // Faint outer shell
    const shellGeo = new THREE.IcosahedronGeometry(3.1, 0);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x9fb8cc,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const shell = new THREE.Mesh(shellGeo, shellMat);
    group.add(shell);

    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;

    function onMove(e) {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      targetX = (x - 0.5) * 0.9;
      targetY = (y - 0.5) * 0.9;
    }
    window.addEventListener("mousemove", onMove);

    let raf;
    const clock = new THREE.Clock();
    function animate() {
      const t = clock.getElapsedTime();
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      group.rotation.y = t * 0.12 + mouseX;
      group.rotation.x = t * 0.05 + mouseY;

      knot.rotation.y = -t * 0.35;
      knot.rotation.x = t * 0.2;

      shell.rotation.y = -t * 0.03;
      shell.rotation.x = t * 0.02;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    }
    animate();

    function onResize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      coreGeo.dispose();
      coreMat.dispose();
      knotGeo.dispose();
      knotMat.dispose();
      shellGeo.dispose();
      shellMat.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="hero-canvas" aria-hidden="true" />;
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
        <div className="project-glyph">
          <svg viewBox="0 0 80 80" width="100%" height="100%">
            <polygon
              points="40,6 74,26 74,54 40,74 6,54 6,26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.5"
            />
            <polygon
              points="40,20 60,32 60,48 40,60 20,48 20,32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <line x1="40" y1="6" x2="40" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <line x1="74" y1="26" x2="60" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <line x1="74" y1="54" x2="60" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <line x1="40" y1="74" x2="40" y2="60" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <line x1="6" y1="54" x2="20" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <line x1="6" y1="26" x2="20" y2="32" stroke="currentColor" strokeWidth="1" opacity="0.5" />
          </svg>
        </div>
        <div className="project-meta">
          <span className="project-code">{p.code}</span>
          <span className="project-year">{p.year}</span>
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

        .hero-canvas {
          width: 100%;
          height: 62vh;
          min-height: 380px;
          position: relative;
          z-index: 1;
        }

        .scroll-cue {
          position: absolute;
          bottom: 10px;
          left: 52px;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          color: var(--slate);
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 10px;
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
        }
      `}</style>

      <div className="crop tl" />
      <div className="crop tr" />
      <div className="crop bl" />
      <div className="crop br" />

      <div className="topbar">
        <span className="mark">MIRA VOSS &mdash; DES. 003</span>
        <nav>
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <span className="hero-eyebrow">3D &amp; Interactive Designer</span>
          <h1 className="hero-name">Mira<br />Voss</h1>
          <p className="hero-tagline">
            I build things you can walk around. Real-time scenes, generative
            visuals, and interfaces that behave more like objects than pages.
          </p>
          <div className="hero-actions">
            <a className="btn" href="#work">View Work</a>
            <a className="btn ghost" href="#contact">Get in touch</a>
          </div>
        </div>
        <HeroCanvas />
        <div className="scroll-cue">
          <span className="line" />
          SCROLL
        </div>
      </section>

      <section className="about" id="about">
        <RevealBlock>
          <span className="section-label">Fig. 00 &mdash; About</span>
          <div className="about-text">
            <p>
              I'm a designer and developer working at the edge of the browser
              and the built environment &mdash; spatial interfaces, real-time
              rendering, and installations that live somewhere between a
              website and a room. Based in Berlin, working with studios and
              independent artists worldwide.
            </p>
          </div>
        </RevealBlock>
        <RevealBlock className="about-facts">
          <div className="fact"><span>Currently</span><b>Freelance &mdash; open for Q1 2027</b></div>
          <div className="fact"><span>Tools</span><b>Three.js, WebGL, TouchDesigner, Blender</b></div>
          <div className="fact"><span>Based</span><b>Berlin, DE</b></div>
          <div className="fact"><span>Prior</span><b>Studio Lumen, independent since 2022</b></div>
        </RevealBlock>
      </section>

      <section className="work" id="work">
        <RevealBlock>
          <span className="section-label">Selected Work</span>
        </RevealBlock>
        <div className="project-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} p={p} index={i} />
          ))}
        </div>
      </section>

      <section className="contact" id="contact">
        <RevealBlock>
          <span className="section-label">Fig. 05 &mdash; Contact</span>
          <h2 className="contact-headline">
            Have a space or a screen that needs something built for it?{" "}
            <a href="mailto:hello@miravoss.studio">Let's talk &rarr;</a>
          </h2>
          <div className="title-block">
            <div className="cell">
              <span className="k">Email</span>
              <span className="v"><a href="mailto:hello@miravoss.studio">hello@miravoss.studio</a></span>
            </div>
            <div className="cell">
              <span className="k">Instagram</span>
              <span className="v"><a href="#">@miravoss.studio</a></span>
            </div>
            <div className="cell">
              <span className="k">GitHub</span>
              <span className="v"><a href="#">github.com/miravoss</a></span>
            </div>
            <div className="cell">
              <span className="k">Location</span>
              <span className="v">Berlin, DE &mdash; UTC+1</span>
            </div>
          </div>
          <div className="footer-note">DRAWN 2026 &nbsp;/&nbsp; SCALE 1:1 &nbsp;/&nbsp; ALL RIGHTS RESERVED</div>
        </RevealBlock>
      </section>
    </div>
  );
}