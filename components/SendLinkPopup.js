/* components/SendLinkPopup.js */
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ type, label, buttonColor, messagePrefix, linkText }) {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Récupère le token depuis Supabase selon le type
  useEffect(() => {
    const fetchToken = async () => {
      const { data, error } = await supabase
        .from("access_token")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (!error && data) setToken(data.token);
      else setToken(null);
    };

    fetchToken();
  }, [type]);

  const handleSend = () => {
    if (!token) {
      alert("Token introuvable. Vérifie la table Supabase.");
      return;
    }

    const baseUrl = "https://soultrack-beta.vercel.app/access/";
    const url = `${baseUrl}${token}`;
    const message = `${messagePrefix}%0A${linkText} ${url}`;

    let whatsappUrl;
    if (phone) {
      // envoyer directement au numéro
      const phoneNumber = phone.replace(/\D/g, ""); // retirer tout sauf chiffres
      whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    } else {
      // laisse vide → ouvre WhatsApp pour choisir contact
      whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    }

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(true)}
        className={`w-full py-3 rounded-2xl font-bold text-white text-lg bg-gradient-to-r ${buttonColor} hover:scale-105 transition-transform duration-200`}
      >
        {label}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-lg flex flex-col gap-4">
            <h3 className="text-xl font-bold text-gray-800 text-center">{label}</h3>

            <input
              type="text"
              placeholder="Numéro WhatsApp (laisser vide pour choisir un contact)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl px-4 py-2 w-full"
            />

            <div className="flex justify-between gap-4 mt-2">
              <button
                onClick={handleSend}
                className={`flex-1 py-3 rounded-2xl font-bold text-white text-lg bg-gradient-to-r ${buttonColor} hover:scale-105 transition-transform duration-200`}
              >
                Envoyer
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 rounded-2xl font-bold text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
