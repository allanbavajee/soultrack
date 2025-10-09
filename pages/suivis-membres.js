// pages/suivis-membres.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [commentaire, setCommentaire] = useState({});
  const [filter, setFilter] = useState("");
  const [viewList, setViewList] = useState("principale"); // 'principale', 'refus', 'integre'

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select(`id, statut, commentaire, membre: membre_id (*)`)
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
    } catch (err) {
      console.error("Erreur update statut:", err.message);
    }
  };

  const filteredSuivis = suivis.filter((s) => {
    // Filtrer par liste
    if (viewList === "principale") {
      return (
        (s.membre.statut === "visiteur" || s.membre.statut === "veut rejoindre ICC") &&
        (!filter || s.statut === filter)
      );
    }
    if (viewList === "refus") return s.statut === "Refus";
    if (viewList === "integre") return s.statut === "Intégré";
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-indigo-600 to-blue-400">
      <h1 className="text-4xl text-white font-handwriting mb-4">Suivis Membres 📋</h1>

      {/* Boutons rapides Refus / Intégré */}
      <div className="mb-4 flex gap-4">
        <button
          className={`px-4 py-2 rounded-xl font-semibold ${
            viewList === "principale" ? "bg-orange-500 text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => setViewList("principale")}
        >
          Principale
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold ${
            viewList === "refus" ? "bg-orange-500 text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => setViewList("refus")}
        >
          Refus
        </button>
        <button
          className={`px-4 py-2 rounded-xl font-semibold ${
            viewList === "integre" ? "bg-orange-500 text-white" : "bg-white text-gray-700"
          }`}
          onClick={() => setViewList("integre")}
        >
          Intégré
        </button>
      </div>

      {/* Filtre central */}
      {viewList === "principale" && (
        <div className="mb-4 w-full max-w-md flex justify-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Filtrer par statut Suivis --</option>
            <option value="En cours">En cours</option>
            <option value="Intégré">Intégré</option>
            <option value="Refus">Refus</option>
          </select>
        </div>
      )}

      <div className="w-full max-w-5xl overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Prénom</th>
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Détails</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuivis.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-gray-600">
                  Aucun contact trouvé.
                </td>
              </tr>
            ) : (
              filteredSuivis.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2 px-4">{s.membre.prenom}</td>
                  <td className="py-2 px-4">{s.membre.nom}</td>
                  <td className="py-2 px-4">{s.membre.statut}</td>
                  <td className="py-2 px-4">
                    <p
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() =>
                        setDetailsOpen((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                      }
                    >
                      {detailsOpen[s.id] ? "Fermer détails" : "Détails"}
                    </p>

                    {detailsOpen[s.id] && (
                      <div className="mt-2 text-sm text-gray-700 text-left">
                        <p>
                          <strong>Besoin:</strong> {s.membre.besoin || "—"}
                        </p>
                        <p>
                          <strong>Infos supplémentaires:</strong>{" "}
                          {s.membre.infos_supplementaires || "—"}
                        </p>
                        <p>
                          <strong>Comment est-il venu ?</strong> {s.membre.comment || "—"}
                        </p>
                        <p>
                          <strong>Cellule:</strong> {s.membre.cellule_id || "—"}
                        </p>

                        <div className="mt-2 flex flex-col gap-2">
                          <select
                            value={selectedStatus[s.id] || ""}
                            onChange={(e) =>
                              setSelectedStatus((prev) => ({
                                ...prev,
                                [s.id]: e.target.value,
                              }))
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
                              setCommentaire((prev) => ({
                                ...prev,
                                [s.id]: e.target.value,
                              }))
                            }
                            className="border rounded-lg px-2 py-1 text-sm w-full"
                          />

                          <button
                            onClick={() => handleStatusUpdate(s.id)}
                            className="mt-1 py-2 bg-orange-500 text-white rounded-xl font-semibold"
                          >
                            Valider
                          </button>
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
