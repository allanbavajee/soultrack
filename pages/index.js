// pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [memberToken, setMemberToken] = useState(null);
  const [evangeliseToken, setEvangeliseToken] = useState(null);
  const phoneNumber = "+230XXXXXXXX"; // Remplace par le numéro du destinataire

  // Récupération ou génération des tokens
  useEffect(() => {
    const fetchTokens = async () => {
      // 1️⃣ Récupère le token "ajouter_membre"
      let { data: memberData, error: memberError } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", "ajouter_membre")
        .limit(1)
        .single();

      if (memberError || !memberData) {
        // Générer un nouveau token via RPC ou insert
        const { data, error } = await supabase.rpc("generate_access_token", {
          p_user_id: null,
          p_access_type: "ajouter_membre",
        });
        setMemberToken(data.token);
      } else {
        setMemberToken(memberData.token);
      }

      // 2️⃣ Récupère le token "ajouter_evangelise"
      let { data: evData, error: evError } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", "ajouter_evangelise")
        .limit(1)
        .single();

      if (evError || !evData) {
        const { data, error } = await supabase.rpc("generate_access_token", {
          p_user_id: null,
          p_access_type: "ajouter_evangelise",
        });
        setEvangeliseToken(data.token);
      } else {
        setEvangeliseToken(evData.token);
      }
    };

    fetchTokens();
  }, []);

  // Fonction pour envoyer le lien via WhatsApp
  const sendWhatsapp = (token, type) => {
    const message =
      type === "member"
        ? `Voici le lien pour ajouter un membre : https://soultrack-beta.vercel.app/access/${token}`
        : `Voici le lien pour ajouter un évangélisé : https://soultrack-beta.vercel.app/access/${token}`;

    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, "_blank");
  };

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

      {/* Boutons WhatsApp dynamiques */}
      <div className="mt-6 flex gap-4">
        {memberToken && (
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            onClick={() => sendWhatsapp(memberToken, "member")}
          >
            Envoyer l'appli - Nouveau membre
          </button>
        )}

        {evangeliseToken && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => sendWhatsapp(evangeliseToken, "evangelise")}
          >
            Envoyer l'appli - Évangélisé
          </button>
        )}
      </div>

      {/* Cartes d'actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10 justify-items-center">
        <Link href="/membres-hub" className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#4285F4]">
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Membres & Suivis</h2>
        </Link>

        <Link href="/evangelisation-hub" className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#34a853]">
          <div className="text-5xl mb-4">🙌</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Évangélisation</h2>
        </Link>

        <Link href="/rapport" className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#ea4335]">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Rapport</h2>
        </Link>
      </div>
    </div>
  );
}
