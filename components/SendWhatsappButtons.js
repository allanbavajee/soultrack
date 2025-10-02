/* components/SendWhatsappButtons.js */
"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type, profile }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!phoneNumber) {
      alert("Veuillez saisir un numéro de téléphone.");
      return;
    }

    setSending(true);

    try {
      // Appel RPC Supabase pour générer token
      const { data, error } = await supabase.rpc("generate_access_token", {
        p_access_type: type,
      });

      if (error) throw error;

      const token = data?.token;
      if (!token) throw new Error("Token introuvable.");

      const link = `https://soultrack-beta.vercel.app/access/${token}`;

      // Ouvrir WhatsApp
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(link)}`, "_blank");

      setPhoneNumber("");
      setShowPopup(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du lien.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={() => setShowPopup(true)}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 w-full"
      >
        {type === "ajouter_membre" ? "Envoyer l'appli – Nouveau membre" : "Envoyer l'appli – Évangélisé"}
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-80 relative flex flex-col gap-4 shadow-lg">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ❌
            </button>

            <h3 className="text-lg font-semibold text-gray-800 text-center">Saisir le numéro WhatsApp</h3>
            <input
              type="tel"
              placeholder="+230XXXXXXXX"
              className="border p-2 rounded w-full text-center"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              onClick={handleSend}
              disabled={sending}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-200 w-full"
            >
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
