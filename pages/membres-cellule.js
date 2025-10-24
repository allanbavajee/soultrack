//pages/admin/membres-cellule.js

"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function MembresCellule() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembres = async () => {
      setLoading(true);

      // 🔹 Récupère les membres associés à une cellule avec jointure
      const { data, error } = await supabase
        .from("membres")
        .select(`
          id,
          nom,
          prenom,
          telephone,
          ville,
          cellule_id,
          cellules (cellule, responsable)
        `)
        .not("cellule_id", "is", null); // Seulement ceux assignés à une cellule

      if (error) {
        console.error("Erreur Supabase :", error);
      } else {
        console.log("Membres avec cellule_id :", data);
        setMembres(data);
      }

      setLoading(false);
    };

    fetchMembres();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (membres.length === 0)
    return <p className="text-center text-gray-600 mt-10">
      Aucun membre assigné à une cellule.
    </p>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-indigo-100 to-indigo-50">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        👥 Membres des Cellules
      </h2>

      <div className="overflow-x-auto bg-white rounded-3xl shadow-2xl p-6">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nom complet</th>
              <th className="py-3 px-4 text-left">Téléphone</th>
              <th className="py-3 px-4 text-left">Ville</th>
              <th className="py-3 px-4 text-left">Cellule</th>
            </tr>
          </thead>
          <tbody>
            {membres.map((membre) => (
              <tr key={membre.id} className="border-b hover:bg-indigo-50 transition-all">
                <td className="py-3 px-4 font-semibold text-gray-700">
                  {membre.nom} {membre.prenom}
                </td>
                <td className="py-3 px-4">{membre.telephone}</td>
                <td className="py-3 px-4">{membre.ville || "—"}</td>
                <td className="py-3 px-4 text-indigo-700 font-medium">
                  {membre.cellules?.cellule || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
