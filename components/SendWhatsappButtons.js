/* components/SendWhatsappButtons.js */
"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type, gradient }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);

    try {
      // Générer token via RPC Supabase
      const { data, error } = await supabase.rpc("generate_access_token", {
        p_access_type: type,
      });

      if (error) throw error;
      const token = data?.token;
      if (!token) throw new Error("Token introuvable.");

      // Créer le membre + suivi si c'est un nouveau membre
      let memberId = null;
      if (type === "ajouter_membre" || type === "ajouter_evangelise") {
        const { data: existingMember } = await supabase
          .from("membres")
          .select("*")
          .eq("telephone", phoneNumber.trim())
          .single();

        if (!existingMember) {
          const { data: newMember } = await supabase
            .from("membres")
            .insert([{ telephone: phoneNumber.trim(), statut: "envoye" }])
            .select()
            .single();
          memberId = newMember.id;
        } else {
          memberId = existingMember.id;
        }

        await supabase
          .from("suivis_membres")
          .insert([{ membre_id: memberId, statut: "envoye" }]);

        // Mettre à jour le statut pour qu'il devienne actif
        await supabase
          .from("membres")
          .update({ statut: "actif" })
          .eq("id", memberId);
      }

      const link = `${window.location.origin}/access/${token}`;
      const message =
        type === "ajouter_membre"
          ? `Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre ${link}`
          : `Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé ${link}`;

      const waUrl = phoneNumber
        ? `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;

      window.open(waUrl, "_blank");
      setPhoneNumber("");
      setShowPopup(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du lien.");
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
        {type === "ajouter_membre" ? "Envoyer l'appli – Nouveau membre" : "Envoyer l'appli – Évangélisé"}
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

            <h3 className="text-lg font-semibold text-gray-800 text-center">Saisir le numéro WhatsApp</h3>
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
