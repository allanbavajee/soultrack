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

  const steps = [
    {
      icon: "🏛️",
      title: "Créer votre structure",
      desc: "Créez votre église ou simplement vos cellules. Ajoutez vos responsables et organisez votre ministère.",
      accent: "rgba(55,138,221,0.5)",
    },
    {
      icon: "👥",
      title: "Ajouter vos membres",
      desc: "Ajoutez ou importez vos membres. Chaque personne possède une fiche complète avec historique.",
      accent: "rgba(127,119,221,0.5)",
    },
    {
      icon: "✝️",
      title: "Ajouter une nouvelle âme",
      desc: "Ajoutez une personne rencontrée et envoyez un message WhatsApp directement. Elle apparaît dans les suivis.",
      accent: "rgba(239,159,39,0.4)",
    },
    {
      icon: "🧭",
      title: "Suivi par conseiller",
      desc: "Attribuez chaque personne à un conseiller pour un accompagnement personnalisé et structuré.",
      accent: "rgba(29,158,117,0.45)",
    },
    {
      icon: "🏠",
      title: "Organiser les cellules",
      desc: "Créez vos cellules, ajoutez les membres et suivez les présences chaque semaine.",
      accent: "rgba(93,202,165,0.45)",
    },
    {
      icon: "📅",
      title: "Suivre les présences",
      desc: "Visualisez qui est présent, absent et identifiez rapidement les personnes à relancer.",
      accent: "rgba(212,83,126,0.4)",
    },
    {
      icon: "📊",
      title: "Rapports par cellule",
      desc: "Analysez la croissance, les présences et l’activité de chaque cellule.",
      accent: "rgba(55,138,221,0.5)",
    },
    {
      icon: "🧠",
      title: "Rapports par conseiller",
      desc: "Suivez le travail des conseillers et l’évolution des personnes qu’ils accompagnent.",
      accent: "rgba(127,119,221,0.5)",
    },
    {
      icon: "📈",
      title: "Vision globale",
      desc: "Accédez à des statistiques complètes pour piloter votre église avec précision.",
      accent: "rgba(239,159,39,0.4)",
    },
    {
      icon: "🔥",
      title: "Évangélisation structurée",
      desc: "Suivez chaque contact : rencontré, suivi, converti, baptisé. Rien n’est perdu.",
      accent: "rgba(251,191,36,0.4)",
    },
  ];

  return (
    <div style={{ background: "#333699", minHeight: "100vh", position: "relative" }}>

      {/* GLOW */}
      <div style={{
        position: "absolute",
        width: "800px", height: "800px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 40%, transparent 65%)",
        top: "80px", left: "50%", transform: "translateX(-50%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{
        position: "absolute",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, rgba(255,255,255,0.02) 40%, transparent 65%)",
        top: "600px", left: "50%", transform: "translateX(-50%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* HEADER */}
      <header style={{
        background: scrolled ? "rgba(51,54,153,0.92)" : "transparent",
        borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid transparent",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto", padding: "22px 24px", height: "88px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div onClick={() => router.push("/site/HomePage")} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <Image src="/logo.png" alt="SoulTrack" width={50} height={50} />
            <span style={{ color: "#fff", fontSize: "22px", fontFamily: "'Great Vibes', cursive" }}>SoulTrack</span>
          </div>

          <nav style={{ display: "flex", gap: "32px" }} className="nav-hide">
            {navItems.map((item) => (
              <span key={item.path} onClick={() => router.push(item.path)}
                style={{ color: item.path === "/CommentCaMarche" ? "#fbbf24" : "rgba(255,255,255,0.7)", cursor: "pointer" }}>
                {item.label}
              </span>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "70px 24px 40px", position: "relative", zIndex: 1 }}>
        <h1 style={{ color: "#fff", fontSize: "2.5rem", marginBottom: "16px" }}>
          Comment ça marche ?
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "500px", margin: "0 auto" }}>
          Une plateforme simple pour organiser, suivre et faire grandir votre église ou vos cellules.
        </p>
      </section>

      {/* STEPS */}
      <section style={{ padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gap: "20px" }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.08)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: "18px",
              padding: "24px",
              position: "relative",
              backdropFilter: "blur(8px)",
            }}>
              <div style={{ position: "absolute", top: "-30px", left: "-30px", width: "140px", height: "140px", borderRadius: "50%", background: `radial-gradient(circle, ${step.accent} 0%, transparent 70%)` }} />

              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: "26px" }}>{step.icon}</span>
                <div>
                  <h3 style={{ color: "#fff", fontSize: "16px", marginBottom: "6px" }}>{step.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", paddingBottom: "80px" }}>
        <button
          onClick={() => router.push("/SignupEglise")}
          style={{
            background: "#fff",
            color: "#333699",
            padding: "14px 32px",
            borderRadius: "10px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🚀 Créer mon église
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", padding: "20px 24px" }}>
        <div style={{ textAlign: "center", color: "rgba(255,255,255,0.35)" }}>
          © {new Date().getFullYear()} SoulTrack
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .nav-hide { display: none !important; }
        }
      `}</style>
    </div>
  );
}
