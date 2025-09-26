// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [selectedEvangelises, setSelectedEvangelises] = useState([]);

  useEffect(() => {
    fetchMembers();
    fetchCellules();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("membres").select("*");
    if (!error && data) setMembers(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("*");
    if (!error && data) setCellules(data);
  };

  const handleChangeStatus = (id, newStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const handleToggleEvangelise = (id) => {
    setSelectedEvangelises((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";           // jaune pour Star
    if (member.statut === "actif") return "#4285F4"; // bleu
    if (member.statut === "a déjà mon église") return "#EA4335"; // rouge
    if (member.statut === "ancien") return "#999999";            // gris
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur") return "#34A853"; // vert
    if (member.statut === "evangelisé") return "#fbbc05";        // orange clair
    return "#000"; // default
  };

  const sendWhatsAppToResponsable = () => {
    if (!selectedCellule || selectedEvangelises.length === 0) return;

    const prenomResp = selectedCellule.responsable.split(" ")[0];
    let message = `👋 Salut ${prenomResp},\n\n🙏 Dieu nous a envoyé de nouvelles âmes à suivre :\n\n`;

    selectedEvangelises.forEach((id) => {
      const m = members.find((x) => x.id === id);
      if (!m) return;
      message += `- 👤 ${m.prenom} ${m.nom}\n- 📱 ${m.telephone} ${m.is_whatsapp ? "(WhatsApp ✅)" : ""}\n- 📧 ${m.email || "—"}\n- 🏙️ ${m.ville || "—"}\n- 🙏 Besoin : ${m.besoin || "—"}\n- 📝 Infos suppl. : ${m.infos_supplementaires || "—"}\n\n`;
    });

    message += "Merci pour ton cœur ❤️ et ton amour ✨";

    window.open(
      `https://wa.me/${selectedCellule.telephone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Liste des membres
      </h1>

      {/* Filtre déroulant */}
      <div className="flex justify-center mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Filtrer par statut --</option>
          <option value="actif">Actif</option>
          <option value="ancien">Ancien</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="visiteur">Visiteur</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="evangelisé">Evangelisé</option>
          <option value="star">⭐ Star</option>
        </select>
      </div>

      {/* Compteur */}
      <p className="text-center text-gray-600 mb-6">
        Total membres : {members.length} | Affichés : {filteredMembers.length}
      </p>

      {/* Cartes membres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const [showDetails, setShowDetails] = useState(false);

          return (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center">
                    {member.prenom} {member.nom}{" "}
                    {member.star && <span className="ml-2 text-yellow-400">⭐</span>}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
                  <p className="text-sm font-bold" style={{ color: getBorderColor(member) }}>
                    Statut : {member.statut}
                  </p>
                </div>

                {/* Changer le statut localement */}
                <select
                  value={member.statut}
                  onChange={(e) => handleChangeStatus(member.id, e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                  <option value="visiteur">Visiteur</option>
                  <option value="a déjà mon église">A déjà mon église</option>
                  <option value="evangelisé">Evangelisé</option>
                  <option value="actif">Actif</option>
                  <option value="ancien">Ancien</option>
                </select>
              </div>

              {/* Détails */}
              <p
                className="mt-2 text-blue-500 underline cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Fermer détails" : "Détails"}
              </p>

              {showDetails && (
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p>Email : {member.email || "—"}</p>
                  <p>Besoin : {member.besoin || "—"}</p>
                  <p>Ville : {member.ville || "—"}</p>
                  <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
                  <p>Infos suppl. : {member.infos_supplementaires || "—"}</p>
                  <p>Comment venu : {member.how_came || "—"}</p>

                  {/* Menu + WhatsApp pour visiteurs et veut rejoindre ICC */}
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
                          onClick={() => {
                            const prenomResp = selectedCellule.responsable.split(" ")[0];
                            const message = `👋 Salut ${prenomResp},

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
                          }}
                          className="mt-2 w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                        >
                          📤 Envoyer WhatsApp
                        </button>
                      )}
                    </div>
                  )}

                  {/* Checkbox pour selection multiple evangelisé */}
                  {filter === "evangelisé" && (
                    <div className="mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedEvangelises.includes(member.id)}
                          onChange={() => handleToggleEvangelise(member.id)}
                        />
                        <span>Ajouter à la liste pour WhatsApp</span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Envoi WhatsApp pour les evangelisés */}
      {filter === "evangelisé" && selectedEvangelises.length > 0 && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <label className="block font-semibold mb-2">Choisir une cellule pour les membres sélectionnés :</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedCellule?.cellule || ""}
            onChange={(e) => {
              const c = cellules.find((x) => x.cellule === e.target.value);
              setSelectedCellule(c);
            }}
          >
            <option value="">-- Sélectionner --</option>
            {cellules.map((c) => (
              <option key={c.cellule} value={c.cellule}>
                {c.cellule} ({c.responsable})
              </option>
            ))}
          </select>

          {selectedCellule && (
            <button
              onClick={sendWhatsAppToResponsable}
              className="mt-2 w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
            >
              📤 Envoyer WhatsApp au responsable de la cellule
            </button>
          )}
        </div>
      )}
    </div>
  );
}
