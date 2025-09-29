/* pages/list-members.js */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [membres, setMembres] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);

  // Récupérer les membres
  const fetchMembres = async () => {
    const { data, error } = await supabase.from("membres").select("*");
    if (error) console.error(error);
    else setMembres(data);
  };

  // Récupérer les cellules
  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("*");
    if (error) console.error(error);
    else setCellules(data);
  };

  useEffect(() => {
    fetchMembres();
    fetchCellules();
  }, []);

  const toggleContactSelection = (membre) => {
    setSelectedContacts((prev) => {
      const updated = { ...prev };
      if (updated[membre.id]) {
        delete updated[membre.id];
      } else {
        updated[membre.id] = membre;
      }
      return updated;
    });
  };

  const handleWhatsAppGroup = async () => {
    if (!selectedCellule) {
      alert("Sélectionne d'abord une cellule.");
      return;
    }

    for (const member of Object.values(selectedContacts)) {
      const prenomResponsable = selectedCellule.responsable.split(" ")[0] || "Frère/Soeur";
      const telDigits = (selectedCellule.telephone || "").replace(/\D/g, "");
      if (!telDigits) continue;

      const message = `👋 Salut ${prenomResponsable},

🙏 Dieu nous a envoyé une nouvelle âme à suivre :
- 👤 Nom : ${member.prenom} ${member.nom}
- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}
- 📧 Email : ${member.email || "—"}
- 🏙️ Ville : ${member.ville || "—"}
- 🙏 Besoin : ${member.besoin || "—"}
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}
`;

      // ouvrir WhatsApp
      window.open(
        `https://wa.me/${telDigits}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      // Mettre à jour le statut
      if (member.statut === "visiteur" || member.statut === "veut rejoindre icc") {
        const { error } = await supabase
          .from("membres")
          .update({ statut: "actif" })
          .eq("id", member.id);

        if (error) console.error("Erreur maj statut:", error);
      }
    }

    // Nettoyer la sélection et rafraîchir
    setSelectedContacts({});
    fetchMembres();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des Membres</h1>

      {/* Sélecteur de cellule */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Choisir une cellule :</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedCellule?.id || ""}
          onChange={(e) =>
            setSelectedCellule(
              cellules.find((c) => c.id === parseInt(e.target.value))
            )
          }
        >
          <option value="">-- Sélectionner --</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom} ({c.responsable})
            </option>
          ))}
        </select>
      </div>

      {/* Liste des membres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {membres.map((membre) => (
          <div
            key={membre.id}
            className={`p-4 rounded-xl shadow cursor-pointer ${
              selectedContacts[membre.id] ? "bg-green-100" : "bg-white"
            }`}
            onClick={() => toggleContactSelection(membre)}
          >
            <h2 className="text-lg font-semibold">
              {membre.prenom} {membre.nom}
            </h2>
            <p>📱 {membre.telephone}</p>
            <p>🏙️ {membre.ville}</p>
            <p>📌 Statut : {membre.statut}</p>
          </div>
        ))}
      </div>

      {/* Bouton envoyer */}
      {Object.keys(selectedContacts).length > 0 && (
        <div className="mt-6">
          <button
            onClick={handleWhatsAppGroup}
            className="bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600"
          >
            Envoyer par WhatsApp
          </button>
        </div>
      )}
    </div>
  );
}
