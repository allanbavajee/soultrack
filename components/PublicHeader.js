"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PublicHeader() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  const navLink = {
    color: "rgba(255,255,255,0.6)",
    fontSize: "14px",
    fontWeight: 400,
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.2s",
    background: "none",
    border: "none",
    padding: 0,
  };

  return (
    <header style={{
      background: "#0a0a14",
      borderBottom: "0.5px solid rgba(83,74,183,0.25)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(12px)",
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

        {/* LOGO */}
        <div
          onClick={() => router.push("/site/HomePage")}
          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
        >
          <Image src="/logo.png" alt="SoulTrack" width={32} height={32} />
          <span style={{ color: "#fff", fontSize: "16px", fontWeight: 500, letterSpacing: "0.02em" }}>
            SoulTrack
          </span>
        </div>

        {/* NAV DESKTOP */}
        <nav style={{ display: "flex", alignItems: "center", gap: "32px" }} className="hide-mobile">
          {[
            { label: "Accueil", path: "/site/HomePage" },
            { label: "Process", path: "/CommentCaMarche" },
            { label: "À propos", path: "/about" },
            { label: "Pricing", path: "/pricing" },
            { label: "Contact", path: "/contact" },
          ].map((item) => (
            <span
              key={item.path}
              onClick={() => router.push(item.path)}
              style={navLink}
              onMouseEnter={e => e.target.style.color = "#fff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.6)"}
            >
              {item.label}
            </span>
          ))}
        </nav>

        {/* ACTIONS DESKTOP */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }} className="hide-mobile">
          <button
            onClick={() => router.push("/login")}
            style={{
              background: "transparent",
              color: "rgba(255,255,255,0.7)",
              border: "0.5px solid rgba(255,255,255,0.2)",
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 400,
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
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Créer mon église
          </button>
        </div>

        {/* HAMBURGER MOBILE */}
        <button
          onClick={() => setOpenMenu(!openMenu)}
          className="show-mobile"
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
          {[0,1,2].map(i => (
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

      {/* MOBILE MENU */}
      {openMenu && (
        <div style={{
          background: "#0d0d1f",
          borderTop: "0.5px solid rgba(83,74,183,0.2)",
          padding: "20px 24px 28px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}>
          {[
            { label: "Accueil", path: "/site/HomePage" },
            { label: "Process", path: "/CommentCaMarche" },
            { label: "À propos", path: "/about" },
            { label: "Pricing", path: "/pricing" },
            { label: "Contact", path: "/contact" },
          ].map((item) => (
            <span
              key={item.path}
              onClick={() => { router.push(item.path); setOpenMenu(false); }}
              style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", cursor: "pointer" }}
            >
              {item.label}
            </span>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
            <button
              onClick={() => router.push("/login")}
              style={{
                background: "transparent",
                color: "rgba(255,255,255,0.7)",
                border: "0.5px solid rgba(255,255,255,0.2)",
                padding: "11px",
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
                padding: "11px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Créer mon église
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
