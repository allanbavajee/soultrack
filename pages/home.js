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
      className="min-h-screen flex flex-col items-center justify-between p-6 gap-10"
      style={{ background: "linear-gradient(135deg, #F8F8F9 0%, #111439 100%)" }}
    >
      {/* Logos */}
      <div className="flex flex-row items-center justify-center gap-6 mt-4">
        <Image src="/soul.logo.png" alt="SoulTrack Logo" width={90} height={90} />
        <Image src="/icc.logo.png" alt="ICC Logo" width={90} height={90} />
      </div>

      {/* Titre SoulTrack */}
      <h1 className="text-4xl font-handwriting text-white text-center mt-4">
        SoulTrack
      </h1>

      {/* Cartes principales */}
      <div className="flex flex-col md:flex-row gap-6 justify-center w-full max-w-5xl mt-6">
        {/* Suivis des membres */}
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <Link href="/membres-hub" className="flex-1">
            <div className="w-full h-32 bg-white rounded-3xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-500 p-4 hover:shadow-xl transition-all duration-200 cursor-pointer">
              <div className="text-5xl mb-2">👤</div>
              <div className="text-lg font-bold text-gray-800 text-center">Suivis des membres</div>
            </div>
          </Link>
        )}

        {/* Évangélisation */}
        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <Link href="/evangelisation-hub" className="flex-1">
            <div className="w-full h-32 bg-white rounded-3xl shadow-md flex flex-col justify-center items-center border-t-4 border-green-500 p-4 hover:shadow-xl transition-all duration-200 cursor-pointer">
              <div className="text-5xl mb-2">🙌</div>
              <div className="text-lg font-bold text-gray-800 text-center">Évangélisation</div>
            </div>
          </Link>
        )}

        {/* Rapport - Admin uniquement */}
        {profile.role === "Admin" && (
          <Link href="/rapport" className="flex-1">
            <div className="w-full h-32 bg-white rounded-3xl shadow-md flex flex-col justify-center items-center border-t-4 border-red-500 p-4 hover:shadow-xl transition-all duration-200 cursor-pointer">
              <div className="text-5xl mb-2">📊</div>
              <div className="text-lg font-bold text-gray-800 text-center">Rapport</div>
            </div>
          </Link>
        )}
      </div>

      {/* Boutons Envoyer l'appli */}
      <div className="flex flex-col gap-4 mt-6 w-full max-w-md">
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <SendWhatsappButtons
            type="ajouter_membre"
            profile={profile}
            label="Envoyer l'appli – Nouveau membre"
            gradient="from-blue-400 to-blue-500"
            rounded="rounded-2xl"
            shadow="shadow-md"
            hover="hover:brightness-105"
          />
        )}

        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <SendWhatsappButtons
            type="ajouter_evangelise"
            profile={profile}
            label="Envoyer l'appli – Évangélisé"
            gradient="from-green-400 to-green-500"
            rounded="rounded-2xl"
            shadow="shadow-md"
            hover="hover:brightness-105"
          />
        )}

        {profile.role === "Admin" && (
          <SendLinkPopup
            buttonColor="from-orange-400 to-orange-500"
            rounded="rounded-2xl"
            shadow="shadow-md"
            hover="hover:brightness-105"
          />
        )}
      </div>

      {/* Message en bas */}
      <div className="mt-auto mb-4 text-center text-white text-lg">
        Suivez, accompagnez et aimons comme Christ nous a aimés. ❤️
      </div>
    </div>
  );
}
