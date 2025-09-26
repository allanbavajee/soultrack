// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import MemberCard from "../components/MemberCard";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingCellules, setLoadingCellules] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchMembers(), fetchCellules()]);
    setLoading(false);
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase.from("membres").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error("fetchMembers error:", err);
      setMembers([]);
    }
  };

  const fetchCellules = async () => {
    setLoadingCellules(true);
    try {
      const { data, error } = await supabase
        .from("cellules")
        .select("cellule, responsable, telephone");
      if (error) throw error;
      setCellules(data || []);
    } catch (err) {
      console.error("fetchCellules error:", err);
      setCellules([]);
    } finally {
      setLoadingCellules(false);
    }
  };

  // Filtrage
  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true || m.star === "true";
    return m.statut === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Liste des membres
        </h1>
        {/* Flèche retour */}
        <div className="mb-4">
          <a
            href="/"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
        ← Retour
        </a>
        </div>

        {/* Filtre déroulant */}
        <div className="flex justify-center mb-4">
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

        {/* Compteur et loading */}
        <p className="text-center text-gray-600 mb-6">
          {loading ? "Chargement…" : `Total membres : ${members.length} | Affichés : ${filteredMembers.length}`}
        </p>

        {/* Message si pas de cellules */}
        {loadingCellules && (
          <p className="text-center text-sm text-gray-500 mb-3">Chargement des cellules…</p>
        )}

        {/* Cartes membres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.length === 0 && !loading ? (
            <div className="col-span-full text-center text-gray-500">Aucun membre trouvé.</div>
          ) : (
            filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                fetchMembers={fetchMembers}
                cellules={cellules} // on passe la liste stable une seule fois
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
