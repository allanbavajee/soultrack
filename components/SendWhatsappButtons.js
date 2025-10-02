/* components/SendWhatsappButtons.js */
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type }) {
  const [token, setToken] = useState(null);
  const [phone, setPhone] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Récupère un token valide depuis Supabase
    const fetchToken = async () => {
      const { data, error } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (!error && data) setToken(data.token);
    };

    fetchToken();
  }, [type]);

  if (!token) {
    return (
      <p className="text-red-500 text-sm">
        Token introuvable. Vérifie la table Supabase.
      </p>
    );
  }

  const handleSend = () => {
    if (!token) return;

    let message = "";
    if (type === "ajouter_membre") {
      message = `Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre`;
    } else if (type === "ajouter_evangelise") {
      message = `Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé`;
    }

    const tokenLink = `https://soultrack-beta.vercel.app/access/${token}`;
    // WhatsApp URL
    const waLink = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)} ${encodeURIComponent(
          tokenLink
        )}`
      : `https://wa.me/?text=${encodeURIComponent(message)} ${encodeURIComponent(tokenLink)}`;

    window.open(waLink, "_blank");
    setShowPopup(false);
  };

  return (
    <div>
      <button
        onClick={() => setShowPopup(true)}
        className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-bold py-2 px-4 rounded-xl hover:opacity-90 transition-all duration-200"
      >
        {type === "ajouter_membre" ? "Envoyer l'appli – Nouveau membre" : "Envoyer l'appli – Évangélisé"}
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-80 flex flex-col gap-4 shadow-lg relative">
            <h3 className="font-bold text-lg text-center">
              {type === "ajouter_membre" ? "Envoyer un nouveau membre" : "Envoyer un nouvel évangélisé"}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Laissez vide pour choisir un contact existant sur WhatsApp
            </p>
            <input
              type="text"
              placeholder="Numéro WhatsApp avec indicatif (+230...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full"
            />
            <div className="flex gap-4 justify-center mt-2">
              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-bold py-2 px-4 rounded-xl hover:opacity-90 transition-all duration-200"
              >
                Envoyer
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-xl hover:bg-gray-300 transition-all duration-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
