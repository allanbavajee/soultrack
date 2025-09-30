// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [selectedEvangelises, setSelectedEvangelises] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchMembers();
    fetchCellules();

    // gérer bouton scroll top
    const handleScroll = () => {
      if (window.scrollY > 300) setShowScrollTop(true);
      else setShowScrollTop(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("membres").select("*");
    if (!error && data) setMembers(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id, cellule, responsable, telephone");
    if (!error && data) setCellules(data);
  };

  const handleChangeStatus = async (id, newStatus) => {
    await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const handleWhatsAppSingle = async (member, cellule) => {
    if (!cellule) return;

    const prenomResponsable = cellule.responsable.split(" ")[0];
    const message = `👋 Salut ${prenomResponsable},\n\n🙏 Dieu nous a envoyé une nouvelle âme à suivre.  
Voici ses infos :\n\n- 👤 Nom : ${member.prenom} ${member.nom}  
- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}  
- 📧 Email : ${member.email || "—"}  
- 🏙️ Ville : ${member.ville || "—"}  
- 🙏 Besoin : ${member.besoin || "—"}  
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}\n\nMerci pour ton cœur ❤️ et son amour ✨`;

    window.open(
      `https://wa.me/${cellule.telephone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    await supabase.from("membres").update({ statut: "actif" }).eq("id", member.id);

    await supabase.from("suivis_membres").insert([
      { membre_id: member.id, cellule_id: cellule.id, statut: "envoye" },
    ]);

    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, statut: "actif" } : m))
    );
  };

  const handleWhatsAppGroup = () => {
    Object.entries(selectedEvangelises).forEach(([memberId, membre]) => {
      const cellule = selectedCellules[memberId];
      if (!cellule) return;
      handleWhatsAppSingle(membre, cellule);
    });
    setSelectedEvangelises({});
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  // trouver la dernière date d’ajout
  const lastDate = filteredMembers.length
    ? new Date(
        Math.max(...filteredMembers.map((m) => new Date(m.created_at).getTime()))
      )
    : null;

  const formatDate = (date) =>
    date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const groupedByDate = lastDate
    ? filteredMembers.filter(
        (m) =>
          new Date(m.created_at).toDateString() === lastDate.toDateString()
      )
    : [];

  const others = filteredMembers
    .filter(
      (m) => !lastDate || new Date(m.created_at).toDateString() !== lastDate.toDateString()
    )
    .sort((a, b) =>
      `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`, "fr")
    );

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-orange-500 font-semibold mb-4"
      >
        ← Retour
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Liste des membres
      </h1>

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
          <option value="star">⭐ Star</option>
        </select>
      </div>

      {Object.keys(selectedEvangelises).length > 0 && (
        <button
          onClick={handleWhatsAppGroup}
          className="mb-4 w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          📤 Envoyer WhatsApp aux responsables sélectionnés
        </button>
      )}

      {/* Dernière date */}
      {groupedByDate.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">
            {formatDate(lastDate)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedByDate.map((member) => renderMemberCard(member))}
          </div>
        </div>
      )}

      {/* Autres en ordre alphabétique */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {others.map((member) => renderMemberCard(member))}
      </div>

      {/* Bouton scroll top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-orange-500 text-white rounded-full p-3 shadow-lg hover:bg-orange-600"
        >
          ↑
        </button>
      )}
    </div>
  );

  function renderMemberCard(member) {
    return (
      <div
        key={member.id}
        className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
        style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center">
              {member.prenom} {member.nom}
              {member.star && (
                <span className="ml-2 text-yellow-400 font-bold">⭐</span>
              )}
            </h2>
            <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
            <p
              className="text-sm"
              style={{ color: getBorderColor(member), fontWeight: "bold" }}
            >
              {member.statut}
            </p>
          </div>

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

        <p
          className="mt-2 text-blue-500 underline cursor-pointer"
          onClick={() =>
            setDetailsOpen((prev) => ({
              ...prev,
              [member.id]: !prev[member.id],
            }))
          }
        >
          {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
        </p>

        {detailsOpen[member.id] && (
          <div className="mt-2 text-sm text-gray-700 space-y-1">
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
                  value={selectedCellules[member.id]?.cellule || ""}
                  onChange={(e) => {
                    const cellule = cellules.find(
                      (c) => c.cellule === e.target.value
                    );
                    setSelectedCellules((prev) => ({
                      ...prev,
                      [member.id]: cellule,
                    }));
                  }}
                >
                  <option value="">-- Sélectionner --</option>
                  {cellules.map((c) => (
                    <option key={c.cellule} value={c.cellule}>
                      {c.cellule} ({c.responsable})
                    </option>
                  ))}
                </select>
                {selectedCellules[member.id] && (
                  <button
                    onClick={() =>
                      handleWhatsAppSingle(member, selectedCellules[member.id])
                    }
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
  }
}
