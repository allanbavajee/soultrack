//pages/membres-cellule.js"

"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function MembresCellule() {
  const [user, setUser] = useState(null);
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 🔹 Récupération de l'utilisateur connecté
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("Erreur récupération user :", userError);
        setLoading(false);
        return;
      }
      setUser(user);

      // 🔹 Récupération du profil complet pour obtenir le rôle
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", user.email)
        .single();

      if (profileError || !profile) {
        console.error("Erreur récupération profil :", profileError);
        setLoading(false);
        return;
      }

      // 🔹 Construire la requête selon le rôle
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

      if (profile.role === "ResponsableCellule") {
        // Filtre pour ne montrer que les membres de la cellule du responsable
        query = query.eq("cellule_id", profile.id);
      }

      const { data: membresData, error: membresError } = await query;
      if (membresError) {
        console.error("Erreur récupération membres :", membresError);
      } else {
        setMembres(membresData);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Chargement utilisateur...</p>;
  if (!user) return <p className="text-center mt-10 text-red-500">Utilisateur non connecté</p>;
  if (membres.length === 0)
    return <p className="text-center mt-10 text-gray-600">Aucun membre assigné à une cellule.</p>;

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


