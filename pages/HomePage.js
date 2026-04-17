"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const fadeRefs = useRef([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fadeRefs.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
  };

  const features = [
    { icon: "🏠", title: "Cellules Hub", desc: "Organise les groupes, les responsables et les présences hebdomadaires. Vision vivante de la dynamique des cellules." },
    { icon: "🧭", title: "Conseillers Hub", desc: "Suivi personnalisé par responsable. Accompagner, noter, discerner les besoins et intervenir de manière ciblée." },
    { icon: "📊", title: "Rapports Hub", desc: "Analyse toutes les données du ministère pour ressortir des indicateurs clairs et des décisions stratégiques." },
    { icon: "⚙️", title: "Admin Hub", desc: "Pilote la structure : gestion des accès, organisation interne et configuration de l'église." },
  ];

  const navItems = [
    { label: "Accueil", path: "/site/HomePage" },
    { label: "Process", path: "/CommentCaMarche" },
    { label: "À propos", path: "/about" },
    { label: "Pricing", path: "/pricing" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <div style={{ background: "#0a0a14", minHeight: "100vh" }}>

      {/* ───── HEADER ───── */}
      <header style={{
        background: scrolled ? "rgba(10,10,20,0.92)" : "#0a0a14",
        borderBottom: scrolled ? "0.5px solid rgba(83,74,183,0.25)" : "0.5px solid transparent",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div
            onClick={() => router.push("/site/HomePage")}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          >
            <Image src="/logo.png" alt="SoulTrack" width={32} height={32} />
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: 500 }}>SoulTrack</span>
          </div>

          {/* Nav desktop */}
          <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            {navItems.map((item) => (
              <span
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                className="nav-hide"
              >
                {item.label}
              </span>
            ))}
          </nav>

          {/* Boutons desktop */}
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }} className="nav-hide">
            <button
              onClick={() => router.push("/login")}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.65)",
                border: "0.5px solid rgba(255,255,255,0.18)",
                padding: "7px 18px",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Connexion
            </button>
            <button
              onClick={() => router.push("/SignupEglise")}
              style={{
                background: "#534AB7",
                color: "#fff",
                border: "none",
                padding: "7px 18px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Créer mon église
            </button>
          </div>

          {/* Hamburger mobile */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="nav-show"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              gap: "5px",
              padding: "4px",
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block",
                width: "22px",
                height: "1.5px",
                background: "rgba(255,255,255,0.7)",
                borderRadius: "2px",
                transition: "transform 0.2s, opacity 0.2s",
                transform: openMenu
                  ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                  : i === 2 ? "rotate(-45deg) translate(5px, -5px)"
                  : "scaleX(0)"
                  : "none",
                opacity: openMenu && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* Mobile menu */}
        {openMenu && (
          <div style={{
            background: "#0a0a14",
            borderTop: "0.5px solid rgba(83,74,183,0.2)",
            padding: "20px 24px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
            {navItems.map((item) => (
              <span
                key={item.path}
                onClick={() => { router.push(item.path); setOpenMenu(false); }}
                style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", cursor: "pointer" }}
              >
                {item.label}
              </span>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
              <button onClick={() => router.push("/login")} style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "0.5px solid rgba(255,255,255,0.2)", padding: "11px", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>
                Connexion
              </button>
              <button onClick={() => router.push("/SignupEglise")} style={{ background: "#534AB7", color: "#fff", border: "none", padding: "11px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
                Créer mon église
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ───── HERO ───── */}
      <section style={{
        minHeight: "520px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          width: "700px", height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(83,74,183,0.18) 0%, transparent 70%)",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }} />
        <span style={{
          position: "relative",
          color: "#AFA9EC",
          fontSize: "11px",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          border: "0.5px solid rgba(83,74,183,0.4)",
          background: "rgba(83,74,183,0.2)",
          padding: "5px 16px",
          borderRadius: "20px",
          marginBottom: "28px",
        }}>
          SoulTrack — Plateforme ministérielle
        </span>
        <h1 style={{
          position: "relative",
          fontSize: "clamp(2rem, 5vw, 3.2rem)",
          fontWeight: 500,
          color: "#fff",
          lineHeight: 1.15,
          maxWidth: "680px",
          marginBottom: "18px",
        }}>
          Pilotez votre église avec{" "}
          <span style={{ color: "#7F77DD" }}>clarté</span> et précision
        </h1>
        <p style={{
          position: "relative",
          color: "rgba(255,255,255,0.48)",
          fontSize: "16px",
          maxWidth: "500px",
          lineHeight: 1.7,
          marginBottom: "36px",
        }}>
          Connecte toutes les dimensions de votre ministère pour transformer des données dispersées en une vision claire et actionnable.
        </p>
        <div style={{ position: "relative", display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => router.push("/SignupEglise")}
            style={{ background: "#534AB7", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: 500, cursor: "pointer" }}
          >
            Créer mon église →
          </button>
          <button
            onClick={() => router.push("/comment-ca-marche")}
            style={{ background: "transparent", color: "rgba(255,255,255,0.6)", border: "0.5px solid rgba(255,255,255,0.2)", padding: "12px 28px", borderRadius: "10px", fontSize: "15px", cursor: "pointer" }}
          >
            Voir comment ça marche
          </button>
        </div>
      </section>

      {/* ───── LABEL ───── */}
      <div ref={addRef} style={{ textAlign: "center", padding: "64px 24px 0" }}>
        <p style={{ color: "#534AB7", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>
          Modules
        </p>
        <h2 style={{ color: "#fff", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 500, maxWidth: "500px", margin: "0 auto", lineHeight: 1.3 }}>
          Une structure complète pour accompagner chaque âme
        </h2>
      </div>

      {/* ───── FEATURES ───── */}
      <section style={{ padding: "48px 24px 80px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
          maxWidth: "1050px",
          margin: "0 auto",
        }}>
          <div ref={addRef} style={{ gridColumn: "1 / -1", background: "#13132a", border: "0.5px solid rgba(83,74,183,0.25)", borderRadius: "16px", padding: "28px 24px" }}>
            <span style={{ fontSize: "22px", display: "block", marginBottom: "12px" }}>✝️</span>
            <h3 style={{ color: "#C8C4F0", fontSize: "16px", fontWeight: 500, marginBottom: "10px" }}>Évangélisation Hub</h3>
            <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "14px", lineHeight: 1.65, maxWidth: "600px" }}>
              Regroupe les nouvelles âmes, les décisions, les suivis et les baptêmes. Permet de ne laisser aucun contact sans accompagnement et d'assurer une progression spirituelle structurée.
            </p>
            <div style={{ display: "flex", gap: "32px", marginTop: "20px" }}>
              <div>
                <div style={{ color: "#7F77DD", fontSize: "24px", fontWeight: 500 }}>100%</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Suivi</div>
              </div>
              <div>
                <div style={{ color: "#7F77DD", fontSize: "24px", fontWeight: 500 }}>0</div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Oubliés</div>
              </div>
            </div>
          </div>

          {features.map((f, i) => (
            <div key={i} ref={addRef} style={{ background: "#13132a", border: "0.5px solid rgba(83,74,183,0.2)", borderRadius: "16px", padding: "24px" }}>
              <span style={{ fontSize: "20px", display: "block", marginBottom: "12px" }}>{f.icon}</span>
              <h3 style={{ color: "#C8C4F0", fontSize: "15px", fontWeight: 500, marginBottom: "8px" }}>{f.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13.5px", lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section ref={addRef} style={{
        borderTop: "0.5px solid rgba(83,74,183,0.15)",
        padding: "80px 24px",
        textAlign: "center",
      }}>
        <h2 style={{ color: "#fff", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 500, marginBottom: "12px" }}>
          Commencez dès aujourd'hui
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: "400px", margin: "0 auto 32px", lineHeight: 1.7, fontSize: "15px" }}>
          SoulTrack vous donne une vision vivante et stratégique pour guider votre église avec précision.
        </p>
        <button
          onClick={() => router.push("/SignupEglise")}
          style={{ background: "#534AB7", color: "#fff", border: "none", padding: "14px 36px", borderRadius: "10px", fontSize: "16px", fontWeight: 500, cursor: "pointer" }}
        >
          Démarrer SoulTrack →
        </button>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .nav-hide { display: none !important; }
          .nav-show { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
