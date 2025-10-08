// pages/suivis-membres.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select(`
          id,
          statut,
          created_at,
          membres: membre_id (
            id,
            prenom,
            nom,
            telephone,
            statut,
            besoin,
            infos_supplementaires
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSuivis(data || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    }
  };

  if (suivis.length === 0) return <p>Aucun contact trouvé.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suivis Membres</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Prénom</th>
            <th className="border px-4 py-2">Nom</th>
            <th className="border px-4 py-2">Statut</th>
            <th className="border px-4 py-2">Téléphone</th>
          </tr>
        </thead>
        <tbody>
          {suivis.map((suivi) => (
            <tr key={suivi.id}>
              <td className="border px-4 py-2">{suivi.membres?.prenom || "—"}</td>
              <td className="border px-4 py-2">{suivi.membres?.nom || "—"}</td>
              <td className="border px-4 py-2">{suivi.membres?.statut || suivi.statut}</td>
              <td className="border px-4 py-2">{suivi.membres?.telephone || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
