"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function BoutonEnvoyer({ membre, cellule, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setLoading(true);

    try {
      // Vérifie la session Supabase
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Erreur session:", sessionError.message);
        alert("❌ Erreur de session Supabase");
        setLoading(false);
        return;
      }

      if (!session) {
        alert("❌ Erreur : utilisateur non connecté");
        setLoading(false);
        return;
      }

      if (!cellule) {
        alert("⚠️ Sélectionne une cellule avant d’envoyer !");
        setLoading(false);
        return;
      }

      // ✅ Insère dans la table suivis_membres
      const { error: insertError } = await supabase.from("suivis_membres").insert([
        {
          membre_id: membre.id,
          cellule_id: cellule.id,
          prenom: membre.prenom,
          nom: membre.nom,
          telephone: membre.telephone,
          statut_membre: membre.statut,
          besoin: membre.besoin,
          infos_supplementaires: membre.infos_supplementaires,
          cellule_nom: cellule.cellule,
          responsable: cellule.responsable,
          statut: "envoye",
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) {
        console.error("Erreur insertion :", insertError.message);
        alert("❌ Erreur lors de l’envoi vers le suivi");
        setLoading(false);
        return;
      }

      // ✅ Met à jour le statut du membre immédiatement
      const { error: updateError } = await supabase
        .from("membres")
        .update({ statut: "actif" })
        .eq("id", membre.id);

      if (updateError) {
        console.error("Erreur update statut :", updateError.message);
      } else {
        if (onStatusChange) onStatusChange(membre.id, "actif");
      }

      alert(`✅ ${membre.prenom} ${membre.nom} a été envoyé vers ${cellule.cellule}`);
      setSent(true);
    } catch (err) {
      console.error("Exception :", err.message);
      alert("Erreur inattendue lors de l’envoi");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleSend}
      disabled={loading || sent}
      className={`mt-3 w-full py-2 rounded-lg text-white font-semibold transition duration-300 ${
        sent
          ? "bg-green-500 cursor-not-allowed"
          : loading
          ? "bg-gray-400 cursor-wait"
          : "bg-indigo-600 hover:bg-indigo-700"
      }`}
    >
      {sent ? "✅ Envoyé" : loading ? "⏳ Envoi..." : "📤 Envoyer vers suivis"}
    </button>
  );
}
