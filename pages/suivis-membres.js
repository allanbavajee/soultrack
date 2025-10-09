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

  async function fetchSuivis() {
    setLoading(true);
    const { data, error } = await supabase
      .from("suivis_membres")
      .select(
        `
        id,
        statut,
        created_at,
        membre:membre_id (
          id, prenom, nom, telephone, besoin, infos_supplementaires, ville
        ),
        cellule:cellule_id (
          id, cellule, responsable, telephone
        )
      `
      );

    if (error) {
      console.error("Erreur fetch suivis:", error);
      setSuivis([]);
    } else {
      setSuivis(data || []);
    }
    setLoading(false);
  }

  if (loading) {
    return <p className="p-4">Chargement...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Suivis Membres 📋</h1>

      {suivis.length === 0 ? (
        <p>Aucun contact trouvé.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Prénom</th>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Détails</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map((s) => (
              <tr key={s.id} className="border">
                <td className="border p-2">{s.membre?.prenom}</td>
                <td className="border p-2">{s.membre?.nom}</td>
                <td className="border p-2">
                  {/* Menu déroulant Statut Suivis */}
                  <select
                    defaultValue={s.statut || ""}
                    className="border rounded p-1"
                  >
                    <option value="integrer">Intégré</option>
                    <option value="en cours">En cours</option>
                    <option value="refus">Refus</option>
                  </select>
                </td>
                <td className="border p-2 text-sm">
                  <div className="flex flex-col gap-1 text-left">
                    <p>
                      <strong>Téléphone:</strong> {s.membre?.telephone}
                    </p>
                    <p>
                      <strong>Besoin:</strong> {s.membre?.besoin}
                    </p>
                    <p>
                      <strong>Infos:</strong>{" "}
                      {s.membre?.infos_supplementaires}
                    </p>
                    <p>
                      <strong>Ville:</strong> {s.membre?.ville}
                    </p>
                    <p>
                      <strong>Cellule:</strong> {s.cellule?.cellule} (
                      {s.cellule?.responsable})
                    </p>
                    {/* Champ commentaire */}
                    <textarea
                      placeholder="Ajouter un commentaire..."
                      className="border rounded p-1 w-full"
                    ></textarea>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* DEBUG : Affichage brut des données */}
      <pre className="text-xs bg-gray-100 p-2 mt-4 rounded">
        {JSON.stringify(suivis, null, 2)}
      </pre>
    </div>
  );
}
