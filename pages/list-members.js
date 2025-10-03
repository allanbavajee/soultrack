// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [selectedEvangelises, setSelectedEvangelises] = useState({});

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
    const message = `👋 Salut ${prenomResponsable},\n\n🙏 Nouvelle personne à suivre :\n- 👤 Nom : ${member.prenom} ${member.nom}\n- 📱 Téléphone : ${member.telephone || "—"} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}\n- 📧 Email : ${member.email || "—"}\n- 🏙️ Ville : ${member.ville || "—"}\n- 🙏 Besoin : ${member.besoin || "—"}\n- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}\n\nMerci ❤️`;

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

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at) : a.id;
    const dateB = b.created_at ? new Date(b.created_at) : b.id;
    return dateB - dateA;
  });

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853";
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      {/* Logo */}
      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      {/* Titre */}
      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        SoulTrack
      </h1>

      {/* Message inspirant */}
      <p className="text-center text-white text-lg mb-6 font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et partageons l’amour de Christ dans chaque action ❤️
      </p>

      {/* Filtres */}
      <div className="flex justify-center mb-4 w-full max-w-md">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

      {/* Bouton WhatsApp group */}
      {Object.keys(selectedEvangelises).length > 0 && (
        <button
          onClick={handleWhatsAppGroup}
          className="mb-4 w-full max-w-md py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          📤 Envoyer WhatsApp aux responsables sélectionnés
        </button>
      )}

      {/* Liste des membres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {sortedMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
            style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
          >
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center justify-between">
                <span>
                  {member.prenom} {member.nom} {member.star && <span className="ml-1 text-yellow-400">⭐</span>}
                </span>
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
              </h2>
              <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
              <p
                className="text-sm font-semibold"
                style={{ color: getBorderColor(member) }}
              >
                {member.statut || "—"}
              </p>
            </div>

            <p
              className="mt-2 text-blue-500 underline cursor-pointer"
              onClick={() =>
                setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
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

                {(member.statut === "visiteur" || member.statut === "veut rejoindre ICC") && (
                  <div className="mt-2">
                    <label className="block mb-1 font-semibold">Choisir une cellule :</label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={selectedCellules[member.id]?.cellule || ""}
                      onChange={(e) => {
                        const cellule = cellules.find((c) => c.cellule === e.target.value);
                        setSelectedCellules((prev) => ({ ...prev, [member.id]: cellule }));
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
        ))}
      </div>

      {/* Message final */}
      <p className="mt-6 mb-4 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens 12:14 ❤️
      </p>
    </div>
  );
}
