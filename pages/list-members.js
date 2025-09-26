// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");

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
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";           // jaune pour Star
    if (member.statut === "actif") return "#4285F4";             // bleu
    if (member.statut === "a déjà mon église") return "#EA4335"; // rouge
    if (member.statut === "ancien") return "#9E9E9E";           // gris
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853"; // vert
    if (member.statut === "evangelisé") return "#F57C00"; // orange foncé (exemple)
    return "#999"; // couleur par défaut
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Flèche retour */}
      <div className="mb-4">
        <Link href="/" className="flex items-center text-orange-500 hover:text-orange-600 font-semibold">
          ← Retour
        </Link>
      </div>

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
          const borderColor = getBorderColor(member);
          return (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              style={{ borderTop: `4px solid ${borderColor}` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold mb-1 flex items-center" style={{ color: borderColor }}>
                    {member.prenom} {member.nom}
                    {member.star && <span className="ml-2 text-yellow-400">⭐</span>}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
                  <p className="text-sm font-semibold" style={{ color: borderColor }}>Statut : {member.statut}</p>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
