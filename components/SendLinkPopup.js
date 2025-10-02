/* components/SendLinkPopup.js */
"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ label, type, buttonColor, customText }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchToken = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (error || !data) {
        setError("Token introuvable. Vérifie la table Supabase.");
      } else {
        setToken(data.token);
      }
    } catch (err) {
      setError("Erreur lors de la récupération du token");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    await fetchToken();
    setShowPopup(true);
  };

  const handleSendWhatsapp = () => {
    if (!token) return;

    const baseUrl = `https://soultrack-beta.vercel.app/access/${token}`;
    const message = encodeURIComponent(`${customText}: ${baseUrl}`);

    // Si numéro vide, WhatsApp ouvrira la sélection de contacts
    const url = phoneNumber
      ? `https://wa.me/${phoneNumber}?text=${message}`
      : `https://wa.me/?text=${message}`;

    window.open(url, "_blank");
  };

  const handleCopyLink = () => {
    if (!token) return;
    navigator.clipboard.writeText(`https://soultrack-beta.vercel.app/access/${token}`);
    alert("Lien copié !");
  };

  return (
    <div className="relative">
      <button
        className={`w-full py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${buttonColor} hover:brightness-105 transition-all duration-200`}
        onClick={handleClick}
      >
        {label}
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-md flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-800 text-center">{label}</h3>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <input
              type="text"
              placeholder="Saisir numéro WhatsApp (optionnel)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full"
            />

            <div className="flex gap-2">
              <button
                className="flex-1 py-2 rounded-xl text-white font-bold bg-green-500 hover:bg-green-600 transition-all duration-200"
                onClick={handleSendWhatsapp}
                disabled={loading || !!error}
              >
                Envoyer
              </button>

              <button
                className="flex-1 py-2 rounded-xl text-white font-bold bg-gray-500 hover:bg-gray-600 transition-all duration-200"
                onClick={handleCopyLink}
                disabled={!token}
              >
                Copier le lien
              </button>
            </div>

            <button
              className="mt-2 text-gray-500 hover:text-gray-800 text-sm underline"
              onClick={() => setShowPopup(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
