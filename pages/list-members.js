// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function ListMembers() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [cellules, setCellules] = useState([]);
  const [selectedEvangelises, setSelectedEvangelises] = useState([]);
  const [globalCellule, setGlobalCellule] = useState(null);

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
      .select("cellule, responsable, telephone");
    if (!error && data) setCellules(data);
  };

  const handleChangeStatus = (id, newStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";           // jaune pour Star
    if (member.statut === "actif") return "#4285F4";         // bleu
    if (member.statut === "a déjà mon église") return "#EA4335"; // rouge
    if (member.statut === "ancien") return "#999";           // gris
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur") return "#34A853"; // vert
    if (member.statut === "evangelisé") return "#fbbc05";    // orange
    return "#999";
  };

  // Gestion WhatsApp pour les evangelisés sélectionnés
  const handleWhatsAppEvangelises = () => {
    if (!globalCellule) return;
    const prenomResp = globalCellule.responsable.split(" ")[0];
    let message = `👋 Salut ${prenomResp},\n\n🙏 Voici les nouvelles âmes evangelisées :\n`;

    selectedEvangelises.forEach((member) => {
      message += `\n- 👤 ${member.prenom} ${member.nom}\n`;
      message += `  📱 ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}\n`;
      message += `  📧 ${member.email || "—"}\n`;
      message += `  🏙️ ${member.ville || "—"}\n`;
      message += `  🙏 Besoin : ${member.besoin || "—"}\n`;
      message += `  📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}\n`;
    });

    message += `\nMerci pour ton cœur ❤️ et ton amour ✨`;

    window.open(
      `https://wa.me/${globalCellule.telephone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const toggleEvangeliseSelection = (member) => {
    if (selectedEvangelises.includes(member)) {
      setSelectedEvangelises((prev) => prev.filter((m) => m.id !== member.id));
    } else {
      setSelectedEvangelises((prev) => [...prev, member]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Flèche retour */}
      <button
        onClick={() => router.back()}
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

      {/* Menu cellule + WhatsApp pour evangelisés sélectionnés */}
      {selectedEvangelises.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-gray-700">
            Choisir une cellule pour les membres sélectionnés :
          </label>
          <select
            className="w-full p-2 border rounded-lg mb-2"
            value={globalCellule?.cellule || ""}
            onChange={(e) => {
              const cellule = cellules.find((c) => c.cellule === e.target.value);
              setGlobalCellule(cellule);
            }}
          >
            <option value="">-- Sélectionner --</option>
            {cellules.map((c) => (
              <option key={c.cellule} value={c.cellule}>
                {c.cellule} ({c.responsable})
              </option>
            ))}
          </select>
          {globalCellule && (
            <button
              onClick={handleWhatsAppEvangelises}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              📤 Envoyer {selectedEvangelises.length} evangelisé(s) sur WhatsApp
            </button>
          )}
        </div>
      )}

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
                  {member.prenom} {member.nom}
                  {member.star && <span className="ml-2 text-yellow-400 font-bold">⭐</span>}
                </h2>
                <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
                <p
                  className="text-sm font-semibold"
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
                  alert(`Détails :\nNom : ${member.prenom} ${member.nom}\nEmail : ${member.email || "—"}\nTéléphone : ${member.telephone}\nVille : ${member.ville || "—"}\nBesoin : ${member.besoin || "—"}\nInfos supplémentaires : ${member.infos_supplementaires || "—"}`);
                }
              }}
            >
              Détails
            </p>

            {/* Menu cellule + WhatsApp pour "veut rejoindre ICC" et "visiteur" */}
            {(member.statut === "veut rejoindre ICC" || member.statut === "visiteur") && (
              <div className="mt-2">
                <label className="block mb-1 font-semibold">Choisir une cellule :</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  onChange={(e) => {
                    const cellule = cellules.find((c) => c.cellule === e.target.value);
                    member.selectedCellule = cellule;
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
                  className="mt-2 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  onClick={() => {
                    if (!member.selectedCellule) return;
                    const prenomResponsable = member.selectedCellule.responsable.split(" ")[0];
                    const message = `👋 Salut ${prenomResponsable},\n\n🙏 Dieu nous a envoyé une nouvelle âme à suivre.\nVoici ses infos :\n- 👤 Nom : ${member.prenom} ${member.nom}\n- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}\n- 📧 Email : ${member.email || "—"}\n- 🏙️ Ville : ${member.ville || "—"}\n- 🙏 Besoin : ${member.besoin || "—"}\n- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}\n\nMerci pour ton cœur ❤️ et ton amour ✨`;
                    window.open(`https://wa.me/${member.selectedCellule.telephone}?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                >
                  📤 Envoyer sur WhatsApp
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
