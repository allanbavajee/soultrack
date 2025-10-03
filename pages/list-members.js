// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient"; // ✅ corrige l'import

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
    if (error) {
      console.error("❌ Erreur fetchMembers:", error);
    } else {
      console.log("✅ Membres reçus:", data);
      setMembers(data);
    }
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id, cellule, responsable, telephone");
    if (error) {
      console.error("❌ Erreur fetchCellules:", error);
    } else {
      console.log("✅ Cellules reçues:", data);
      setCellules(data);
    }
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  // Tri avec fallback si created_at n’existe pas
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at) : a.id;
    const dateB = b.created_at ? new Date(b.created_at) : b.id;
    return dateB - dateA;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Liste des membres
      </h1>

      {/* Filtres */}
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

      {/* Liste des membres */}
      {sortedMembers.length === 0 ? (
        <p className="text-center text-gray-500">
          Aucun membre trouvé pour ce filtre.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border-t-4 border-blue-500"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                {member.prenom} {member.nom}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                📱 {member.telephone || "—"}
              </p>
              <p className="text-sm font-semibold text-green-600">
                {member.statut || "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
