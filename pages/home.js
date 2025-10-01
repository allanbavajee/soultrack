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
        background: "linear-gradient(135deg, #e0f7fa 0%, #f1f5f9 50%, #f0f4f8 100%)",
      }}
    >
      {/* Logos */}
      <div className="flex flex-row items-center justify-center gap-6 mt-6">
        <img src="/soul.logo.png" alt="SoulTrack Logo" className="w-24 h-24" />
        <img src="/icc.logo.png" alt="ICC Logo" className="w-24 h-24" />
      </div>

      {/* Slogan */}
      <h2 className="mt-4 text-2xl md:text-3xl font-bold text-center text-gray-700 tracking-wide">
        ✨ Bienvenue sur SoulTrack ✨
        <br />
        Suivez, accompagnez et aimez comme Christ nous a aimés.
      </h2>

      {/* Boutons principaux (cartes) */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center mt-8">
        {/* Suivis des membres */}
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <button className="flex flex-col items-center justify-center w-64 h-40 rounded-3xl shadow-lg bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 transition-all duration-200 text-white font-bold text-lg">
            👤 Suivis des membres
          </button>
        )}

        {/* Évangélisation */}
        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <button className="flex flex-col items-center justify-center w-64 h-40 rounded-3xl shadow-lg bg-gradient-to-r from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 transition-all duration-200 text-white font-bold text-lg">
            🙌 Évangélisation
          </button>
        )}

        {/* Rapport */}
        {profile.role === "Admin" && (
          <button className="flex flex-col items-center justify-center w-64 h-40 rounded-3xl shadow-lg bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 transition-all duration-200 text-white font-bold text-lg">
            📊 Rapport
          </button>
        )}
      </div>

      {/* Boutons Envoyer l’appli */}
      <div className="flex flex-col gap-4 w-full max-w-md mt-6">
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <SendWhatsappButtons type="ajouter_membre" profile={profile} label="🚀 Envoyer l’appli – Nouveau membre" />
        )}

        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <SendWhatsappButtons type="ajouter_evangelise" profile={profile} label="🙌 Envoyer l’appli – Évangélisé" />
        )}

        {profile.role === "Admin" && (
          <div className="mt-2">
            <SendLinkPopup buttonColor="orange" />
          </div>
        )}
      </div>

      {/* Message d'amour */}
      <div className="mt-10 p-6 rounded-3xl shadow-lg max-w-2xl text-center bg-white/70 backdrop-blur-sm">
        <p className="text-lg font-semibold text-gray-700">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>
    </div>
  );
}
