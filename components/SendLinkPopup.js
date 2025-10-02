/*SendLinkPopup.js*/
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ label, buttonColor, profile }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState(null);
  const [type, setType] = useState(""); // Type sélectionné

  // Définir les options disponibles selon le rôle
  const typeOptions = [];
  if (profile.role === "Admin") {
    typeOptions.push({ label: "Nouveau membre", value: "ajouter_membre" });
    typeOptions.push({ label: "Nouvel évangélisé", value: "ajouter_evangelise" });
  } else if (profile.role === "ResponsableIntegration") {
    typeOptions.push({ label: "Nouveau membre", value: "ajouter_membre" });
  } else if (profile.role === "ResponsableEvangelisation") {
    typeOptions.push({ label: "Nouvel évangélisé", value: "ajouter_evangelise" });
  }

  useEffect(() => {
    if (!type) return;

    const fetchToken = async () => {
      const { data, error } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (!error && data) setToken(data.token);
      else setToken(null);
    };

    fetchToken();
  }, [type]);

  const handleSend = () => {
    if (!type || !token) return;

    let message = "";
    if (type === "ajouter_membre") {
      message = "Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre";
    } else if (type === "ajouter_evangelise") {
      message = "Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé";
    }

    // Remplace la partie cliquable par le lien token
    const encodedMessage = encodeURIComponent(
      message.replace(/👉 .+$/, `👉 ${window.location.origin}/access/${token}`)
    );

    if (!phone.trim()) {
      // Laisse WhatsApp choisir un contact
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    } else {
      const cleanedPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, "_blank");
    }

    setShowPopup(false);
    setPhone("");
  };

  const handleCopy = () => {
    if (!type || !token) return;
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

            <select
              className="border rounded-xl px-3 py-2 w-full"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">-- Sélectionnez un type --</option>
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                Copier lien
              </button>
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
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
