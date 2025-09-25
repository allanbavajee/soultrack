/* list-members.js */
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
    } else {
      // Ajouter un state local pour le statut affiché
      const membersWithLocalStatut = data.map((m) => ({
        ...m,
        localStatut: m.statut,
      }));
      setMembers(membersWithLocalStatut);
    }
    setLoading(false);
  };

  const handleChangeStatut = (id, newStatut) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              localStatut: newStatut,
            }
          : m
      )
    );
  };

  if (loading) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Liste des membres</h1>

      <div className="grid grid-cols-1 gap-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex justify-between items-center border rounded p-4 shadow-sm"
          >
            <div>
              <p className="font-semibold">
                {member.prenom} {member.nom}
              </p>
              <p className="text-gray-600 text-sm">📱 {member.telephone}</p>
              <p className="text-gray-500 text-sm">Ville : {member.ville || "—"}</p>
            </div>

            <div>
              <label className="text-gray-700 text-sm mb-1 block">Statut :</label>
              <select
                value={member.localStatut}
                onChange={(e) => handleChangeStatut(member.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="actif">Actif</option>
                <option value="ancien">Ancien</option>
                <option value="visiteur">Visiteur</option>
                <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                <option value="evangelisé">Évangélisé</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
