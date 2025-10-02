/* components/SendWhatsappButtons.js */
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("access_token")
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
        console.error(err);
        setError("Erreur lors de la récupération du token.");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [type]);

  const handleSend = () => {
    if (!token) return;
    if (!phoneNumber) {
      alert("Merci de saisir un numéro WhatsApp valide !");
      return;
    }

    const url = `https://soultrack-beta.vercel.app/access/${token}`;
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      `Bonjour ! Accède directement à SoulTrack : ${url}`
    )}`;

    window.open(whatsappLink, "_blank");
    setShowPopup(false);
    setPhoneNumber("");
  };

  return (
    <div>
      <button
        className="w-full py-3 px-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 transition-all duration-200"
        onClick={() => setShowPopup(true)}
        disabled={loading || !!error}
      >
        {loading ? "Chargement..." : type === "ajouter_membre" ? "Envoyer l'appli – Nouveau membre" : "Envoyer l'appli – Évangélisé"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-80 flex flex-col gap-4 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 text-center">Envoyer le lien via WhatsApp</h3>
            <input
              type="tel"
              placeholder="Numéro WhatsApp (ex: 230XXXXXXX)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full"
            />
            <button
              onClick={handleSend}
              className="py-3 px-4 rounded-2xl font-bold text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 transition-all duration-200"
            >
              Envoyer
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-2 py-2 px-4 rounded-xl font-bold text-gray-700 border border-gray-300 hover:bg-gray-100 transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
