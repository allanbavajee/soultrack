// pages/suivis-membres.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("suivis_membres")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("DEBUG DATA:", data);
    console.log("DEBUG ERROR:", error);

    if (error) {
      console.error("Erreur chargement suivis:", error);
    } else {
      setSuivis(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Suivis Membres 📋</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : suivis.length === 0 ? (
        <div className="text-gray-500 text-center">
          <p>Aucun contact trouvé.</p>
          <pre>{JSON.stringify(suivis, null, 2)}</pre>
        </div>
      ) : (
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Membre ID</th>
              <th className="p-3 border">Cellule ID</th>
              <th className="p-3 border">Statut</th>
              <th className="p-3 border">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map((s) => (
              <tr key={s.id} className="text-center">
                <td className="p-3 border">{s.membre_id}</td>
                <td className="p-3 border">{s.cellule_id}</td>
                <td className="p-3 border">{s.statut}</td>
                <td className="p-3 border">
                  {new Date(s.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
