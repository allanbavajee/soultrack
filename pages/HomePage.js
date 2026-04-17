"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const fadeRefs = useRef([]);

  // Carousel
  const testimonials = [
    { name: "Past. Jean", church: "Église Bethel", message: "Avant SoulTrack, je perdais le fil de chaque nouvelle âme. Aujourd'hui, chaque suivi est structuré et aucun membre n'est oublié.", avatar: "/avatar1.png" },
    { name: "Past. Marie", church: "Église Grâce", message: "Je peux enfin voir d'un coup d'œil l'état de toutes mes cellules. C'est un outil qui change vraiment la façon de diriger une église.", avatar: "/avatar2.png" },
    { name: "Past. Paul", church: "Église Agape", message: "Excellent outil pour piloter le ministère. Les rapports sont clairs et m'aident à prendre de meilleures décisions chaque semaine.", avatar: "/avatar3.png" },
    { name: "Bishop John", church: "Potter House", message: "Wonderful system that brings clarity to every layer of church leadership. Our team adopted it immediately.", avatar: "/avatar2.png" },
    { name: "Samuel", church: "Église Lumière", message: "Le tableau de bord est intuitif et puissant. Mes conseillers sont maintenant beaucoup plus efficaces dans leur accompagnement.", avatar: "/avatar3.png" },
    { name: "Past. Clara", church: "Église Espoir", message: "SoulTrack nous a permis de doubler notre capacité de suivi sans doubler notre charge de travail. Indispensable.", avatar: "/avatar1.png" },
  ];
  const CARD_WIDTH = 300;
  const GAP = 16;
  const STEP = CARD_WIDTH + GAP;
  const max = testimonials.length;
  const looped = [...testimonials, ...testimonials, ...testimonials];
  const [tIndex, setTIndex] = useState(max);
  const trackRef = useRef(null);
  const animating = useRef(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (animating.current) return;
      setTIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tIndex >= max * 2) {
      animating.current = true;
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = "none";
          setTIndex(max);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (trackRef.current) {
                trackRef.current.style.transition = "transform 700ms ease-in-out";
              }
              animating.current = false;
            });
          });
        }
      }, 720);
    }
  }, [tIndex]);

  const addRef = (el) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
  };

  const features = [
    { icon: "👥", title: "Membres Hub", desc: "Une vue centralisée de chaque membre pour suivre son parcours, son engagement et son évolution. Toutes les informations essentielles sont regroupées pour garder une vision claire du troupeau et agir au bon moment.", accent: "rgba(55,138,221,0.5)" },
    { icon: "✝️", title: "Évangélisation Hub", desc: "Regroupe les nouvelles âmes, les décisions, les suivis et les baptêmes. Permet de ne laisser aucun contact sans accompagnement et d'assurer une progression spirituelle structurée.", accent: "rgba(127,119,221,0.5)" },
    { icon: "🏠", title: "Cellules Hub", desc: "Organise les groupes, les responsables et les présences hebdomadaires. Donne une vision vivante de la dynamique des cellules et aide à maintenir la connexion et la croissance.", accent: "rgba(29,158,117,0.45)" },
    { icon: "🧭", title: "Conseillers Hub", desc: "Offre un suivi personnalisé par responsable. Chaque conseiller peut accompagner, noter, discerner les besoins et intervenir de manière ciblée sur les membres qui lui sont confiés.", accent: "rgba(239,159,39,0.4)" },
    { icon: "📊", title: "Rapports Hub", desc: "Analyse toutes les données du ministère pour en ressortir des indicateurs clairs. Aide à prendre des décisions stratégiques basées sur des faits concrets et mesurables.", accent: "rgba(93,202,165,0.45)" },
    { icon: "⚙️", title: "Admin Hub", desc: "Pilote l'ensemble de la structure : gestion des accès, organisation interne et configuration de l'église. Assure une base solide, cohérente et alignée pour tout le système.", accent: "rgba(212,83,126,0.4)" },
  ];

  const navItems = [
    { label: "Accueil", path: "/site/HomePage" },
    { label: "Process", path: "/CommentCaMarche" },
    { label: "À propos", path: "/about" },
    { label: "Pricing", path: "/pricing" },
    { label: "Contact", path: "/contact" },
  ];

  const offset = -(tIndex * STEP) + CARD_WIDTH + GAP;

  return (
    <div style={{ background: "#0a0a14", minHeight: "100vh", position: "relative", overflow: "hidden" }}>

      {/* GLOW GLOBAL */}
      <div style={{
        position: "absolute", width: "900px", height: "900px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(83,74,183,0.13) 0%, transparent 68%)",
        top: "120px", left: "50%", transform: "translateX(-50%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ───── HEADER ───── */}
      <header style={{
        background: scrolled ? "rgba(10,10,20,0.88)" : "transparent",
        borderBottom: scrolled ? "0.5px solid rgba(83,74,183,0.25)" : "0.5px solid transparent",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div onClick={() => router.push("/site/HomePage")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", position: "relative", zIndex: 1 }}>
            <Image src="/logo.png" alt="SoulTrack" width={32} height={32} />
            <span style={{ color: "#fff", fontSize: "16px", fontWeight: 500 }}>SoulTrack</span>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "32px", position: "relative", zIndex: 1 }}>
            {navItems.map((item) => (
              <span key={item.path} onClick={() => router.push(item.path)}
                style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.55)"}
                className="nav-hide"
              >{item.label}</span>
            ))}
          </nav>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", position: "relative", zIndex: 1 }} className="nav-hide">
            <button onClick={() => router.push("/login")} style={{ background: "transparent", color: "rgba(255,255,255,0.65)", border: "0.5px solid rgba(255,255,255,0.18)", padding: "7px 18px", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>
              Connexion
            </button>
            <button onClick={() => router.push("/SignupEglise")} style={{ background: "#534AB7", color: "#fff", border: "none", padding: "7px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
              Créer mon église
            </button>
          </div>

          <button onClick={() => setOpenMenu(!openMenu)} className="nav-show" style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: "5px", padding: "4px", position: "relative", zIndex: 1 }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: "22px", height: "1.5px", background: "rgba(255,255,255,0.7)", borderRadius: "2px", transition: "transform 0.2s, opacity 0.2s",
                transform: openMenu ? i === 0 ? "rotate(45deg) translate(5px, 5px)" : i === 2 ? "rotate(-45deg) translate(5px, -5px)" : "scaleX(0)" : "none",
                opacity: openMenu && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {openMenu && (
          <div style={{ background: "#0a0a14", borderTop: "0.5px solid rgba(83,74,183,0.2)", padding: "20px 24px 28px", display: "flex", flexDirection: "column", gap: "20px" }}>
            {navItems.map((item) => (
              <span key={item.path} onClick={() => { router.push(item.path); setOpenMenu(false); }}
                style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", cursor: "pointer" }}>{item.label}</span>
            ))}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px" }}>
              <button onClick={() => router.push("/login")} style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "0.5px solid rgba(255,255,255,0.2)", padding: "11px", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>Connexion</button>
              <button onClick={() => router.push("/SignupEglise")} style={{ background: "#534AB7", color: "#fff", border: "none", padding: "11px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>Créer mon église</button>
            </div>
          </div>
        )}
      </header>

      {/* ───── HERO ───── */}
      <section style={{ minHeight: "560px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "80px 24px", position: "relative", zIndex: 1 }}>
        <span style={{ color: "#AFA9EC", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", border: "0.5px solid rgba(83,74,183,0.4)", background: "rgba(83,74,183,0.15)", padding: "5px 16px", borderRadius: "20px", marginBottom: "28px" }}>
          SoulTrack — Plateforme ministérielle
        </span>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 500, color: "#fff", lineHeight: 1.15, maxWidth: "680px", marginBottom: "18px" }}>
          Pilotez votre église avec <span style={{ color: "#7F77DD" }}>clarté</span> et précision
        </h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "16px", maxWidth: "500px", lineHeight: 1.7, marginBottom: "36px" }}>
          Connecte toutes les dimensions de votre ministère pour transformer des données dispersées en une vision claire et actionnable.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => router.push("/SignupEglise")} style={{ background: "#534AB7", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: 500, cursor: "pointer" }}>
            Créer mon église →
          </button>
          <button onClick={() => router.push("/comment-ca-marche")} style={{ background: "transparent", color: "rgba(255,255,255,0.6)", border: "0.5px solid rgba(255,255,255,0.2)", padding: "12px 28px", borderRadius: "10px", fontSize: "15px", cursor: "pointer" }}>
            Voir comment ça marche
          </button>
        </div>
      </section>

      {/* ───── LABEL MODULES ───── */}
      <div ref={addRef} style={{ textAlign: "center", padding: "64px 24px 48px", position: "relative", zIndex: 1 }}>
        <p style={{ color: "#534AB7", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Modules</p>
        <h2 style={{ color: "#fff", fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 500, maxWidth: "500px", margin: "0 auto", lineHeight: 1.3 }}>
          Une structure complète pour accompagner chaque âme
        </h2>
      </div>

      {/* ───── CARDS MODULES ───── */}
      <section style={{ padding: "0 24px 100px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", maxWidth: "1050px", margin: "0 auto" }}>
          {features.map((f, i) => (
            <div key={i} ref={addRef}
              style={{ background: "rgba(19,19,42,0.7)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "18px", padding: "28px 24px", position: "relative", overflow: "hidden", backdropFilter: "blur(8px)", cursor: "default", transition: "transform 0.25s, border-color 0.25s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <div style={{ position: "absolute", top: "-40px", left: "-40px", width: "180px", height: "180px", borderRadius: "50%", background: `radial-gradient(circle, ${f.accent} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
              <div style={{ position: "absolute", top: 0, left: "24px", right: "24px", height: "1px", background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <span style={{ fontSize: "24px", display: "block", marginBottom: "16px" }}>{f.icon}</span>
                <h3 style={{ color: "#e8e6ff", fontSize: "15px", fontWeight: 500, marginBottom: "10px", letterSpacing: "0.01em" }}>{f.title}</h3>
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "13.5px", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── TÉMOIGNAGES ───── */}
      <section style={{ padding: "100px 0", position: "relative", zIndex: 1 }}>
        {/* Glow ambiant témoignages */}
        <div style={{
          position: "absolute", width: "700px", height: "700px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(83,74,183,0.09) 0%, transparent 68%)",
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        <div ref={addRef} style={{ textAlign: "center", marginBottom: "56px", position: "relative", zIndex: 1 }}>
          <p style={{ color: "#534AB7", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Témoignages</p>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 500, maxWidth: "480px", margin: "0 auto", lineHeight: 1.3 }}>
            Ce que disent les responsables
          </h2>
        </div>

        {/* Track */}
        <div style={{ position: "relative", maxWidth: `${CARD_WIDTH * 3 + GAP * 2}px`, margin: "0 auto", overflow: "hidden", zIndex: 1 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(90deg, #0a0a14, transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(270deg, #0a0a14, transparent)", zIndex: 2, pointerEvents: "none" }} />

          <div ref={trackRef} style={{ display: "flex", gap: `${GAP}px`, transform: `translateX(${offset}px)`, transition: "transform 700ms ease-in-out", alignItems: "center", padding: "24px 0" }}>
            {looped.map((t, i) => {
              const isCenter = i === tIndex;
              return (
                <div key={i} style={{ flexShrink: 0, width: `${CARD_WIDTH}px`, transition: "transform 0.5s ease, opacity 0.5s ease", transform: isCenter ? "scale(1.08)" : "scale(0.92)", opacity: isCenter ? 1 : 0.45 }}>
                  <div style={{
                    background: isCenter ? "rgba(26,24,64,0.85)" : "rgba(19,19,42,0.6)",
                    border: isCenter ? "0.5px solid rgba(127,119,221,0.4)" : "0.5px solid rgba(255,255,255,0.06)",
                    borderRadius: "18px", padding: "28px 24px", position: "relative", overflow: "hidden", backdropFilter: "blur(8px)",
                  }}>
                    {isCenter && <div style={{ position: "absolute", top: 0, left: "24px", right: "24px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(127,119,221,0.6), transparent)" }} />}
                    {isCenter && <div style={{ position: "absolute", top: "-30px", left: "-30px", width: "140px", height: "140px", borderRadius: "50%", background: "radial-gradient(circle, rgba(127,119,221,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />}

                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                      <div style={{ width: "52px", height: "52px", borderRadius: "50%", border: isCenter ? "1.5px solid rgba(127,119,221,0.5)" : "1px solid rgba(255,255,255,0.1)", overflow: "hidden" }}>
                        <Image src={t.avatar} alt={t.name} width={52} height={52} style={{ objectFit: "cover" }} />
                      </div>
                    </div>

                    <p style={{ color: isCenter ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)", fontSize: "13px", lineHeight: 1.7, fontStyle: "italic", textAlign: "center", marginBottom: "20px", position: "relative", zIndex: 1 }}>
                      "{t.message}"
                    </p>

                    <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                      <div style={{ color: isCenter ? "#e8e6ff" : "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 500, marginBottom: "3px" }}>{t.name}</div>
                      <div style={{ color: isCenter ? "rgba(175,169,236,0.7)" : "rgba(255,255,255,0.25)", fontSize: "12px" }}>{t.church}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "36px", position: "relative", zIndex: 1 }}>
          {testimonials.map((_, i) => (
            <div key={i} style={{
              width: (tIndex % max) === i ? "20px" : "6px",
              height: "6px", borderRadius: "3px",
              background: (tIndex % max) === i ? "#7F77DD" : "rgba(255,255,255,0.15)",
              transition: "width 0.3s ease, background 0.3s ease",
            }} />
          ))}
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section ref={addRef} style={{ borderTop: "0.5px solid rgba(83,74,183,0.15)", padding: "80px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{ color: "#fff", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 500, marginBottom: "12px" }}>
          Commencez dès aujourd'hui
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: "400px", margin: "0 auto 32px", lineHeight: 1.7, fontSize: "15px" }}>
          SoulTrack vous donne une vision vivante et stratégique pour guider votre église avec précision.
        </p>
        <button onClick={() => router.push("/SignupEglise")} style={{ background: "#534AB7", color: "#fff", border: "none", padding: "14px 36px", borderRadius: "10px", fontSize: "16px", fontWeight: 500, cursor: "pointer" }}>
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
