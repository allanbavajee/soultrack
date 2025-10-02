/*components/SendLinkPopup.js*/
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SendLinkPopup({ type, onClose, label }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      setLoading(true);

      // 1. Créer un token unique
      const { data, error } = await supabase
        .from("access_tokens")
        .insert([{ type }])
        .select()
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const token = data.token;
      const link = `https://soultrack-beta.vercel.app/access/${token}`;

      // 2. Texte du message selon le type
      let message = "";
      if (type === "ajouter_membre") {
        message = `Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre ${link}`;
      } else if (type === "ajouter_evangelise") {
        message = `Voici le lien pour ajouter un nouvel évangélisé : 👉 Ajouter nouvel évangélisé ${link}`;
      }

      // 3. Construire l’URL WhatsApp
      let whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      if (phoneNumber.trim() !== "") {
        const cleanNumber = phoneNumber.replace(/\D/g, "");
        whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
      }

      // 4. Ouvrir WhatsApp
      window.open(whatsappUrl, "_blank");

      setLoading(false);
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg flex flex-col gap-4">
        <h3 className="text-lg font-bold">{label}</h3>

        {/* Champ numéro */}
        <input
          type="tel"
          placeholder="Entrer le numéro WhatsApp (optionnel)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border rounded-xl px-3 py-2 w-full"
        />

        {/* Boutons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
          >
            {loading ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}

