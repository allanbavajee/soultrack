// pages/evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Evangelisation() {
  const [evangelises, setEvangelises] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState({});

  useEffect(() => {
    fetchEvangelises();
    fetchCellules();
  }, []);

  const fetchEvangelises = async () => {
    // Ne récupérer que les contacts non envoyés
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .eq("statut", "evangelisé");
    if (!error && data) setEvangelises(data);
  };

  const fetchCellules = async () => {
    const { data } = await supabase.from("cellules").select("cellule,responsable,telephone");
    if (data) setCellules(data);
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
      alert("Sélectionne d'abord une cellule.");
      return;
    }

    const prenomResponsable = selectedCellule.responsable.split(" ")[0] || "Frère/Soeur";
    const telDigits = (selectedCellule.telephone || "").replace(/\D/g, "");
    if (!telDigits) return;

    // Construire le message pour tous les contacts sélectionnés
    let message = `👋 Salut ${prenomResponsable},\n\n🙏 Dieu nous a envoyé de nouvelles âmes à suivre:\n\n`;
    Object.values(selectedContacts).forEach((member, index) => {
      message += `- 👤 Nom : ${member.prenom} ${member.nom}\n`;
      message += `- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}\n`;
      message += `- 📧 Email : ${member.email || "—"}\n`;
      message += `- 🏙️ Ville : ${member.ville || "—"}\n`;
      message += `- 🙏 Besoin : ${member.besoin || "—"}\n`;
      message += `- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}\n\n`;
    });

    // Ouvrir un seul lien WhatsApp avec tous les contacts
    window.open(`https://wa.me/${telDigits}?text=${encodeURIComponent(message)}`, "_blank");

    // Marquer les contacts comme envoyés
    await Promise.all(
      Object.values(selectedContacts).map(async (member) => {
        await supabase
          .from("suivis")
          .insert({
            membre_id: member.id,
            cellule_id: selectedCellule.id,
            statut: "envoyé",
          });
      })
    );

    setSelectedContacts({});
    fetchEvangelises(); // Mettre à jour la liste pour ne plus afficher les contacts envoyés
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Évangélisés à envoyer aux cellules
      </h1>

      <div className="mb-4 w-full max-w-md mx-auto">
        <label className="block mb-2 font-semibold">Choisir une cellule :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedCellule?.cellule || ""}
          onChange={(e) => {
            const cellule = cellules.find((c) => c.cellule === e.target.value);
            setSelectedCellule(cellule || null);
          }}
        >
          <option value="">-- Sélectionner --</option>
          {cellules.map((c) => (
            <option key={c.cellule} value={c.cellule}>
              {c.cellule} ({c.responsable})
            </option>
          ))}
        </select>
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {evangelises.map((member) => (
          <div
            key={member.id}
            className="bg-white w-full p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <div className="flex justify-between items-start w-full">
              <div className="w-full">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {member.prenom} {member.nom}
                </h2>
                <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
                <p className="text-sm font-bold text-orange-500">Statut : {member.statut}</p>
              </div>
            </div>

            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={!!selectedContacts[member.id]}
                onChange={() => handleCheckbox(member)}
              />
              <span>Envoyer ce contact</span>
            </div>

            <div className="mt-2 text-sm text-gray-700 space-y-1">
              <p>Email : {member.email || "—"}</p>
              <p>Besoin : {member.besoin || "—"}</p>
              <p>Ville : {member.ville || "—"}</p>
              <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
              <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

