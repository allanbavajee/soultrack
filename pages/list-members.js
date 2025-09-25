/* list-members.js */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les membres depuis Supabase
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("membres").select("*");
    if (error) {
      console.error("Erreur lors du chargement :", error);
    } else {
      setMembers(data);
    }
    setLoading(false);
  };

  // Mettre à jour le statut dans Supabase
  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from("membres")
      .update({ statut: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Erreur de mise à jour :", error);
      alert("Impossible de mettre à jour le statut !");
    } else {
      // Mettre à jour localement aussi
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, statut: newStatus } : m
        )
      );
    }
  };

  // Fonction pour les couleurs selon statut
  const getStatusColor = (member) => {
    if (member.star) return "bg-yellow-400 text-black"; // ⭐ couleur spéciale
    switch (member.statut) {
      case "actif":
        return "bg-green-500 text-white";
      case "ancien":
        return "bg-gray-500 text-white";
      case "veut rejoindre ICC":
        return "bg-blue-500 text-white";
      case "visiteur":
        return "bg-purple-500 text-white";
      case "evangelise":
        return "bg-pink-500 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  if (loading) return <p className="text-center">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Liste des membres</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="p-4 bg-white shadow-lg rounded-xl flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">
                {member.prenom} {member.nom}
              </h2>
              <p className="text-gray-600">📞 {member.telephone}</p>
              <p className="text-gray-600">📍 {member.ville}</p>
            </div>

            {/* Badge statut */}
            <div className="mt-3 flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(
                  member
                )}`}
              >
                {member.star ? "⭐ Actif" : member.statut || "—"}
              </span>

              {/* Sélecteur de statut */}
              <select
                value={member.statut || ""}
                onChange={(e) => handleStatusChange(member.id, e.target.value)}
                className="ml-2 px-2 py-1 border rounded-md text-sm"
              >
                <option value="">—</option>
                <option value="actif">Actif</option>
                <option value="ancien">Ancien</option>
                <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                <option value="visiteur">Visiteur</option>
                <option value="evangelise">Évangélisé</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

