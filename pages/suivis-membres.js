// pages/suivis-membres.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [selectedCellules, setSelectedCellules] = useState({});
  const [view, setView] = useState("card"); // 'card' ou 'table'

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select(`
          id,
          statut,
          created_at,
          membres!inner(
            id,
            prenom,
            nom,
            telephone,
            statut,
            besoin,
            infos_supplementaires,
            star,
            ville
          ),
          cellules!inner(
            id,
            cellule,
            responsable,
            telephone
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

  const getBorderColor = (suivi) => {
    const statut = suivi.membres.statut;
    if (suivi.membres.star) return "#FBC02D";
    if (statut === "actif") return "#4285F4";
    if (statut === "a déjà mon église") return "#EA4335";
    if (statut === "ancien") return "#999999";
    if (statut === "veut rejoindre ICC" || statut === "visiteur") return "#34A853";
    return "#ccc";
  };

  const sendWhatsapp = (celluleId, suivi) => {
    const cellule = suivi.cellules;
    if (!cellule || !cellule.telephone) return alert("Numéro de la cellule introuvable.");

    const phone = cellule.telephone.replace(/\D/g, "");
    const member = suivi.membres;

    const message = `👋 Salut ${cellule.responsable},

🙏 Dieu nous a envoyé une nouvelle âme à suivre.
Voici ses infos :

- 👤 Nom : ${member.prenom} ${member.nom}
- 📱 Téléphone : ${member.telephone || "—"}
- 🏙 Ville : ${member.ville || "—"}
- 🙏 Besoin : ${member.besoin || "—"}
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}
- 💬 Comment est-il venu ? : — 

Merci pour ton cœur ❤ et son amour ✨`;

    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    // changer statut si c'était nouveau
    if (member.statut === "visiteur" || member.statut === "veut rejoindre ICC") {
      handleChangeStatus(suivi.id, "actif");
    }
  };

  // Trier pour que les nouveaux soient en haut
  const nouveaux = suivis.filter(
    (s) => s.membres.statut === "visiteur" || s.membres.statut === "veut rejoindre ICC"
  );
  const anciens = suivis.filter(
    (s) => s.membres.statut !== "visiteur" && s.membres.statut !== "veut rejoindre ICC"
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        Suivis Membres
      </h1>

      {/* Toggle Visuel */}
      <p className="self-end text-orange-500 cursor-pointer mb-4" onClick={() => setView(view === "card" ? "table" : "card")}>
        Visuel
      </p>

      {view === "card" ? (
        <div className="w-full max-w-5xl">
          {[...nouveaux, ...anciens].map((suivi) => (
            <div
              key={suivi.id}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between border-t-4 mb-4"
              style={{ borderTopColor: getBorderColor(suivi), minHeight: "180px" }}
            >
              <h2 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
                {suivi.membres.prenom} {suivi.membres.nom} {suivi.membres.star && <span className="ml-1 text-yellow-400">⭐</span>}
                {(suivi.membres.statut === "visiteur" || suivi.membres.statut === "veut rejoindre ICC") && (
                  <span className="ml-2 bg-blue-400 text-white px-2 py-0.5 rounded-full text-xs">Nouveau</span>
                )}
              </h2>
              <p className="text-sm text-gray-600 mb-1">📱 {suivi.membres.telephone || "—"}</p>
              <p className="text-sm font-semibold" style={{ color: getBorderColor(suivi) }}>
                {suivi.membres.statut || "—"}
              </p>

              <p className="mt-2 text-blue-500 underline cursor-pointer" onClick={() => setDetailsOpen((prev) => ({ ...prev, [suivi.id]: !prev[suivi.id] }))}>
                {detailsOpen[suivi.id] ? "Fermer détails" : "Détails"}
              </p>

              {detailsOpen[suivi.id] && (
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p>Besoin : {suivi.membres.besoin || "—"}</p>
                  <p>Infos supplémentaires : {suivi.membres.infos_supplementaires || "—"}</p>
                  <p>Comment est-il venu ? : —</p>
                  <p className="text-green-600">Cellule : {suivi.cellules.cellule} ({suivi.cellules.responsable})</p>

                  <button
                    onClick={() => sendWhatsapp(suivi.cellules.id, suivi)}
                    className="mt-2 w-full py-2 rounded-xl text-white font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600"
                  >
                    Envoyer par WhatsApp
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
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
              {[...nouveaux, ...anciens].map((suivi) => (
                <tr key={suivi.id} className="border-b">
                  <td className="py-2 px-4">{suivi.membres.prenom}</td>
                  <td className="py-2 px-4">{suivi.membres.nom}</td>
                  <td className="py-2 px-4" style={{ color: getBorderColor(suivi) }}>
                    {suivi.membres.statut}
                    {(suivi.membres.statut === "visiteur" || suivi.membres.statut === "veut rejoindre ICC") && (
                      <span className="ml-2 bg-blue-400 text-white px-2 py-0.5 rounded-full text-xs">Nouveau</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <p className="text-blue-500 underline cursor-pointer" onClick={() => setDetailsOpen((prev) => ({ ...prev, [suivi.id]: !prev[suivi.id] }))}>
                      {detailsOpen[suivi.id] ? "Fermer détails" : "Détails"}
                    </p>
                    {detailsOpen[suivi.id] && (
                      <div className="mt-2 text-sm text-gray-700 space-y-1">
                        <p>Besoin : {suivi.membres.besoin || "—"}</p>
                        <p>Infos supplémentaires : {suivi.membres.infos_supplementaires || "—"}</p>
                        <p>Comment est-il venu ? : —</p>
                        <p>Cellule : {suivi.cellules.cellule} ({suivi.cellules.responsable})</p>
                        <button
                          onClick={() => sendWhatsapp(suivi.cellules.id, suivi)}
                          className="mt-2 w-full py-2 rounded-xl text-white font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600"
                        >
                          Envoyer par WhatsApp
                        </button>
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
