/*components/SendWhatsappButtons.js*/
"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SendWhatsappButtons({ phoneNumber }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Fonction générique pour générer et envoyer un token
  const handleSend = async (accessType) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // Appel de la fonction SQL Supabase
      const { data: token, error } = await supabase.rpc("generate_access_token", {
        p_access_type: accessType,
      });

      if (error) {
        console.error("Erreur RPC :", error.message);
        setErrorMsg("Erreur lors de la génération du token");
        return;
      }

      // Construire le lien SoulTrack
      const link = `https://soultrack-beta.vercel.app/access/${token}`;

      // Construire le message WhatsApp
      const message =
        accessType === "ajouter_membre"
          ? `Bonjour 👋, clique ici pour ajouter un membre : ${link}`
          : `Bonjour 🙌, clique ici pour ajouter une personne évangélisée : ${link}`;

      // Redirection vers WhatsApp
      window.open(
        `https://wa.me/${phoneNumber.replace("+", "")}?text=${encodeURIComponent(
          message
        )}`,
        "_blank"
      );
    } catch (err) {
      console.error("Erreur JS :", err);
      setErrorMsg("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <button
        onClick={() => handleSend("ajouter_membre")}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
      >
        {loading ? "Envoi..." : "📲 Envoyer l’appli – Nouveau membre"}
      </button>

      <button
        onClick={() => handleSend("ajouter_evangelise")}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
      >
        {loading ? "Envoi..." : "📲 Envoyer l’appli – Évangélisé"}
      </button>

      {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
    </div>
  );
}

