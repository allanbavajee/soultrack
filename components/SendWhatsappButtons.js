/* components/SendWhatsappButtons.js */
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type }) {
  const [token, setToken] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const { data, error } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (data) setToken(data.token);
    };

    fetchToken();
  }, [type]);

  const handleSend = () => {
    if (!token) return alert("Token introuvable. Vérifie la table Supabase.");

    // Construction du lien
    const url = `https://soultrack-beta.vercel.app/access/${token}`;

    // Message personnalisé
    const message =
      type === "ajouter_membre"
        ? `Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre`
        : type === "ajouter_evangelise"
        ? `Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé`
        : `Voici le lien : 👉 Cliquer ici`;

    // WhatsApp
    const whatsappUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="text"
        placeholder="Numéro WhatsApp (laisser vide pour choisir un contact)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border px-3 py-2 rounded-xl w-full"
      />
      <button
        onClick={handleSend}
        className={`bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white font-bold py-2 rounded-2xl transition-all duration-200 hover:opacity-90`}
      >
        Envoyer
      </button>
    </div>
  );
}
