"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Great_Vibes } from "next/font/google";
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export default function ContactPage() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Accueil", path: "/site/HomePage" },
    { label: "Fonctionnement", path: "/site/Fonctionnement" },
    { label: "À propos", path: "/site/about" },
    { label: "Pricing", path: "/site/pricing" },
    { label: "Contact", path: "/site/contact" },
  ];

  const handleSubmit = () => {
    if (!form.nom || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <div style={{ background: "#333699", minHeight: "100vh", position: "relative" }}>

      {/* GLOW 1 */}
      <div style={{
        position: "absolute",
        width: "800px", height: "800px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 40%, transparent 65%)",
        top: "80px", left: "50%", transform: "translateX(-50%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* GLOW 2 */}
      <div style={{
        position: "absolute",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.07) 0%, rgba(255,255,255,0.02) 40%, transparent 65%)",
        top: "600px", left: "50%", transform: "translateX(-50%)",
        pointerEvents: "none", zIndex: 0,
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
                style={{ color: item.path === "/contact" ? "#fbbf24" : "rgba(255,255,255,0.7)", fontSize: "14px", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                onMouseLeave={e => e.currentTarget.style.color = item.path === "/contact" ? "#fbbf24" : "rgba(255,255,255,0.7)"}
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

      {/* ───── HERO CONTACT ───── */}
      <section style={{ textAlign: "center", padding: "70px 24px 40px", position: "relative", zIndex: 1 }}>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "14px" }}>
          Contact
        </p>
        <h1 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 500, lineHeight: 1.15, maxWidth: "600px", margin: "0 auto 16px" }}>
          Une question ? <span style={{ color: "#fbbf24" }}>Écrivez-nous</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
          Notre équipe vous répond dans les plus brefs délais. Nous sommes là pour vous accompagner.
        </p>
      </section>

      {/* ───── CONTENU PRINCIPAL ───── */}
      <section style={{ padding: "40px 24px 80px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "32px", alignItems: "start" }}>

          {/* COLONNE GAUCHE — infos */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {[
              {
                icon: "✉️",
                label: "Email",
                value: "support@soultrack.app",
                accent: "rgba(55,138,221,0.5)",
              },
              {
                icon: "💬",
                label: "Disponibilité",
                value: "Lun – Ven, 9h – 18h",
                accent: "rgba(29,158,117,0.45)",
              },
              {
                icon: "🌍",
                label: "Communauté",
                value: "Disponible partout dans le monde",
                accent: "rgba(251,191,36,0.4)",
              },
            ].map((item, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.08)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: "16px",
                padding: "22px 20px",
                position: "relative",
                overflow: "hidden",
                backdropFilter: "blur(8px)",
              }}>
                <div style={{ position: "absolute", top: "-30px", left: "-30px", width: "140px", height: "140px", borderRadius: "50%", background: `radial-gradient(circle, ${item.accent} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
                <div style={{ position: "absolute", top: 0, left: "20px", right: "20px", height: "1px", background: `linear-gradient(90deg, transparent, ${item.accent}, transparent)` }} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <span style={{ fontSize: "20px", display: "block", marginBottom: "8px" }}>{item.icon}</span>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>{item.label}</div>
                  <div style={{ color: "#fff", fontSize: "14px", lineHeight: 1.5 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* COLONNE DROITE — formulaire */}
          <div style={{
            background: "rgba(255,255,255,0.08)",
            border: "0.5px solid rgba(255,255,255,0.12)",
            borderRadius: "20px",
            padding: "36px 32px",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: "radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, left: "32px", right: "32px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />

            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "16px" }}>✅</div>
                <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: 500, marginBottom: "10px" }}>Message envoyé !</h3>
                <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: 1.7 }}>
                  Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                </p>
                <button onClick={() => setSent(false)} style={{ marginTop: "24px", background: "transparent", color: "rgba(255,255,255,0.7)", border: "0.5px solid rgba(255,255,255,0.25)", padding: "8px 20px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}>
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "18px", position: "relative", zIndex: 1 }}>
                <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: 500, marginBottom: "4px" }}>Envoyez-nous un message</h3>

                {/* Nom + Email */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  {[
                    { key: "nom", label: "Nom complet", placeholder: "Jean Dupont" },
                    { key: "email", label: "Email", placeholder: "jean@exemple.com" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "7px" }}>{f.label}</label>
                      <input
                        type={f.key === "email" ? "email" : "text"}
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.18)",
                          borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none",
                        }}
                        onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.45)"}
                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.18)"}
                      />
                    </div>
                  ))}
                </div>

                {/* Sujet */}
                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "7px" }}>Sujet</label>
                  <input
                    type="text"
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={form.sujet}
                    onChange={e => setForm({ ...form, sujet: e.target.value })}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.18)",
                      borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.45)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.18)"}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: "12px", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "7px" }}>Message</label>
                  <textarea
                    placeholder="Décrivez votre demande..."
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.07)", border: "0.5px solid rgba(255,255,255,0.18)",
                      borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none",
                      resize: "vertical", fontFamily: "inherit",
                    }}
                    onFocus={e => e.target.style.borderColor = "rgba(255,255,255,0.45)"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.18)"}
                  />
                </div>

                {/* Bouton */}
                <button
                  onClick={handleSubmit}
                  style={{
                    background: "#fff", color: "#333699", border: "none",
                    padding: "13px 28px", borderRadius: "10px", fontSize: "15px",
                    fontWeight: 600, cursor: "pointer", alignSelf: "flex-start",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  Envoyer le message →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", padding: "20px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
          © {new Date().getFullYear()} SoulTrack. Tous droits réservés.
        </div>
      </footer>

      <style>{`
        body { overflow-x: hidden; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        @media (max-width: 768px) {
          .nav-hide { display: none !important; }
          .nav-show { display: flex !important; }
        }
        @media (max-width: 640px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
