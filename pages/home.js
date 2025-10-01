/* pages/home.js */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import SendWhatsappButtons from "../components/SendWhatsappButtons";
import SendLinkPopup from "../components/SendLinkPopup";

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/"); // pas connecté → login
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) setProfile(data);
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [router]);

  if (loadingProfile) {
    return <p className="text-center mt-10 text-gray-600">Chargement du profil...</p>;
  }

  if (!profile) {
    return (
      <div className="text-center mt-10 text-red-500">
        Profil introuvable. Connecte-toi.
        <br />
        <a href="/" className="text-green-600 font-bold underline mt-2 inline-block">
          Retour à la connexion
        </a>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start p-6 gap-10"
      style={{
        background: "linear-gradient(135deg, #FFF7ED 0%, #FFEBC1 50%, #FFF2D1 100%)",
      }}
    >
      {/* Logos */}
      <div className="flex flex-row items-center justify-center gap-6 mt-6">
        <img src="/soul.logo.png" alt="SoulTrack Logo" className="w-24 h-24" />
        <img src="/icc.logo.png" alt="ICC Logo" className="w-24 h-24" />
      </div>

      {/* Titre */}
      <h1 className="text-4xl font-bold text-gray-800 font-handwriting text-center">
        SoulTrack
      </h1>

      {/* Message d’accompagnement */}
      <p className="text-center text-gray-700 max-w-xl p-4 rounded-2xl bg-yellow-50 shadow-md">
        Suivez, accompagnez et aimons comme Christ nous a aimés. ❤️
      </p>

      {/* Cartes principales */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl justify-center mt-6">
        {/* Suivis des membres */}
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <div className="flex-1 flex flex-col items-center">
            <div className="w-52 h-32 bg-white rounded-3xl shadow-md flex flex-col justify-between items-center border-t-4 border-blue-500 p-4 hover:shadow-xl transition-all duration-200">
              <div className="text-5xl">👤</div>
              <div className="text-lg font-bold text-gray-800">Suivis des membres</div>
            </div>
          </div>
        )}

        {/* Évangélisation */}
        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <div className="flex-1 flex flex-col items-center">
            <div className="w-52 h-32 bg-white rounded-3xl shadow-md flex flex-col justify-between items-center border-t-4 border-green-500 p-4 hover:shadow-xl transition-all duration-200">
              <div className="text-5xl">🙌</div>
              <div className="text-lg font-bold text-gray-800">Évangélisation</div>
            </div>
          </div>
        )}

        {/* Rapport */}
        {profile.role === "Admin" && (
          <div className="flex-1 flex flex-col items-center">
            <div className="w-52 h-32 bg-white rounded-3xl shadow-md flex flex-col justify-between items-center border-t-4 border-red-500 p-4 hover:shadow-xl transition-all duration-200">
              <div className="text-5xl">📊</div>
              <div className="text-lg font-bold text-gray-800">Rapport</div>
            </div>
          </div>
        )}
      </div>

      {/* Boutons Envoyer l’appli */}
      <div className="flex flex-col gap-4 w-full max-w-md mt-6">
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <SendWhatsappButtons
            type="ajouter_membre"
            profile={profile}
            label="🚀 Envoyer l’appli – Nouveau membre"
            gradient="from-blue-400 to-cyan-500"
          />
        )}

        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <SendWhatsappButtons
            type="ajouter_evangelise"
            profile={profile}
            label="🙌 Envoyer l’appli – Évangélisé"
            gradient="from-green-400 to-emerald-500"
          />
        )}

        {/* Bouton Voir / Copier liens */}
        {profile.role === "Admin" && (
          <div className="mt-2">
            <SendLinkPopup buttonColor="orange" />
          </div>
        )}
      </div>
    </div>
  );
}
