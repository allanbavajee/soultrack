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
    { label: "Comment Ca Marche", path: "/site/CommentCaMarche" },
    { label: "À propos", path: "/about" },
    { label: "Pricing", path: "/site/pricing" },
    { label: "Contact", path: "/site/contact" },
  ];

 const modules = [
  {
    title: "Membres",
    steps: [
      { icon: "➕", title: "Ajouter", desc: "Créer ou importer un membre dans la base." },
      { icon: "📋", title: "Liste", desc: "Visible immédiatement dans la liste globale." },
      { icon: "👤", title: "Assignation", desc: "Envoyé à un conseiller ou cellule." },
      { icon: "📈", title: "Suivi", desc: "Historique, notes et évolution suivis." },
      { icon: "📊", title: "Rapports", desc: "Analyse par conseiller ou cellule." },
    ],
  },
  {
    title: "Évangélisation",
    steps: [
      { icon: "📞", title: "Nouveau contact", desc: "Ajouter une nouvelle âme rencontrée." },
      { icon: "🔁", title: "Suivi", desc: "Relance et accompagnement structuré." },
      { icon: "❤️", title: "Conversion", desc: "Suivre décisions et engagements." },
      { icon: "💧", title: "Baptême", desc: "Enregistrer les étapes spirituelles." },
      { icon: "📊", title: "Rapports", desc: "Voir impact global et progression." },
    ],
  },
  {
    title: "Cellules",
    steps: [
      { icon: "🏠", title: "Créer cellule", desc: "Mettre en place un groupe." },
      { icon: "👨‍💼", title: "Responsable", desc: "Nommer un leader de cellule." },
      { icon: "➕", title: "Ajouter membres", desc: "Affecter les participants." },
      { icon: "📅", title: "Présences", desc: "Suivre chaque réunion." },
      { icon: "📊", title: "Rapports", desc: "Analyse par cellule." },
    ],
  },
  {
    title: "Rapports",
    steps: [
      { icon: "🌍", title: "Vue globale", desc: "Vision complète de l’église." },
      { icon: "🏘️", title: "Par cellule", desc: "Comparer les dynamiques." },
      { icon: "👥", title: "Par conseiller", desc: "Suivi des responsables." },
      { icon: "📉", title: "Croissance", desc: "Évolution des membres." },
      { icon: "⚡", title: "Décision", desc: "Aide stratégique." },
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
    
      {/* ───── HEADER ───── */}
      <header style={{
        background: scrolled ? "rgba(51,54,153,0.92)" : "transparent",
        borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid transparent",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{
          maxWidth: "1100px", margin: "0 auto", padding: "22px 24px", height: "88px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div onClick={() => router.push("/site/HomePage")} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", zIndex: 1, flexShrink: 0 }}>
            <Image src="/logo.png" alt="SoulTrack" width={50} height={50} />
            <span style={{ color: "#fff", fontSize: "22px", fontWeight: 500, fontFamily: "'Great Vibes', cursive" }}>SoulTrack</span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "32px", zIndex: 1 }}>
            {navItems.map((item) => (
              <span key={item.path} onClick={() => router.push(item.path)}
                style={{ color: item.path === "/CommentCaMarche" ? "#fbbf24" : "rgba(255,255,255,0.7)", fontSize: "14px", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = item.path === "site/CommentCaMarche" ? "#fbbf24" : "rgba(255,255,255,0.7)"}
                className="nav-hide"
              >{item.label}</span>
            ))}
          </nav>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", zIndex: 1, flexShrink: 0 }} className="nav-hide">
            <button onClick={() => router.push("/login")} style={{ background: "transparent", color: "#fbbf24", border: "0.5px solid rgba(255,255,255,0.35)", padding: "7px 18px", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>
              Connexion
            </button>
            <button onClick={() => router.push("/SignupEglise")} style={{ background: "#fff", color: "#333699", border: "none", padding: "7px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
              Créer mon église
            </button>
          </div>

          <button onClick={() => setOpenMenu(!openMenu)} className="nav-show" style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: "5px", padding: "4px", zIndex: 1 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: "22px", height: "1.5px", background: "rgba(255,255,255,0.85)", borderRadius: "2px", transition: "transform 0.2s, opacity 0.2s",
                transform: openMenu ? i === 0 ? "rotate(45deg) translate(5px, 5px)" : i === 2 ? "rotate(-45deg) translate(5px, -5px)" : "scaleX(0)" : "none",
                opacity: openMenu && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {openMenu && (
          <div style={{ background: "#333699", borderTop: "0.5px solid rgba(255,255,255,0.15)", padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {navItems.map((item) => (
              <span key={item.path} onClick={() => { router.push(item.path); setOpenMenu(false); }}
                style={{ color: "rgba(255,255,255,0.8)", fontSize: "15px", cursor: "pointer" }}>{item.label}</span>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
              <button onClick={() => router.push("/login")} style={{ background: "transparent", color: "#fff", border: "0.5px solid rgba(255,255,255,0.35)", padding: "11px", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>Connexion</button>
              <button onClick={() => router.push("/SignupEglise")} style={{ background: "#fff", color: "#333699", border: "none", padding: "11px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Créer mon église</button>
            </div>
          </div>
        )}
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
            position: "relative",
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            flexWrap: "wrap",
            padding: "40px 0"          
          }}
          >

          <div
            style={{
              position: "absolute",
              top: "70px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "70%",
              height: "2px",
              background: "rgba(255,255,255,0.15)",
              zIndex: 0,
            }}
          />                  

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
                  <div
                    style={{
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
                      background: "#fbbf24",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    {step.icon}
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
