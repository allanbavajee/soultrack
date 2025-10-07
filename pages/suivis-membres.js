// pages/suivis-membres.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    const { data, error } = await supabase
      .from("suivis_membres")
      .select(`
        id,
        statut,
        created_at,
        membre:membre_id (
          id, prenom, nom
        ),
        cellule:cellule_id (
          id, cellule, responsable
        )
      `)
      .order("created_at", { ascending: false });

    if (!error) setSuivis(data);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-5xl font-handwriting text-white text-center mb-6">
        Suivi des membres
      </h1>

      <table className="table-auto w-full max-w-5xl border-collapse border border-white text-center text-gray-800">
        <thead>
          <tr className="bg-white bg-opacity-20">
            <th className="border px-4 py-2">Nom</th>
            <th className="border px-4 py-2">Prénom</th>
            <th className="border px-4 py-2">Cellule</th>
            <th className="border px-4 py-2">Statut</th>
            <th className="border px-4 py-2">Détails</th>
          </tr>
        </thead>
        <tbody>
          {suivis.map((s) => (
            <tr key={s.id}>
              <td className="border px-4 py-2">{s.membre.nom}</td>
              <td className="border px-4 py-2">{s.membre.prenom}</td>
              <td className="border px-4 py-2">{s.cellule?.cellule || "—"}</td>
              <td className="border px-4 py-2">{s.statut}</td>
              <td className="border px-4 py-2">Voir</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
