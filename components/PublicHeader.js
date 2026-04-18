"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PublicHeader() {
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

  return (
    <header style={{
      background: scrolled ? "rgba(51,54,153,0.92)" : "#333699",
      borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid transparent",
      position: "sticky", top: 0, zIndex: 100,
      backdropFilter: scrolled ? "blur(16px)" : "none",
      transition: "background 0.3s, border-color 0.3s",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        <div onClick={() => router.push("/site/HomePage")} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <Image src="/logo.png" alt="SoulTrack" width={32} height={32} />
          <span style={{ color: "#fff", fontSize: "16px", fontWeight: 500 }}>SoulTrack</span>
        </div>

        <nav style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          {navItems.map((item) => (
            <span key={item.path} onClick={() => router.push(item.path)}
              style={{ color: "rgba(255,255,255,0.7)", fontSize: "14px", cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
              className="nav-hide"
            >{item.label}</span>
          ))}
        </nav>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }} className="nav-hide">
          <button onClick={() => router.push("/login")} style={{ background: "transparent", color: "rgba(255,255,255,0.85)", border: "0.5px solid rgba(255,255,255,0.35)", padding: "7px 18px", borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}>
            Connexion
          </button>
          <button onClick={() => router.push("/SignupEglise")} style={{ background: "#fff", color: "#333699", border: "none", padding: "7px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
            Créer mon église
          </button>
        </div>

        <button onClick={() => setOpenMenu(!openMenu)} className="nav-show" style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: "5px", padding: "4px" }}>
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

      <style>{`
        @media (max-width: 768px) {
          .nav-hide { display: none !important; }
          .nav-show { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
