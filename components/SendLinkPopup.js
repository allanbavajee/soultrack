/* components/SendLinkPopup.js */
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ type }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Déterminer le message selon le type
  const messageText = type === "ajouter_membre"
    ? "👉 Nouveau venu"
    : "👉 Nouvel évangélisé";

  // Récupération dynamique du token depuis Supabase
  useEffect(() => {
    const fetchToken = async () => {
      const { data, error } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (!error && data) {
        setToken(data.token);
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

    // Si le champ est vide, WhatsApp s'ouvre et l'utilisateur choisit un contact existant
    const phoneParam = phone ? phone.replace(/\D/g, "") : "";
    const waUrl = `https://wa.me/${phoneParam}?text=${encodeURIComponent(
      `${messageText} : ${link}`
    )}`;

    window.open(waUrl, "_blank");
  };

  return (
    <div>
      {/* Bouton principal */}
      <button
        onClick={() => setShowPopup(true)}
        className={`w-full py-3 rounded-2xl text-white font-bold text-lg bg-gradient-to-r ${
          type === "ajouter_membre"
            ? "from-blue-400 via-blue-500 to-blue-600"
            : type === "ajouter_evangelise"
            ? "from-green-400 via-green-500 to-green-600"
            : "from-orange-400 via-orange-500 to-orange-600"
        } hover:scale-105 transition-all duration-200`}
      >
        {type === "ajouter_membre" ? "Envoyer l'appli – Nouveau membre" :
         type === "ajouter_evangelise" ? "Envoyer l'appli – Évangélisé" :
         "Voir / Copier liens…"}
      </button>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-3xl p-6 w-80 flex flex-col gap-4 relative">
            <h3 className="text-lg font-bold text-gray-800">Envoyer le lien</h3>
            <p className="text-sm text-gray-600">
              Saisissez le numéro pour envoyer directement, ou laissez vide pour choisir un contact existant dans WhatsApp.
            </p>

            <input
              type="tel"
              placeholder="Laissez vide pour choisir un contact"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full"
            />

            <button
              onClick={handleSend}
              className={`w-full py-3 rounded-2xl text-white font-bold text-lg bg-gradient-to-r ${
                type === "ajouter_membre"
                  ? "from-blue-400 via-blue-500 to-blue-600"
                  : type === "ajouter_evangelise"
                  ? "from-green-400 via-green-500 to-green-600"
                  : "from-orange-400 via-orange-500 to-orange-600"
              } hover:scale-105 transition-all duration-200`}
            >
              Envoyer
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
