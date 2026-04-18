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
      number: "01",
      title: "Créer une église ou une structure",
      desc: "Vous pouvez créer une église OU une organisation sans église. Le système s’adapte à toute structure (église, réseau, groupe).",
      emoji: "🏛️",
    },
    {
      number: "02",
      title: "Ajouter une personne",
      desc: "Chaque nouvelle personne est ajoutée dans la base de membres et devient visible dans la liste globale.",
      emoji: "👤",
    },
    {
      number: "03",
      title: "Assignation automatique ou manuelle",
      desc: "La personne est assignée à une cellule ou un conseiller pour assurer un suivi spirituel structuré.",
      emoji: "🧭",
    },
    {
      number: "04",
      title: "Suivi par conseiller et cellule",
      desc: "Les conseillers et responsables de cellule suivent les membres, ajoutent des notes et assurent un accompagnement régulier.",
      emoji: "👥",
    },
    {
      number: "05",
      title: "Communication et WhatsApp",
      desc: "Les actions importantes peuvent être envoyées par WhatsApp pour accélérer la communication et le suivi terrain.",
      emoji: "📲",
    },
    {
      number: "06",
      title: "Évangélisation & nouvelles âmes",
      desc: "Chaque nouvelle âme est suivie, convertie, et intégrée dans le système avec un parcours clair.",
      emoji: "✝️",
    },
    {
      number: "07",
      title: "Cellules & structure",
      desc: "Organisation complète des cellules avec responsables, membres et suivi des présences.",
      emoji: "🏠",
    },
    {
      number: "08",
      title: "Rapports intelligents",
      desc: "Rapports par cellule, par conseiller, par église : croissance, engagement, suivi des âmes.",
      emoji: "📊",
    },
    {
      number: "09",
      title: "Dashboard & vision globale",
      desc: "Vue globale de toute l’église ou réseau pour prendre des décisions stratégiques.",
      emoji: "📈",
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
        background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 40%, transparent 65%)",
        top: "80px",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }} />

      {/* HEADER (COPIER-COLLER IDENTIQUE) */}
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
            <Image src="/logo.png" width={50} height={50} />
            <span style={{ color: "#fff", fontSize: "22px", fontFamily: "'Great Vibes', cursive" }}>
              SoulTrack
            </span>
          </div>

          <nav style={{ display: "flex", gap: "32px" }}>
            {navItems.map((i) => (
              <span key={i.path} onClick={() => router.push(i.path)}
                style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", cursor: "pointer" }}>
                {i.label}
              </span>
            ))}
          </nav>

        </div>
      </header>

      {/* HERO */}
      <section style={{ textAlign: "center", padding: "70px 24px 40px" }}>
        <h1 style={{ color: "#fff", fontSize: "40px", fontWeight: 500 }}>
          Comment fonctionne <span style={{ color: "#fbbf24" }}>SoulTrack</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: "600px", margin: "10px auto" }}>
          Une plateforme structurée pour gérer membres, cellules, évangélisation et suivi pastoral.
        </p>
      </section>

      {/* STEPS FLOW STYLE */}
      <section style={{ padding: "40px 24px 80px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px" }}>

          {steps.map((s, i) => (
            <div key={i} style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-start"
            }}>

              {/* circle number */}
              <div style={{
                minWidth: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#fbbf24",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                color: "#333699"
              }}>
                {s.number}
              </div>

              {/* content */}
              <div style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "18px 20px",
                flex: 1
              }}>
                <h3 style={{ color: "#fff", marginBottom: "6px" }}>
                  {s.emoji} {s.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                  {s.desc}
                </p>
              </div>

            </div>
          ))}

        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "20px", textAlign: "center", color: "rgba(255,255,255,0.4)" }}>
        © {new Date().getFullYear()} SoulTrack
      </footer>

    </div>
  );
}
