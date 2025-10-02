"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ label, type, buttonColor }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
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
      <button
        className={`w-full py-3 rounded-2xl text-white font-bold ${buttonColor} cursor-not-allowed`}
        disabled
      >
        {label} - Token introuvable
      </button>
    );
  }

  const handleSend = () => {
    let waUrl = `https://wa.me/${phone}?text=`;

    let message = "";
    if (type === "ajouter_membre") {
      message = `Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre`;
    } else if (type === "ajouter_evangelise") {
      message = `Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé`;
    } else {
      message = `Voici le lien SoulTrack : 👉 Accéder à l'application`;
    }

    // Encode le message et ajoute le lien token derrière le texte cliquable
    let encodedMessage = encodeURIComponent(
      message.replace(/👉 .+$/, `👉 ${window.location.origin}/access/${token}`)
    );

    if (phone.trim() === "") {
      // Ouvre WhatsApp pour choisir un contact existant
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    } else {
      // Envoie directement au numéro
      const cleanedPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, "_blank");
    }

    setShowPopup(false);
    setPhone("");
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
            <h3 className="text-lg font-bold">{label}</h3>
            <p className="text-sm text-gray-700">
              Laissez vide pour sélectionner un contact existant sur WhatsApp
            </p>
            <input
              type="text"
              placeholder="Numéro WhatsApp avec indicatif"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl px-3 py-2 w-full"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
