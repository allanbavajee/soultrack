//components/BoutonEnvoyer.js
"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function BoutonEnvoyer({ membre, cellule }) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    // Vérifier la session utilisateur (on récupère la session si possible,
    // mais on NE BLOQUE PAS si elle est absente pour éviter l'erreur "utilisateur non connecté")
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        // on log l'erreur de session, mais on continue (ne pas interrompre l'envoi)
        console.error("Erreur de session:", sessionError.message);
      } else if (!session) {
        // pas de session active : on log pour info mais on continue l'opération
        console.warn("Aucune session active (envoi autorisé en mode public).");
      }
    } catch (e) {
      // Si l'appel getSession lui-même plante, on ignore et on continue
      console.warn("Impossible de vérifier la session (continuation de l'envoi).", e);
    }

    if (!cellule) {
      alert("⚠️ Sélectionne une cellule avant d’envoyer !");
      return;
    }

    setLoading(true);

    try {
      // Insertion dans la table suivis_membres
      const { error } = await supabase.from("suivis_membres").insert([
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

      if (error) {
        console.error("Erreur insertion :", error);
        alert("❌ Erreur lors de l’envoi vers le suivi");
      } else {
        // ✅ Mise à jour du statut du membre en "actif" si c'était un visiteur ou "veut rejoindre ICC"
        if (
          membre.statut === "visiteur" ||
          membre.statut === "veut rejoindre ICC"
        ) {
          try {
            const { error: updateError } = await supabase
              .from("membres")
              .update({ statut: "actif" })
              .eq("id", membre.id);

            if (updateError) {
              console.error(
                "Erreur mise à jour statut membre :",
                updateError.message
              );
              // on ne bloque pas l'affichage : on affiche quand même la confirmation d'envoi
            } else {
              console.log(
                `✅ Statut de ${membre.prenom} ${membre.nom} passé en "actif"`
              );
            }
          } catch (e) {
            console.error("Exception lors de la mise à jour statut :", e);
          }
        }

        alert(
          `✅ ${membre.prenom} ${membre.nom} a été envoyé vers ${cellule.cellule}`
        );
        setSent(true);
      }
    } catch (err) {
      console.error("Exception lors de l’envoi :", err?.message ?? err);
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
