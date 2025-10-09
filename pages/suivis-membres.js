"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [commentaire, setCommentaire] = useState({});

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSuivis(data || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    }
  };

  const handleStatusUpdate = async (suiviId) => {
    const newStatus = selectedStatus[suiviId];
    const newComment = commentaire[suiviId] || "";

    if (!newStatus) return;

    try {
      await supabase
        .from("suivis_membres")
        .update({ statut: newStatus, commentaire: newComment })
        .eq("id", suiviId);

      fetchSuivis();
      setSelectedStatus((prev) => ({ ...prev, [suiviId]: "" }));
      setCommentaire((prev) => ({ ...prev, [suiviId]: "" }));
    } catch (err) {
      console.error("Erreur update statut:", err.message);
    }
  };

  // Afficher uniquement les visiteurs dans la page principale
  const filteredSuivis = suivis.filter(
    (s) => s.statut === "visiteur" && s.statut !== "Refus" && s.statut !== "Intégré"
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-indigo-600 to-blue-400">
      <h1 className="text-4xl text-white font-handwriting mb-4">Suivis Membres 📋</h1>

      <div className="w-full max-w-5xl overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Membre ID</th>
              <th className="py-2 px-4">Cellule ID</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Commentaire</th>
              <th className="py-2 px-4">Modifier</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuivis.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-gray-600">
                  Aucun contact trouvé.
                </td>
              </tr>
            ) : (
              filteredSuivis.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2 px-4">{s.membre_id}</td>
                  <td className="py-2 px-4">{s.cellule_id}</td>
                  <td className="py-2 px-4">{s.statut}</td>
                  <td className="py-2 px-4">{s.commentaire || "—"}</td>
                  <td className="py-2 px-4">
                    <select
                      value={selectedStatus[s.id] || ""}
                      onChange={(e) =>
                        setSelectedStatus((prev) => ({ ...prev, [s.id]: e.target.value }))
                      }
                      className="border rounded-lg px-2 py-1 text-sm w-full"
                    >
                      <option value="">-- Statut Suivis --</option>
                      <option value="En cours">En cours</option>
                      <option value="Intégré">Intégré</option>
                      <option value="Refus">Refus</option>
                    </select>

                    <textarea
                      placeholder="Ajouter un commentaire"
                      value={commentaire[s.id] || ""}
                      onChange={(e) =>
                        setCommentaire((prev) => ({ ...prev, [s.id]: e.target.value }))
                      }
                      className="border rounded-lg px-2 py-1 text-sm w-full mt-1"
                    />

                    <button
                      onClick={() => handleStatusUpdate(s.id)}
                      className="mt-1 py-2 bg-orange-500 text-white rounded-xl font-semibold w-full"
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
    </div>
  );
}
