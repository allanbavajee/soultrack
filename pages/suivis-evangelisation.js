// pages/suivi-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuiviEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCellules();
    fetchSuivis();
  }, []);

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id, cellule, responsable");
    if (!error && data) setCellules(data);
  };

  const fetchSuivis = async () => {
    setLoading(true);
    let query = supabase
      .from("suivis")
      .select(`id, membre_id, cellule_id, commentaire, created_at, membre: membres(*), cellule: cellules(*)`);

    if (selectedCellule) {
      query = query.eq("cellule_id", selectedCellule.id);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (!error && data) setSuivis(data);
    setLoading(false);
  };

  const handleCelluleChange = (e) => {
    const cellule = cellules.find((c) => c.cellule === e.target.value);
    setSelectedCellule(cellule || null);
    fetchSuivis();
  };

  const handleCommentChange = (suiviId, value) => {
    setSuivis((prev) =>
      prev.map((s) => (s.id === suiviId ? { ...s, commentaire: value } : s))
    );
  };

  const saveComment = async (suiviId, commentaire) => {
    await supabase
      .from("suivis")
      .update({ commentaire })
      .eq("id", suiviId);
    fetchSuivis();
  };

  const updateMembreStatus = async (membreId, newStatus) => {
    await supabase
      .from("membres")
      .update({ statut: newStatus })
      .eq("id", membreId);
    fetchSuivis();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suivi des évangélisés
      </h1>

      {/* Choix cellule */}
      <div className="mb-4 w-full max-w-md mx-auto">
        <label className="block mb-2 font-semibold">Filtrer par cellule :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedCellule?.cellule || ""}
          onChange={handleCelluleChange}
        >
          <option value="">-- Toutes --</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.cellule}>
              {c.cellule} ({c.responsable})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center mt-6">Chargement...</p>
      ) : suivis.length === 0 ? (
        <p className="text-center mt-6">Aucun suivi pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suivis.map((suivi) => (
            <div
              key={suivi.id}
              className="bg-white w-full p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                {suivi.membre.prenom} {suivi.membre.nom}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                📱 {suivi.membre.telephone}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Cellule : {suivi.cellule.cellule} ({suivi.cellule.responsable})
              </p>
              <p className="text-sm text-gray-600 mb-2">
                Statut : {suivi.membre.statut}
              </p>

              {/* Champ commentaire */}
              <textarea
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Ajouter un commentaire"
                value={suivi.commentaire || ""}
                onChange={(e) => handleCommentChange(suivi.id, e.target.value)}
              />
              <button
                onClick={() => saveComment(suivi.id, suivi.commentaire)}
                className="w-full py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-2"
              >
                💾 Enregistrer commentaire
              </button>

              {/* Changer le statut */}
              <select
                className="w-full p-2 border rounded-lg"
                value={suivi.membre.statut}
                onChange={(e) => updateMembreStatus(suivi.membre.id, e.target.value)}
              >
                <option value="envoyé">Envoyé</option>
                <option value="actif">Actif</option>
                <option value="ancien">Ancien</option>
                <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                <option value="visiteur">Visiteur</option>
                <option value="a déjà mon église">A déjà mon église</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
