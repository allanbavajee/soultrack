/*components/SendLinkPopup.js*/
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ label, type, gradient }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (type === "voir_copier") return; // Pas besoin de token pour ce bouton

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

  const handleSend = () => {
    let message = "";
    let link = "";

    if (type === "ajouter_membre") {
      message = "Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre";
      link = `https://soultrack-beta.vercel.app/access/${token}`;
    } else if (type === "ajouter_evangelise") {
      message = "Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé";
      link = `https://soultrack-beta.vercel.app/access/${token}`;
    } else if (type === "voir_copier") {
      message = "Voici le lien pour accéder à SoulTrack : 👉 Accéder à l'application";
      link = "https://soultrack-beta.vercel.app/";
    }

    // Encode message avec le lien cliquable
    const fullMessage = encodeURIComponent(`${message} ${link}`);

    if (phone.trim() === "") {
      // Choisir un contact existant
      window.open(`https://wa.me/?text=${fullMessage}`, "_blank");
    } else {
      // Envoyer directement au numéro
      const cleanedPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanedPhone}?text=${fullMessage}`, "_blank");
    }

    setShowPopup(false);
    setPhone("");
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setShowPopup(true)}
        style={{ background: gradient }}
        className="w-full py-3 rounded-2xl text-white font-bold transition-all duration-200"
      >
        {label}
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg flex flex-col gap-4">
            <h3 className="text-lg font-bold text-center">{label}</h3>
            {type !== "voir_copier" && (
              <p className="text-sm text-gray-700">
                Laissez vide pour sélectionner un contact existant sur WhatsApp
              </p>
            )}
            {type !== "voir_copier" && (
              <input
                type="text"
                placeholder="Numéro WhatsApp avec indicatif"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border rounded-xl px-3 py-2 w-full"
              />
            )}
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-xl text-white font-bold"
                style={{ background: gradient }}
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

