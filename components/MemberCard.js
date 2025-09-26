// components/MemberCard.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MemberCard({ member, fetchMembers, cellules }) {
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // ✅ Couleur en fonction du statut
  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D"; // Jaune star
    if (member.statut === "a déjà mon église") return "#4285F4"; // Bleu
    if (member.statut === "evangelisé") return "#34A853"; // Vert
    if (member.statut === "actif") return "#fbbc05"; // Jaune/orange
    if (member.statut === "ancien") return "#EA4335"; // Rouge
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34a853"; // Vert foncé
    return "#999"; // Par défaut
  };

  // ✅ Envoi WhatsApp
  const handleWhatsApp = async () => {
    if (!selectedCellule) return;

    const prenomResponsable = selectedCellule.responsable.split(" ")[0];
    const message = `👋 Salut ${prenomResponsable},

🙏 Dieu nous a envoyé une nouvelle âme à suivre.  
Voici ses infos :  

- 👤 Nom : ${member.prenom} ${member.nom}  
- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}  
- 📧 Email : ${member.email || "—"}  
- 🏙️ Ville : ${member.ville || "—"}  
- 🙏 Besoin : ${member.besoin || "—"}  
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}  

Merci pour ton cœur ❤️ et ton amour ✨`;

    window.open(
      `https://wa.me/${selectedCellule.telephone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // ✅ Met à jour le statut en "ancien"
    await supabase.from("membres").update({ statut: "ancien" }).eq("id", member.id);
    fetchMembers();
  };

  return (
    <div
      className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
      style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center">
            {member.prenom} {member.nom}{" "}
            {member.star && <span className="ml-2 text-yellow-400">⭐</span>}
          </h2>
          <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
          <p className="text-sm text-gray-500">Statut : {member.statut}</p>
        </div>
      </div>

      {/* 🔹 Lien texte bleu pour voir les détails */}
      <p
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 text-sm text-blue-500 underline cursor-pointer"
      >
        {showDetails ? "Fermer détails" : "Voir détails"}
      </p>

      {/* 🔹 Détails affichés au clic */}
      {showDetails && (
        <div className="mt-3 text-sm text-gray-700 space-y-1">
          <p>Email : {member.email || "—"}</p>
          <p>Besoin : {member.besoin || "—"}</p>
          <p>Ville : {member.ville || "—"}</p>
          <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
          <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
          <p>Comment venu : {member.how_came || "—"}</p>

          {/* ✅ Si statut visiteur / veut rejoindre ICC */}
          {(member.statut === "visiteur" || member.statut === "veut rejoindre ICC") && (
            <div className="mt-3">
              <label className="block mb-1 font-semibold">Choisir une cellule :</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedCellule?.cellule || ""}
                onChange={(e) => {
                  const cellule = cellules.find((c) => c.cellule === e.target.value);
                  setSelectedCellule(cellule);
                }}
              >
                <option value="">-- Sélectionner --</option>
                {cellules.length > 0 ? (
                  cellules.map((c) => (
                    <option key={c.cellule} value={c.cellule}>
                      {c.cellule} ({c.responsable})
                    </option>
                  ))
                ) : (
                  <option value="">⚠️ Aucune cellule trouvée</option>
                )}
              </select>

              {selectedCellule && (
                <button
                  onClick={handleWhatsApp}
                  className="mt-2 w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                >
                  📤 Envoyer sur WhatsApp
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
