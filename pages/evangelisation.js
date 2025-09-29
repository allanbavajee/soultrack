// pages/evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Evangelisation() {
  const router = useRouter();
  const [evangelises, setEvangelises] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [detailsOpen, setDetailsOpen] = useState({});

  useEffect(() => {
    fetchEvangelises();
    fetchCellules();
  }, []);

  const fetchEvangelises = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .eq("statut", "evangelisé");
    if (!error && data) setEvangelises(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id, cellule, responsable, telephone");
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
      alert("Sélectionne d'abord une cellule.");
      return;
    }

    const contactsToSend = Object.values(selectedContacts);
    if (contactsToSend.length === 0) return;

    const prenomResponsable = selectedCellule.responsable.split(" ")[0] || "Frère/Soeur";
    const telDigits = (selectedCellule.telephone || "").replace(/\D/g, "");
    if (!telDigits) return;

    // Construire le message pour tous les contacts
    let message = `👋 Salut ${prenomResponsable},\n\n🙏 Dieu nous a envoyé de nouvelles âmes à suivre:\n\n`;
    contactsToSend.forEach((member) => {
      message += `- 👤 Nom : ${member.prenom} ${member.nom}\n`;
      message += `- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}\n`;
      message += `- 📧 Email : ${member.email || "—"}\n`;
      message += `- 🏙 Ville : ${member.ville || "—"}\n`;
      message += `- 🙏 Besoin : ${member.besoin || "—"}\n`;
      message += `- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}\n\n`;
    });

    window.open(`https://wa.me/${telDigits}?text=${encodeURIComponent(message)}`, "_blank");

    // Marquer les contacts comme envoyés dans la table "suivis"
    for (const member of contactsToSend) {
      await supabase.from("suivis").insert({
        membre_id: member.id,
        cellule_id: selectedCellule.id,
        statut: "envoyé",
      });
    }

    // Retirer les contacts envoyés de la liste
    setEvangelises((prev) => prev.filter((m) => !selectedContacts[m.id]));
    setSelectedContacts({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Flèche retour */}
      <button
        className="text-orange-500 font-semibold mb-4"
        onClick={() => router.back()}
      >
        ← Retour
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Évangélisés à envoyer aux cellules
      </h1>

      {/* Choix cellule */}
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
            <option key={c.id} value={c.cellule}>
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

      {/* Liste cartes evangelisés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {evangelises.map((member) => (
          <div
            key={member.id}
            className="bg-white w-full p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">{member.prenom} {member.nom}</h2>
            <p className="text-sm font-semibold text-gray-600 mb-1">Ville : {member.ville || "—"}</p>
            <p className="text-sm font-bold text-orange-500 mb-2">Statut : {member.statut}</p>

            {/* Checkbox */}
            <div className="mt-2 flex items-center mb-2">
              <input
                type="checkbox"
                className="mr-2"
                checked={!!selectedContacts[member.id]}
                onChange={() => handleCheckbox(member)}
              />
              <span>Envoyer ce contact</span>
            </div>

            {/* Bouton afficher détails */}
            <p
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() =>
                setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
              }
            >
              {detailsOpen[member.id] ? "Cacher détails" : "Afficher détails"}
            </p>

            {/* Détails complets */}
            {detailsOpen[member.id] && (
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>Email : {member.email || "—"}</p>
                <p>Besoin : {member.besoin || "—"}</p>
                <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
                <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

