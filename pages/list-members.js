// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("membres").select("*");
    if (!error && data) setMembers(data);
  };

  const handleChangeStatus = (id, newStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const filteredMembers = members.filter((m) => {
    if (filter === "all") return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Liste des membres
      </h1>

      {/* Filtre déroulant */}
      <div className="flex justify-center mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="all">Tous ({members.length})</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC ({members.filter(m => m.statut === "veut rejoindre ICC").length})</option>
          <option value="visiteur">Visiteur ({members.filter(m => m.statut === "visiteur").length})</option>
          <option value="a déjà mon église">A déjà mon église ({members.filter(m => m.statut === "a déjà mon église").length})</option>
          <option value="evangelisé">Evangelisé ({members.filter(m => m.statut === "evangelisé").length})</option>
          <option value="star">⭐ Star ({members.filter(m => m.star).length})</option>
        </select>
      </div>

      {/* Compteur */}
      <p className="text-center text-gray-700 mb-6">
        Total membres : {members.length} | Affichés : {filteredMembers.length}
      </p>

      {/* Liste des membres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="p-4 rounded-lg shadow-md bg-white flex justify-between items-center"
            style={{
              borderTopWidth: "4px",
              borderTopColor: member.star
                ? "#FBC02D" // jaune pour star = TRUE
                : member.statut === "a déjà mon église"
                ? "#4285F4"
                : member.statut === "evangelisé"
                ? "#9C27B0"
                : "#34A853", // vert pour veut rejoindre ICC / visiteur
            }}
          >
            <div>
              <h3 className="font-bold text-lg text-gray-800">
                {member.prenom} {member.nom} {member.star && "⭐"}
              </h3>
              <p className="text-sm text-gray-600">📱 {member.telephone}</p>
              <p className="text-sm text-gray-500">Statut : {member.statut}</p>
            </div>

            {/* Menu déroulant pour changer le statut localement */}
            <select
              value={member.statut}
              onChange={(e) => handleChangeStatus(member.id, e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
              <option value="visiteur">Visiteur</option>
              <option value="a déjà mon église">A déjà mon église</option>
              <option value="evangelisé">Evangelisé</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
