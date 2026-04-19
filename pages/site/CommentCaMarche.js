"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Great_Vibes } from "next/font/google";
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function CommentCaMarche() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      title: "👥 Membres",
      steps: [
        "Ajouter une personne",
        "Apparaît dans la liste des membres",
        "Envoyer en suivi (cellule / conseiller)",
        "Suivi actif par responsable",
        "Analyse & rapport",
      ],
    },
    {
      title: "✝️ Évangélisation",
      steps: [
        "Ajouter un contact",
        "Qualifier (visiteur, âme gagnée…)",
        "Assigner à un conseiller",
        "Suivi des interactions",
        "Conversion / baptême",
      ],
    },
    {
      title: "🏠 Cellules",
      steps: [
        "Créer une cellule",
        "Ajouter responsables",
        "Affecter membres",
        "Suivi des présences",
        "Rapport par cellule",
      ],
    },
    {
      title: "🧭 Conseillers",
      steps: [
        "Créer un conseiller",
        "Attribuer des membres",
        "Suivi personnalisé",
        "Notes & actions",
        "Rapport conseiller",
      ],
    },
    {
      title: "📊 Rapports",
      steps: [
        "Collecte automatique",
        "Analyse par cellule",
        "Analyse par conseiller",
        "Vision globale",
        "Décision stratégique",
      ],
    },
  ];

  return (
    <div style={{ background: "#333699", minHeight: "100vh", position: "relative" }}>

      {/* GLOW */}
      <div style={{
        position: "absolute",
        width: "800px",
        height: "800px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.13) 0%, transparent 65%)",
        top: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }} />

      {/* HEADER */}
      <header style={{
        background: scrolled ? "rgba(51,54,153,0.92)" : "transparent",
        borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid transparent",
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
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div onClick={() => router.push("/site/HomePage")} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <Image src="/logo.png" alt="SoulTrack" width={50} height={50} />
            <span style={{ color: "#fff", fontSize: "22px", fontFamily: "'Great Vibes', cursive" }}>SoulTrack</span>
          </div>

          <nav style={{ display: "flex", gap: "32px" }}>
            {navItems.map((item) => (
              <span key={item.path} onClick={() => router.push(item.path)}
                style={{ color: item.path === "/CommentCaMarche" ? "#fbbf24" : "rgba(255,255,255,0.7)", cursor: "pointer" }}>
                {item.label}
              </span>
            ))}
          </nav>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => router.push("/login")} style={{ background: "transparent", color: "#fbbf24", border: "1px solid rgba(255,255,255,0.3)", padding: "7px 18px", borderRadius: "8px" }}>
              Connexion
            </button>
            <button onClick={() => router.push("/SignupEglise")} style={{ background: "#fff", color: "#333699", padding: "7px 18px", borderRadius: "8px" }}>
              Créer mon église
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "80px 24px" }}>
        <h1 style={{ color: "#fff", fontSize: "40px", marginBottom: "20px" }}>
          Comment ça marche
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "0 auto" }}>
          Une structure claire pour suivre chaque âme et piloter votre église avec précision.
        </p>
      </section>

      {/* MODULES */}
      <section style={{ padding: "40px 24px 100px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "80px" }}>
          {modules.map((module, idx) => (
            <div key={idx}>

              <h2 style={{ color: "#fbbf24", fontSize: "22px", marginBottom: "40px", textAlign: "center" }}>
                {module.title}
              </h2>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>

                {/* LINE */}
                <div style={{
                  position: "absolute",
                  top: "22px",
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: "rgba(255,255,255,0.2)",
                }} />

                {module.steps.map((step, i) => (
                  <div key={i} style={{ width: "18%", textAlign: "center", position: "relative" }}>

                    {/* CIRCLE */}
                    <div style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.3)",
                      margin: "0 auto 12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: 600,
                      background: i === 0 ? "#fbbf24" : "transparent",
                    }}>
                      {i + 1}
                    </div>

                    <p style={{
                      color: "#fff",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      opacity: 0.8,
                    }}>
                      {step}
                    </p>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "20px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
        © {new Date().getFullYear()} SoulTrack
      </footer>
    </div>
  );
}
