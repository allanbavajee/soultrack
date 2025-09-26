// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [selectedEvangelises, setSelectedEvangelises] = useState([]);
  const [showDetailsIds, setShowDetailsIds] = useState([]);

  useEffect(() => {
    fetchMembers();
    fetchCellules();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("membres").select("*");
    if (!error && data) setMembers(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("cellule,responsable,telephone");
    if (!error && data) setCellules(data);
  };

  const toggleDetail = (id) => {
    setShowDetailsIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleEvangeliseSelection = (id) => {
    setSelectedEvangelises((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";           // jaune pour Star
    if (member.statut === "actif") return "#4285F4";   // bleu
    if (member.statut === "a déjà mon église") return "#EA4335"; // rouge
    if (member.statut === "ancien") return "#888888"; // gris
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur") return "#34A853"; // vert
    if (member.statut === "evangelisé") return "#fbbc05"; // jaune/orange
    return "#999";
  };

  const getStatusStyle = (member) => ({
    fontWeight: member.statut === "star" ? "bold" : "normal",
    color: getBorderColor(member),
  });

  const sendWhatsAppGroup = () => {
    if (!selectedCellule || selectedEvangelises.length === 0) return;
    const prenomResp = selectedCellule.responsable.split(" ")[0];
    let message = `👋 Salut ${prenomResp},\n\n🙏 Dieu nous a envoyé de nouvelles âmes à suivre :\n\n`;

    selectedEvangelises.forEach((id) => {
      const m = members.find((x) => x.id === id);
      if (!m) return;
      message += `- 👤 ${m.prenom} ${m.nom}\n- 📱 ${m.telephone} ${
        m.is_whatsapp ? "(WhatsApp ✅)" : ""
      }\n- 📧 ${m.email || "—"}\n- 🏙️ ${m.ville || "—"}\n- 🙏 Besoin : ${
        m.besoin || "—"
      }\n- 📝 Infos supp. : ${m.infos_supplementaires || "—"}\n\n`;
    });

    message += "Merci pour ton cœur ❤️ et ton amour ✨";
    window.open(
      `https://wa.me/${selectedCellule.telephone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Flèche retour */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-orange-500 font-semibold mb-4"
      >
        ← Retour
      </button>

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

      {/* Bloc cellule pour evangelisés */}
      {filter === "evangelisé" && filteredMembers.length > 0 && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <label className="font-semibold block mb-2">
            Choisir une cellule pour les membres sélectionnés :
          </label>
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
              onClick={sendWhatsAppGroup}
              className="mt-2 w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
            >
              📤 Envoyer WhatsApp aux membres sélectionnés
            </button>
          )}
        </div>
      )}

      {/* Cartes membres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {member.prenom} {member.nom}
                </h2>
                <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
                <p
                  className="text-sm"
                  style={getStatusStyle(member)}
                >
                  Statut : {member.statut}
                </p>
              </div>

              {/* Changer le statut localement */}
              <select
                value={member.statut}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  setMembers((prev) =>
                    prev.map((m) =>
                      m.id === member.id ? { ...m, statut: newStatus } : m
                    )
                  );
                }}
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
              onClick={() => toggleDetail(member.id)}
              className="mt-2 text-blue-600 cursor-pointer underline text-sm"
            >
              {showDetailsIds.includes(member.id) ? "Fermer détails" : "Voir détails"}
            </p>

            {showDetailsIds.includes(member.id) && (
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>Email : {member.email || "—"}</p>
                <p>Besoin : {member.besoin || "—"}</p>
                <p>Ville : {member.ville || "—"}</p>
                <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
                <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
                <p>Comment venu : {member.how_came || "—"}</p>

                {/* Menu déroulant + WhatsApp seulement pour "veut rejoindre ICC" ou "visiteur" */}
                {(member.statut === "visiteur" || member.statut === "veut rejoindre ICC") && (
                  <div className="mt-2">
                    <label className="block mb-1 font-semibold">Choisir une cellule :</label>
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
                        onClick={() => {
                          const prenomResp = selectedCellule.responsable.split(" ")[0];
                          const message = `👋 Salut ${prenomResp},\n\n🙏 Dieu nous a envoyé une nouvelle âme à suivre :\n\n- 👤 ${member.prenom} ${member.nom}\n- 📱 ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}\n- 📧 ${member.email || "—"}\n- 🏙️ ${member.ville || "—"}\n- 🙏 Besoin : ${member.besoin || "—"}\n- 📝 Infos suppl. : ${member.infos_supplementaires || "—"}\n\nMerci pour ton cœur ❤️ et ton amour ✨`;
                          window.open(`https://wa.me/${selectedCellule.telephone}?text=${encodeURIComponent(message)}`, "_blank");
                        }}
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
        ))}
      </div>
    </div>
  );
}
