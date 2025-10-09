// pages/suivis-membres.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [commentaire, setCommentaire] = useState({});
  const [viewList, setViewList] = useState("principale"); // 'principale', 'refus', 'integre'

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
        .update({ statut_suivi: newStatus, commentaire: newComment })
        .eq("id", suiviId);

      setSuivis((prev) =>
        prev.map((s) =>
          s.id === suiviId ? { ...s, statut_suivi: newStatus, commentaire: newComment } : s
        )
      );

      setSelectedStatus((prev) => ({ ...prev, [suiviId]: "" }));
      setCommentaire((prev) => ({ ...prev, [suiviId]: "" }));
    } catch (err) {
      console.error("Erreur update statut:", err.message);
    }
  };

  const filteredSuivis = suivis.filter((s) => {
    if (viewList === "principale") {
      return (
        (s.statut === "visiteur" || s.statut === "veut rejoindre ICC") &&
        s.statut_suivi !== "Refus" &&
        s.statut_suivi !== "Intégré"
      );
    }
    if (viewList === "refus") return s.statut_suivi === "Refus";
    if (viewList === "integre") return s.statut_suivi === "Intégré";
    return true;
  });

  const otherViews = [];
  if (viewList === "principale") otherViews.push("Refus", "Intégré");
  if (viewList === "refus") otherViews.push("Principale", "Intégré");
  if (viewList === "integre") otherViews.push("Principale", "Refus");

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-indigo-600 to-blue-400">
      <h1 className="text-4xl text-white font-handwriting mb-4">Suivis Membres 📋</h1>

      <div className="mb-4 flex gap-4">
        {otherViews.map((v) => (
          <p
            key={v}
            className="text-orange-500 cursor-pointer"
            onClick={() =>
              setViewList(v.toLowerCase().replace("é", "e"))
            }
          >
            {v}
          </p>
        ))}
      </div>

      <div className="w-full max-w-5xl overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Prénom</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Statut Suivis</th>
              <th className="py-2 px-4">Action</th>
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
                  <td className="py-2 px-4">{s.nom}</td>
                  <td className="py-2 px-4">{s.prenom}</td>
                  <td className="py-2 px-4">{s.statut}</td>
                  <td className="py-2 px-4">{s.statut_suivi || "—"}</td>
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
