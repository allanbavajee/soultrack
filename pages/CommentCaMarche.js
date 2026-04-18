"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";

export default function CommentCaMarche() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

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

  const flows = [
    {
      icon: "👥",
      title: "MODULE MEMBRES",
      steps: [
        "➕ Ajouter un membre",
        "📂 Ajout dans la base automatiquement",
        "🧭 Attribution conseiller ou cellule",
        "👥 Suivi personnalisé",
        "📊 Rapport d’engagement"
      ],
      accent: "rgba(55,138,221,0.5)"
    },
    {
      icon: "✝️",
      title: "MODULE ÉVANGÉLISATION",
      steps: [
        "➕ Ajouter une nouvelle âme",
        "📲 Envoi WhatsApp automatique",
        "🧭 Attribution conseiller / cellule",
        "👥 Suivi progression (visité → converti → baptisé)",
        "📊 Rapport conversion"
      ],
      accent: "rgba(251,191,36,0.4)"
    },
    {
      icon: "🏠",
      title: "MODULE CELLULES",
      steps: [
        "➕ Créer une cellule",
        "👥 Ajouter membres",
        "🧭 Nommer un responsable",
        "📅 Suivi hebdomadaire",
        "📊 Rapport cellule"
      ],
      accent: "rgba(29,158,117,0.45)"
    },
    {
      icon: "🧭",
      title: "MODULE CONSEILLERS",
      steps: [
        "➕ Créer un conseiller",
        "👥 Assigner membres",
        "📞 Suivi individuel",
        "📝 Notes & accompagnement",
        "📊 Rapport performance"
      ],
      accent: "rgba(127,119,221,0.5)"
    },
    {
      icon: "📊",
      title: "MODULE RAPPORTS",
      steps: [
        "📥 Données automatiques",
        "📈 Analyse croissance",
        "📉 Détection pertes",
        "🧠 Vision par cellule / conseiller",
        "📊 Dashboard global église"
      ],
      accent: "rgba(212,83,126,0.4)"
    }
  ];

  return (
    <div style={{ background: "#333699", minHeight: "100vh", position: "relative" }}>

      {/* GLOW */}
      <div style={{
        position: "absolute",
        width: "800px",
        height: "800px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 70%)",
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
        background: "radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)",
        top: "700px",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }} />

      {/* HEADER IDENTIQUE STYLE CONTACT */}
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
          alignItems: "center"
        }}>
          <div onClick={() => router.push("/site/HomePage")} style={{ display: "flex", gap: "6px", cursor: "pointer" }}>
            <Image src="/logo.png" alt="SoulTrack" width={50} height={50} />
            <span style={{ color: "#fff", fontSize: "22px", fontFamily: "'Great Vibes', cursive" }}>SoulTrack</span>
          </div>

          <nav style={{ display: "flex", gap: "30px" }} className="nav-hide">
            {navItems.map((item) => (
              <span key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  color: item.path === "/CommentCaMarche" ? "#fbbf24" : "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  fontSize: "14px"
                }}>
                {item.label}
              </span>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "80px 24px 40px" }}>
        <h1 style={{ color: "#fff", fontSize: "2.8rem", fontWeight: 500 }}>
          Comment fonctionne SoulTrack ?
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "15px auto" }}>
          Un système structuré pour suivre chaque âme, chaque cellule et chaque responsable.
        </p>
      </section>

      {/* FLOW */}
      <section style={{ padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>

          {flows.map((flow, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: "18px",
              padding: "24px",
              position: "relative"
            }}>

              <div style={{
                position: "absolute",
                top: "-40px",
                left: "-40px",
                width: "160px",
                height: "160px",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${flow.accent} 0%, transparent 70%)`
              }} />

              <div style={{ position: "relative" }}>
                <div style={{ fontSize: "22px", marginBottom: "10px" }}>{flow.icon}</div>

                <h2 style={{ color: "#fff", fontSize: "16px", marginBottom: "12px" }}>
                  {flow.title}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {flow.steps.map((s, idx) => (
                    <div key={idx} style={{ color: "rgba(255,255,255,0.65)", fontSize: "14px" }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "40px 24px 80px" }}>
        <button
          onClick={() => router.push("/SignupEglise")}
          style={{
            background: "#fff",
            color: "#333699",
            padding: "14px 32px",
            borderRadius: "10px",
            fontWeight: 600,
            border: "none",
            cursor: "pointer"
          }}
        >
          🚀 Commencer maintenant
        </button>
      </section>

      <Footer />
    </div>
  );
}
