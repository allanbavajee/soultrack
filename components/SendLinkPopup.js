/* components/SendLinkPopup.js */
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ label, profile, buttonColor }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [token, setToken] = useState(null);

  // Détermine les options disponibles selon le rôle
  const accessOptions = [];
  if (profile.role === "Admin") {
    accessOptions.push({ label: "Nouveau membre", type: "ajouter_membre" });
    accessOptions.push({ label: "Évangélisé", type: "ajouter_evangelise" });
  } else if (profile.email === "clency.c@soultrack.org") {
    accessOptions.push({ label: "Évangélisé", type: "ajouter_evangelise" });
  } else if (profile.email === "lucie.d@soultrack.org") {
    accessOptions.push({ label: "Nouveau membre", type: "ajouter_membre" });
  }

  useEffect(() => {
    if (!selectedType) return;
    const fetchToken = async () => {
      const { data, error } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", selectedType)
        .limit(1)
        .single();
      if (!error && data) setToken(data.token);
    };
    fetchToken();
  }, [selectedType]);

  const handleSend = () => {
    if (!token) {
      alert("Token introuvable.");
      return;
    }

    let message = "";
    let linkText = "";

    if (selectedType === "ajouter_membre") {
      message = "Voici le lien pour ajouter un nouveau membre :";
      linkText = "👉 Ajouter nouveau membre";
    } else if (selectedType === "ajouter_evangelise") {
      message = "Voici le lien pour ajouter un nouveau évangélisé :";
      linkText = "👉 Ajouter nouveau évangélisé";
    }

    const waMessage = `${message} ${linkText} ${window.location.origin}/access/${token}`;

    const encodedMessage = encodeURIComponent(waMessage);

    if (!phone) {
      // Laisse choisir un contact existant
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    } else {
      const cleanedPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, "_blank");
    }

    setShowPopup(false);
    setPhone("");
  };

  const handleCopy = () => {
    if (!token) return;
    const url = `${window.location.origin}/access/${token}`;
    navigator.clipboard.writeText(url);
    alert("Lien copié !");
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => {
          setShowPopup(true);
          setSelectedType(accessOptions[0]?.type || "");
        }}
        className={`w-full py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${buttonColor} transition-all duration-200`}
      >
        {label}
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg flex flex-col gap-4">
            <h3 className="text-lg font-bold">{label}</h3>

            <label className="text-gray-700">Choisir le type :</label>
            <select
              className="border rounded-xl px-3 py-2 w-full"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {accessOptions.map((opt) => (
                <option key={opt.type} value={opt.type}>
                  {opt.label}
                </option>
              ))}
            </select>

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
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-orange-400 text-white font-bold"
              >
                Copier le lien
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

