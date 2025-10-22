// pages/membres-cellule.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function MembresCellule() {
  const [membres, setMembres] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setLoading(false);
      setUser(user);

      // Récupère le rôle et la cellule de l’utilisateur
      const { data: profil } = await supabase
        .from("users")
        .select("role, cellule_id")
        .eq("id", user.id)
        .single();

      if (!profil) return setLoading(false);

      let query = supabase.from("membres").select("*");

      if (profil.role === "admin") {
        // 🟢 Admin : voit tous les membres
        const { data, error } = await query;
        if (!error) setMembres(data);
      } else if (profil.cellule_id) {
        // 🔵 Responsable : voit les membres de sa cellule
        const { data, error } = await query.eq("cellule_id", profil.cellule_id);
        if (!error) setMembres(data);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10">Chargement...</div>;

  if (!membres || membres.length === 0) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Aucune cellule trouvée. Retour au hub.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 p-6">
      <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
        Membres de la cellule
      </h1>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-3xl p-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="p-3 text-left">Nom</th>
              <th className="p-3 text-left">Prénom</th>
              <th className="p-3 text-left">Téléphone</th>
              <th className="p-3 text-left">Ville</th>
              <th className="p-3 text-left">Cellule</th>
            </tr>
          </thead>
          <tbody>
            {membres.map((m) => (
              <tr
                key={m.id}
                className="border-b hover:bg-indigo-50 transition-all"
              >
                <td className="p-3">{m.nom}</td>
                <td className="p-3">{m.prenom}</td>
                <td className="p-3">{m.telephone}</td>
                <td className="p-3">{m.ville || "-"}</td>
                <td className="p-3">{m.cellule_id || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
