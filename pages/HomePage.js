"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function HomePage() {
  const router = useRouter();
  const fadeRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("opacity-100", "translate-y-0");
        });
      },
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLDivElement | null) => {
    if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el);
  };

  const features = [
    { icon: "✝️", title: "Évangélisation Hub", desc: "Regroupe les nouvelles âmes, les décisions, les suivis et les baptêmes. Permet de ne laisser aucun contact sans accompagnement." },
    { icon: "🏠", title: "Cellules Hub", desc: "Organise les groupes, les responsables et les présences hebdomadaires. Vision vivante de la dynamique des cellules." },
    { icon: "🧭", title: "Conseillers Hub", desc: "Suivi personnalisé par responsable. Accompagner, noter, discerner les besoins et intervenir de manière ciblée." },
    { icon: "📊", title: "Rapports Hub", desc: "Analyse toutes les données du ministère pour ressortir des indicateurs clairs et des décisions stratégiques." },
    { icon: "⚙️", title: "Admin Hub", desc: "Pilote la structure : gestion des accès, organisation interne et configuration de l'église." },
  ];

  return (
    <div className="font-sans">
      {/* HERO */}
      <section className="bg-[#0a0a14] min-h-[520px] flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(83,74,183,0.18)_0%,transparent_70%)]" />
        </div>
        <span className="relative z-10 text-[#AFA9EC] text-xs tracking-widest uppercase border border-[rgba(83,74,183,0.4)] bg-[rgba(83,74,183,0.2)] px-4 py-1.5 rounded-full mb-7">
          SoulTrack — Plateforme ministérielle
        </span>
        <h1 className="relative z-10 text-4xl md:text-5xl font-medium text-white leading-tight max-w-2xl mb-5">
          Pilotez votre église avec{" "}
          <span className="text-[#7F77DD]">clarté</span> et précision
        </h1>
        <p className="relative z-10 text-white/50 text-base max-w-lg mb-9 leading-relaxed">
          Connecte toutes les dimensions de votre ministère pour transformer des données dispersées en une vision claire et actionnable.
        </p>
        <div className="relative z-10 flex gap-3 flex-wrap justify-center">
          <button
            onClick={() => router.push("/SignupEglise")}
            className="bg-[#534AB7] hover:bg-[#7F77DD] text-white px-7 py-3 rounded-xl font-medium transition-all hover:scale-105"
          >
            Créer mon église →
          </button>
          <button
            onClick={() => router.push("/comment-ca-marche")}
            className="border border-white/20 text-white/65 px-7 py-3 rounded-xl hover:bg-white/10 transition"
          >
            Voir comment ça marche
          </button>
        </div>
      </section>

      {/* LABEL */}
      <div
        ref={addRef}
        className="bg-[#0e0e1c] text-center pt-16 pb-0 px-6 opacity-0 translate-y-5 transition-all duration-500"
      >
        <p className="text-[#534AB7] text-xs uppercase tracking-widest mb-2">Modules</p>
        <h2 className="text-white text-2xl font-medium max-w-md mx-auto leading-snug">
          Une structure complète pour accompagner chaque âme
        </h2>
      </div>

      {/* FEATURES */}
      <section className="bg-[#0e0e1c] py-12 px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {/* Featured card */}
          <div
            ref={addRef}
            className="md:col-span-2 lg:col-span-3 bg-[#13132a] border border-[rgba(83,74,183,0.25)] rounded-2xl p-7 opacity-0 translate-y-5 transition-all duration-500 hover:-translate-y-1"
          >
            <span className="text-2xl mb-3 block">✝️</span>
            <h3 className="text-[#C8C4F0] text-base font-medium mb-2">Évangélisation Hub</h3>
            <p className="text-white/40 text-sm leading-relaxed max-w-xl">
              Regroupe les nouvelles âmes, les décisions, les suivis et les baptêmes. Permet de ne laisser aucun contact sans accompagnement et d'assurer une progression spirituelle structurée.
            </p>
            <div className="flex gap-8 mt-5">
              <div><div className="text-[#7F77DD] text-2xl font-medium">100%</div><div className="text-white/35 text-xs uppercase tracking-wider">Suivi</div></div>
              <div><div className="text-[#7F77DD] text-2xl font-medium">0</div><div className="text-white/35 text-xs uppercase tracking-wider">Oubliés</div></div>
            </div>
          </div>

          {features.slice(1).map((f, i) => (
            <div
              key={i}
              ref={addRef}
              className="bg-[#13132a] border border-[rgba(83,74,183,0.2)] rounded-2xl p-6 opacity-0 translate-y-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-[rgba(127,119,221,0.5)]"
            >
              <span className="text-xl mb-3 block">{f.icon}</span>
              <h3 className="text-[#C8C4F0] text-base font-medium mb-2">{f.title}</h3>
              <p className="text-white/38 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        ref={addRef}
        className="bg-[#0a0a14] border-t border-[rgba(83,74,183,0.15)] py-20 text-center px-6 opacity-0 translate-y-5 transition-all duration-500"
      >
        <h2 className="text-white text-3xl font-medium mb-3">Commencez dès aujourd'hui</h2>
        <p className="text-white/40 max-w-sm mx-auto mb-8 leading-relaxed">
          SoulTrack vous donne une vision vivante et stratégique pour guider votre église avec précision.
        </p>
        <button
          onClick={() => router.push("/SignupEglise")}
          className="bg-[#534AB7] hover:bg-[#7F77DD] text-white px-9 py-3.5 rounded-xl font-medium text-base transition-all hover:scale-105"
        >
          Démarrer SoulTrack →
        </button>
      </section>
    </div>
  );
}
