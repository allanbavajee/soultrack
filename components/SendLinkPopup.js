/*components/SendLinkPopup.js*/
"use client";

import { useState } from "react";

export default function SendLinkPopup({ label }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");

  const handleSend = () => {
    const link = "https://soultrack-beta.vercel.app/";
    const message = `Voici votre accès à SoulTrack : 👉 Accéder`;
    const encodedMessage = encodeURIComponent(message.replace(/👉 .+$/, `👉 ${link}`));

    if (!phone) {
      // ouvrir WhatsApp pour choisir un contact existant
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
    } else {
      const cleanedPhone = phone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanedPhone}?text=${encodedMessage}`, "_blank");
    }

    setShowPopup(false);
    setPhone("");
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setShowPopup(true)}
        className="w-full py-3 rounded-2xl text-white font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 transition-all duration-200"
      >
        {label}
      </button>

      {showPopup && (
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
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
