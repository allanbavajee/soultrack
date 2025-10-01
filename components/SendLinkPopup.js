/* components/SendLinkPopup.js */
"use client";
import { useState } from "react";

export default function SendLinkPopup() {
  const [showPopup, setShowPopup] = useState(false);

  const links = [
    {
      name: "Lucie Des Jardins",
      role: "Responsable Integration",
      url: "https://soultrack-beta.vercel.app/index?userId=7021fc57-bf07-48cb-8050-99d0db8e8e7d",
    },
    {
      name: "Clency Ravina",
      role: "Responsable Evangelisation",
      url: "https://soultrack-beta.vercel.app/index?userId=f9fc287b-a3fb-43d5-a1c4-ed4a316204b2",
    },
  ];

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    alert("Lien copié dans le presse-papiers !");
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
        onClick={() => setShowPopup(true)}
      >
        📎 Envoyer le lien
      </button>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-lg flex flex-col gap-4 items-center relative">
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-800 font-bold text-lg"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold text-center">Liens permanents à envoyer</h3>

            {links.map((link) => (
              <div key={link.name} className="w-full flex flex-col gap-2 items-center bg-gray-100 p-3 rounded-lg">
                <p className="font-semibold">{link.name} ({link.role})</p>
                <input
                  type="text"
                  value={link.url}
                  readOnly
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-700"
                />
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg mt-1"
                  onClick={() => handleCopy(link.url)}
                >
                  Copier le lien
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
