/* pages/suivis-evangelisation.js */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function SuivisEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(null);
  const [newStatut, setNewStatut] = useState("");

  useEffect(() => {
    fetchCellules();
    if (selectedCellule) fetchSuivis(selectedCellule);
  }, [selectedCellule]);

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id,cellule,responsable");
    if (!error && data) setCellules(data);
  };

  const fetchSuivis = async (celluleId) => {
    let query = supabase
      .from("suivis")
      .select("id, statut, commentaire, membres: membre_id (*) , cellules: cellule_id (*)")
      .eq("statut", "envoyé");

    if (celluleId) query = query.eq("cellule_id", celluleId);

    const { data, error } = await query;
    if (!error && data) setSuivis(data);
  };

  const handleValidate = async (suivi) => {
    if (!newStatut) {
      toast.error("Choisissez un statut avant de valider.");
      return;
    }

    // Mettre à jour le statut dans la table suivis
    const { error: errSuivi } = await supabase
      .from("suivis")
      .update({ statut: newStatut })
      .eq("id", suivi.id);

    if (errSuivi) {
      toast.error("Erreur lors de la mise à jour du statut");
      return;
    }

    // Si actif, mettre aussi dans la table membres
    if (newStatut === "actif") {
      await supabase
        .from("membres")
        .update({ statut: "actif" })
        .eq("id", suivi.membre_id);
      setSuivis((prev) => prev.filter((s) => s.id !== suivi.id));
      toast.success("Contact validé et transféré dans la liste des membres actifs");
    } else {
      fetchSuivis(selectedCellule);
      toast.success("Statut mis à jour avec succès");
    }

    setDetailsVisible(null);
    setNewStatut("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Titre et retour */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
          Suivi des évangélisés
        </h1>
      </div>

      {/* Filtre cellule */}
      <div className="mb-4 w-full max-w-md">
        <label className="block mb-2 font-semibold">Filtrer par cellule :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedCellule}
          onChange={(e) => setSelectedCellule(e.target.value)}
        >
          <option value="">-- Toutes --</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cellule} ({c.responsable})
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Prénom</th>
              <th className="border px-4 py-2">Cellule</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Détails</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map((s) => (
              <tr key={s.id} className="text-center border">
                <td className="border px-4 py-2">{s.membres.prenom}</td>
                <td className="border px-4 py-2">{s.membres.nom}</td>
                <td className="border px-4 py-2">{s.cellules.cellule}</td>
                <td className="border px-4 py-2">{s.statut}</td>
                <td className="border px-4 py-2">
                  <span
                    className="text-blue-500 cursor-pointer hover:underline"
                    onClick={() => setDetailsVisible(s.id === detailsVisible ? null : s.id)}
                  >
                    Afficher
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal/Details */}
      {detailsVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg relative">
            <button
              onClick={() => setDetailsVisible(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
            >
              ✕
            </button>
            {suivis
              .filter((s) => s.id === detailsVisible)
              .map((s) => (
                <div key={s.id} className="space-y-2">
                  <p><strong>Nom :</strong> {s.membres.nom}</p>
                  <p><strong>Prénom :</strong> {s.membres.prenom}</p>
                  <p><strong>Téléphone :</strong> {s.membres.telephone}</p>
                  <p><strong>Email :</strong> {s.membres.email || "—"}</p>
                  <p><strong>Ville :</strong> {s.membres.ville || "—"}</p>
                  <p><strong>Besoin :</strong> {s.membres.besoin || "—"}</p>
                  <p><strong>Infos supplémentaires :</strong> {s.membres.infos_supplementaires || "—"}</p>

                  {/* Changer le statut */}
                  <div className="mt-4">
                    <label className="block mb-1 font-semibold">Changer le statut :</label>
                    <select
                      className="border p-2 rounded-lg w-full"
                      value={newStatut}
                      onChange={(e) => setNewStatut(e.target.value)}
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="en cours">En cours</option>
                      <option value="actif">Actif</option>
                      <option value="refus">Refus</option>
                    </select>
                    {newStatut && (
                      <button
                        onClick={() => handleValidate(s)}
                        className="mt-2 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Valider
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
