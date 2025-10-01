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
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-6">
      {/* Logos */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-8 gap-6">
        <Image src="/soul.logo.png" alt="SoulTrack Logo" width={90} height={90} />
        <Image src="/icc.logo.png" alt="ICC Logo" width={90} height={90} />
      </div>

      {/* Slogan */}
      <h2 className="mt-4 text-2xl md:text-3xl font-handwriting text-center text-gray-800">
        Tu es précieux, tu es attendu, tu es aimé
      </h2>

      {/* Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10 justify-items-center">
        {/* Membres & Suivis */}
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <div className="flex flex-col items-center h-full">
            <div className="flex flex-col items-center justify-between bg-white p-6 w-64 h-64 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-200 border-t-4 border-[#4285F4]">
              <Link href="/membres-hub" className="flex flex-col items-center">
                <div className="text-5xl mb-4">👤</div>
                <h2 className="text-xl font-bold text-gray-800 text-center">Membres & Suivis</h2>
              </Link>
              <div className="mt-4 w-full">
                <SendWhatsappButtons type="ajouter_membre" profile={profile} />
              </div>
            </div>
          </div>
        )}

        {/* Évangélisation */}
        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <div className="flex flex-col items-center h-full">
            <div className="flex flex-col items-center justify-between bg-white p-6 w-64 h-64 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-200 border-t-4 border-[#34a853]">
              <Link href="/evangelisation-hub" className="flex flex-col items-center">
                <div className="text-5xl mb-4">🙌</div>
                <h2 className="text-xl font-bold text-gray-800 text-center">Évangélisation</h2>
              </Link>
              <div className="mt-4 w-full">
                <SendWhatsappButtons type="ajouter_evangelise" profile={profile} />
              </div>
            </div>
          </div>
        )}

        {/* Rapport - Admin uniquement */}
        {profile.role === "Admin" && (
          <div className="flex flex-col items-center h-full">
            <div className="flex flex-col items-center justify-between bg-white p-6 w-64 h-64 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-200 border-t-4 border-[#ea4335]">
              <Link href="/rapport" className="flex flex-col items-center">
                <div className="text-5xl mb-4">📊</div>
                <h2 className="text-xl font-bold text-gray-800 text-center">Rapport</h2>
              </Link>
              {/* Aucun bouton WhatsApp ici pour le rapport */}
            </div>
          </div>
        )}
      </div>

      {/* Popup pour liens permanents - uniquement Admin */}
      {profile.role === "Admin" && (
        <div className="mt-6 w-full flex justify-center">
          <SendLinkPopup />
        </div>
      )}

      {/* Message d'amour */}
      <div className="mt-10 p-6 rounded-3xl shadow-md max-w-2xl text-center text-gray-800">
        <p className="text-lg font-handwriting font-semibold">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>
    </div>
  );
}
