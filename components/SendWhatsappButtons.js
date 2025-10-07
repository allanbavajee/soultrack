/* components/SendWhatsappButtons.js */
"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type, profile, gradient }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);

  // ⚡ Fonction pour créer le suivi du membre
  const markAsSent = async (memberId, celluleId = null) => {
    if (!memberId) return;

    try {
      // 1️⃣ Mettre le statut du membre à "actif"
      const { error: updateError } = await supabase
        .from("membres")
        .update({ statut: "actif" })
        .eq("id", memberId);
      if (updateError) throw updateError;

      // 2️⃣ Vérifier si le suivi existe déjà
      const { data: existing, error: selectError } = await supabase
        .from("suivis_membres")
        .select("*")
        .eq("membre_id", memberId)
        .eq("cellule_id", celluleId)
        .maybeSingle();
      if (selectError) throw selectError;

      // 3️⃣ Créer le suivi si inexistant
      if (!existing) {
        const { error: insertError } = await supabase
          .from("suivis_membres")
          .insert({
            membre_id: memberId,
            cellule_id: celluleId,
            statut: "envoye",
          });
        if (insertError) throw insertError;
      }
    } catch (err) {
      console.error("Erreur markAsSent:", err);
      throw err; // on relance pour que handleSend capte l'erreur
    }
  };

  // ⚡ Fonction principale d'envoi
  const handleSend = async () => {
    setSending(true);

    try {
      // 1️⃣ Générer token via RPC Supabase
      const { data, error } = await supabase.rpc("generate_access_token", {
        p_access_type: type,
      });
      if (error) throw error;

      const token = data?.token;
      if (!token) throw new Error("Token introuvable.");

      // 2️⃣ Préparer le lien et le message WhatsApp
      const link = `https://soultrack-beta.vercel.app/access/${token}`;
      const message =
        type === "ajouter_membre"
          ? `Voici le lien pour ajouter un nouveau membre : 👉 ${link}`
          : `Voici le lien pour ajouter un nouvel évangélisé : 👉 ${link}`;

      // 3️⃣ Ouvrir WhatsApp
      const cleanedPhone = phoneNumber.replace(/\D/g, "");
      const waUrl = cleanedPhone
        ? `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;

      window.open(waUrl, "_blank");

      // 4️⃣ Marquer le membre comme envoyé
      await markAsSent(profile?.id, profile?.cellule_id);

      // 5️⃣ Reset du popup
      setPhoneNumber("");
      setShowPopup(false);
    } catch (err) {
      console.error("Erreur handleSend:", err);
      alert("Impossible de créer le suivi. Envoi annulé.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={() => setShowPopup(true)}
        style={{ background: gradient }}
        className="text-white font-bold py-2 px-4 rounded-xl w-full transition-all duration-200"
      >
        {type === "ajouter_membre"
          ? "Envoyer l'appli – Nouveau membre"
          : "Envoyer l'appli – Évangélisé"}
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-80 relative flex flex-col gap-4 shadow-lg">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ❌
            </button>

            <h3 className="text-lg font-semibold text-gray-800 text-center">
              Saisir le numéro WhatsApp (optionnel)
            </h3>
            <input
              type="tel"
              placeholder="+230XXXXXXXX"
              className="border p-2 rounded w-full text-center"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <button
              onClick={handleSend}
              disabled={sending}
              style={{ background: gradient }}
              className="text-white font-bold py-2 px-4 rounded-xl w-full transition-all duration-200"
            >
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
