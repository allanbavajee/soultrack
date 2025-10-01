/* pages/home.js */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        localStorage.removeItem("userId");
        router.push("/");
      } else {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [router]);

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-10 gap-10"
      style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #dbeafe 100%)", // Bleu nuancé
      }}
    >
      {/* Titre */}
      <h1 className="text-4xl font-extrabold text-slate-800">
        Bienvenue, {profile.responsable || profile.role}
      </h1>

      {/* Cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition flex flex-col items-center gap-3">
          <span className="text-4xl">👤</span>
          <h2 className="text-xl font-semibold text-slate-700">
            Suivis des membres
          </h2>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition flex flex-col items-center gap-3">
          <span className="text-4xl">📖</span>
          <h2 className="text-xl font-semibold text-slate-700">
            Évangélisation
          </h2>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-xl transition flex flex-col items-center gap-3">
          <span className="text-4xl">📊</span>
          <h2 className="text-xl font-semibold text-slate-700">Rapport</h2>
        </div>
      </div>

      {/* Boutons envoyer l’appli */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <button
          className="flex items-center justify-center gap-2 text-white font-bold py-3 rounded-2xl transition-all duration-200"
          style={{
            background: "linear-gradient(90deg,#6366f1,#8b5cf6)", // Indigo → Violet
            boxShadow: "0 6px 18px rgba(139,92,246,0.25)",
          }}
        >
          🚀 Envoyer l’appli – Nouveau membre
        </button>

        <button
          className="flex items-center justify-center gap-2 text-white font-bold py-3 rounded-2xl transition-all duration-200"
          style={{
            background: "linear-gradient(90deg,#f97316,#facc15)", // Orange → Jaune
            boxShadow: "0 6px 18px rgba(249,115,22,0.25)",
          }}
        >
          🙌 Envoyer l’appli – Évangélisé
        </button>
      </div>

      {/* Bouton Voir / Copier */}
      <button
        className="flex items-center justify-center gap-2 text-white font-bold py-3 rounded-2xl transition-all duration-200 mt-6"
        style={{
          background: "linear-gradient(90deg,#64748b,#475569)", // Gris → Slate
          boxShadow: "0 6px 18px rgba(71,85,105,0.25)",
        }}
      >
        📎 Voir / Copier liens…
      </button>
    </div>
  );
}
