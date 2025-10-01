/* components/SendWhatsappButtons.js */
"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type, profile }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleButtonClick = () => {
    setShowModal(true);
    setErrorMsg(null);
  };

  const handleSend = async () => {
    if (!phoneNumber) {
      setErrorMsg("⚠️ Entre un numéro WhatsApp !");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: token, error } = await supabase.rpc("generate_access_token", {
        p_access_type: type,
      });

      if (error) {
        setErrorMsg("Erreur lors de la génération du token");
        setLoading(false);
        return;
      }

      const link = `https://soultrack-beta.vercel.app/access/${token}`;
      const message =
        type === "ajouter_membre"
          ? `Bonjour 👋, clique ici pour ajouter un membre : ${link}`
          : `Bonjour 🙌, clique ici pour ajouter une personne évangélisée : ${link}`;

      const cleanNumber = phoneNumber.replace(/\D/g, "");
      window.open(
        `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      setPhoneNumber("");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Bouton principal moderne */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold px-6 py-3 rounded-3xl shadow-lg transform hover:-translate-y-1 hover:shadow-2xl transition-all duration-200"
      >
        📲 {type === "ajouter_membre" ? "Envoyer l’appli – Nouveau membre" : "Envoyer l’appli – Évangélisé"}
      </button>

      {/* Popup */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-gray-100 rounded-2xl p-6 w-80 shadow-lg flex flex-col gap-4 items-center relative">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-800 font-bold text-lg"
            >
              ×
            </button>

            <h3 className="text-lg font-semibold text-center text-gray-800">
              {type === "ajouter_membre"
                ? "Envoyer lien – Nouveau membre"
                : "Envoyer lien – Évangélisé"}
            </h3>

            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Numéro WhatsApp (ex: 23052345678)"
              className="border rounded-xl px-4 py-2 w-full"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200 w-full"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>

            {errorMsg && <p className="text-red-500 mt-2 text-center">{errorMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
