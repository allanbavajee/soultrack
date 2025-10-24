//pages/membres-cellule.js"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function MembresCellule() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchMembres = async () => {
      setLoading(true);

      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Erreur récupération user :", userError);
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, role, roles")
          .eq("id", user.id)
          .single();

        if (profileError || !profile) {
          console.error("Erreur récupération profil :", profileError);
          setLoading(false);
          return;
        }

        setCurrentUser(profile);

        // Déterminer si l'utilisateur est ResponsableCellule
        const rolesArray = Array.isArray(profile.roles) ? profile.roles : [profile.role];
        let celluleId = null;

        if (rolesArray.includes("ResponsableCellule")) {
          // Récupérer la cellule dont il est responsable
          const { data: celluleData, error: celluleError } = await supabase
            .from("cellules")
            .select("id")
            .eq("responsable_id", profile.id)
            .single();

          if (celluleError || !celluleData) {
            console.error("Erreur récupération cellule :", celluleError);
            setLoading(false);
            return;
          }

          celluleId = celluleData.id;
        }

        // 🔹 Requête membres
        let query = supabase
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
          .not("cellule_id", "is", null);

        if (celluleId) {
          query = query.eq("cellule_id", celluleId);
        }

        const { data, error } = await query;
        if (error) {
          console.error("Erreur Supabase :", error);
        } else {
          setMembres(data);
        }

      } catch (err) {
        console.error("Erreur inattendue :", err);
      }

      setLoading(false);
    };

    fetchMembres();
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
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

