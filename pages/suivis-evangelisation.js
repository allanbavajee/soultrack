// pages/suivis-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuivisEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [editingStatus, setEditingStatus] = useState({}); // pour afficher le bouton valider
  const [detailsOpen, setDetailsOpen] = useState({}); // pour afficher les détails

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
    const { data, error } = await supabase
      .from("suivis")
      .select(`
        id,
        statut,
        commentaire,
        created_at,
        membre:membre_id (id, prenom, nom, telephone, email, ville, besoin, infos_supplementaires)
      `)
      .neq("statut", "actif"); // ne pas afficher les contacts déjà actifs
    if (!error && data) setSuivis(data);
  };

  const handleChangeStatus = (suiviId, newStatus) => {
    setSuivis((prev) =>
      prev.map((s) => (s.id === suiviId ? { ...s, statut: newStatus } : s))
    );
    setEditingStatus((prev) => ({ ...prev, [suiviId]: true }));
  };

  const handleValidateStatus = async (suivi) => {
    // Mettre à jour le statut dans la table suivis
    await supabase
      .from("suivis")
      .update({ statut: suivi.statut })
      .eq("id", suivi.id);

    // Si le statut devient actif, mettre à jour la table membres
    if (suivi.statut === "actif") {
      await supabase
        .from("membres")
        .update({ statut: "actif" })
        .eq("id", suivi.membre.id);

      // Retirer le suivi de la liste
      setSuivis((prev) => prev.filter((s) => s.id !== suivi.id));
    }

    // Cacher le bouton valider
    setEditingStatus((prev) => ({ ...prev, [suivi.id]: false }));
  };

  const filteredSuivis = selectedCellule
    ? suivis.filter((s) => s.membre.cellule_id === selectedCellule)
    : suivis;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Titre */}
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Suivi des évangélisés
      </h1>

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
              {c.cellule} ({c.responsable})
            </option>
          ))}
        </select>
      </div>

      {/* Tableau des suivis */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-center">
              <th className="py-2 px-4 border">Nom</th>
              <th className="py-2 px-4 border">Prénom</th>
              <th className="py-2 px-4 border">Cellule</th>
              <th className="py-2 px-4 border">Statut</th>
              <th className="py-2 px-4 border">Détails</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuivis.map((s) => (
              <tr key={s.id} className="text-center border-b">
                <td className="py-2 px-4 border">{s.membre.nom}</td>
                <td className="py-2 px-4 border">{s.membre.prenom}</td>
                <td className="py-2 px-4 border">
                  {
                    cellules.find((c) => c.id === s.membre.cellule_id)
                      ?.cellule || "—"
                  }
                </td>
                <td className="py-2 px-4 border">
                  <select
                    value={s.statut}
                    onChange={(e) => handleChangeStatus(s.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="envoyé">Envoyé</option>
                    <option value="en cours">En cours</option>
                    <option value="refus">Refus</option>
                    <option value="actif">Actif</option>
                  </select>
                  {editingStatus[s.id] && (
                    <button
                      onClick={() => handleValidateStatus(s)}
                      className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Valider
                    </button>
                  )}
                </td>
                <td className="py-2 px-4 border">
                  <span
                    className="text-blue-500 cursor-pointer underline"
                    onClick={() =>
                      setDetailsOpen((prev) => ({
                        ...prev,
                        [s.id]: !prev[s.id],
                      }))
                    }
                  >
                    Afficher
                  </span>
                  {detailsOpen[s.id] && (
                    <div className="mt-2 text-left bg-gray-100 p-2 rounded">
                      <p>Nom : {s.membre.nom}</p>
                      <p>Prénom : {s.membre.prenom}</p>
                      <p>Téléphone : {s.membre.telephone}</p>
                      <p>Email : {s.membre.email || "—"}</p>
                      <p>Ville : {s.membre.ville || "—"}</p>
                      <p>Besoin : {s.membre.besoin || "—"}</p>
                      <p>Infos supplémentaires : {s.membre.infos_supplementaires || "—"}</p>
                      <p>Commentaire : {s.commentaire || "—"}</p>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredSuivis.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  Aucun suivi disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
