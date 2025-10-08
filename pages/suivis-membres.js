// pages/suivis-membres.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [selectedCellules, setSelectedCellules] = useState({});

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
          membres: membre_id (*),
          cellules: cellule_id (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSuivis(data || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const getBorderColor = (status) => {
    if (status === "actif") return "#4285F4";
    if (status === "a déjà mon église") return "#EA4335";
    if (status === "ancien") return "#999999";
    if (status === "envoyer") return "#34A853"; // le statut que tu veux afficher
    return "#ccc";
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        Suivis Membres
      </h1>

      {suivis.length === 0 ? (
        <p className="text-white mt-4">Aucun membre trouvé.</p>
      ) : (
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
              {suivis.map((suivi) => {
                const member = suivi.membres;
                const cellule = suivi.cellules;

                return (
                  <tr key={suivi.id} className="border-b">
                    <td className="py-2 px-4">{member?.prenom || "—"}</td>
                    <td className="py-2 px-4">{member?.nom || "—"}</td>
                    <td
                      className="py-2 px-4 font-semibold"
                      style={{ color: getBorderColor(suivi.statut) }}
                    >
                      {suivi.statut || "—"}
                    </td>
                    <td className="py-2 px-4">
                      <p
                        className="text-blue-500 underline cursor-pointer"
                        onClick={() =>
                          setDetailsOpen((prev) => ({ ...prev, [suivi.id]: !prev[suivi.id] }))
                        }
                      >
                        {detailsOpen[suivi.id] ? "Fermer détails" : "Détails"}
                      </p>

                      {detailsOpen[suivi.id] && (
                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                          <p><strong>Prénom:</strong> {member?.prenom || "—"}</p>
                          <p><strong>Nom:</strong> {member?.nom || "—"}</p>
                          <p><strong>Statut:</strong> {suivi.statut || "—"}</p>
                          <p><strong>Téléphone:</strong> {member?.telephone || "—"}</p>
                          <p><strong>Besoin:</strong> {member?.besoin || "—"}</p>
                          <p><strong>Infos supplémentaires:</strong> {member?.infos_supplementaires || "—"}</p>
                          <p><strong>Comment est-il venu ?</strong> {member?.comment || "—"}</p>
                          <p><strong>Cellule:</strong> {cellule?.cellule || "—"} ({cellule?.responsable || "—"})</p>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold"
      >
        ↑
      </button>
    </div>
  );
}
