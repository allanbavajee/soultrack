"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [currentView, setCurrentView] = useState("principale");

  useEffect(() => {
    fetchSuivis();
  }, [currentView]);

  async function fetchSuivis() {
    const { data, error } = await supabase
      .from("suivis_membres")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setSuivis([]);
      return;
    }

    let filtered = data;

    if (currentView === "principale") {
      filtered = filtered.filter(
        (s) => s.statut !== "Refus" && s.statut !== "Intégré"
      );
    } else if (currentView === "refus") {
      filtered = filtered.filter((s) => s.statut === "Refus");
    } else if (currentView === "integre") {
      filtered = filtered.filter((s) => s.statut === "Intégré");
    }

    setSuivis(filtered);
  }

  async function handleStatusUpdate(id) {
    const newStatus = selectedStatus[id];
    if (!newStatus) return;

    const { error } = await supabase
      .from("suivis_membres")
      .update({ statut: newStatus })
      .eq("id", id);

    if (error) {
      console.error(error);
    } else {
      fetchSuivis();
      setSelectedStatus((prev) => ({ ...prev, [id]: "" }));
    }
  }

  return (
    <div className="p-4">
      {/* Navigation */}
      <div className="mb-4 space-x-4 text-orange-500">
        {currentView !== "principale" && (
          <span className="cursor-pointer" onClick={() => setCurrentView("principale")}>
            Principale
          </span>
        )}
        {currentView !== "refus" && (
          <span className="cursor-pointer" onClick={() => setCurrentView("refus")}>
            Refus
          </span>
        )}
        {currentView !== "integre" && (
          <span className="cursor-pointer" onClick={() => setCurrentView("integre")}>
            Intégré
          </span>
        )}
      </div>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Statut</th>
            <th className="border p-2">Commentaire</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {suivis.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center">Aucun contact trouvé.</td>
            </tr>
          ) : (
            suivis.map((s) => (
              <tr key={s.id}>
                <td className="border p-2">{s.id}</td>
                <td className="border p-2">{s.statut}</td>
                <td className="border p-2">{s.commentaire || ""}</td>
                <td className="border p-2">
                  <select
                    value={selectedStatus[s.id] || ""}
                    onChange={(e) =>
                      setSelectedStatus({ ...selectedStatus, [s.id]: e.target.value })
                    }
                  >
                    <option value="">-- Statut --</option>
                    <option value="Refus">Refus</option>
                    <option value="Intégré">Intégré</option>
                  </select>
                  <button
                    className="ml-2 px-2 py-1 bg-green-500 text-white rounded"
                    onClick={() => handleStatusUpdate(s.id)}
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
