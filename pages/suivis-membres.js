// pages/suivis-membres.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
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
          membre_id,
          cellule_id,
          statut,
          created_at,
          membres (*)
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
        .select("id, cellule, responsable, telephone, ville");
      if (error) throw error;
      setCellules(data || []);
    } catch (err) {
      console.error("Erreur fetchCellules:", err.message);
      setCellules([]);
    }
  };

  const handleChangeStatus = async (suiviId, newStatus) => {
    try {
      await supabase.from("suivis_membres").update({ statut: newStatus }).eq("id", suiviId);
      setSuivis((prev) =>
        prev.map((s) => (s.id === suiviId ? { ...s, statut: newStatus } : s))
      );
    } catch (err) {
      console.error("Erreur update statut:", err.message);
    }
  };

  const getBorderColor = (statut) => {
    if (statut === "actif") return "#4285F4";
    if (statut === "a déjà mon église") return "#EA4335";
    if (statut === "ancien") return "#999999";
    if (statut === "veut rejoindre ICC" || statut === "visiteur") return "#34A853";
    return "#ccc";
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Trier les suivis : nouveaux en haut
  const suivisTries = [
    ...suivis.filter(
      (s) => s.membres && (s.membres.statut === "visiteur" || s.membres.statut === "veut rejoindre ICC")
    ),
    ...suivis.filter(
      (s) => s.membres && !(s.membres.statut === "visiteur" || s.membres.statut === "veut rejoindre ICC")
    ),
  ];

  const sendWhatsapp = (celluleId, suivi) => {
    const cellule = cellules.find((c) => String(c.id) === String(celluleId));
    if (!cellule) return alert("Cellule introuvable.");
    if (!cellule.telephone) return alert("Numéro de la cellule introuvable.");

    const phone = cellule.telephone.replace(/\D/g, "");
    if (!phone) return alert("Numéro de la cellule invalide.");

    const m = suivi.membres;
    const message = `👋 Salut ${cellule.responsable},

🙏 Voici les infos du membre à suivre :

- 👤 Nom : ${m.prenom} ${m.nom}
- 📱 Téléphone : ${m.telephone || "—"}
- 🏙 Ville : ${m.ville || "—"}
- 🙏 Besoin : ${m.besoin || "—"}
- 📝 Infos supplémentaires : ${m.infos_supplementaires || "—"}
- 💬 Comment est-il venu ? : ${m.comment || "—"}

Merci !`;

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    // Changer le statut en actif et enlever tag nouveau
    if (m.statut === "visiteur" || m.statut === "veut rejoindre ICC") {
      handleChangeStatus(suivi.id, "actif");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      <button onClick={() => window.history.back()} className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200">
        ← Retour
      </button>

      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        Suivis Membres
      </h1>

      {/* Toggle Vue */}
      <p className="self-end text-orange-500 cursor-pointer mb-4" onClick={() => setView(view === "card" ? "table" : "card")}>
        Visuel
      </p>

      {view === "card" ? (
        <div className="w-full max-w-5xl">
          {suivisTries.map((suivi) => {
            if (!suivi.membres) return null;
            const m = suivi.membres;
            const isNouveau = m.statut === "visiteur" || m.statut === "veut rejoindre ICC";

            return (
              <div key={suivi.id} className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border-t-4 mb-4" style={{ borderTopColor: getBorderColor(m.statut) }}>
                <h2 className="text-lg font-bold mb-1 flex justify-between items-center">
                  {m.prenom} {m.nom} {m.star && <span className="ml-1 text-yellow-400">⭐</span>}
                  {isNouveau && <span className="ml-2 text-sm bg-blue-200 text-blue-800 px-2 rounded">Nouveau</span>}
                </h2>
                <p className="text-sm text-gray-600 mb-1">📱 {m.telephone || "—"}</p>
                <p className="text-sm font-semibold" style={{ color: getBorderColor(m.statut) }}>{m.statut}</p>

                <p className="mt-2 text-blue-500 underline cursor-pointer" onClick={() => setDetailsOpen((prev) => ({ ...prev, [suivi.id]: !prev[suivi.id] }))}>
                  {detailsOpen[suivi.id] ? "Fermer détails" : "Détails"}
                </p>

                {detailsOpen[suivi.id] && (
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <p>Besoin : {m.besoin || "—"}</p>
                    <p>Infos supplémentaires : {m.infos_supplementaires || "—"}</p>
                    <p>Comment est-il venu ? : {m.comment || "—"}</p>

                    <p className="text-green-600">Cellule :</p>
                    <select
                      value={selectedCellules[suivi.id] || ""}
                      onChange={(e) => setSelectedCellules((prev) => ({ ...prev, [suivi.id]: e.target.value }))}
                      className="border rounded-lg px-2 py-1 text-sm w-full mt-1"
                    >
                      <option value="">-- Sélectionner cellule --</option>
                      {cellules.map((c) => (
                        <option key={c.id} value={c.id}>{c.cellule} ({c.responsable})</option>
                      ))}
                    </select>

                    {selectedCellules[suivi.id] && (
                      <button onClick={() => sendWhatsapp(selectedCellules[suivi.id], suivi)} className="mt-2 w-full py-2 rounded-xl text-white font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600">
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
                if (!suivi.membres) return null;
                const m = suivi.membres;
                const isNouveau = m.statut === "visiteur" || m.statut === "veut rejoindre ICC";

                return (
                  <tr key={suivi.id} className="border-b">
                    <td className="py-2 px-4">{m.prenom}</td>
                    <td className="py-2 px-4">{m.nom}</td>
                    <td className="py-2 px-4" style={{ color: getBorderColor(m.statut) }}>
                      {m.statut} {isNouveau && <span className="ml-1 text-sm bg-blue-200 text-blue-800 px-2 rounded">Nouveau</span>}
                    </td>
                    <td className="py-2 px-4">
                      <p className="text-blue-500 underline cursor-pointer" onClick={() => setDetailsOpen((prev) => ({ ...prev, [suivi.id]: !prev[suivi.id] }))}>
                        {detailsOpen[suivi.id] ? "Fermer détails" : "Détails"}
                      </p>
                      {detailsOpen[suivi.id] && (
                        <div className="mt-2 text-sm text-gray-700 space-y-1">
                          <p>Prénom : {m.prenom}</p>
                          <p>Nom : {m.nom}</p>
                          <p>Statut : {m.statut}</p>
                          <p>Téléphone : {m.telephone || "—"}</p>
                          <p>Besoin : {m.besoin || "—"}</p>
                          <p>Infos supplémentaires : {m.infos_supplementaires || "—"}</p>
                          <p>Comment est-il venu ? : {m.comment || "—"}</p>

                          <p className="text-green-600">Cellule :</p>
                          <select
                            value={selectedCellules[suivi.id] || ""}
                            onChange={(e) => setSelectedCellules((prev) => ({ ...prev, [suivi.id]: e.target.value }))}
                            className="border rounded-lg px-2 py-1 text-sm w-full"
                          >
                            <option value="">-- Sélectionner cellule --</option>
                            {cellules.map((c) => (
                              <option key={c.id} value={c.id}>{c.cellule} ({c.responsable})</option>
                            ))}
                          </select>

                          {selectedCellules[suivi.id] && (
                            <button onClick={() => sendWhatsapp(selectedCellules[suivi.id], suivi)} className="mt-2 w-full py-2 rounded-xl text-white font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600">
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

      <button onClick={scrollToTop} className="fixed bottom-5 right-5 text-white text-2xl font-bold">↑</button>
    </div>
  );
}
