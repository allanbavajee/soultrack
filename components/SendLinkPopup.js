// components/SendLinkPopup.js
"use client";
import { useState } from "react";

export default function SendLinkPopup({ label, buttonColor }) {
  const [isOpen, setIsOpen] = useState(false);

  // 🔗 Lien à partager (tu peux le personnaliser)
  const appLink = "https://soultrack.app/inscription";

  const handleCopy = () => {
    navigator.clipboard.writeText(appLink);
    alert("Lien copié ✅");
  };

  const handleWhatsapp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `Bonjour 👋, voici le lien pour rejoindre : ${appLink}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div>
      {/* Bouton principal */}
      <button
        onClick={() => setIsOpen(true)}
        className={`w-full py-3 px-6 rounded-2xl text-white font-semibold shadow-md transition-all duration-200 bg-gradient-to-r ${buttonColor} hover:opacity-90`}
      >
        {label}
      </button>

      {/* Popup */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Partager le lien
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Voici le lien pour partager l’application :
            </p>
            <div className="bg-gray-100 p-3 rounded-md text-gray-700 text-sm break-all">
              {appLink}
            </div>

            {/* Boutons d’action */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handleCopy}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-medium shadow hover:opacity-90"
              >
                Copier
              </button>
              <button
                onClick={handleWhatsapp}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-medium shadow hover:opacity-90"
              >
                WhatsApp
              </button>
            </div>

            {/* Fermer */}
            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
