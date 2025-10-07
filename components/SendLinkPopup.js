/* components/SendLinkPopup.js */
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ label, type, buttonColor }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (type === "voir_copier") return;

    const fetchToken = async () => {
      const { data, error } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("access_type", type)
        .limit(1)
        .single();

      if (!error && data) setToken(data.token);
    };

    fetchToken();
  }, [type]);

  const handleSend = async () => {
    setLoading(true);

    try {
      let membreId = null;

      if (type === "ajouter_membre" || type === "ajouter_evangelise") {
        // Vérifie si le numéro existe déjà
        const { data: existingMembre } = await supabase
          .from("membres")
          .select("*")
          .eq("telephone", phone.trim())
          .single();

        if (existingMembre) {
          membreId = existingMembre.id;
        } else {
          // Crée le membre
          const { data: newMembre, error: insertError } = await supabase
            .from("membres")
            .insert({
              prenom: "—",
              nom: "—",
              telephone: phone.trim(),
              statut: "envoye",
              is_whatsapp: true,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          membreId = newMembre.id;
        }

        // Crée le suivi
        await supabase.from("suivis_membres").insert({
          membre_id: membreId,
          statut: "envoye",
        });
      }

      // Génère le lien WhatsApp
      let message = "";
      if (type === "ajouter_membre") {
        message = `Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre`;
      } else if (type === "ajouter_evangelise") {
        message = `Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé`;
      } else if (type === "voir_copier") {
        message = `Voici le lien pour accéder à l'application : 👉 Accéder à l'application`;
      }

      const waUrl =
        type === "voir_copier"
          ? `https://wa.me/${phone.trim()}?text=${encodeURIComponent(
              message + " https://soultrack-beta.vercel.app/"
            )}`
          : `https://wa.me/${phone.trim()}?text=${encodeURIComponent(
              message + " " + window.location.origin + "/access/" + token
            )}`;

      window.open(waUrl, "_blank");
      setShowPopup(false);
      setPhone("");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi ou de l'ajout du membre : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if ((type === "ajouter_membre" || type === "ajouter_evangelise") && !token) {
    return (
      <button
        className={`w-full py-3 rounded-2xl text-white font-bold ${buttonColor} cursor-not-allowed`}
        disabled
      >
        {label} - Token introuvable
      </button>
    );
  }

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
            {type !== "voir_copier" && (
              <p className="text-sm text-gray-700">
                Laissez vide pour sélectionner un contact existant sur WhatsApp
              </p>
            )}
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
                disabled={loading}
                className="px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600"
              >
                {loading ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

