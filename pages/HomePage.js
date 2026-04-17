"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      title: "✝️ Évangélisation Hub",
      desc: "Regroupe les nouvelles âmes, les décisions, les suivis et les baptêmes. Permet de ne laisser aucun contact sans accompagnement et d’assurer une progression spirituelle structurée.",
    },
    {
      title: "🏠 Cellules Hub",
      desc: "Organise les groupes, les responsables et les présences hebdomadaires. Donne une vision vivante de la dynamique des cellules et aide à maintenir la connexion et la croissance.",
    },
    {
      title: "🧭 Conseillers Hub",
      desc: "Offre un suivi personnalisé par responsable. Chaque conseiller peut accompagner, noter, discerner les besoins et intervenir de manière ciblée.",
    },
    {
      title: "📊 Rapports Hub",
      desc: "Analyse toutes les données du ministère pour en ressortir des indicateurs clairs et aider à prendre des décisions stratégiques.",
    },
    {
      title: "⚙️ Admin Hub",
      desc: "Pilote l’ensemble de la structure : gestion des accès, organisation interne et configuration de l’église. Assure une base solide et cohérente.",
    },
  ];

  return (
    <div className="bg-white text-gray-900">

      {/* HERO */}
      <section className="py-28 text-center max-w-5xl mx-auto px-6">
        <h1 className="text-5xl font-extrabold leading-tight mb-6">
          Pilotez votre église avec clarté et précision
        </h1>

        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          SoulTrack connecte toutes les dimensions de votre ministère pour transformer
          des données dispersées en une vision claire et actionnable.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => router.push("/SignupEglise")}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Créer mon église
          </button>

          <button
            onClick={() => router.push("/comment-ca-marche")}
            className="border px-8 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Voir comment ça marche
          </button>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition border"
            >
              <h3 className="text-xl font-semibold mb-3">
                {f.title}
              </h3>

              <p className="text-gray-600 text-sm leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}

        </div>
      </section>

      {/* DETAIL SECTION */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">

          <h2 className="text-3xl font-bold">
            Une structure complète pour accompagner chaque âme
          </h2>

          <p className="text-gray-600">
            SoulTrack ne se contente pas de stocker des données. Il vous donne une vision
            vivante, exploitable et stratégique pour guider votre église avec précision.
          </p>

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center px-6">
        <h2 className="text-3xl font-bold mb-6">
          Commencez dès aujourd’hui
        </h2>

        <button
          onClick={() => router.push("/SignupEglise")}
          className="bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold hover:scale-105 transition"
        >
          Démarrer SoulTrack
        </button>
      </section>

    </div>
  );
}
