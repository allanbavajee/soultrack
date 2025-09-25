// pages/list-members.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");

  // Charger les membres depuis Supabase
  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase.from("membres").select("*");
      if (!error && data) setMembers(data);
    }
    fetchMembers();
  }, []);

  // Déterminer la couleur du bord selon le statut
  const getBorderColor = (member) => {
    if (member.star === true || member.star === "true") return "border-yellow-400";
    if (member.statut === "a déjà mon église") return "border-green-400";
    if (member.statut === "evangelise") return "border-blue-400";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "border-orange-400";
    return "border-gray-300";
  };

  // Membres filtrés
  const filteredMembers = filter
    ? members.filter((m) => m.statut === filter)
    : members;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">Liste des membres</h1>

      {/* Filtre par statut */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-semibold">Filtrer par statut :</label>
        <select
          className="p-2 border rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">-- Tous --</option>
          <option value="actif">Actif</option>
          <option value="ancien">Ancien</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="visiteur">Visiteur</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="evangelise">Évangélisé</option>
        </select>

        <span className="ml-auto font-semibold">
          Total : {filteredMembers.length}
        </span>
      </div>

      {/* Liste des membres */}
      <div className="space-y-3">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className={`p-4 rounded-xl border-t-4 shadow flex justify-between items-center ${getBorderColor(member)}`}
          >
            <div>
              <span className="font-bold text-lg">
                {member.prenom} {member.nom}{" "}
                {(member.star === true || member.star === "true") && (
                  <span className="ml-1 text-yellow-400">⭐</span>
                )}
              </span>
              <p className="text-sm text-gray-600">📱 {member.telephone}</p>
              <p className="text-sm text-gray-600">Ville : {member.ville || "—"}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">{member.statut}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
