/* components/SendWhatsappButtons.js */
"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Affiche le popup
  const handleButtonClick = () => {
    setShowModal(true);
    setErrorMsg(null);
  };

  // Envoi du lien WhatsApp
  const handleSend = async () => {
    if (!phoneNumber) {
      setErrorMsg("⚠️ Entre un numéro WhatsApp !");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // Génère le token selon le type passé
      const { data: token, error } = await supabase.rpc("generate_access_token", {
        p_access_type: type,
      });

      if (error) {
        console.error("Erreur RPC :", error.message);
        setErrorMsg("Erreur lors de la génération du token");
        setLoading(false);
        return;
      }

      const link = `https://soultrack-beta.vercel.app/access/${token}`;
      const message =
        type === "ajouter_membre"
          ? `Bonjour 👋, clique ici pour ajouter un membre : ${link}`
          : `Bonjour 🙌, clique ici pour ajouter une personne évangélisée : ${link}`;

      // Supprime les caractères non numériques pour WhatsApp
      const cleanNumber = phoneNumber.replace(/\D/g, "");

      // Ouvre WhatsApp dans un nouvel onglet
      window.open(
        `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      // Réinitialise le formulaire
      setPhoneNumber("");
      setShowModal(false);
    } catch (err) {
      console.error("Erreur JS :", err);
      setErrorMsg("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Bouton principal */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
      >
        {type === "ajouter_membre"
          ? "📲 Envoyer l’appli – Nouveau membre"
          : "📲 Envoyer l’appli – Évangélisé"}
      </button>

      {/* Popup vert WhatsApp */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-[#25D366] rounded-2xl p-6 w-80 shadow-lg flex flex-col gap-4 relative">
            {/* Bouton fermer */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-white font-bold text-lg"
            >
              ×
            </button>

            {/* Titre */}
            <h3 className="text-lg font-semibold text-center text-white">
              {type === "ajouter_membre"
                ? "Envoyer lien – Nouveau membre"
                : "Envoyer lien – Évangélisé"}
            </h3>

            {/* Saisie du numéro */}
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Numéro WhatsApp (ex: 23052345678)"
              className="border rounded-xl px-4 py-2 w-full"
            />

            {/* Bouton envoyer */}
            <button
              type="button"
              onClick={handleSend}
              disabled={loading}
              className="bg-white hover:bg-gray-200 text-[#25D366] font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>

            {/* Message d'erreur */}
            {errorMsg && <p className="text-red-500 mt-2 text-center">{errorMsg}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
