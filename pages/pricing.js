"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PricingPage() {
  const router = useRouter();
  const fadeRefs = useRef([]);

  const addRef = (el) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
  };

  useEffect(() => {
    fadeRefs.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
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

  const plans = [
    {
      name: "Starter",
      members: "0 – 50 membres",
      price: "Gratuit",
      highlight: false,
      desc: "Pour démarrer et structurer les bases du suivi.",
      features: [
        "Suivi des membres",
        "Gestion des cellules",
        "Évangélisation simple",
      ],
    },
    {
      name: "Croissance",
      members: "51 – 200 membres",
      price: "$19 / mois",
      highlight: true,
      desc: "Pour accompagner une église en développement.",
      features: [
        "Tout Starter",
        "Rapports essentiels",
        "Suivi des conseillers",
      ],
    },
    {
      name: "Vision",
      members: "201 – 800 membres",
      price: "$39 / mois",
      highlight: false,
      desc: "Pour piloter avec clarté et précision.",
      features: [
        "Tout Croissance",
        "Statistiques avancées",
        "Analyse des besoins",
      ],
    },
    {
      name: "Expansion",
      members: "801 – 2000 membres",
      price: "$79 / mois",
      highlight: false,
      desc: "Pour structurer une église en forte croissance.",
      features: [
        "Tout Vision",
        "Multi-responsables",
        "Exports & rapports complets",
      ],
    },
    {
      name: "Réseau",
      members: "2000+ membres",
      price: "Sur mesure",
      highlight: false,
      desc: "Pour les églises et réseaux multi-branches.",
      features: [
        "Multi-branches",
        "Support dédié",
        "Accompagnement stratégique",
      ],
    },
  ];

  return (
    <div style={{ background: "#333699", minHeight: "100vh" }}>
      
      {/* HERO */}
      <section
        ref={addRef}
        style={{
          textAlign: "center",
          padding: "100px 24px 60px",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            marginBottom: "20px",
          }}
        >
          Une structure adaptée à chaque église
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          SoulTrack évolue avec votre ministère. 
          Chaque niveau vous donne les outils nécessaires pour suivre, comprendre 
          et accompagner votre église avec précision.
        </p>
      </section>

      {/* CARDS */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
        }}
      >
        {plans.map((plan, i) => (
          <div
            key={i}
            ref={addRef}
            style={{
              background: plan.highlight
                ? "rgba(255,255,255,0.15)"
                : "rgba(255,255,255,0.08)",
              border: plan.highlight
                ? "1px solid rgba(255,255,255,0.4)"
                : "0.5px solid rgba(255,255,255,0.15)",
              borderRadius: "18px",
              padding: "28px 24px",
              backdropFilter: "blur(10px)",
              position: "relative",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {plan.highlight && (
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#fbbf24",
                  color: "#333699",
                  padding: "4px 12px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Recommandé
              </div>
            )}

            <h3 style={{ color: "#fff", fontSize: "18px", marginBottom: "6px" }}>
              {plan.name}
            </h3>

            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
              {plan.members}
            </p>

            <div
              style={{
                color: "#fff",
                fontSize: "28px",
                margin: "16px 0",
              }}
            >
              {plan.price}
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              {plan.desc}
            </p>

            <ul
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "13px",
                lineHeight: 1.8,
                marginBottom: "20px",
              }}
            >
              {plan.features.map((f, idx) => (
                <li key={idx}>• {f}</li>
              ))}
            </ul>

            <button
              onClick={() => router.push("/SignupEglise")}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                background: plan.highlight ? "#fff" : "transparent",
                color: plan.highlight ? "#333699" : "#fff",
                borderColor: "#fff",
                borderWidth: "0.5px",
                borderStyle: "solid",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Commencer
            </button>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section
        ref={addRef}
        style={{
          textAlign: "center",
          padding: "60px 24px",
          borderTop: "0.5px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2 style={{ color: "#fff", marginBottom: "12px" }}>
          Une vision claire commence par une bonne structure
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            maxWidth: "500px",
            margin: "0 auto 24px",
          }}
        >
          Choisissez le plan adapté à votre réalité et développez votre église avec cohérence et intention.
        </p>

        <button
          onClick={() => router.push("/SignupEglise")}
          style={{
            background: "#fff",
            color: "#333699",
            padding: "12px 28px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Démarrer SoulTrack →
        </button>
      </section>
    </div>
  );
}
