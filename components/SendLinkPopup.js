/*components/SendLinkPopup.js*/
"use client";
import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ label, type, buttonColor }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState(null);

  // Récupération dynamique du token depuis Supabase
  useEffect(() => {
    const fetchToken = async () => {
      const { data, error } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (data) setToken(data.token);
    };
    fetchToken();
  }, [type]);

  const handleSend = () => {
    if (!token) return alert("Token introuvable. Vérifie la table Supabase.");

    const baseUrl = `https://soultrack-beta.vercel.app/access/${token}`;
    let message = "";

    if (type === "ajouter_membre") {
      message = `Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre`;
    } else if (type === "ajouter_evangelise") {
      message = `Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé`;
    }

    // Construction du lien WhatsApp
    let waLink = "";
    if (phone) {
      // Si numéro saisi
      const cleanPhone = phone.replace(/\D/g, ""); // Supprime tout sauf chiffres
      waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
        message + " " + baseUrl
      )}`;
    } else {
      // Si champ vide → laisse choisir contact
      waLink = `https://wa.me/?text=${encodeURIComponent(message + " " + baseUrl)}`;
    }

    window.open(waLink, "_blank");
  };

  return (
    <div>
      <button
        onClick={() => setShowPopup(true)}
        className={`bg-gradient-to-r ${buttonColor} text-white font-bold py-3 rounded-2xl w-full transition-all duration-200`}
      >
        {label}
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md flex flex-col gap-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">{label}</h2>

            <p className="text-gray-600 text-sm text-center">
              Pour envoyer à un contact déjà enregistré, laisse le champ vide et clique sur envoyer.
            </p>

            <input
              type="text"
              placeholder="Numéro WhatsApp (+230...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full"
            />

            <button
              onClick={handleSend}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl w-full transition-all duration-200"
            >
              Envoyer
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="text-gray-500 font-semibold py-2 w-full"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

