"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ type, label, buttonColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const togglePopup = () => {
    setIsOpen(!isOpen);
    setError(null);
  };

  const fetchToken = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (error || !data) {
        setError("Token introuvable. Vérifie la table Supabase.");
        setToken(null);
      } else {
        setToken(data.token);
      }
    } catch (err) {
      setError("Erreur lors de la récupération du token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!token) return;
    let message = "";
    if (type === "ajouter_membre") {
      message = `Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre ${window.location.origin}/access/${token}`;
    } else if (type === "ajouter_evangelise") {
      message = `Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé ${window.location.origin}/access/${token}`;
    }

    let whatsappUrl = "https://wa.me/";
    if (phoneNumber) {
      // supprimer les espaces et + si nécessaire
      const formatted = phoneNumber.replace(/\D/g, "");
      whatsappUrl += formatted + "?text=" + encodeURIComponent(message);
    } else {
      // laisse vide pour que l'utilisateur choisisse un contact dans WhatsApp
      whatsappUrl += "?text=" + encodeURIComponent(message);
    }

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full">
      <button
        className={`w-full py-3 rounded-2xl text-white font-bold transition-all duration-200 bg-gradient-to-r ${buttonColor}`}
        onClick={() => {
          togglePopup();
          fetchToken();
        }}
      >
        {label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 relative">
            <h2 className="text-lg font-bold text-center">{label}</h2>

            <p className="text-sm text-gray-600">
              Saisissez un numéro pour envoyer directement, ou laissez vide pour choisir un contact dans WhatsApp.
            </p>

            <input
              type="tel"
              placeholder="Numéro WhatsApp (ex: +230XXXXXXXX)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 w-full"
            />

            {error && <p className="text-red-500 text-center">{error}</p>}
            {loading && <p className="text-gray-500 text-center">Chargement du token...</p>}
            {token && !loading && (
              <button
                className={`w-full py-3 rounded-2xl text-white font-bold transition-all duration-200 bg-gradient-to-r ${buttonColor}`}
                onClick={handleSend}
              >
                Envoyer
              </button>
            )}

            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 font-bold"
              onClick={togglePopup}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
