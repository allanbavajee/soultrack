"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

import { Great_Vibes } from "next/font/google";
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400" });

export default function CommentCaMarche() {
  const router = useRouter();
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);

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
      icon: "👥",
      title: "Membres",
      steps: [
        { title: "Ajouter", desc: "Créer ou importer un membre dans la base." },
        { title: "Liste", desc: "Visible immédiatement dans la liste globale." },
        { title: "Assignation", desc: "Envoyé à un conseiller ou cellule." },
        { title: "Suivi", desc: "Historique, notes et évolution suivis." },
        { title: "Rapports", desc: "Analyse par conseiller ou cellule." },
      ],
    },
    {
      icon: "✝️",
      title: "Évangélisation",
      steps: [
        { title: "Nouveau contact", desc: "Ajouter une nouvelle âme rencontrée." },
        { title: "Suivi", desc: "Relance et accompagnement structuré." },
        { title: "Conversion", desc: "Suivre décisions et engagements." },
        { title: "Baptême", desc: "Enregistrer les étapes spirituelles." },
        { title: "Rapports", desc: "Voir impact global et progression." },
      ],
    },
    {
      icon: "🏠",
      title: "Cellules",
      steps: [
        { title: "Créer cellule", desc: "Mettre en place un groupe." },
        { title: "Responsable", desc: "Nommer un leader de cellule." },
        { title: "Ajouter membres", desc: "Affecter les participants." },
        { title: "Présences", desc: "Suivre chaque réunion." },
        { title: "Rapports", desc: "Analyse par cellule." },
      ],
    },
    {
      icon: "📊",
      title: "Rapports",
      steps: [
        { title: "Vue globale", desc: "Vision complète de l’église." },
        { title: "Par cellule", desc: "Comparer les dynamiques." },
        { title: "Par conseiller", desc: "Suivi des responsables." },
        { title: "Croissance", desc: "Évolution des membres." },
        { title: "Décision", desc: "Aide stratégique." },
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
        top: "100px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 0,
      }} />

      {/* HEADER */}
      <header style={{
        background: scrolled ? "rgba(51,54,153,0.92)" : "transparent",
        borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid transparent",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "background 0.3s, border-color 0.3s",
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
          <div onClick={() => router.push("/site/HomePage")}
            style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
            <Image src="/logo.png" alt="SoulTrack" width={50} height={50} />
            <span style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 500,
              fontFamily: "'Great Vibes', cursive"
            }}>SoulTrack</span>
          </div>

          <nav style={{ display: "flex", gap: "32px" }}>
            {navItems.map((item) => {
              const isActive = pathname === item.path;

              return (
                <span
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  style={{
                    color: isActive ? "#fbbf24" : "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "0.2s",
                    fontWeight: isActive ? "600" : "400",
                  }}
                >
                  {item.label}
                </span>
              );
            })}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "80px 24px" }}>
        <h1 style={{ color: "#fff", fontSize: "2.5rem" }}>
          Comment fonctionne <span style={{ color: "#fbbf24" }}>SoulTrack</span>
        </h1>
      </section>

      {/* MODULES */}
      {modules.map((module, mIndex) => (
        <section key={mIndex} style={{ padding: "40px 24px" }}>
          <h2 style={{ color: "#fbbf24", textAlign: "center", marginBottom: "40px" }}>
            {module.icon} {module.title}
          </h2>

          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            flexWrap: "wrap"
          }}>
            {module.steps.map((step, i) => {
              const isActive = active === `${mIndex}-${i}`;

              return (
                <div
                  key={i}
                  onMouseEnter={() => setActive(`${mIndex}-${i}`)}
                  onMouseLeave={() => setActive(null)}
                  style={{ textAlign: "center", maxWidth: "140px" }}
                >
                  {/* CERCLE AVEC EMOJI */}
                  <div style={{
                    width: isActive ? "75px" : "60px",
                    height: isActive ? "75px" : "60px",
                    borderRadius: "50%",
                    border: `2px solid ${isActive ? "#fbbf24" : "rgba(255,255,255,0.4)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    margin: "0 auto 10px",
                    transition: "all 0.25s",
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                    background: "rgba(255,255,255,0.05)",
                  }}>
                    {module.icon}
                  </div>

                  <div style={{ color: "#fff", fontSize: "14px", marginBottom: "6px" }}>
                    {step.title}
                  </div>

                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <footer style={{
        textAlign: "center",
        padding: "20px",
        color: "rgba(255,255,255,0.4)"
      }}>
        © {new Date().getFullYear()} SoulTrack
      </footer>
    </div>
  );
}
