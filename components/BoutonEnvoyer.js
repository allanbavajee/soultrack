"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function BoutonEnvoyer({
  membre,
  type = "cellule",
  cible,
  session,
  onEnvoyer,
  showToast,
}) {
  const [loading, setLoading] = useState(false);

  const statutIds = {
    envoye: 1,
    "en attente": 2,
    integrer: 3,
    refus: 4,
  };

  const sendToWhatsapp = async (force = false) => {
    if (!session) {
      alert("❌ Vous devez être connecté pour envoyer un membre.");
      return;
    }

    if (!cible) {
      alert("❌ Sélectionnez une cible !");
      return;
    }

    setLoading(true);

    try {
      /* =======================
         1️⃣ Vérifier doublon
      ======================= */
      const { data: existing, error: selectError } = await supabase
        .from("suivis_membres")
        .select("id")
        .eq("telephone", membre.telephone || "");

      if (selectError) throw selectError;

      if (existing.length > 0 && !force) {
        alert(
          `⚠️ Le contact ${membre.prenom} ${membre.nom} est déjà dans les suivis.`
        );
        setLoading(false);
        return;
      }

      /* =======================
         2️⃣ Déterminer le responsable
      ======================= */
      let responsablePrenom = "";
      let responsableTelephone = "";

      if (type === "cellule") {
        if (!cible.responsable_id) {
          throw new Error("Responsable de cellule introuvable");
        }

        const { data: responsable, error: respError } = await supabase
          .from("profiles")
          .select("prenom, telephone")
          .eq("id", cible.responsable_id)
          .single();

        if (respError || !responsable) {
          throw new Error("Responsable de cellule introuvable");
        }

        responsablePrenom = responsable.prenom;
        responsableTelephone = responsable.telephone;
      }

      if (type === "conseiller") {
        responsablePrenom = cible.prenom;
        responsableTelephone = cible.telephone;
      }

      if (!responsableTelephone) {
        throw new Error("Le responsable n'a pas de numéro WhatsApp valide");
      }

      /* =======================
         3️⃣ Créer le suivi
      ======================= */
      const suiviData = {
        membre_id: membre.id,
        prenom: membre.prenom,
        nom: membre.nom,
        telephone: membre.telephone,
        is_whatsapp: true,
        ville: membre.ville,
        besoin: membre.besoin,
        infos_supplementaires: membre.infos_supplementaires,
        statut_suivis: statutIds.envoye,
        created_at: new Date().toISOString(),
      };

      if (type === "cellule") {
        suiviData.cellule_id = cible.id;
        suiviData.cellule_nom =
          cible.cellule_full || cible.cellule || "—";
        suiviData.responsable = responsablePrenom;
      }

      if (type === "conseiller") {
        suiviData.conseiller_id = cible.id;
        suiviData.responsable = responsablePrenom;
      }

      const { data: insertedData, error: insertError } = await supabase
        .from("suivis_membres")
        .insert([suiviData])
        .select()
        .single();

      if (insertError) throw insertError;

      /* =======================
         4️⃣ Mettre membre actif
      ======================= */
      const { error: updateError } = await supabase
        .from("membres")
        .update({ statut: "actif" })
        .eq("id", membre.id);

      if (updateError) throw updateError;

      if (onEnvoyer) onEnvoyer(insertedData);

      /* =======================
         5️⃣ Message WhatsApp
      ======================= */
      let message = `👋 Bonjour ${responsablePrenom}\n\n`;
      message += `✨ Un nouveau membre est placé sous tes soins.\n\n`;
      message += `👤 Nom: ${membre.prenom} ${membre.nom}\n`;
      message += `⚥ Sexe: ${membre.sexe || "—"}\n`;
      message += `📱 Téléphone: ${membre.telephone || "—"}\n`;
      message += `💬 WhatsApp: ${membre.is_whatsapp ? "Oui" : "Non"}\n`;
      message += `🏙 Ville: ${membre.ville || "—"}\n`;
      message += `🙏 Besoin: ${
        Array.isArray(membre.besoin)
          ? membre.besoin.join(", ")
          : membre.besoin || "—"
      }\n`;
      message += `📝 Infos supplémentaires: ${
        membre.infos_supplementaires || "—"
      }\n\n`;
      message += `Merci pour ton accompagnement ❤️`;

      const phone = responsableTelephone.replace(/\D/g, "");

      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      if (showToast) {
        showToast(
          `✅ ${membre.prenom} ${membre.nom} a été envoyé à ${responsablePrenom}`
        );
      }
    } catch (err) {
      console.error("Erreur sendToWhatsapp:", err);
      alert("❌ Une erreur est survenue lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={() => sendToWhatsapp()}
      disabled={loading}
      className={`w-full text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-500 hover:bg-green-600"
      }`}
    >
      {loading ? "Envoi..." : "📤 Envoyer par WhatsApp"}
    </button>
  );
}
