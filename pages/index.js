/* pages/index.js */
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import supabase from "../lib/supabaseClient";
import SendWhatsappButtons from "../components/SendWhatsappButtons";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      // Récupère l’utilisateur connecté
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // Récupère son profil dans la table "profiles"
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error) setProfile(data);
      setLoading(false);
    };

    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>⚠️ Aucun profil trouvé. Connecte-toi.</p>
      </div>
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

      {/* Cas pour Responsable Intégration */}
      {profile.role === "ResponsableIntegration" && (
        <>
          {/* Carte Membres & Suivis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10 justify-items-center">
            <Link
              href="/membres-hub"
              className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#4285F4]"
            >
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-xl font-bold text-gray-800 text-center">
                Membres & Suivis
              </h2>
            </Link>
          </div>

          {/* Bouton WhatsApp */}
          <div className="mt-10 w-full flex justify-center">
            <SendWhatsappButtons type="ajouter_membre" />
          </div>
        </>
      )}

      {/* Cas pour Responsable Évangélisation */}
      {profile.role === "ResponsableEvangelisation" && (
        <>
          {/* Carte Évangélisation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10 justify-items-center">
            <Link
              href="/evangelisation-hub"
              className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#34a853]"
            >
              <div className="text-5xl mb-4">🙌</div>
              <h2 className="text-xl font-bold text-gray-800 text-center">
                Évangélisation
              </h2>
            </Link>
          </div>

          {/* Bouton WhatsApp */}
          <div className="mt-10 w-full flex justify-center">
            <SendWhatsappButtons type="ajouter_evangelise" />
          </div>
        </>
      )}

      {/* Cas par défaut */}
      {profile.role !== "ResponsableIntegration" &&
        profile.role !== "ResponsableEvangelisation" && (
          <div className="mt-10">
            <p className="text-red-500 text-lg">
              🚫 Accès limité. Contacte un responsable.
            </p>
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
