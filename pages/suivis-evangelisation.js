import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuiviEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [selectedSuivi, setSelectedSuivi] = useState(null); // pour le modal
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchCellules();
    fetchSuivis();
  }, []);

  const fetchCellules = async () => {
    const { data } = await supabase.from("cellules").select("id, cellule");
    if (data) setCellules(data);
  };

  const fetchSuivis = async (celluleId = "") => {
    let query = supabase
      .from("suivis")
      .select("id, statut, commentaire, membres(prenom, nom), cellules(cellule)");

    if (celluleId) query = query.eq("cellule_id", celluleId);

    const { data } = await query;
    if (data) setSuivis(data);
  };

  const handleStatusChange = async (suiviId) => {
    if (!newStatus) return;
    const { error } = await supabase
      .from("suivis")
      .update({ statut: newStatus })
      .eq("id", suiviId);

    if (!error) {
      if (newStatus === "actif") {
        // insérer dans membres comme actif
        const suivi = suivis.find((s) => s.id === suiviId);
        if (suivi?.membres) {
          await supabase
            .from("membres")
            .update({ statut: "actif" })
            .eq("id", suivi.membre_id);
        }
      }
      fetchSuivis(selectedCellule);
      setNewStatus("");
      setSelectedSuivi(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Suivi des évangélisés</h1>

      {/* Filtre par cellule */}
      <select
        className="border p-2 mb-4"
        value={selectedCellule}
        onChange={(e) => {
          setSelectedCellule(e.target.value);
          fetchSuivis(e.target.value);
        }}
      >
        <option value="">-- Toutes les cellules --</option>
        {cellules.map((c) => (
          <option key={c.id} value={c.id}>
            {c.cellule}
          </option>
        ))}
      </select>

      {/* Tableau */}
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nom</th>
            <th className="border p-2">Prénom</th>
            <th className="border p-2">Cellule</th>
            <th className="border p-2">Statut</th>
            <th className="border p-2">Détails</th>
          </tr>
        </thead>
        <tbody>
          {suivis.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.membres?.nom}</td>
              <td className="border p-2">{s.membres?.prenom}</td>
              <td className="border p-2">{s.cellules?.cellule}</td>
              <td className="border p-2">{s.statut}</td>
              <td className="border p-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => setSelectedSuivi(s)}
                >
                  Afficher
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedSuivi && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {selectedSuivi.membres?.prenom} {selectedSuivi.membres?.nom}
            </h2>
            <p><b>Cellule :</b> {selectedSuivi.cellules?.cellule}</p>
            <p><b>Statut :</b> {selectedSuivi.statut}</p>
            <p><b>Commentaire :</b> {selectedSuivi.commentaire || "—"}</p>

            {/* Changer statut */}
            <select
              className="border p-2 mt-4 w-full"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">-- Changer statut --</option>
              <option value="en cours">En cours</option>
              <option value="actif">Actif</option>
              <option value="refus">Refus</option>
            </select>

            {/* Boutons */}
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={() => setSelectedSuivi(null)}
              >
                Fermer
              </button>
              {newStatus && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => handleStatusChange(selectedSuivi.id)}
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
