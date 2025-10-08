// pages/suivis-membres.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [detailsOpen, setDetailsOpen] = useState({});

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("suivis_membres")
        .select(`
          id,
          statut,
          created_at,
          membres: membre_id (*),
          cellules: cellule_id (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSuivis(data || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await supabase.from("suivis_membres").update({ statut: newStatus }).eq("id", id);
      setSuivis((prev) =>
        prev.map((s) => (s.id === id ? { ...s, statut: newStatus } : s))
      );
    } catch (err) {
      console.error("Erreur update statut:", err.message);
    }
  };

  const sendWhatsapp = (cellule, membre) => {
    if (!cellule || !cellule.telephone) return alert("Numéro de la cellule introuvable.");
    const phone = cellule.telephone.replace(/\D/g, "");
    if (!phone) return alert("Numéro de la cellule invalide.");

    const message = `👋 Salut ${cellule.responsable},

🙏 Nouveau suivi :
- 👤 Nom : ${membre.prenom} ${membre.nom}
- 📱 Téléphone : ${membre.telephone || "—"}
- 🏙 Ville : ${membre.ville || "—"}
- 🙏 Besoin : ${membre.besoin || "—"}
- 📝 Infos supplémentaires : ${membre.infos_supplementaires || "—"}
- 💬 Comment est-il venu ? : ${membre.comment || "—"}
- 🏠 Cellule : ${cellule.cellule || "—"}`;

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    // Mettre statut à "envoyé"
    handleChangeStatus(membre.id, "envoyé");
  };

  const getBorderColor = (statut) => {
    if (statut === "envoyé") return "#34A853";
    return "#ccc";
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 text-center">Suivis Membres</h1>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : suivis.length === 0 ? (
        <p className="text-center">Aucun membre trouvé.</p>
      ) : (
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Prénom</th>
                <th className="py-2 px-4">Nom</th>
                <th className="py-2 px-4">Statut</th>
                <th className="py-2 px-4">Détails</th>
              </tr>
            </thead>
            <tbody>
              {suivis.map((s) => {
                const membre = s.membres || {};
                const cellule = s.cellules || {};
                return (
                  <tr key={s.id} className="border-b">
                    <td className="py-2 px-4">{membre.prenom || "—"}</td>
                    <td className="py-2 px-4">{membre.nom || "—"}</td>
                    <td className="py-2 px-4">
                      <select
                        value={s.statut || ""}
                        onChange={(e) => handleChangeStatus(s.id, e.target.value)}
                        className="border rounded-lg px-2 py-1 text-sm w-full"
                      >
                        <option value="envoyé">Envoyé</option>
                        <option value="en attente">En attente</option>
                        <option value="à relancer">À relancer</option>
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
                          <p><strong>Besoin:</strong> {membre.besoin || "—"}</p>
                          <p><strong>Infos supplémentaires:</strong> {membre.infos_supplementaires || "—"}</p>
                          <p><strong>Comment est-il venu ?</strong> {membre.comment || "—"}</p>
                          <p><strong>Cellule:</strong> {cellule.cellule || "—"} ({cellule.responsable || "—"})</p>

                          {cellule && (
                            <button
                              onClick={() => sendWhatsapp(cellule, membre)}
                              className="mt-2 w-full py-2 rounded-xl text-white font-bold bg-green-500 hover:bg-green-600 transition-colors"
                            >
                              Envoyer par WhatsApp
                            </button>
                          )}
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
