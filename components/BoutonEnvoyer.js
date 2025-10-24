//components/BoutonEnvoyer.js

"use client";
import supabase from "../lib/supabaseClient";

export default function BoutonEnvoyer({ membre, cellule, onStatusUpdate, session }) {
  const handleSend = async () => {
    if (!session) {
      alert("❌ Vous devez être connecté pour envoyer un membre à une cellule.");
      return;
    }

    if (!cellule) {
      alert("❌ Veuillez sélectionner une cellule !");
      return;
    }

    const now = new Date().toISOString();

    const suivisData = {
      prenom: membre.prenom,
      nom: membre.nom,
      telephone: membre.telephone,
      is_whatsapp: true,
      ville: membre.ville,
      besoin: membre.besoin,
      infos_supplementaires: membre.infos_supplementaires,
      cellule_id: cellule.id,
      responsable_cellule: cellule.responsable,
      date_suivi: now,
    };

    // Insertion du suivi
    const { error: insertError } = await supabase
      .from("suivis_des_membres")
      .insert([suivisData]);

    if (insertError) {
      console.error("Erreur lors de l'insertion du suivi :", insertError.message);
      alert("❌ Une erreur est survenue lors de l’enregistrement du suivi.");
      return;
    }

    // Mise à jour du statut du membre
    const { error: updateError } = await supabase
      .from("membres")
      .update({ statut: "Integrer" })
      .eq("id", membre.id);

    if (updateError) {
      console.error("Erreur lors de la mise à jour du statut :", updateError.message);
      alert("❌ Erreur lors de la mise à jour du statut du membre.");
      return;
    }

    // Notification WhatsApp
    const phone = cellule.telephone.replace(/\D/g, "");
    const message = `👋 Salut ${cellule.responsable},\n\n🙏 Voici les infos du membre à intégrer :\n- Nom : ${membre.prenom} ${membre.nom}\n- Téléphone : ${membre.telephone || "—"}\n- Ville : ${membre.ville || "—"}\n- Besoin : ${membre.besoin || "—"}\n- Infos supplémentaires : ${membre.infos_supplementaires || "—"}\n\n🙏 Merci !`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    alert("✅ Membre envoyé avec succès !");
    onStatusUpdate(membre.id, "Integrer");
  };

  return (
    <button
      onClick={handleSend}
      className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all"
    >
      Envoyer à la cellule
    </button>
  );
}

