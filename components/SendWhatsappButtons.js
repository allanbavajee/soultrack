/* components/SendWhatsappButtons.js */
"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  const fetchToken = async () => {
    try {
      const { data, error } = await supabase
        .from("access_token")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (error || !data) {
        setError("Token introuvable");
        return;
      }

      setToken(data.token);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération du token");
    }
  };

  const handleClick = async () => {
    if (!token) await fetchToken();
    setShowPopup(true);
  };

  const handleSendWhatsapp = () => {
    if (!phone) {
      setError("Veuillez saisir un numéro WhatsApp");
      return;
    }

    const link = `https://soultrack-beta.vercel.app/access/${token}`;
    const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(link)}`;
    window.open(whatsappLink, "_blank");
    setShowPopup(false);
    setPhone("");
  };

  const buttonGradient =
    type === "ajouter_membre"
      ? "from-blue-400 via-blue-500 to-blue-600"
      : "from-green-400 via-green-500 to-green-600";

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`w-full py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${buttonGradient} transition-all duration-200 hover:opacity-90`}
      >
        {type === "ajouter_membre" ? "Envoyer l'appli – Nouveau membre" : "Envoyer l'appli – Évangélisé"}
      </button>

      {showPopup && (
        <div className="absolute top-16 left-0 w-full bg-white p-4 rounded-2xl shadow-lg z-50 flex flex-col gap-3">
          <label className="font-semibold text-gray-700">Numéro WhatsApp :</label>
          <input
            type="tel"
            placeholder="Ex: 230XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded-xl px-4 py-2 w-full"
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleSendWhatsapp}
              className={`flex-1 py-2 rounded-xl font-bold text-white bg-gradient-to-r ${buttonGradient} hover:opacity-90 transition-all duration-200`}
            >
              Envoyer
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="flex-1 py-2 rounded-xl font-bold text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all duration-200"
            >
              Annuler
            </button>
          </div>
          {token && (
            <p className="text-sm text-gray-500 mt-2 break-all">
              Lien direct : <span className="text-blue-500">{`https://soultrack-beta.vercel.app/access/${token}`}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
