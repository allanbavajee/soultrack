import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuiviEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [loading, setLoading] = useState(true);
  const [editedStatus, setEditedStatus] = useState({});

  useEffect(() => {
    fetchCellules();
  }, []);

  // recharge automatiquement quand selectedCellule change
  useEffect(() => {
    fetchSuivis();
  }, [selectedCellule]);

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("id, cellule");
    if (!error && data) setCellules(data);
  };

  const fetchSuivis = async () => {
    setLoading(true);
    let query = supabase
      .from("suivis")
      .select(`
        id,
        statut,
        membre:membre_id (id, prenom, nom, statut),
        cellule:cellule_id (id, cellule)
      `)
      .order("created_at", { ascending: false });

    if (selectedCellule) query = query.eq("cellule_id", selectedCellule);

    const { data, error } = await query;
    if (!error && data) {
      setSuivis(data);
    }
    setLoading(false);
  };

  const handleChangeStatus = (suiviId, newStatus) => {
    setEditedStatus((prev) => ({ ...prev, [suiviId]: newStatus }));
  };

  const handleValidateStatus = async (suivi) => {
    const newStatus = editedStatus[suivi.id];
    if (!newStatus) return;

    const { error } = await supabase
      .from("suivis")
      .update({ statut: newStatus })
      .eq("id", suivi.id);

    if (error) {
      console.error("Erreur mise à jour statut:", error.message);
      return;
    }

    if (newStatus === "actif") {
      await supabase.from("membres").update({ statut: "actif" }).eq("id", suivi.membre.id);
    }

    fetchSuivis();
  };

  if (loading) return <p className="text-center mt-20 text-gray-600">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suivi des évangélisés
      </h1>

      {/* Filtre cellule */}
      <div className="mb-6 max-w-md mx-auto">
        <label className="block mb-2 font-semibold">Filtrer par cellule :</label>
        <select
          className="w-full border p-2 rounded-lg"
          value={selectedCellule}
          onChange={(e) => setSelectedCellule(e.target.value)}
        >
          <option value="">Toutes les cellules</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cellule}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg bg-white shadow-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border-b">Prénom</th>
              <th className="p-3 border-b">Nom</th>
              <th className="p-3 border-b">Cellule</th>
              <th className="p-3 border-b">Statut</th>
              <th className="p-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{s.membre?.prenom}</td>
                <td className="p-3 border-b">{s.membre?.nom}</td>
                <td className="p-3 border-b">{s.cellule?.cellule}</td>
                <td className="p-3 border-b">
                  <select
                    value={editedStatus[s.id] || s.statut}
                    onChange={(e) => handleChangeStatus(s.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="envoyé">Envoyé</option>
                    <option value="en cours">En cours</option>
                    <option value="actif">Actif</option>
                    <option value="refus">Refus</option>
                  </select>
                </td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => handleValidateStatus(s)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Valider
                  </button>
                </td>
              </tr>
            ))}

            {suivis.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  Aucun contact trouvé pour cette cellule.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
