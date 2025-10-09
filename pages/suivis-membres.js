// pages/suivis-membres.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [members, setMembers] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [commentaire, setCommentaire] = useState({});
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select(`
          id,
          statut AS statut_suivi,
          commentaire,
          membres(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error("Erreur fetchMembers:", err.message);
      setMembers([]);
    }
  };

  const handleUpdateSuivi = async (id) => {
    try {
      const { error } = await supabase
        .from("suivis_membres")
        .update({
          statut: selectedStatus[id],
          commentaire: commentaire[id] || "",
        })
        .eq("id", id);

      if (error) throw error;

      // Met à jour localement
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                statut_suivi: selectedStatus[id],
                commentaire: commentaire[id] || "",
              }
            : m
        )
      );

      // Ferme les détails après validation
      setDetailsOpen((prev) => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error("Erreur update suivi:", err.message);
    }
  };

  // Filtrer uniquement les visiteurs et ceux qui veulent rejoindre ICC
  const filteredMembers = members.filter(
    (m) =>
      m.statut_suivi === "visiteur" || m.statut_suivi === "veut rejoindre ICC"
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-4">
        Suivis Membres 📋
      </h1>

      {/* Filtre central */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full max-w-md justify-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Filtrer par statut suivi --</option>
          <option value="visiteur">Visiteur</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
        </select>
      </div>

      {filteredMembers.length === 0 ? (
        <p className="text-white text-lg">Aucun contact trouvé.</p>
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
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b">
                  <td className="py-2 px-4">{member.membres.prenom}</td>
                  <td className="py-2 px-4">{member.membres.nom}</td>
                  <td className="py-2 px-4">{member.statut_suivi}</td>
                  <td className="py-2 px-4">
                    <p
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() =>
                        setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
                      }
                    >
                      {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                    </p>

                    {detailsOpen[member.id] && (
                      <div className="mt-2 text-sm text-gray-700 space-y-2 text-left">
                        <p><strong>Besoin:</strong> {member.membres.besoin || "—"}</p>
                        <p><strong>Infos supplémentaires:</strong> {member.membres.infos_supplementaires || "—"}</p>
                        <p><strong>Comment est-il venu ?</strong> {member.membres.comment || "—"}</p>
                        <p><strong>Cellule:</strong> {member.membres.cellule || "—"}</p>

                        <div className="flex flex-col md:flex-row gap-2 mt-2">
                          <select
                            value={selectedStatus[member.id] || member.statut_suivi}
                            onChange={(e) =>
                              setSelectedStatus((prev) => ({ ...prev, [member.id]: e.target.value }))
                            }
                            className="border rounded-lg px-2 py-1 text-sm"
                          >
                            <option value="intégré">Intégré</option>
                            <option value="en cours">En cours</option>
                            <option value="refus">Refus</option>
                          </select>

                          <input
                            type="text"
                            placeholder="Ajouter un commentaire"
                            value={commentaire[member.id] || member.commentaire || ""}
                            onChange={(e) =>
                              setCommentaire((prev) => ({ ...prev, [member.id]: e.target.value }))
                            }
                            className="border rounded-lg px-2 py-1 text-sm flex-1"
                          />

                          <button
                            onClick={() => handleUpdateSuivi(member.id)}
                            className="bg-green-500 text-white rounded-lg px-4 py-1 text-sm hover:bg-green-600"
                          >
                            Valider
                          </button>
                        </div>
                      </div>
                    )}
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
