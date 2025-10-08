// pages/suivis-membres.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState({});

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      setLoading(true);

      const { data: suivisData, error: suivisError } = await supabase
        .from("suivis_membres")
        .select("*")
        .order("created_at", { ascending: false });

      if (suivisError) throw suivisError;

      const suivisWithDetails = await Promise.all(
        suivisData.map(async (s) => {
          const { data: member } = await supabase
            .from("membres")
            .select("*")
            .eq("id", s.membre_id)
            .single();

          const { data: cellule } = await supabase
            .from("cellules")
            .select("*")
            .eq("id", s.cellule_id)
            .single();

          return { ...s, member, cellule };
        })
      );

      setSuivis(suivisWithDetails);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async (id, newStatus) => {
    try {
      await supabase.from("suivis_membres").update({ statut: newStatus }).eq("id", id);
      setSuivis((prev) =>
        prev.map((s) => (s.id === id ? { ...s, statut: newStatus } : s))
      );
    } catch (err) {
      console.error("Erreur update statut:", err.message);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      <h1 className="text-4xl font-bold mb-4">Suivis Membres</h1>

      {loading ? (
        <p>Chargement...</p>
      ) : suivis.length === 0 ? (
        <p>Aucun membre trouvé.</p>
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
              {suivis.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2 px-4">{s.member?.prenom || "—"}</td>
                  <td className="py-2 px-4">{s.member?.nom || "—"}</td>
                  <td className="py-2 px-4">
                    <select
                      value={s.statut || ""}
                      onChange={(e) => updateStatut(s.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    >
                      <option value="nouveau">Nouveau</option>
                      <option value="envoyé">Envoyé</option>
                      <option value="en cours">En cours</option>
                      <option value="terminé">Terminé</option>
                    </select>
                  </td>
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
                      <div className="mt-2 text-sm text-gray-700 space-y-1">
                        <p><strong>Prénom:</strong> {s.member?.prenom || "—"}</p>
                        <p><strong>Nom:</strong> {s.member?.nom || "—"}</p>
                        <p><strong>Téléphone:</strong> {s.member?.telephone || "—"}</p>
                        <p><strong>Besoin:</strong> {s.member?.besoin || "—"}</p>
                        <p><strong>Infos supplémentaires:</strong> {s.member?.infos_supplementaires || "—"}</p>
                        <p><strong>Comment est-il venu ?</strong> {s.member?.comment || "—"}</p>
                        <p><strong>Cellule:</strong> {s.cellule?.cellule || "—"} ({s.cellule?.responsable || "—"})</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
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
