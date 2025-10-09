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

    if (error) {
      console.error("Erreur chargement suivis:", error);
    } else {
      setSuivis(data || []);
    }
    setLoading(false);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Suivis Membres 📋</h1>

      {suivis.length === 0 ? (
        <p>Aucun contact trouvé.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Membre ID</th>
              <th className="border p-2">Cellule ID</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.id}</td>
                <td className="border p-2">{s.membre_id}</td>
                <td className="border p-2">{s.cellule_id}</td>
                <td className="border p-2">{s.statut}</td>
                <td className="border p-2">
                  {new Date(s.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* DEBUG JSON */}
      <pre className="text-xs bg-gray-100 p-2 mt-4 rounded">
        {JSON.stringify(suivis, null, 2)}
      </pre>
    </div>
  );
}
