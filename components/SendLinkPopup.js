/* components/SendLinkPopup.js */
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ type }) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState(null);
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
      alert("Token introuvable.");
      return;
    }

    // Construction du message personnalisé
    const displayText = type === "ajouter_membre" ? "👉 Nouveau venu" : "👉 Nouvel evangelise";

    const link = `https://soultrack-beta.vercel.app/access/${token}`;

    const message = `${displayText}`;

    // WhatsApp : si numéro vide, choix contact existant
    const waUrl = phoneNumber
      ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message + " " + link)}`
      : `https://wa.me/?text=${encodeURIComponent(message + " " + link)}`;

    window.open(waUrl, "_blank");
    setOpen(false); // fermer le popup après envoi
  };

  return (
    <div className="w-full">
      {/* Bouton pour ouvrir le popup */}
      <button
        onClick={() => setOpen(true)}
        className={`bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-bold py-3 rounded-2xl w-full transition-all duration-200 hover:scale-105`}
      >
        {type === "ajouter_membre" ? "Envoyer l'appli – Nouveau membre" : "Envoyer l'appli – Évangélisé"}
      </button>

      {/* Popup */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-80 flex flex-col gap-4 shadow-xl relative">
            <h3 className="text-lg font-bold text-gray-800 text-center">
              {type === "ajouter_membre" ? "Envoyer lien Nouveau membre" : "Envoyer lien Nouvel evangelise"}
            </h3>

            <input
              type="tel"
              placeholder="Numéro WhatsApp (laisser vide pour choisir contact)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full"
            />

            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold py-3 rounded-2xl w-full transition-all duration-200 hover:scale-105"
            >
              Envoyer
            </button>

            <button
              onClick={() => setOpen(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
