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
    // Met à jour localement le statut
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  // Filtrer les membres
  const filteredMembers =
    filter === "all" ? members : members.filter((m) => m.statut === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
        Liste des membres
      </h1>

      {/* Filtre */}
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-indigo-500 text-white" : "bg-white"
          } border`}
        >
          Tous ({members.length})
        </button>
        <button
          onClick={() => setFilter("veut rejoindre ICC")}
          className={`px-4 py-2 rounded ${
            filter === "veut rejoindre ICC" ? "bg-green-500 text-white" : "bg-white"
          } border`}
        >
          Veut rejoindre ICC ({members.filter(m => m.statut === "veut rejoindre ICC").length})
        </button>
        <button
          onClick={() => setFilter("visiteur")}
          className={`px-4 py-2 rounded ${
            filter === "visiteur" ? "bg-green-500 text-white" : "bg-white"
          } border`}
        >
          Visiteur ({members.filter(m => m.statut === "visiteur").length})
        </button>
        <button
          onClick={() => setFilter("a déjà mon église")}
          className={`px-4 py-2 rounded ${
            filter === "a déjà mon église" ? "bg-blue-500 text-white" : "bg-white"
          } border`}
        >
          A déjà mon église ({members.filter(m => m.statut === "a déjà mon église").length})
        </button>
        <button
          onClick={() => setFilter("evangelisé")}
          className={`px-4 py-2 rounded ${
            filter === "evangelisé" ? "bg-purple-500 text-white" : "bg-white"
          } border`}
        >
          Evangelisé ({members.filter(m => m.statut === "evangelisé").length})
        </button>
        <button
          onClick={() => setFilter("star")}
          className={`px-4 py-2 rounded ${
            filter === "star" ? "bg-yellow-400 text-white" : "bg-white"
          } border`}
        >
          ⭐ Star ({members.filter(m => m.star).length})
        </button>
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
                ? "#FBC02D" // jaune
                : member.statut === "a déjà mon église"
                ? "#4285F4" // bleu
                : member.statut === "evangelisé"
                ? "#9C27B0" // violet
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

            {/* Menu déroulant pour changer le statut */}
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

