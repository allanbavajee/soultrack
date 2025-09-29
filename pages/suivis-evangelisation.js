// pages/suivis-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuivisEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [loading, setLoading] = useState(true);

  // Popup (modal)
  const [selectedSuivi, setSelectedSuivi] = useState(null);
  const [newStatut, setNewStatut] = useState("");
  const [showValidate, setShowValidate] = useState(false);

  useEffect(() => {
    fetchCellules();
    fetchSuivis();
  }, []);

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("id, cellule");
    if (!error) setCellules(data);
  };

  const fetchSuivis = async (celluleId = "") => {
    setLoading(true);
    let query = supabase
      .from("suivis")
      .select(
        `
        id, statut, commentaire, created_at,
        membres ( id, prenom, nom, telephone, email, ville, besoin, infos_supplementaires, is_whatsapp ),
        cellules ( id, cellule )
      `
      )
      .order("created_at", { ascending: false });

    if (celluleId) {
      query = query.eq("cellule_id", celluleId);
    }

    const { data, error } = await query;
    if (!error) setSuivis(data);
    setLoading(false);
  };

  const handleOpenModal = (suivi) => {
    setSelectedSuivi(suivi);
    setNewStatut(suivi.statut);
    setShowValidate(false);
  };

  const handleCloseModal = () => {
    setSelectedSuivi(null);
    setNewStatut("");
    setShowValidate(false);
  };

  const handleChangeStatut = (value) => {
    setNewStatut(value);
    setShowValidate(true);
  };

  const handleValidate = async () => {
    if (!selectedSuivi) return;

    // Update table suivis
    const { error } = await supabase
      .from("suivis")
      .update({ statut: newStatut })
      .eq("id", selectedSuivi.id);

    if (error) {
      alert("Erreur lors de la mise à jour du statut");
      return;
    }

    // Si actif → update membres
    if (newStatut === "actif") {
      await supabase.from("membres").update({ statut: "actif" }).eq("id", selectedSuivi.membres.id);
    }

    // Rafraîchir
    fetchSuivis(selectedCellule);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suivi des évangélisés
      </h1>

      {/* Filtre cellule */}
      <div className="max-w-md mx-auto mb-6">
        <label className="block mb-2 font-semibold text-gray-700">Filtrer par cellule :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedCellule}
          onChange={(e) => {
            setSelectedCellule(e.target.value);
            fetchSuivis(e.target.value);
          }}
        >
          <option value="">Toutes les cellules</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cellule}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 bg-white rounded-xl shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-center">Prénom</th>
                <th className="p-3 text-center">Nom</th>
                <th className="p-3 text-center">Cellule</th>
                <th className="p-3 text-center">Statut</th>
                <th className="p-3 text-center">Détails</th>
              </tr>
            </thead>
            <tbody>
              {suivis.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    Aucun évangélisé trouvé
                  </td>
                </tr>
              ) : (
                suivis.map((suivi) => (
                  <tr key={suivi.id} className="border-t text-center">
                    <td className="p-3">{suivi.membres?.prenom}</td>
                    <td className="p-3">{suivi.membres?.nom}</td>
                    <td className="p-3">{suivi.cellules?.cellule || "—"}</td>
                    <td className="p-3 capitalize">{suivi.statut}</td>
                    <td className="p-3">
                      <span
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={() => handleOpenModal(suivi)}
                      >
                        Afficher
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup */}
      {selectedSuivi && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">
              Détails de {selectedSuivi.membres?.prenom} {selectedSuivi.membres?.nom}
            </h2>

            <div className="space-y-2 text-gray-700">
              <p><strong>Téléphone :</strong> {selectedSuivi.membres?.telephone}</p>
              <p><strong>Email :</strong> {selectedSuivi.membres?.email || "—"}</p>
              <p><strong>Ville :</strong> {selectedSuivi.membres?.ville || "—"}</p>
              <p><strong>Besoin :</strong> {selectedSuivi.membres?.besoin || "—"}</p>
              <p><strong>Infos sup. :</strong> {selectedSuivi.membres?.infos_supplementaires || "—"}</p>
              <p><strong>Cellule :</strong> {selectedSuivi.cellules?.cellule || "—"}</p>
            </div>

            {/* Statut */}
            <div className="mt-4">
              <label className="block font-semibold mb-1">Statut :</label>
              <select
                value={newStatut}
                onChange={(e) => handleChangeStatut(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="en attente">En attente</option>
                <option value="en cours">En cours</option>
                <option value="actif">Actif</option>
                <option value="refus">Refus</option>
              </select>
            </div>

            {/* Boutons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Fermer
              </button>
              {showValidate && (
                <button
                  onClick={handleValidate}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
                >
                  Valider
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
