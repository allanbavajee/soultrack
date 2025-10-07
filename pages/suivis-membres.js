//pages/suivis-membres.js
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
      .select("id, statut, created_at, membre:membre_id(*)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      const filtered = data.filter(
        (s) =>
          s.membre.statut === "visiteur" || s.membre.statut === "veut rejoindre ICC"
      );
      setSuivis(filtered);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      <h1 className="text-white text-4xl mb-6">Suivis des membres</h1>
      <table className="table-auto w-full bg-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Prénom</th>
            <th className="px-4 py-2">Statut</th>
          </tr>
        </thead>
        <tbody>
          {suivis.map((s) => (
            <tr key={s.id}>
              <td className="border px-4 py-2">{s.membre.nom}</td>
              <td className="border px-4 py-2">{s.membre.prenom}</td>
              <td className="border px-4 py-2">{s.statut}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
