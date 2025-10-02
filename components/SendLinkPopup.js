/* components/SendLinkPopup.js */
"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ type, label, buttonColor, linkText }) {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchToken = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("access_token")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (error || !data) {
        setError("Token introuvable. Vérifie la table Supabase.");
        setLoading(false);
        return;
      }

      const tokenLink = `https://soultrack-beta.vercel.app/access/${data.token}`;
      setLink(tokenLink);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la récupération du token");
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    fetchToken();
  };

  const handleSendWhatsapp = () => {
    if (!link) return;

    // Message personnalisé avec texte cliquable
    // Exemple : "Voici le lien pour ajouter un 👉 Nouvel évangélisé"
    const message = `Voici le lien pour ajouter un ${linkText}`;
    const encodedMessage = encodeURIComponent(`${message} ${link}`);

    const whatsappUrl = whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`; // vide = choisir contact

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div>
      <button
        className={`w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${buttonColor} hover:opacity-90 transition-all duration-200`}
        onClick={handleOpen}
      >
        {label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-lg flex flex-col gap-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-gray-800 text-center">{label}</h3>

            {loading && <p className="text-center text-gray-600">Chargement du token...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && link && (
              <>
                <input
                  type="text"
                  placeholder="Saisir le numéro WhatsApp (optionnel)"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="border rounded-xl px-4 py-2 w-full"
                />

                <button
                  className={`w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r ${buttonColor} hover:opacity-90 transition-all duration-200`}
                  onClick={handleSendWhatsapp}
                >
                  Envoyer
                </button>

                <p className="text-center text-gray-700 mt-2">
                  Ou copier le lien :{" "}
                  <span
                    className="text-blue-600 font-semibold cursor-pointer underline"
                    onClick={() => navigator.clipboard.writeText(link)}
                  >
                    {linkText}
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
