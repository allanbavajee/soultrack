/* components/SendWhatsappButtons.js */
"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type }) {
  const [phone, setPhone] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Récupération d’un token disponible
      const { data: tokenData, error } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", type)
        .is("user_id", null)
        .limit(1)
        .single();

      if (error || !tokenData) {
        setMessage("Token introuvable. Vérifie la table Supabase.");
        setLoading(false);
        return;
      }

      const token = tokenData.token;
      const link = `https://soultrack-beta.vercel.app/access/${token}`;

      // Message personnalisé selon le type
      const customMessage =
        type === "ajouter_membre"
          ? `Voici le lien pour enregistrer un nouveau venu : ${link}`
          : `Voici le lien pour enregistrer un nouvel évangélisé : ${link}`;

      // Construction de l’URL WhatsApp
      const whatsappUrl = phone
        ? `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(customMessage)}`
        : `https://wa.me/?text=${encodeURIComponent(customMessage)}`;

      // Ouvrir WhatsApp (le contact peut être choisi par WhatsApp si champ vide)
      window.open(whatsappUrl, "_blank");

      // Marquer le token comme utilisé
      await supabase
        .from("access_tokens")
        .update({ user_id: "temporary" }) // optionnel
        .eq("id", tokenData.id);

      setMessage("Lien prêt à être envoyé !");
      setPhone("");
      setShowPopup(false);
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-all duration-200"
        onClick={() => setShowPopup(true)}
      >
        {type === "ajouter_membre"
          ? "Envoyer l'appli – Nouveau membre"
          : "Envoyer l'appli – Évangélisé"}
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 flex flex-col gap-4 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800">Envoyer le lien WhatsApp</h3>

            <input
              type="text"
              placeholder="Numéro WhatsApp (+230...) (optionnel)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl px-3 py-2 w-full"
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:to-green-700 transition-all duration-200"
            >
              {loading ? "Envoi..." : "Envoyer"}
            </button>

            <button
              onClick={() => setShowPopup(false)}
              className="py-2 mt-2 text-center text-gray-700 hover:text-gray-900 transition-colors"
            >
              Annuler
            </button>

            {message && <p className="text-center text-red-500">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
