/*components/SendLinkPopup.js*/
"use client";

import { useState } from "react";

export default function SendLinkPopup({ label, buttonColor, responsables }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedResponsable, setSelectedResponsable] = useState(responsables[0]?.email || "");
  
  const handleSend = () => {
    const responsable = responsables.find(r => r.email === selectedResponsable);
    if (!responsable) return;

    // Construire le message WhatsApp
    const message = `Voici votre accès SoulTrack : 👉 ${responsable.label}`;

    // Ouvrir WhatsApp ou copier
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    setShowPopup(false);
  };

  const handleCopy = () => {
    const responsable = responsables.find(r => r.email === selectedResponsable);
    if (!responsable) return;

    const message = `Voici votre accès SoulTrack : 👉 ${responsable.label}`;
    navigator.clipboard.writeText(message);
    alert("Lien copié dans le presse-papier !");
    setShowPopup(false);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setShowPopup(true)}
        className={`w-full py-3 rounded-2xl text-white font-bold bg-gradient-to-r ${buttonColor} transition-all duration-200`}
      >
        {label}
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg flex flex-col gap-4">
            <h3 className="text-lg font-bold">{label}</h3>
            <select
              className="border rounded-xl px-3 py-2 w-full"
              value={selectedResponsable}
              onChange={(e) => setSelectedResponsable(e.target.value)}
            >
              {responsables.map(r => (
                <option key={r.email} value={r.email}>{r.name} ({r.email})</option>
              ))}
            </select>
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 font-bold"
              >
                Annuler
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
              >
                Copier
              </button>
              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"
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

