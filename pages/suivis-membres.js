// pages/suivis-membres.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentSuivi, setCurrentSuivi] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchCellules();
    fetchSuivis();
  }, []);

  useEffect(() => {
    if (selectedCellule) {
      fetchSuivis(selectedCellule);
    } else {
      fetchSuivis();
    }
  }, [selectedCellule]);

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("id, cellule,responsable,telephone");
    if (!error) setCellules(data);
  };

  const fetchSuivis = async (cellule = null) => {
    let query = supabase
      .from("suivis_membres")
      .select(
        `
        id,
        statut,
        membre:membre_id (
          id, prenom, nom, telephone, email, ville, infos_supplementaires, is_whatsapp, besoin, how_came
        ),
        cellule:cellule_id (id, cellule,responsable,telephone)
      `
      )
      .in("statut", ["envoyé","en cours","intégré"])
      .order("created_at", { ascending: false });

    if (cellule) query = query.eq("cellule_id", cellule);

    const { data, error } = await query;
    if (!error) setSuivis(data);
  };

  const openPopup = (suivi) => {
    setCurrentSuivi(suivi);
    setNewStatus(suivi.statut);
    setShowPopup(true);
  };

  const handleStatusChange = (e) => setNewStatus(e.target.value);

  const handleValidate = async () => {
    if (!currentSuivi) return;

    await supabase
      .from("suivis_membres")
      .update({ statut: newStatus })
      .eq("id", currentSuivi.id);

    setShowPopup(false);
    fetchSuivis(selectedCellule);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Flèche retour */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-orange-500 font-semibold mb-4"
      >
        ← Retour
      </button>

      <h1 className="text-3xl font-bold text-center mb-6">Suivi des membres</h1>

      {/* Filtre cellule */}
      <div className="mb-6 max-w-md mx-auto">
        <label className="block mb-2 font-semibold">Filtrer par cellule :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedCellule}
          onChange={(e) => setSelectedCellule(e.target.value)}
        >
          <option value="">-- Toutes les cellules --</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cellule}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau des suivis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {suivis.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border-t-4 border-blue-400"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {s.membre.prenom} {s.membre.nom}
                </h2>
                <p className="text-sm text-gray-600 mb-1">📱 {s.membre.telephone}</p>
                <p className="text-sm font-semibold">{s.statut}</p>
              </div>

              {/* Menu statut */}
              <select
                value={s.statut}
                onChange={(e) => {
                  setCurrentSuivi(s);
                  setNewStatus(e.target.value);
                  handleValidate();
                }}
                className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              >
                <option value="envoyé">Envoyé</option>
                <option value="en cours">En cours</option>
                <option value="intégré">Intégré</option>
              </select>
            </div>

            {/* Détails */}
            <p
              className="mt-2 text-blue-500 underline cursor-pointer"
              onClick={() =>
                setCurrentSuivi((prev) => ({ ...prev, showDetails: !prev?.showDetails }))
              }
            >
              Détails
            </p>

            {currentSuivi?.id === s.id && currentSuivi.showDetails && (
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>Email : {s.membre.email || "—"}</p>
                <p>Besoin : {s.membre.besoin || "—"}</p>
                <p>Ville : {s.membre.ville || "—"}</p>
                <p>WhatsApp : {s.membre.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
                <p>Infos supplémentaires : {s.membre.infos_supplementaires || "—"}</p>
                <p>Comment venu : {s.membre.how_came || "—"}</p>
                <p>Cellule : {s.cellule?.cellule || "—"}</p>
                <p>Responsable : {s.cellule?.responsable || "—"}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
