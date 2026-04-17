"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function TestimonialsSection() {
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

  const [index, setIndex] = useState(max);
  const trackRef = useRef(null);
  const animating = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (animating.current) return;
      setIndex((prev) => prev - 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (index >= max * 2) {
      animating.current = true;
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.transition = "none";
          setIndex(max);
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
  }, [index]);

  // offset pour centrer la carte du milieu
  const offset = -(index * STEP) + CARD_WIDTH + GAP;

  return (
    <section style={{
      background: "#0a0a14",
      padding: "100px 0",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Glow ambiant */}
      <div style={{
        position: "absolute",
        width: "700px", height: "700px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(83,74,183,0.1) 0%, transparent 68%)",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* Titre */}
      <div style={{ textAlign: "center", marginBottom: "56px", position: "relative", zIndex: 1 }}>
        <p style={{ color: "#534AB7", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>
          Témoignages
        </p>
        <h2 style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 500, maxWidth: "480px", margin: "0 auto", lineHeight: 1.3 }}>
          Ce que disent les responsables
        </h2>
      </div>

      {/* Carousel */}
      <div style={{
        position: "relative",
        maxWidth: `${CARD_WIDTH * 3 + GAP * 2}px`,
        margin: "0 auto",
        overflow: "hidden",
        zIndex: 1,
      }}>
        {/* Fade gauche */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: "80px",
          background: "linear-gradient(90deg, #0a0a14, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }} />
        {/* Fade droite */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: "80px",
          background: "linear-gradient(270deg, #0a0a14, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }} />

        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: `${GAP}px`,
            transform: `translateX(${offset}px)`,
            transition: "transform 700ms ease-in-out",
            alignItems: "center",
            padding: "24px 0",
          }}
        >
          {looped.map((t, i) => {
            const isCenter = i === index;
            return (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: `${CARD_WIDTH}px`,
                  transition: "transform 0.5s ease, opacity 0.5s ease",
                  transform: isCenter ? "scale(1.08)" : "scale(0.92)",
                  opacity: isCenter ? 1 : 0.45,
                }}
              >
                <div style={{
                  background: isCenter ? "rgba(26,24,64,0.85)" : "rgba(19,19,42,0.6)",
                  border: isCenter
                    ? "0.5px solid rgba(127,119,221,0.4)"
                    : "0.5px solid rgba(255,255,255,0.06)",
                  borderRadius: "18px",
                  padding: "28px 24px",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "blur(8px)",
                }}>
                  {/* Ligne du haut */}
                  {isCenter && (
                    <div style={{
                      position: "absolute", top: 0, left: "24px", right: "24px",
                      height: "1px",
                      background: "linear-gradient(90deg, transparent, rgba(127,119,221,0.6), transparent)",
                    }} />
                  )}
                  {/* Glow coin */}
                  {isCenter && (
                    <div style={{
                      position: "absolute", top: "-30px", left: "-30px",
                      width: "140px", height: "140px",
                      borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(127,119,221,0.2) 0%, transparent 70%)",
                      pointerEvents: "none",
                    }} />
                  )}

                  {/* Avatar */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                    <div style={{
                      width: "52px", height: "52px",
                      borderRadius: "50%",
                      border: isCenter ? "1.5px solid rgba(127,119,221,0.5)" : "1px solid rgba(255,255,255,0.1)",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}>
                      <Image src={t.avatar} alt={t.name} width={52} height={52} style={{ objectFit: "cover" }} />
                    </div>
                  </div>

                  {/* Quote */}
                  <p style={{
                    color: isCenter ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                    fontSize: "13px",
                    lineHeight: 1.7,
                    fontStyle: "italic",
                    textAlign: "center",
                    marginBottom: "20px",
                    position: "relative",
                    zIndex: 1,
                  }}>
                    "{t.message}"
                  </p>

                  {/* Nom */}
                  <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                    <div style={{ color: isCenter ? "#e8e6ff" : "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 500, marginBottom: "3px" }}>
                      {t.name}
                    </div>
                    <div style={{ color: isCenter ? "rgba(175,169,236,0.7)" : "rgba(255,255,255,0.25)", fontSize: "12px" }}>
                      {t.church}
                    </div>
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
          <div
            key={i}
            style={{
              width: (index % max) === i ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: (index % max) === i ? "#7F77DD" : "rgba(255,255,255,0.15)",
              transition: "width 0.3s ease, background 0.3s ease",
            }}
          />
        ))}
      </div>
    </section>
  );
}
