/*components/SendLinkPopup.js*/
"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ label, type, onClose }) {
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);

    try {
      let link = "";

      if (type === "ajouter_membre" || type === "ajouter_evangelise") {
        // Demande à Supabase de générer un token
        const { data, error } = await supabase.rpc("generate_access_token", {
          p_access_type: type,
        });

        if (error) throw error;
        const token = data?.token;
        if (!token) throw new Error("Token introuvable.");

        link = `https://soultrack-beta.vercel.app/access/${token}`;
      } else if (type === "voir_copier") {
        // Lien simple pour accès normal
        link = "https://soultrack-beta.vercel.app/";
      }

      // Message personnalisé selon le type
      let message = "";
      if (type === "ajouter_membre") {
        message = `Voici le lien pour ajouter un nouveau membre : 👉 ${link}`;
      } else if (type === "ajouter_evangelise") {
        message = `Voici le lien pour ajouter un nouveau évangélisé : 👉 ${link}`;
      } else {
        message = `Voici le lien pour accéder à SoulTrack : 👉 ${link}`;
      }

      const encodedMessage = encodeURIComponent(message);

      if (phone.trim() === "") {
        // Ouvre WhatsApp pour choisir un contact existant
        window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
      } else {
        // Nettoie le numéro avant envoi
        const cleanedPhone = phone.replace(/\D/g, "");
        window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, "_blank");
      }

      setPhone("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du lien.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg flex flex-col gap-4">
        <h3 className="text-lg font-bold">{label}</h3>
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
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 font-bold"
          >
            Annuler
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600"
          >
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}

