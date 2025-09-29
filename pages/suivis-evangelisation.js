// pages/evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Evangelisation() {
  const [evangelises, setEvangelises] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState({}); // checkbox
  const [popupMember, setPopupMember] = useState(null); // pour détails popup

  useEffect(() => {
    fetchEvangelises();
    fetchCellules();
  }, []);

  const fetchEvangelises = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .eq("statut", "evangelisé"); // uniquement les evangelisés
    if (!error && data) setEvangelises(data);
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

  const handleWhatsAppGroup = () => {
    if (!selectedCellule) {
      alert("Sélectionne d'abord une cellule.");
      return;
    }

    // Pour chaque contact sélectionné
    Object.values(selectedContacts).forEach((member) => {
      const prenomResponsable = selectedCellule.responsable.split(" ")[0] || "Frère/Soeur";
      const telDigits = (selectedCellule.telephone || "").replace(/\D/g, "");
      if (!telDigits) return;

      const message = `👋 Salut ${prenomResponsable},

🙏 Dieu nous a envoyé de nouvelles âmes à suivre:

- 👤 Nom : ${member.prenom} ${member.nom}
- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}
- 📧 Email : ${member.email || "—"}
- 🏙 Ville : ${member.ville || "—"}
- 🙏 Besoin : ${member.besoin || "—"}
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}

Merci pour ton cœur ❤️ et son amour ✨`;

      window.open(
        `https://wa.me/${telDigits}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    });

    // Supprimer les contacts envoyés de la liste
    const idsEnvoyes = Object.keys(selectedContacts);
    setEvangelises((prev) => prev.filter((m) => !idsEnvoyes.includes(m.id.toString())));
    setSelectedContacts({});
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

      {/* Liste cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {evangelises.map((member) => (
          <div
            key={member.id}
            className="bg-white w-full p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <div className="flex justify-between items-start w-full">
              <div className="w-full">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{member.prenom} {member.nom}</h2>
                <p className="text-sm text-gray-600 mb-1">{member.ville || "—"}</p>
                <p className="text-sm font-bold text-orange-500">{member.statut}</p>
              </div>
              {/* Checkbox */}
              <input
                type="checkbox"
                className="ml-2"
                checked={!!selectedContacts[member.id]}
                onChange={() => handleCheckbox(member)}
              />
            </div>

            {/* Afficher détails */}
            <p
              className="mt-2 text-blue-500 underline cursor-pointer"
              onClick={() => setPopupMember(member)}
            >
              Afficher
            </p>
          </div>
        ))}
      </div>

      {/* Popup détails */}
      {popupMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setPopupMember(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">{popupMember.prenom} {popupMember.nom}</h2>
            <p><strong>Statut:</strong> {popupMember.statut}</p>
            <p><strong>Téléphone:</strong> {popupMember.telephone}</p>
            <p><strong>Email:</strong> {popupMember.email || "—"}</p>
            <p><strong>Ville:</strong> {popupMember.ville || "—"}</p>
            <p><strong>Besoin:</strong> {popupMember.besoin || "—"}</p>
            <p><strong>Infos supplémentaires:</strong> {popupMember.infos_supplementaires || "—"}</p>

            {/* Changer le statut */}
            <div className="mt-4">
              <label className="block mb-1 font-semibold">Changer statut:</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={popupMember.statut}
                onChange={(e) =>
                  setPopupMember((prev) => ({ ...prev, statut: e.target.value }))
                }
              >
                <option value="evangelisé">Evangelisé</option>
                <option value="envoyé">Envoyé</option>
                <option value="en cours">En cours</option>
                <option value="actif">Actif</option>
                <option value="refus">Refus</option>
              </select>
              {popupMember.statut !== "evangelisé" && (
                <button
                  className="mt-3 w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                  onClick={async () => {
                    // Mettre à jour le statut dans supabase
                    await supabase
                      .from("membres")
                      .update({ statut: popupMember.statut })
                      .eq("id", popupMember.id);
                    
                    // Si actif, enlever de la liste et mettre dans list-members
                    if (popupMember.statut === "actif") {
                      setEvangelises((prev) =>
                        prev.filter((m) => m.id !== popupMember.id)
                      );
                    }
                    setPopupMember(null);
                  }}
                >
                  Valider
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
