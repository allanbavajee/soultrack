/* components/SendWhatsappButtons.js */
"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type, profile, label, gradient, rounded, shadow, hover }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);

    try {
      // Appel RPC pour générer un token (exemple)
      const { data, error } = await supabase.rpc("generate_access_token", {
        p_access_type: type,
      });

      if (error) {
        console.error(error);
        setError("Erreur lors de la génération du token");
        setLoading(false);
        return;
      }

      const token = data[0]?.token || data?.token; // selon la réponse
      const phoneNumber = profile?.phone || "+230XXXXXXXX"; // numéro par défaut si non défini

      const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Voici le lien SoulTrack : https://soultrack-beta.vercel.app/access/${token}`
      )}`;

      window.open(whatsappUrl, "_blank");
    } catch (err) {
      console.error(err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleSend}
        disabled={loading}
        className={`w-full py-3 text-white font-bold ${rounded} ${shadow} ${hover} bg-gradient-to-r ${gradient} transition-all duration-200`}
      >
        {loading ? "Envoi..." : label}
      </button>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
