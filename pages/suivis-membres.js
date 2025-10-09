// pages/suivis-membres.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [selectedCellules, setSelectedCellules] = useState({});
  const [statutsSuivis, setStatutsSuivis] = useState({});
  const [commentaires, setCommentaires] = useState({});

  useEffect(() => {
    fetchSuivis();
    fetchCellules();
  }, []);

  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select(
          `
          id,
          statut,
          created_at,
          membre:membre_id (id, prenom, nom, telephone, besoin, infos_supplementaires, ville),
          cellule:cellule_id (id, cellule, responsable, telephone)
        `
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSuivis(data || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    }
  };

  const fetchCellules = async () => {
    try {
      const { data, error } = await supabase
        .from("cellules")
        .select("id, cellule, responsable, telephone");
      if (error) throw error;
      setCellules(data || []);
    } catch (err) {
      console.error("Erreur fetchCellules:", err.message);
      setCellules([]);
    }
  };

  const handleChangeStatutSuivi = (id, value) => {
    setStatutsSuivis((prev) => ({ ...prev, [id]: value }));
    // Tu pourras ensuite rajouter ici un update dans la DB si nécessaire
  };

  const handleChangeCommentaire = (id, value) => {
    setCommentaires((prev) => ({ ...prev, [id]: value }));
    // Tu pourras ensuite rajouter ici un update dans la DB si nécessaire
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
    >
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      <h1 className="text-4xl font-bold text-white mb-6">Suivis Membres</h1>

      <div className="w-full max-w-5xl overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Prénom</th>
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Détails</th>
            </tr>
          </thead>
          <tbody>
            {suivis.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  Aucun contact trouvé.
                </td>
              </tr>
            ) : (
              suivis.map((suivi) => (
                <tr key={suivi.id} className="border-b">
                  <td className="py-2 px-4">{suivi.membre?.prenom}</td>
                  <td className="py-2 px-4">{suivi.membre?.nom}</td>
                  <td className="py-2 px-4">{suivi.statut}</td>
                  <td className="py-2 px-4">
                    <p
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() =>
                        setDetailsOpen((prev) => ({
                          ...prev,
                          [suivi.id]: !prev[suivi.id],
                        }))
                      }
                    >
                      {detailsOpen[suivi.id] ? "Fermer détails" : "Détails"}
                    </p>

                    {detailsOpen[suivi.id] && (
                      <div className="mt-2 text-sm text-gray-700 space-y-2">
                        <p>
                          <strong>Téléphone:</strong>{" "}
                          {suivi.membre?.telephone || "—"}
                        </p>
                        <p>
                          <strong>Besoin:</strong> {suivi.membre?.besoin || "—"}
                        </p>
                        <p>
                          <strong>Infos supp:</strong>{" "}
                          {suivi.membre?.infos_supplementaires || "—"}
                        </p>
                        <p>
                          <strong>Ville:</strong> {suivi.membre?.ville || "—"}
                        </p>
                        <p>
                          <strong>Cellule:</strong>{" "}
                          {suivi.cellule
                            ? `${suivi.cellule.cellule} (${suivi.cellule.responsable})`
                            : "—"}
                        </p>

                        {/* Statut Suivi */}
                        <div>
                          <label className="block text-gray-600 font-medium">
                            Statut Suivi :
                          </label>
                          <select
                            value={statutsSuivis[suivi.id] || ""}
                            onChange={(e) =>
                              handleChangeStatutSuivi(suivi.id, e.target.value)
                            }
                            className="border rounded-lg px-2 py-1 text-sm w-full"
                          >
                            <option value="">-- Sélectionner --</option>
                            <option value="Intégré">Intégré</option>
                            <option value="En cours">En cours</option>
                            <option value="Refus">Refus</option>
                          </select>
                        </div>

                        {/* Commentaire */}
                        <div>
                          <label className="block text-gray-600 font-medium">
                            Commentaire :
                          </label>
                          <textarea
                            value={commentaires[suivi.id] || ""}
                            onChange={(e) =>
                              handleChangeCommentaire(suivi.id, e.target.value)
                            }
                            className="border rounded-lg px-2 py-1 text-sm w-full"
                            rows="2"
                          />
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
