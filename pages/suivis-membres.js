// pages/suivis-membres.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [currentView, setCurrentView] = useState("principale"); // principale | refus | integre

  useEffect(() => {
    fetchSuivis();
  }, [currentView]);

  async function fetchSuivis() {
    setLoading(true);

    // Requête avec jointure
    const { data, error } = await supabase
      .from("suivis_membres")
      .select(
        `
        id,
        statut,
        commentaire,
        membres (
          id,
          prenom,
          nom,
          telephone,
          besoin,
          infos_supplementaires
        )
      `
      );

    if (error) {
      console.error("Erreur fetch:", error);
      setSuivis([]);
    } else {
      let filtered = data.map((row) => ({
        id: row.id,
        statut: row.statut,
        commentaire: row.commentaire,
        ...row.membres,
      }));

      // Filtrage selon la vue choisie
      if (currentView === "principale") {
        filtered = filtered.filter(
          (s) => s.statut !== "refus" && s.statut !== "integre"
        );
      } else if (currentView === "refus") {
        filtered = filtered.filter((s) => s.statut === "refus");
      } else if (currentView === "integre") {
        filtered = filtered.filter((s) => s.statut === "integre");
      }

      setSuivis(filtered);
    }

    setLoading(false);
  }

  async function handleStatusUpdate(id, newStatus) {
    if (!newStatus) return;

    const { error } = await supabase
      .from("suivis_membres")
      .update({ statut: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Erreur update statut:", error);
    } else {
      await fetchSuivis(); // recharge la liste après update
    }
  }

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="p-6">
      {/* Liens de navigation */}
      <div className="mb-4 space-x-4 text-orange-500">
        {currentView !== "principale" && (
          <span
            className="cursor-pointer"
            onClick={() => setCurrentView("principale")}
          >
            Principale
          </span>
        )}
        {currentView !== "refus" && (
          <span
            className="cursor-pointer"
            onClick={() => setCurrentView("refus")}
          >
            Refus
          </span>
        )}
        {currentView !== "integre" && (
          <span
            className="cursor-pointer"
            onClick={() => setCurrentView("integre")}
          >
            Intégré
          </span>
        )}
      </div>

      {/* Tableau */}
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Prénom</th>
            <th className="border p-2">Nom</th>
            <th className="border p-2">Téléphone</th>
            <th className="border p-2">Besoin</th>
            <th className="border p-2">Infos Suppl.</th>
            <th className="border p-2">Statut Suivis</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {suivis.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-4 text-center">
                Aucun contact trouvé.
              </td>
            </tr>
          ) : (
            suivis.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.prenom}</td>
                <td className="border p-2">{s.nom}</td>
                <td className="border p-2">{s.telephone}</td>
                <td className="border p-2">{s.besoin}</td>
                <td className="border p-2">{s.infos_supplementaires}</td>

                {/* Colonne Statut Suivis */}
                <td className="border p-2">
                  {s.statut ? s.statut : ""}
                </td>

                {/* Action */}
                <td className="border p-2">
                  <select
                    value={selectedStatus[s.id] || ""}
                    onChange={(e) =>
                      setSelectedStatus({
                        ...selectedStatus,
                        [s.id]: e.target.value,
                      })
                    }
                    className="border p-1"
                  >
                    <option value="">-- Choisir --</option>
                    <option value="refus">Refus</option>
                    <option value="integre">Intégré</option>
                  </select>
                  <button
                    onClick={() =>
                      handleStatusUpdate(s.id, selectedStatus[s.id])
                    }
                    className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Valider
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
