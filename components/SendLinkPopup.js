/* components/SendLinkPopup.js */
"use client";

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendLinkPopup({ label, type, buttonColor }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState(null);
  const [sending, setSending] = useState(false);

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
    setSending(true);

    try {
      let memberId = null;

      if (type === "ajouter_membre" || type === "ajouter_evangelise") {
        // Vérifier si le membre existe déjà
        const { data: existingMember, error: memberError } = await supabase
          .from("membres")
          .select("*")
          .eq("telephone", phone.trim())
          .single();

        if (memberError && memberError.code !== "PGRST116") throw memberError;

        if (!existingMember) {
          // Créer un nouveau membre
          const { data: newMember, error: insertError } = await supabase
            .from("membres")
            .insert([{ telephone: phone.trim(), statut: "envoye" }])
            .select()
            .single();
          if (insertError) throw insertError;
          memberId = newMember.id;
        } else {
          memberId = existingMember.id;
        }

        // Créer le suivi
        const { error: suiviError } = await supabase
          .from("suivis_membres")
          .insert([{ membre_id: memberId, statut: "envoye" }]);
        if (suiviError) throw suiviError;

        // Mettre à jour le statut du membre pour qu'il ne soit plus "Nouveau"
        await supabase
          .from("membres")
          .update({ statut: "actif" })
          .eq("id", memberId);
      }

      // Générer le lien WhatsApp
      const link = type !== "voir_copier" ? `${window.location.origin}/access/${token}` : "https://soultrack-beta.vercel.app/";
      const message =
        type === "ajouter_membre"
          ? `Voici le lien pour ajouter un nouveau membre : 👉 Ajouter nouveau membre ${link}`
          : type === "ajouter_evangelise"
          ? `Voici le lien pour ajouter un nouveau évangélisé : 👉 Ajouter nouveau évangélisé ${link}`
          : `Voici le lien pour accéder à l'application : 👉 Accéder à l'application ${link}`;

      const waUrl = phone
        ? `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;

      window.open(waUrl, "_blank");
      setPhone("");
      setShowPopup(false);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du lien.");
    } finally {
      setSending(false);
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
                disabled={sending}
                className="px-4 py-2 rounded-xl text-white font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600"
              >
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  

