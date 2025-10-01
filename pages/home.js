/* pages/home.js */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
        <Image src="/soul.logo.png" alt="SoulTrack Logo" width={90} height={90} />
        <Image src="/icc.logo.png" alt="ICC Logo" width={90} height={90} />
      </div>

      {/* Slogan */}
      <h2 className="mt-4 text-2xl md:text-3xl font-bold text-center text-gray-700 tracking-wide">
        ✨ Bienvenue sur SoulTrack ✨
        <br />
        Suivez, accompagnez et aimez comme Christ nous a aimés.
      </h2>

      {/* Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl justify-items-center">
        {/* Membres & Suivis */}
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <div className="flex flex-col items-center h-full">
            <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-[2px] rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 w-64">
              <div className="flex flex-col justify-between bg-white p-6 h-64 rounded-3xl">
                <Link href="/membres-hub" className="flex flex-col items-center mb-4">
                  <div className="text-5xl mb-2">👤</div>
                  <h2 className="text-xl font-bold text-gray-800 text-center">Suivis des membres</h2>
                </Link>
                <SendWhatsappButtons type="ajouter_membre" profile={profile} />
              </div>
            </div>
          </div>
        )}

        {/* Évangélisation */}
        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <div className="flex flex-col items-center h-full">
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-[2px] rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 w-64">
              <div className="flex flex-col justify-between bg-white p-6 h-64 rounded-3xl">
                <Link href="/evangelisation-hub" className="flex flex-col items-center mb-4">
                  <div className="text-5xl mb-2">🙌</div>
                  <h2 className="text-xl font-bold text-gray-800 text-center">Évangélisation</h2>
                </Link>
                <SendWhatsappButtons type="ajouter_evangelise" profile={profile} />
              </div>
            </div>
          </div>
        )}

        {/* Rapport */}
        {profile.role === "Admin" && (
          <div className="flex flex-col items-center h-full">
            <div className="bg-gradient-to-r from-red-400 to-orange-400 p-[2px] rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 w-64">
              <div className="flex flex-col justify-between bg-white p-6 h-64 rounded-3xl">
                <Link href="/rapport" className="flex flex-col items-center">
                  <div className="text-5xl mb-2">📊</div>
                  <h2 className="text-xl font-bold text-gray-800 text-center">Rapport</h2>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Boutons envoyer l’appli */}
      <div className="flex flex-col gap-4 w-full max-w-md mt-6">
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
            👤 Envoyer l’appli – Nouveau membre
          </button>
        )}

        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <button className="bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
            🙌 Envoyer l’appli – Évangélisé
          </button>
        )}

        {profile.role === "Admin" && (
          <div className="mt-2">
            <SendLinkPopup />
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
