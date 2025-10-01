/* pages/home.js */
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-6">
      {/* Titre et message de bienvenue */}
      <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mt-8">SoulTrack</h1>
      <p className="mt-4 text-center text-gray-700 max-w-2xl">
        Bienvenue sur la plateforme SoulTrack ! Ici, tu peux gérer les membres, suivre l’évangélisation et
        soutenir les projets de chacun de manière simple et sécurisée.
      </p>
      <p className="mt-2 text-center text-gray-600 italic max-w-2xl">
        “Car je connais les projets que j’ai formés sur vous, dit l’Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l’espérance.” – Jérémie 29:11
      </p>

      {/* Cartes Membres & Évangélisation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mt-10 justify-items-center">
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <div className="flex flex-col items-center w-full max-w-sm bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-t-4 border-[#4285F4]">
            <h2 className="text-2xl font-bold mb-4 text-center">Suivis des membres</h2>
          </div>
        )}
        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <div className="flex flex-col items-center w-full max-w-sm bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-t-4 border-[#34a853]">
            <h2 className="text-2xl font-bold mb-4 text-center">Évangélisation</h2>
          </div>
        )}
      </div>

      {/* Boutons WhatsApp regroupés */}
      <div className="mt-6 flex flex-col gap-4 w-full max-w-sm">
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <SendWhatsappButtons type="ajouter_membre" profile={profile} />
        )}
        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <SendWhatsappButtons type="ajouter_evangelise" profile={profile} />
        )}
      </div>

      {/* Popup admin pour liens permanents */}
      {profile.role === "Admin" && (
        <div className="mt-6 w-full flex justify-center">
          <SendLinkPopup />
        </div>
      )}

      {/* Carte Rapport */}
      {profile.role === "Admin" && (
        <div className="mt-10 flex flex-col items-center w-full max-w-sm bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all border-t-4 border-[#ea4335]">
          <h2 className="text-2xl font-bold mb-4 text-center">Rapport</h2>
          <Link href="/rapport" className="text-green-600 underline text-center">
            Accéder au rapport
          </Link>
        </div>
      )}
    </div>
  );
}
