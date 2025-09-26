// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function ListMembers() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [cellules, setCellules] = useState([]);
  const [detailsState, setDetailsState] = useState({}); // gère showDetails et selectedCellule par membre

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

  const handleChangeStatus = (id, newStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const toggleDetails = (id) => {
    setDetailsState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        show: !prev[id]?.show,
      },
    }));
  };

  const handleCelluleChange = (id, cellule) => {
    setDetailsState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        selectedCellule: cellule,
      },
    }));
  };

  const handleWhatsApp = (member) => {
    const selectedCellule = detailsState[member.id]?.selectedCellule;
    if (!selectedCellule) return;

    const prenomResponsable = selectedCellule.responsable.split(" ")[0];
    const message = `👋 Salut ${prenomResponsable},

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
      `https://wa.me/${selectedCellule.telephone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );

    // Mise à jour du statut en ancien après envoi
    supabase.from("membres").update({ statut: "ancien" }).eq("id", member.id);
    fetchMembers();
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D"; // jaune
    if (member.statut === "actif") return "#4285F4"; // bleu
    if (member.statut === "a déjà mon église") return "#EA4335"; // rouge
    if (member.statut === "ancien") return "#9E9E9E"; // gris
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853"; // vert
    if (member.statut === "evangelisé") return "#fbbc05"; // orange
    return "#999"; // défaut
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Flèche retour */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-orange-600 font-semibold mb-4"
      >
        ← Retour
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Liste des membres
      </h1>

      {/* Filtre */}
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

      {/* Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const showDetails = detailsState[member.id]?.show || false;
          const selectedCellule = detailsState[member.id]?.selectedCellule || null;

          return (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    {member.prenom} {member.nom}
                  </h2>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: getBorderColor(member) }}
                  >
                    {member.statut}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
                </div>

                {/* Changer statut local */}
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
                className="mt-2 text-blue-600 cursor-pointer underline"
                onClick={() => toggleDetails(member.id)}
              >
                {showDetails ? "Fermer détails" : "Voir détails"}
              </p>

              {showDetails && (
                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <p>Email : {member.email || "—"}</p>
                  <p>Besoin : {member.besoin || "—"}</p>
                  <p>Ville : {member.ville || "—"}</p>
                  <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
                  <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
                  <p>Comment venu : {member.how_came || "—"}</p>

                  {(member.statut === "visiteur" ||
                    member.statut === "veut rejoindre ICC") && (
                    <div className="mt-2">
                      <label className="block mb-1 font-semibold">
                        Choisir une cellule :
                      </label>
                      <select
                        className="w-full p-2 border rounded-lg"
                        value={selectedCellule?.cellule || ""}
                        onChange={(e) => {
                          const cellule = cellules.find(
                            (c) => c.cellule === e.target.value
                          );
                          handleCelluleChange(member.id, cellule);
                        }}
                      >
                        <option value="">-- Sélectionner --</option>
                        {cellules.length > 0
                          ? cellules.map((c) => (
                              <option key={c.cellule} value={c.cellule}>
                                {c.cellule} ({c.responsable})
                              </option>
                            ))
                          : null}
                      </select>

                      {selectedCellule && (
                        <button
                          onClick={() => handleWhatsApp(member)}
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
          );
        })}
      </div>
    </div>
  );
}
