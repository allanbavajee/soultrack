"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CommentCaMarche() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const stepsRef = useRef([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Accueil", path: "/site/HomePage" },
    { label: "Process", path: "/CommentCaMarche" },
    { label: "À propos", path: "/about" },
    { label: "Pricing", path: "/pricing" },
    { label: "Contact", path: "/contact" },
  ];

  const modules = [
    {
      title: "Membres",
      desc: "Ajouter une personne → base centralisée → assignation conseiller ou cellule → suivi complet",
    },
    {
      title: "Évangélisation",
      desc: "Nouvelle âme → WhatsApp → suivi progression → conversion → baptême",
    },
    {
      title: "Cellules",
      desc: "Créer cellule → ajouter membres → responsable → suivi hebdomadaire",
    },
    {
      title: "Conseillers",
      desc: "Créer conseiller → assignation → suivi individuel → accompagnement",
    },
    {
      title: "Rapports",
      desc: "Données automatiques → analyse cellule → analyse conseiller → vision globale",
    },
  ];

  // Scroll detection (highlight step)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      stepsRef.current.forEach((el, index) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.5) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ background: "#333699", minHeight: "100vh", position: "relative" }}>

      {/* GLOW */}
      <div style={{
        position: "absolute",
        width: "800px",
        height: "800px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 65%)",
        top: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }} />

      <div style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)",
        top: "600px",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }} />

      {/* HEADER (copié fidèle ton style) */}
      <header style={{
        background: scrolled ? "rgba(51,54,153,0.92)" : "transparent",
        borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.15)" : "none",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "22px 24px",
          height: "88px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>

          <div onClick={() => router.push("/site/HomePage")} style={{ display: "flex", gap: "6px", cursor: "pointer" }}>
            <Image src="/logo.png" width={50} height={50} />
            <span style={{ color: "#fff", fontSize: "22px", fontFamily: "'Great Vibes', cursive" }}>
              SoulTrack
            </span>
          </div>

          <nav style={{ display: "flex", gap: "32px" }}>
            {navItems.map((i) => (
              <span key={i.path}
                onClick={() => router.push(i.path)}
                style={{
                  color: i.path === "/CommentCaMarche" ? "#fbbf24" : "rgba(255,255,255,0.7)",
                  fontSize: "14px",
                  cursor: "pointer"
                }}>
                {i.label}
              </span>
            ))}
          </nav>

        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "70px 24px 40px" }}>
        <h1 style={{ color: "#fff", fontSize: "42px", fontWeight: 500 }}>
          Comment fonctionne <span style={{ color: "#fbbf24" }}>SoulTrack</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "600px", margin: "10px auto" }}>
          Un système structuré pour suivre chaque âme, cellule et responsable avec précision.
        </p>
      </section>

      {/* TIMELINE HORIZONTAL STYLE (comme ton image) */}
      <section style={{ padding: "60px 24px 120px", overflowX: "auto" }}>
        <div style={{
          display: "flex",
          gap: "80px",
          minWidth: "1100px",
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative"
        }}>

          {/* ligne horizontale */}
          <div style={{
            position: "absolute",
            top: "28px",
            left: 0,
            right: 0,
            height: "1px",
            background: "rgba(255,255,255,0.2)"
          }} />

          {modules.map((m, i) => (
            <div
              key={i}
              ref={el => stepsRef.current[i] = el}
              style={{
                flex: 1,
                textAlign: "center",
                position: "relative"
              }}
            >

              {/* circle */}
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                margin: "0 auto 14px",
                background: activeStep >= i ? "#fbbf24" : "transparent",
                border: "2px solid #fbbf24",
                color: activeStep >= i ? "#333699" : "#fbbf24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                transition: "all 0.3s"
              }}>
                {i + 1}
              </div>

              {/* content */}
              <h3 style={{ color: "#fff", fontSize: "15px", marginBottom: "8px" }}>
                {m.title}
              </h3>

              <p style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                lineHeight: 1.6
              }}>
                {m.desc}
              </p>

            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "40px 24px 100px" }}>
        <button
          onClick={() => router.push("/SignupEglise")}
          style={{
            background: "#fff",
            color: "#333699",
            padding: "14px 34px",
            borderRadius: "10px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer"
          }}
        >
          🚀 Commencer maintenant
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.1)",
        padding: "20px",
        textAlign: "center",
        color: "rgba(255,255,255,0.4)"
      }}>
        © {new Date().getFullYear()} SoulTrack
      </footer>

    </div>
  );
}
