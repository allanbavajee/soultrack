// pages/suivis-membres.js*/
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuivis = async () => {
      try {
        const { data, error } = await supabase
          .from("suivis_membres")
          .select(
            `
            id,
            created_at,
            statut,
            membre_id,
            cellule_id,
            membres (id, prenom, nom, telephone, statut),
            cellules (id, cellule, responsable, telephone)
            `
          )
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Erreur chargement suivis:", error);
          return;
        }

        // ⚡ Filtrer seulement les membres avec statut visiteur ou veut rejoindre ICC
        const filtered = data.filter(
          (s) =>
            s.membres &&
            (s.membres.statut === "visiteur" || s.membres.statut === "veut rejoindre ICC")
        );

        setSuivis(filtered || []);
      } catch (err) {
        console.error("❌ Erreur inattendue fetchSuivis:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuivis();
  }, []);

  if (loading) return <p className="p-4">Chargement des suivis...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Suivis des membres</h1>

      {suivis.length === 0 ? (
        <p>Aucun suivi trouvé.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Membre</th>
              <th className="border p-2">Téléphone</th>
              <th className="border p-2">Statut membre</th>
              <th className="border p-2">Cellule</th>
              <th className="border p-2">Responsable</th>
              <th className="border p-2">Statut suivi</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border p-2">{new Date(s.created_at).toLocaleString()}</td>
                <td className="border p-2">
                  {s.membres ? `${s.membres.prenom} ${s.membres.nom}` : "—"}
                </td>
                <td className="border p-2">{s.membres?.telephone || "—"}</td>
                <td className="border p-2">{s.membres?.statut || "—"}</td>
                <td className="border p-2">{s.cellules?.cellule || "—"}</td>
                <td className="border p-2">{s.cellules?.responsable || "—"}</td>
                <td className="border p-2 font-semibold text-green-600">{s.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
