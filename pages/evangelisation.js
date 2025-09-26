import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Evangelisation() {
  const [members, setMembers] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState({});

  useEffect(() => {
    fetchEvangelises();
    fetchCellules();
  }, []);

  const fetchEvangelises = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .eq("statut", "evangelisé");
    if (!error && data) setMembers(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("cellule,responsable,telephone");
    if (!error && data) setCellules(data);
  };

  const handleWhatsAppGroup = () => {
    if (!selectedCellule) {
      alert("Sélectionne d'abord une cellule !");
      return;
    }

    Object.values(selectedMembers).forEach((member) => {
      const prenomResponsable = (selectedCellule.responsable || "").split(" ")[0] || "Frère/Soeur";
      const message = `👋 Salut ${prenomResponsable},

🙏 Dieu nous a envoyé une nouvelle âme à suivre.
Voici ses infos :

- 👤 Nom : ${member.prenom} ${member.nom}
- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}
- 📧 Email : ${member.email || "—"}
- 🏙️ Ville : ${member.ville || "—"}
- 🙏 Besoin : ${member.besoin || "—"}
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}`;

      window.open(
        `https://wa.me/${selectedCellule.telephone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    });

    setSelectedMembers({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Évangélisation – Liste des évangélisés
      </h1>

      {/* Compteurs */}
      <div className="flex justify-center gap-6 mb-6">
        <span className="font-semibold text-gray-700">
          Total évangélisés : {members.length}
        </span>
        <span className="font-semibold text-gray-700">
          Sélectionnés : {Object.keys(selectedMembers).length}
        </span>
      </div>

      {/* Choix cellule global */}
      <div className="mb-6 flex gap-4 items-center">
        <label className="font-semibold">Choisir une cellule :</label>
        <select
          className="border rounded-lg p-2"
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

        <button
          onClick={handleWhatsAppGroup}
          className="ml-4 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
        >
          📤 Envoyer WhatsApp
        </button>
      </div>

      {/* Cartes membres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            style={{ borderTop: "4px solid #FB8C00" }}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">{member.prenom} {member.nom}</h2>
            <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
            <p className="text-sm text-orange-600 font-bold">Évangélisé</p>

            <div className="mt-2 text-sm text-gray-700 space-y-1">
              <p>Email : {member.email || "—"}</p>
              <p>Besoin : {member.besoin || "—"}</p>
              <p>Ville : {member.ville || "—"}</p>
              <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
              <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
            </div>

            {/* Case à cocher */}
            <div className="mt-3 flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={!!selectedMembers[member.id]}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedMembers((prev) => ({ ...prev, [member.id]: member }));
                  } else {
                    setSelectedMembers((prev) => {
                      const copy = { ...prev };
                      delete copy[member.id];
                      return copy;
                    });
                  }
                }}
              />
              <span>Envoyer ce contact</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
