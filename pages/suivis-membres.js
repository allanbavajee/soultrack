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
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-600 to-blue-400">
      <h1 className="text-3xl text-white font-bold mb-4">Suivis Membres 📋</h1>

      {/* Navigation */}
      <div className="mb-4 flex gap-4 text-orange-400">
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Prénom</th>
              <th className="py-2 px-4">Statut</th>
              <th className="py-2 px-4">Statut Suivis</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {suivis.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 text-gray-600">
                  Aucun contact trouvé.
                </td>
              </tr>
            ) : (
              suivis.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2 px-4">{s.nom}</td>
                  <td className="py-2 px-4">{s.prenom}</td>
                  <td className="py-2 px-4">{s.statut}</td>
                  <td className="py-2 px-4">{s.statut_suivi || ""}</td>
                  <td className="py-2 px-4">
                    <select
                      value={selectedStatus[s.id] || ""}
                      onChange={(e) =>
                        setSelectedStatus({ ...selectedStatus, [s.id]: e.target.value })
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="">-- Statut Suivis --</option>
                      <option value="En cours">En cours</option>
                      <option value="Intégré">Intégré</option>
                      <option value="Refus">Refus</option>
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
    </div>
  );
}
