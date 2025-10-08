// pages/suivis-membres.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [view, setView] = useState("card"); // 'card' ou 'table'

  useEffect(() => {
    fetchSuivis();
    fetchCellules();
  }, []);

  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select(`
          id,
          statut,
          created_at,
          membres (
            id,
            prenom,
            nom,
            telephone,
            statut as membre_statut,
            besoin,
            infos_supplementaires,
            star,
            ville
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSuivis(data || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    }
  };

  const fetchCellules = async () => {
    try {
      const { data, error } = await supabase
        .from("cellules")
        .select("*");
      if (error) throw error;
      setCellules(data || []);
    } catch (err) {
      console.error("Erreur fetchCellules:", err.message);
      setCellules([]);
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await supabase
        .from("suivis_membres")
        .update({ statut: newStatus })
        .eq("id", id);
      setSuivis((prev) =>
        prev.map((s) => (s.id === id ? { ...s, statut: newStatus } : s))
      );
    } catch (err) {
      console.error("Erreur update statut:", err.message);
    }
  };

  const sendWhatsapp = (celluleId, suivi) => {
    const cellule = cellules.find((c) => String(c.id) === String(celluleId));
    if (!cellule || !cellule.telephone) return alert("Numéro de cellule invalide.");

    const phone = cellule.telephone.replace(/\D/g, "");
    const member = suivi.membres;

    const message = `👋 Salut ${cellule.responsable},
🙏 Voici un nouveau suivi à effectuer:
- Nom: ${member.prenom} ${member.nom}
- Téléphone: ${member.telephone || "—"}
- Besoin: ${member.besoin || "—"}
- Infos: ${member.infos_supplementaires || "—"}
- Comment est-il venu?: ${member.comment || "—"}`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    if (member.membre_statut === "visiteur" || member.membre_statut === "veut rejoindre ICC") {
      handleChangeStatus(suivi.id, "actif");
    }
  };

  // Trier pour que les nouveaux soient tout en haut
  const nouveaux = suivis.filter(
    (s) =>
      s.membres.membre_statut === "visiteur" ||
      s.membres.membre_statut === "veut rejoindre ICC"
  );
  const anciens = suivis.filter(
    (s) =>
      s.membres.membre_statut !== "visiteur" &&
      s.membres.membre_statut !== "veut rejoindre ICC"
  );
  const suivisTries = [...nouveaux, ...anciens];

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Suivis Membres</h1>

      {/* Toggle Visuel */}
      <p
        className="self-end text-orange-500 cursor-pointer mb-4"
        onClick={() => setView(view === "card" ? "table" : "card")}
      >
        Visuel
      </p>

      {view === "card" ? (
        <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suivisTries.map((suivi) => {
            const m = suivi.membres;
            const isNouveau =
              m.membre_statut === "visiteur" || m.membre_statut === "veut rejoindre ICC";
            return (
              <div
                key={suivi.id}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border-t-4"
                style={{ borderTopColor: isNouveau ? "#34A853" : "#ccc" }}
              >
                <h2 className="text-lg font-bold mb-1 flex justify-between items-center">
                  {m.prenom} {m.nom} {m.star && <span className="ml-1 text-yellow-400">⭐</span>}
                  {isNouveau && <span className="ml-2 text-sm bg-blue-200 text-blue-800 px-2 rounded">Nouveau</span>}
                </h2>
                <p className="text-sm mb-1">📱 {m.telephone || "—"}</p>
                <p className="text-sm font-semibold">{m.membre_statut}</p>

                <p
                  className="mt-2 text-blue-500 underline cursor-pointer"
                  onClick={() =>
                    setDetailsOpen((prev) => ({ ...prev, [suivi.id]: !prev[suivi.id] }))
                  }
                >
                  {detailsOpen[suivi.id] ? "Fermer détails" : "Détails"}
                </p>

                {detailsOpen[suivi.id] && (
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <p>Besoin: {m.besoin || "—"}</p>
                    <p>Infos supplémentaires: {m.infos_supplementaires || "—"}</p>
                    <p>Comment est-il venu?: {m.comment || "—"}</p>

                    <p>Cellule:</p>
                    <select
                      value={selectedCellules[suivi.id] || ""}
                      onChange={(e) =>
                        setSelectedCellules((prev) => ({ ...prev, [suivi.id]: e.target.value }))
                      }
                      className="border rounded-lg px-2 py-1 text-sm w-full"
                    >
                      <option value="">-- Sélectionner cellule --</option>
                      {cellules.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cellule} ({c.responsable})
                        </option>
                      ))}
                    </select>

                    {selectedCellules[suivi.id] && (
                      <button
                        onClick={() => sendWhatsapp(selectedCellules[suivi.id], suivi)}
                        className="mt-2 w-full py-2 rounded-xl text-white font-bold bg-green-500"
                      >
                        Envoyer par WhatsApp
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        // Vue Table
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
              {suivisTries.map((suivi) => {
                const m = suivi.membres;
                const isNouveau =
                  m.membre_statut === "visiteur" || m.membre_statut === "veut rejoindre ICC";
                return (
                  <tr key={suivi.id} className="border-b">
                    <td className="py-2 px-4">{m.prenom}</td>
                    <td className="py-2 px-4">{m.nom}</td>
                    <td className="py-2 px-4">
                      {m.membre_statut} {isNouveau && <span className="ml-1 text-sm bg-blue-200 text-blue-800 px-2 rounded">Nouveau</span>}
                    </td>
                    <td className="py-2 px-4">
                      <p
                        className="text-blue-500 underline cursor-pointer"
                        onClick={() =>
                          setDetailsOpen((prev) => ({ ...prev, [suivi.id]: !prev[suivi.id] }))
                        }
                      >
                        {detailsOpen[suivi.id] ? "Fermer détails" : "Détails"}
                      </p>

                      {detailsOpen[suivi.id] && (
                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                          <p>Besoin: {m.besoin || "—"}</p>
                          <p>Infos supplémentaires: {m.infos_supplementaires || "—"}</p>
                          <p>Comment est-il venu?: {m.comment || "—"}</p>

                          <p>Cellule:</p>
                          <select
                            value={selectedCellules[suivi.id] || ""}
                            onChange={(e) =>
                              setSelectedCellules((prev) => ({ ...prev, [suivi.id]: e.target.value }))
                            }
                            className="border rounded-lg px-2 py-1 text-sm w-full"
                          >
                            <option value="">-- Sélectionner cellule --</option>
                            {cellules.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.cellule} ({c.responsable})
                              </option>
                            ))}
                          </select>

                          {selectedCellules[suivi.id] && (
                            <button
                              onClick={() => sendWhatsapp(selectedCellules[suivi.id], suivi)}
                              className="mt-2 w-full py-2 rounded-xl text-white font-bold bg-green-500"
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
