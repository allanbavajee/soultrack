/* components/MemberCard.js */

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function MemberCard({ member, fetchMembers }) {
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Charger toutes les cellules
  useEffect(() => {
    async function fetchCellules() {
      const { data, error } = await supabase
        .from("cellules")
        .select("cellule, responsable, telephone");

      if (!error && data) setCellules(data);
    }
    fetchCellules();
  }, []);

  // Envoyer WhatsApp et mettre à jour le statut
  const handleWhatsApp = async () => {
    if (!selectedCellule) return;

    const prenomResponsable = selectedCellule.responsable.split(" ")[0]; // seulement le prénom
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

    // Mise à jour du statut
    await supabase.from("membres").update({ statut: "ancien" }).eq("id", member.id);
    fetchMembers();
  };

  // Style de la carte
  const cardStyle =
    member.star
      ? "bg-green-100 border-green-400"
      : member.statut === "ancien"
      ? "bg-white border-gray-300"
      : "bg-orange-100 border-orange-400";

  return (
    <div className={`p-4 rounded-xl border shadow mb-3 ${cardStyle}`}>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">
          {member.prenom} {member.nom}
        </h2>
        <span className="text-sm font-semibold text-orange-600">{member.statut}</span>
      </div>

      <p className="text-sm text-gray-600">📱 {member.telephone}</p>

      {/* Texte bleu cliquable pour afficher les détails */}
      <p
        onClick={() => setShowDetails(!showDetails)}
        className="mt-2 text-sm text-blue-500 underline cursor-pointer"
      >
        {showDetails ? "Fermer détails" : "Voir détails"}
      </p>

      {showDetails && (
        <div className="mt-3 text-sm text-gray-700 space-y-1">
          <p>Email : {member.email || "—"}</p>
          <p>Besoin : {member.besoin || "—"}</p>
          <p>Ville : {member.ville || "—"}</p>
          <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
          <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
          <p>Comment venu : {member.how_came || "—"}</p>

          {/* Menu déroulant + WhatsApp pour visiteurs et ceux qui veulent rejoindre ICC */}
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
