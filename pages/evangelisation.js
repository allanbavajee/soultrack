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

  // Récupère uniquement les membres evangelisés non encore envoyés
  const fetchEvangelises = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .eq("statut", "evangelisé"); // uniquement à envoyer

    if (!error && data) {
      setEvangelises(data);
    }
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("cellule,responsable,telephone");

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

    const membresAEnvoyer = Object.values(selectedContacts);

    for (const member of membresAEnvoyer) {
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

      // Ouvre WhatsApp pour chaque contact
      window.open(
        `https://wa.me/${telDigits}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      // Mets à jour le statut du membre dans la base pour qu'il disparaisse de la liste
      await supabase
        .from("membres")
        .update({ statut: "envoyé" })
        .eq("id", member.id);

      // Crée un suivi pour la cellule
      await supabase.from("suivis").insert({
        membre_id: member.id,
        cellule_id: selectedCellule.id,
        statut: "envoyé",
        created_at: new Date(),
      });
    }

    // Vide la sélection
    setSelectedContacts({});
    // Recharge la liste des evangelises
    fetchEvangelises();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Évangélisés à envoyer aux cellules
      </h1>
  {/* Flèche retour */}
        <button
          onClick={() => router.back()}
           className="flex items-center text-orange-500 font-semibold mb-4 hover:text-orange-600 transition-colors"
        >
          ← Retour
        </button>

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
            <option key={c.cellule} value={c.cellule}>
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
            <div className="flex justify-between items-start w-full">
              <div className="w-full">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {member.prenom} {member.nom}
                </h2>
                <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
                <p className="text-sm font-bold text-orange-500">Statut : {member.statut}</p>
              </div>
            </div>

            {/* Checkbox "Envoyer ce contact" */}
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={!!selectedContacts[member.id]}
                onChange={() => handleCheckbox(member)}
              />
              <span>Envoyer ce contact</span>
            </div>

            {/* Détails */}
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


