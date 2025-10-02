/* pages/home.js */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
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
      className="min-h-screen flex flex-col items-center justify-between p-6 gap-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      {/* Logo */}
      <div className="mt-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={100} height={100} />
      </div>

      {/* Titre SoulTrack */}
      <h1 className="text-4xl font-bold text-white text-center mt-2">
        SoulTrack
      </h1>

      {/* Message central */}
      <div className="text-center text-white text-xl font-handwriting max-w-2xl">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, nous grandissons,
        et nous partageons l’amour de Christ dans chaque action ❤️
      </div>

      {/* Cartes principales */}
      <div className="flex flex-col md:flex-row gap-6 justify-center w-full max-w-5xl mt-6">
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <Link href="/membres-hub" className="flex-1">
            <div className="w-full h-32 bg-white rounded-3xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-500 p-4 hover:shadow-xl transition-all duration-200 cursor-pointer">
              <div className="text-5xl mb-2">👤</div>
              <div className="text-lg font-bold text-gray-800 text-center">
                Suivis des membres
              </div>
            </div>
          </Link>
        )}

        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <Link href="/evangelisation-hub" className="flex-1">
            <div className="w-full h-32 bg-white rounded-3xl shadow-md flex flex-col justify-center items-center border-t-4 border-green-500 p-4 hover:shadow-xl transition-all duration-200 cursor-pointer">
              <div className="text-5xl mb-2">🙌</div>
              <div className="text-lg font-bold text-gray-800 text-center">
                Évangélisation
              </div>
            </div>
          </Link>
        )}

        {profile.role === "Admin" && (
          <Link href="/rapport" className="flex-1">
            <div className="w-full h-32 bg-white rounded-3xl shadow-md flex flex-col justify-center items-center border-t-4 border-red-500 p-4 hover:shadow-xl transition-all duration-200 cursor-pointer">
              <div className="text-5xl mb-2">📊</div>
              <div className="text-lg font-bold text-gray-800 text-center">
                Rapport
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Boutons avec popup */}
      <div className="flex flex-col gap-4 mt-2 w-full max-w-md">
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <SendLinkPopup
            label="Envoyer l'appli – Nouveau membre"
            type="ajouter_membre"
            buttonColor="from-[#09203F] to-[#537895]"
          />
        )}

        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <SendLinkPopup
            label="Envoyer l'appli – Évangélisé"
            type="ajouter_evangelise"
            buttonColor="from-[#09203F] to-[#537895]"
          />
        )}

        {profile.role === "Admin" && (
          <SendLinkPopup
            label="Voir / Copier liens…"
            type="voir_copier"
            buttonColor="from-[#FF5F6D] to-[#FFC371]"
          />
        )}
      </div>

      {/* Verset en bas */}
      <div className="mb-4 text-center text-white text-lg font-handwriting">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs.  
        <br />– 1 Corinthiens 12:14 ❤️
      </div>
    </div>
  );
}
