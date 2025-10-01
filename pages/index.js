/* pages/index.js */
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import supabase from "../lib/supabaseClient";
import SendWhatsappButtons from "../components/SendWhatsappButtons";
import SendLinkPopup from "../components/SendLinkPopup";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      // Récupère l'utilisateur connecté via Supabase Auth
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!user || error) {
        setLoadingProfile(false);
        return;
      }

      // Récupère le profil complet
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!profileError && data) {
        setProfile(data);
      }

      setLoadingProfile(false);
    };

    fetchProfile();
  }, []);

  if (loadingProfile) {
    return <p className="text-center mt-10 text-gray-600">Chargement du profil...</p>;
  }

  if (!profile) {
    return (
      <p className="text-center mt-10 text-red-500">
        Aucun profil trouvé. Connecte-toi pour accéder à la plateforme.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Logos */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-8 gap-6">
        <Image src="/soul.logo.png" alt="SoulTrack Logo" width={90} height={90} />
        <Image src="/icc.logo.png" alt="ICC Logo" width={90} height={90} />
      </div>

      {/* Slogan */}
      <h2 className="mt-4 text-2xl md:text-3xl font-handwriting text-center text-gray-800">
        Tu es précieux, tu es attendu, tu es aimé
      </h2>

      {/* Cartes et boutons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10 justify-items-center">
        {/* Membres & Suivis */}
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <div className="flex flex-col items-center">
            <Link
              href="/membres-hub"
              className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#4285F4]"
            >
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-xl font-bold text-gray-800 text-center">Membres & Suivis</h2>
            </Link>
            <div className="mt-4">
              <SendWhatsappButtons type="ajouter_membre" profile={profile} />
            </div>
          </div>
        )}

        {/* Évangélisation */}
        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <div className="flex flex-col items-center">
            <Link
              href="/evangelisation-hub"
              className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#34a853]"
            >
              <div className="text-5xl mb-4">🙌</div>
              <h2 className="text-xl font-bold text-gray-800 text-center">Évangélisation</h2>
            </Link>
            <div className="mt-4">
              <SendWhatsappButtons type="ajouter_evangelise" profile={profile} />
            </div>
          </div>
        )}

        {/* Rapport - Admin uniquement */}
        {profile.role === "Admin" && (
          <div className="flex flex-col items-center">
            <Link
              href="/rapport"
              className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#ea4335]"
            >
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-xl font-bold text-gray-800 text-center">Rapport</h2>
            </Link>
          </div>
        )}
      </div>

      {/* Popup pour liens permanents */}
      <div className="mt-6">
        <SendLinkPopup />
      </div>

      {/* Message d'amour */}
      <div className="mt-10 p-6 rounded-3xl shadow-md max-w-2xl text-center text-gray-800">
        <p className="text-lg font-handwriting font-semibold">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>
    </div>
  );
}
