/* components/SendWhatsappButtons.js */
"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type }) {
  const [phone, setPhone] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async (manualNumber) => {
    setLoading(true);
    setMessage("");

    try {
      // Récupérer un token disponible dans Supabase
      const { data: tokenData, error } = await supabase
        .from("access_tokens")          // <-- table correcte
        .select("*")
        .eq("access_type", type)
        .is("user_id", null)           // token non utilisé
        .limit(1)
        .single();

      if (error || !tokenData) {
        setMessage("Token introuvable. Vérifie la table Supabase.");
        setLoading(false);
        return;
      }

      const token = tokenData.token;
      const link = `https://soultrack-beta.vercel.app/access/${token}`;

      const number = manualNumber || phone;
      if (!number) {
        setMessage("Veuillez saisir un numéro WhatsApp.");
        setLoading(false);
        return;
      }

      // Lien WhatsApp
      const whatsappUrl = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Voici votre lien SoulTrack : ${link}`
      )}`;

      // Ouvrir WhatsApp
      window.open(whatsappUrl, "_blank");

      // Marquer le token comme utilisé
      await supabase
        .from("access_tokens")
        .update({ user_id: "temporary" }) // optionnel : mettre l'ID du destinataire si connu
        .eq("id", tokenData.id);

      setMessage("Lien envoyé avec succès !");
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
        className={`w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-all duration-200`}
        onClick={() => setShowPopup(true)}
      >
        {type === "ajouter_membre" ? "Envoyer l'appli – Nouveau membre" : "Envoyer l'appli – Évangélisé"}
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-80 flex flex-col gap-4 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800">Envoyer le lien WhatsApp</h3>

            <input
              type="text"
              placeholder="Numéro WhatsApp (+230...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl px-3 py-2 w-full"
            />

            <button
              onClick={() => handleSend()}
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
