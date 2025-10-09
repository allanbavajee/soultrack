// pages/suivis-membres.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [members, setMembers] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [commentaires, setCommentaires] = useState({});
  const [suiviStatuts, setSuiviStatuts] = useState({});

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

  // Filtrer les suivis pour n'afficher que les statuts suivis pertinents
  const filteredSuivis = suivis.filter(
    (s) => ["Intégré", "En cours", "Refus"].includes(s.statut)
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
    >
      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-6">
        Suivis Membres 📋
      </h1>

      {filteredSuivis.length === 0 ? (
        <p className="text-white text-lg">Aucun contact trouvé.</p>
      ) : (
        <div className="w-full max-w-6xl overflow-x-auto bg-white rounded-xl shadow-md p-4">
          <table className="min-w-full text-center">
            <thead>
              <tr className="bg-gray-200">
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
                  <tr key={suivi.id} className="border-b">
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
                    <td className="py-2 px-4">
                      <button
                        className="text-orange-500 underline mb-1"
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
                        <div className="mt-2 text-gray-700 text-left space-y-1">
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
