/* components/SendWhatsappButtons.js */
"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type }) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [link, setLink] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Récupérer un token dispo dans Supabase
  const getToken = async () => {
    const { data, error } = await supabase
      .from("access_token")
      .select("token")
      .eq("access_type", type)
      .is("profile_id", null)
      .is("user_id", null)
      .limit(1);

    if (error || !data || data.length === 0) {
      alert("Aucun token disponible pour le moment.");
      return;
    }

    const token = data[0].token;
    const url = `https://soultrack-beta.vercel.app/access/${token}`;
    setLink(url);
    setPopupOpen(true);
  };

  // Copier le lien
  const copyLink = () => {
    navigator.clipboard.writeText(link);
    alert("Lien copié !");
  };

  // Envoyer sur WhatsApp
  const sendWhatsapp = () => {
    if (!phoneNumber) {
      alert("Saisis un numéro WhatsApp.");
      return;
    }
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      `Voici ton lien d'accès : ${link}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Bouton principal */}
      <button
        onClick={getToken}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-md hover:opacity-90 transition-all"
      >
        {type === "ajouter_membre"
          ? "Envoyer l'appli – Nouveau membre"
          : "Envoyer l'appli – Évangélisé"}
      </button>

      {/* Popup */}
      {popupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96 flex flex-col gap-4">
            <h3 className="text-lg font-bold text-gray-800">Partager le lien</h3>

            <input
              type="text"
              value={link}
              readOnly
              className="border rounded-lg px-3 py-2 w-full bg-gray-100"
            />

            <div className="flex gap-2">
              <button
                onClick={copyLink}
                className="flex-1 bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition-all"
              >
                Copier
              </button>
              <button
                onClick={() => setPopupOpen(false)}
                className="flex-1 bg-gray-400 text-white py-2 rounded-xl hover:bg-gray-500 transition-all"
              >
                Fermer
              </button>
            </div>

            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">
                Numéro WhatsApp :
              </label>
              <input
                type="text"
                placeholder="Ex: 2301234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
              <button
                onClick={sendWhatsapp}
                className="mt-2 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-xl hover:opacity-90 transition-all"
              >
                Envoyer sur WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
