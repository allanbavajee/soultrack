/* components/SendLinkPopup.js */
"use client";
import { useState } from "react";
import { Copy, Share2, X } from "lucide-react";

export default function SendLinkPopup() {
  const [show, setShow] = useState(false);
  const adminLinks = {
    integration: "https://soultrack-beta.vercel.app/home?admin=integration",
    evangelisation: "https://soultrack-beta.vercel.app/home?admin=evangelisation",
  };

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    alert("Lien copié !");
  };

  const shareLink = (link) => {
    if (navigator.share) {
      navigator.share({ title: "Lien SoulTrack", url: link });
    } else {
      alert("Partage non supporté sur cet appareil");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={() => setShow(!show)}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200"
      >
        Voir / Copier liens responsables
      </button>

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md flex flex-col gap-4 relative shadow-xl">
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
              Liens permanents des responsables
            </h3>

            {Object.entries(adminLinks).map(([role, link]) => (
              <div
                key={role}
                className="flex justify-between items-center border p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
              >
                <span className="text-gray-800 font-medium">
                  {role === "integration" ? "Integration" : "Évangélisation"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(link)}
                    className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => shareLink(link)}
                    className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
