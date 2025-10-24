//pages/admin/membres-cellule.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function MembresCellule() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 🔹 Récupérer l'utilisateur connecté et son rôle
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Erreur récupération user :", error);
        return;
      }

      // 🔹 Récupérer le profil complet pour avoir role et cellule_id
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, roles, cellule_id")
        .eq("email", user.email)
        .single();

      if (profileError) {
        console.error("Erreur récupération profil :", profileError);
        return;
      }

      setCurrentUser(profile);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!currentUser) return; // on attend d'avoir currentUser

    const fetchMembres = async () => {
      setLoading(true);

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

      // 🔹 Filtre pour le responsable de cellule
      if (currentUser.role === "ResponsableCellule") {
        query = query.eq("cellule_id", currentUser.cellule_id);
      }

      const { data, error } = await query;

      if (error) console.error("Erreur Supabase :", error);
      else setMembres(data);

      setLoading(false);
    };

    fetchMembres();
  }, [currentUser]);

  if (!currentUser) return <p>Chargement utilisateur...</p>;
  if (loading) return <p>Chargement membres...</p>;
  if (membres.length === 0)
    return (
      <p className="text-center text-gray-600 mt-10">
        Aucun membre assigné à une cellule.
      </p>
    );

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
              <tr
                key={membre.id}
                className="border-b hover:bg-indigo-50 transition-all"
              >
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
