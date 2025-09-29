// pages/evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Evangelisation() {
  const [evangelises, setEvangelises] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState({}); // checkbox

  useEffect(() => {
    fetchEvangelises();
    fetchCellules();
  }, []);

  // Récupérer uniquement les contacts non encore envoyés
  const fetchEvangelises = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .eq("statut", "evangelisé");
    if (!error && data) {
      // filtrer ceux déjà envoyés
      const filtered = await Promise.all(
        data.map(async (member) => {
          const { data: suiviData } = await supabase
            .from("suivis")
            .select("*")
            .eq("membre_id", member.id)
            .eq("statut", "envoyé")
            .single();
          return suiviData ? null : member;
        })
      );
      setEvangelises(filtered.filter(Boolean));
    }
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("*");
    if (!error && data) setCellules(data);
  };

  const handleCheckbox = (member) => {
    setSelectedContacts((prev) => {
      const copy = { ...prev };
      if (copy[member.id]) delete copy[member.id];
      else copy[member.id] = member;
      return copy;
    });
  };

  const handleWhatsAppGroup = async () => {
    if (!selectedCellule) {
      alert("Sélectionnez d'abord une cellule.");
      return;
    }

    for (const member of Object.values(selectedContacts)) {
      const prenomResponsable = selectedCellule.responsable.split(" ")[0] || "Frère/Soeur";
      const telDigits = (selectedCellule.telephone || "").replace(/\D/g, "");
      if (!telDigits) continue;

      const message = `👋 Salut ${prenomResponsable},

🙏 Dieu nous a envoyé une nouvelle âme à suivre.  
Voici ses infos :  

- 👤 Nom : ${member.prenom} ${member.nom}  
- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}  
- 📧 Email : ${member.email || "—"}  
- 🏙️ Ville : ${member.ville || "—"}  
- 🙏 Besoin : ${member.besoin || "—"}  
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}  

Merci pour ton cœur ❤️ et son amour ✨`;

      // Ouvrir WhatsApp
      window.open(
        `https://wa.me/${telDigits}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      // Ajouter dans la table suivis
      await supabase.from("suivis").insert({
        membre_id: member.id,
        cellule_id: selectedCellule.id,
        statut: "envoyé",
        created_at: new Date(),
      });
    }

    // Vider la sélection et recharger la liste
    setSelectedContacts({});
    fetchEvangelises();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Évangélisés à envoyer aux cellules
      </h1>

      {/* Choix cellule */}
      <div className="mb-4 w-full max-w-md mx-auto">
        <label className="block mb-2 font-semibold">Choisir une cellule :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedCellule?.id || ""}
          onChange={(e) => {
            const cellule = cellules.find((c) => c.id === e.target.value);
            setSelectedCellule(cellule || null);
          }}
        >
          <option value="">-- Sélectionner --</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cellule} ({c.responsable})
            </option>
          ))}
        </select>
      </div>

      {/* Bouton WhatsApp groupé */}
      {Object.keys(selectedContacts).length > 0 && (
        <div className="mb-4 w-full max-w-md mx-auto">
          <button
            onClick={handleWhatsAppGroup}
            className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
          >
            📤 Envoyer WhatsApp aux contacts sélectionnés
          </button>
        </div>
      )}

      {/* Liste tableau */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="text-center">
              <th className="px-4 py-2 border">Nom</th>
              <th className="px-4 py-2 border">Prénom</th>
              <th className="px-4 py-2 border">Cellule</th>
              <th className="px-4 py-2 border">Envoyer</th>
            </tr>
          </thead>
          <tbody>
            {evangelises.map((member) => (
              <tr key={member.id} className="text-center border-b">
                <td className="px-4 py-2">{member.nom}</td>
                <td className="px-4 py-2">{member.prenom}</td>
                <td className="px-4 py-2">{selectedCellule?.cellule || "-"}</td>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={!!selectedContacts[member.id]}
                    onChange={() => handleCheckbox(member)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
