/* components/SendWhatsappButtons.js */
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type, buttonColor = "from-green-400 via-green-500 to-green-600" }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase
          .from("access_tokens")
          .select("*")
          .eq("access_type", type)
          .limit(1)
          .single();

        if (error || !data) {
          console.error("Token introuvable. Vérifie la table Supabase.", error);
          return;
        }
        setToken(data.token);
      } catch (err) {
        console.error(err);
      }
    };

    fetchToken();
  }, [type]);

  const handleSend = () => {
    if (!token) {
      alert("Token introuvable. Vérifie la table Supabase.");
      return;
    }

    const link = `https://soultrack-beta.vercel.app/access/${token}`;
    const customMessage =
      type === "ajouter_membre"
        ? `👉 Nouveau venu : ${link}`
        : `👉 Nouvel évangélisé : ${link}`;

    // Si numéro vide, WhatsApp ouvre pour choisir un contact existant
    const waUrl = phoneNumber
      ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(customMessage)}`;

    window.open(waUrl, "_blank");
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Champ pour saisir le numéro manuellement */}
      <input
        type="tel"
        placeholder="Numéro WhatsApp (laisser vide pour choisir contact)"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border rounded-xl px-4 py-2 w-full"
      />

      {/* Bouton envoyer */}
      <button
        onClick={handleSend}
        className={`bg-gradient-to-r ${buttonColor} text-white font-bold py-3 rounded-2xl transition-all duration-200 hover:scale-105`}
        disabled={!token || loading}
      >
        {type === "ajouter_membre" ? "Envoyer l'appli – Nouveau membre" : "Envoyer l'appli – Évangélisé"}
      </button>
    </div>
  );
}
