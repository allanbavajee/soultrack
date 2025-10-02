/* components/SendLinkPopup.js */
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ label, buttonColor }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [tokens, setTokens] = useState({});

  // Récupère les tokens depuis Supabase pour les deux types
  useEffect(() => {
    const fetchTokens = async () => {
      const { data, error } = await supabase
        .from("access_tokens")
        .select("*")
        .in("access_type", ["ajouter_membre", "ajouter_evangelise"]);

      if (!error && data) {
        const tokenObj = {};
        data.forEach((t) => {
          tokenObj[t.access_type] = t.token;
        });
        setTokens(tokenObj);
      }
    };
    fetchTokens();
  }, []);

  const handleSend = (type) => {
    const token = tokens[type];
    if (!token) {
      alert("Token introuvable. Vérifie la table Supabase.");
      return;
    }

    let message = "";
    if (type === "ajouter_membre") {
      message = "Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre";
    } else if (type === "ajouter_evangelise") {
      message = "Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé";
    }

    // Remplace le texte cliquable par le lien réel
    const encodedMessage = encodeURIComponent(
      message.replace(/👉 .+$/, `👉 ${window.location.origin}/access/${token}`)
    );

    if (!phone.trim()) {
      // WhatsApp ouvert pour choisir un contact existant
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    } else {
      // Envoie directement au numéro
      const cleanedPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, "_blank");
    }
    setPhone("");
    setShowPopup(false);
  };

  const handleCopy = (type) => {
    const token = tokens[type];
    if (!token) {
      alert("Token introuvable. Vérifie la table Supabase.");
      return;
    }
    const link = `${window.location.origin}/access/${token}`;
    navigator.clipboard.writeText(link);
    alert("Lien copié !");
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setShowPopup(true)}
        className={`w-full py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${buttonColor} transition-all duration-200`}
      >
        {label}
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg flex flex-col gap-4">
            <h3 className="text-lg font-bold text-center">{label}</h3>
            <p className="text-sm text-gray-700 text-center mb-2">
              Sélectionnez le type et copiez ou envoyez le lien via WhatsApp.
              <br />
              Laissez vide le numéro pour choisir un contact existant.
            </p>

            {/* Intégration */}
            <div className="flex flex-col gap-2">
              <div className="font-semibold">Intégration</div>
              <input
                type="text"
                placeholder="Numéro WhatsApp (facultatif)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded-xl px-3 py-2 w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy("ajouter_membre")}
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-300 text-gray-800 font-bold"
                >
                  Copier le lien
                </button>
                <button
                  onClick={() => handleSend("ajouter_membre")}
                  className="flex-1 px-3 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"
                >
                  Envoyer
                </button>
              </div>
            </div>

            {/* Évangélisation */}
            <div className="flex flex-col gap-2 mt-4">
              <div className="font-semibold">Évangélisation</div>
              <input
                type="text"
                placeholder="Numéro WhatsApp (facultatif)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded-xl px-3 py-2 w-full"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy("ajouter_evangelise")}
                  className="flex-1 px-3 py-2 rounded-xl bg-gray-300 text-gray-800 font-bold"
                >
                  Copier le lien
                </button>
                <button
                  onClick={() => handleSend("ajouter_evangelise")}
                  className="flex-1 px-3 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600"
                >
                  Envoyer
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowPopup(false)}
              className="mt-4 px-4 py-2 rounded-xl bg-gray-300 text-gray-800 font-bold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
