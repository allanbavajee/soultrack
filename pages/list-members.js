// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [selectedEvangelises, setSelectedEvangelises] = useState([]);
  const [showDetailsIds, setShowDetailsIds] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);

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

  const toggleDetails = (id) => {
    if (showDetailsIds.includes(id)) {
      setShowDetailsIds(prev => prev.filter(i => i !== id));
    } else {
      setShowDetailsIds(prev => [...prev, id]);
    }
  };

  const toggleEvangeliseSelection = (member) => {
    if (selectedEvangelises.includes(member.id)) {
      setSelectedEvangelises(prev => prev.filter(i => i !== member.id));
    } else {
      setSelectedEvangelises(prev => [...prev, member.id]);
    }
  };

  const handleWhatsAppEvangelises = () => {
    if (!selectedCellule || selectedEvangelises.length === 0) return;

    const messages = selectedEvangelises
      .map(id => {
        const member = members.find(m => m.id === id);
        return `👤 ${member.prenom} ${member.nom}\n📱 ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}\n📧 ${member.email || "—"}\n🏙️ ${member.ville || "—"}\n🙏 Besoin : ${member.besoin || "—"}\n📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}`;
      })
      .join("\n\n");

    const prenomResponsable = selectedCellule.responsable.split(" ")[0];
    const message = `👋 Salut ${prenomResponsable},\n\n🙏 Dieu nous a envoyé de nouvelles âmes à suivre :\n\n${messages}\n\nMerci pour ton cœur ❤️ et ton amour ✨`;

    window.open(`https://wa.me/${selectedCellule.telephone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleChangeStatus = (id, newStatus) => {
    setMembers(prev =>
      prev.map(m => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const filteredMembers = members.filter(m => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";           // jaune pour Star
    if (member.statut === "a déjà mon église") return "#EA4335"; // rouge
    if (member.statut === "evangelisé") return "#34A853";        // vert
    if (member.statut === "actif") return "#4285F4";             // bleu
    if (member.statut === "ancien") return "#9E9E9E";            // gris
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853"; // vert
    return "#999"; // couleur par défaut
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Flèche retour */}
      <button
        onClick={() => history.back()}
        className="flex items-center text-orange-600 font-semibold mb-4"
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

      {/* Cartes membres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
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
                <p
                  className="text-sm font-bold"
                  style={{ color: getBorderColor(member) }}
                >
                  {member.statut}
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
              onClick={() => {
                if (member.statut === "evangelisé") {
                  toggleEvangeliseSelection(member);
                } else {
                  toggleDetails(member.id);
                }
              }}
            >
              Détails
            </p>

            {showDetailsIds.includes(member.id) && member.statut !== "evangelisé" && (
              <div className="mt-2 text-gray-700 text-sm space-y-1">
                <p>Email : {member.email || "—"}</p>
                <p>Besoin : {member.besoin || "—"}</p>
                <p>Ville : {member.ville || "—"}</p>
                <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
                <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
                <p>Comment venu : {member.how_came || "—"}</p>

                {(member.statut === "veut rejoindre ICC" || member.statut === "visiteur") && (
                  <div className="mt-2">
                    <label className="block mb-1 font-semibold">Choisir une cellule :</label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={selectedCellule?.cellule || ""}
                      onChange={(e) => {
                        const cellule = cellules.find(c => c.cellule === e.target.value);
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
                          const prenomResponsable = selectedCellule.responsable.split(" ")[0];
                          const message = `👋 Salut ${prenomResponsable},\n\n🙏 Dieu nous a envoyé une nouvelle âme à suivre :\n\n- 👤 Nom : ${member.prenom} ${member.nom}\n- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}\n- 📧 Email : ${member.email || "—"}\n- 🏙️ Ville : ${member.ville || "—"}\n- 🙏 Besoin : ${member.besoin || "—"}\n- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}\n\nMerci pour ton cœur ❤️ et ton amour ✨`;
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
            ))}
          </div>
        ))}
      </div>

      {/* Bloc pour les evangelisés sélectionnés */}
      {selectedEvangelises.length > 0 && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg">
          <label className="block mb-2 font-semibold">
            Choisir une cellule pour les membres sélectionnés :
          </label>
          <select
            className="w-full p-2 border rounded-lg mb-2"
            value={selectedCellule?.cellule || ""}
            onChange={(e) => {
              const cellule = cellules.find(c => c.cellule === e.target.value);
              setSelectedCellule(cellule);
            }}
          >
            <option value="">-- Sélectionner --</option>
            {cellules.length > 0 ? (
              cellules.map(c => (
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
              onClick={handleWhatsAppEvangelises}
              className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
            >
              📤 Envoyer sur WhatsApp
            </button>
          )}
        </div>
      )}
    </div>
  );
}
