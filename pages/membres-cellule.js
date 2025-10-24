//pages/membres-cellule.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function MembresCellule() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchMembres = async () => {
    setLoading(true);

    try {
      const userEmail = localStorage.getItem("userEmail");
      const userRole = JSON.parse(localStorage.getItem("userRole") || "[]");
      const userName = localStorage.getItem("userName");

      if (!userEmail) throw new Error("Utilisateur non connecté");

      let query = supabase
        .from("membres")
        .select(`
          id,
          nom,
          prenom,
          telephone,
          ville,
          cellule_id,
          cellules (id, cellule, responsable)
        `)
        .not("cellule_id", "is", null);

      // 🔹 Si c’est un ResponsableCellule → on filtre côté Supabase
      if (userRole.includes("ResponsableCellule")) {
        query = query.eq("cellules.responsable", userName);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log("✅ Membres récupérés :", data);
      setMembres(data || []);

    } catch (err) {
      console.error("❌ Erreur :", err.message || err);
      setMembres([]);
    } finally {
      setLoading(false);
    }
  };

  fetchMembres();
}, []);


  if (loading) return <p>Chargement...</p>;
  if (membres.length === 0)
    return <p className="text-center text-gray-600 mt-10">Aucun membre assigné à votre cellule.</p>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-indigo-100 to-indigo-50">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">👥 Membres de ma cellule</h2>
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
                <td className="py-3 px-4 font-semibold text-gray-700">{membre.nom} {membre.prenom}</td>
                <td className="py-3 px-4">{membre.telephone}</td>
                <td className="py-3 px-4">{membre.ville || "—"}</td>
                <td className="py-3 px-4 text-indigo-700 font-medium">{membre.cellules?.cellule || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
