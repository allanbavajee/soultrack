// pages/suivis-membres.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [members, setMembers] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [suiviStatuts, setSuiviStatuts] = useState({});
  const [commentaires, setCommentaires] = useState({});
  const [filter, setFilter] = useState(""); // Filtre central

  useEffect(() => {
    fetchSuivis();
    fetchMembers();
    fetchCellules();
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

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase.from("membres").select("*");
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error("Erreur fetchMembers:", err.message);
      setMembers([]);
    }
  };

  const fetchCellules = async () => {
    try {
      const { data, error } = await supabase.from("cellules").select("*");
      if (error) throw error;
      setCellules(data || []);
    } catch (err) {
      console.error("Erreur fetchCellules:", err.message);
      setCellules([]);
    }
  };

  const getMemberById = (id) => members.find((m) => m.id === id) || {};

  const getCelluleById = (id) => cellules.find((c) => c.id === id) || {};

  const handleSuiviChange = async (suiviId, newStatut) => {
    try {
      await supabase
        .from("suivis_membres")
        .update({ statut: newStatut })
        .eq("id", suiviId);
      setSuiviStatuts((prev) => ({ ...prev, [suiviId]: newStatut }));
    } catch (err) {
      console.error("Erreur update statut suivi:", err.message);
    }
  };

  const handleCommentChange = async (suiviId, newComment) => {
    try {
      await supabase
        .from("suivis_membres")
        .update({ commentaire: newComment })
        .eq("id", suiviId);
      setCommentaires((prev) => ({ ...prev, [suiviId]: newComment }));
    } catch (err) {
      console.error("Erreur update commentaire:", err.message);
    }
  };

  // Filtrer uniquement les statuts "visiteur" et "veut rejoindre ICC"
  const filteredSuivis = suivis.filter((s) => {
    const member = getMemberById(s.membre_id);
    if (!member) return false;
    if (filter && member.statut !== filter) return false;
    return member.statut === "visiteur" || member.statut === "veut rejoindre ICC";
  });

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-4">
        Suivis Membres 📋
      </h1>

      {/* Filtre central */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full max-w-md">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Filtrer par statut --</option>
          <option value="visiteur">Visiteur</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
        </select>
        <span className="text-white italic text-opacity-80">
          Résultats: {filteredSuivis.length}
        </span>
      </div>

      {filteredSuivis.length === 0 ? (
        <p className="text-white text-lg">Aucun contact trouvé.</p>
      ) : (
        <div className="w-full max-w-6xl overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="py-2 px-4">Prénom</th>
                <th className="py-2 px-4">Nom</th>
                <th className="py-2 px-4">Statut</th>
                <th className="py-2 px-4">Statut Suivis</th>
                <th className="py-2 px-4">Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuivis.map((suivi) => {
                const member = getMemberById(suivi.membre_id);
                return (
                  <tr key={suivi.id} className="border-b text-center">
                    <td className="py-2 px-4">{member.prenom}</td>
                    <td className="py-2 px-4">{member.nom}</td>
                    <td className="py-2 px-4">{member.statut}</td>
                    <td className="py-2 px-4">
                      <select
                        value={suiviStatuts[suivi.id] || suivi.statut || ""}
                        onChange={(e) =>
                          handleSuiviChange(suivi.id, e.target.value)
                        }
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="Intégré">Intégré</option>
                        <option value="En cours">En cours</option>
                        <option value="Refus">Refus</option>
                      </select>
                    </td>
                    <td className="py-2 px-4 text-left">
                      <button
                        className="text-blue-500 underline mb-1"
                        onClick={() =>
                          setDetailsOpen((prev) => ({
                            ...prev,
                            [suivi.id]: !prev[suivi.id],
                          }))
                        }
                      >
                        {detailsOpen[suivi.id] ? "Fermer détails" : "Détails"}
                      </button>

                      {detailsOpen[suivi.id] && (
                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                          <p><strong>Téléphone:</strong> {member.telephone || "—"}</p>
                          <p><strong>Besoin:</strong> {member.besoin || "—"}</p>
                          <p><strong>Infos supplémentaires:</strong> {member.infos_supplementaires || "—"}</p>
                          <p><strong>Comment est-il venu ?</strong> {member.comment || "—"}</p>
                          <p><strong>Cellule:</strong> {getCelluleById(suivi.cellule_id)?.cellule || "—"}</p>

                          <textarea
                            placeholder="Ajouter un commentaire..."
                            value={commentaires[suivi.id] || ""}
                            onChange={(e) =>
                              setCommentaires((prev) => ({
                                ...prev,
                                [suivi.id]: e.target.value,
                              }))
                            }
                            onBlur={(e) =>
                              handleCommentChange(suivi.id, e.target.value)
                            }
                            className="border rounded px-2 py-1 w-full mt-1"
                          />
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
    </div>
  );
}
