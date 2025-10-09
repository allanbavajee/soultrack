// pages/suivis-membres.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [filter, setFilter] = useState(""); // filtre par statut
  const [detailsOpen, setDetailsOpen] = useState({});

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      // Jointure entre suivis_membres et membres
      const { data, error } = await supabase
        .from("suivis_membres as sm")
        .select(`
          sm.id,
          sm.statut as statut_suivi,
          sm.commentaire,
          m:id (*)
        `)
        .order("sm.created_at", { ascending: false });

      if (error) throw error;
      setSuivis(data || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    }
  };

  const filteredSuivis = suivis.filter((s) => {
    if (!filter) return true;
    return s.statut_suivi === filter;
  });

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-blue-900 to-cyan-300">
      <h1 className="text-5xl font-handwriting text-white mb-4">Suivis Membres 📋</h1>

      {/* Filtre central */}
      <div className="mb-4 w-full max-w-md flex justify-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Filtrer par statut suivi --</option>
          <option value="visiteur">Visiteur</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="en cours">En cours</option>
          <option value="intégré">Intégré</option>
          <option value="refus">Refus</option>
        </select>
      </div>

      {filteredSuivis.length === 0 ? (
        <p className="text-white text-xl mt-8">Aucun contact trouvé.</p>
      ) : (
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Prénom</th>
                <th className="py-2 px-4">Nom</th>
                <th className="py-2 px-4">Statut Suivi</th>
                <th className="py-2 px-4">Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuivis.map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2 px-4">{s.m.prenom}</td>
                  <td className="py-2 px-4">{s.m.nom}</td>
                  <td className="py-2 px-4">{s.statut_suivi}</td>
                  <td className="py-2 px-4 text-left">
                    <p><strong>Téléphone:</strong> {s.m.telephone || "—"}</p>
                    <p><strong>Besoin:</strong> {s.m.besoin || "—"}</p>
                    <p><strong>Infos supplémentaires:</strong> {s.m.infos_supplementaires || "—"}</p>
                    <p><strong>Comment est-il venu ?</strong> {s.m.comment || "—"}</p>
                    <p><strong>Cellule:</strong> {s.m.cellule || "—"}</p>
                    <p><strong>Commentaire:</strong> {s.commentaire || "—"}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
