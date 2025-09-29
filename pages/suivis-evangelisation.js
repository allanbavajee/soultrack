// pages/suivis-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuivisEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [modalData, setModalData] = useState(null); // données du popup
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchSuivis();
    fetchCellules();
  }, []);

  const fetchSuivis = async () => {
    let query = supabase.from("suivis").select("*, membre: membre_id(*) , cellule: cellule_id(*)");
    if (selectedCellule) query = query.eq("cellule_id", selectedCellule);

    const { data, error } = await query;
    if (!error && data) setSuivis(data);
  };

  const fetchCellules = async () => {
    const { data } = await supabase.from("cellules").select("*");
    if (data) setCellules(data);
  };

  const handleOpenModal = (suivi) => {
    setModalData(suivi);
    setNewStatus(suivi.statut);
  };

  const handleCloseModal = () => {
    setModalData(null);
  };

  const handleSaveStatus = async () => {
    if (!modalData) return;

    await supabase
      .from("suivis")
      .update({ statut: newStatus })
      .eq("id", modalData.id);

    // si statut devient "actif", ajouter dans membres
    if (newStatus === "actif") {
      await supabase
        .from("membres")
        .update({ statut: "actif" })
        .eq("id", modalData.membre.id);
    }

    setModalData(null);
    fetchSuivis();
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">Suivi des évangélisés</h1>

      {/* Filtre cellule */}
      <div className="mb-4 w-full max-w-md mx-auto">
        <label className="block mb-2 font-semibold">Filtrer par cellule :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedCellule}
          onChange={(e) => {
            setSelectedCellule(e.target.value);
            fetchSuivis();
          }}
        >
          <option value="">-- Toutes --</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cellule}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="text-center">
              <th className="px-4 py-2 border">Nom</th>
              <th className="px-4 py-2 border">Prénom</th>
              <th className="px-4 py-2 border">Cellule</th>
              <th className="px-4 py-2 border">Statut</th>
              <th className="px-4 py-2 border">Détails</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map((s) => (
              <tr key={s.id} className="text-center border-b">
                <td className="px-4 py-2">{s.membre.nom}</td>
                <td className="px-4 py-2">{s.membre.prenom}</td>
                <td className="px-4 py-2">{s.cellule?.cellule || "-"}</td>
                <td className="px-4 py-2">{s.statut}</td>
                <td className="px-4 py-2">
                  <span
                    onClick={() => handleOpenModal(s)}
                    className="text-blue-600 cursor-pointer hover:underline"
                  >
                    Afficher
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal popup */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">
              {modalData.membre.prenom} {modalData.membre.nom}
            </h2>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>📱 Téléphone : {modalData.membre.telephone}</p>
              <p>Email : {modalData.membre.email || "—"}</p>
              <p>Ville : {modalData.membre.ville || "—"}</p>
              <p>Besoin : {modalData.membre.besoin || "—"}</p>
              <p>Infos supplémentaires : {modalData.membre.infos_supplementaires || "—"}</p>
              <p>Cellule : {modalData.cellule?.cellule || "—"}</p>
              <p>Statut actuel : {modalData.statut}</p>
            </div>

            <div className="mt-4">
              <label className="block mb-1 font-semibold">Changer le statut :</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="envoyé">Envoyé</option>
                <option value="en cours">En cours</option>
                <option value="actif">Actif</option>
                <option value="refus">Refus</option>
              </select>
            </div>

            <button
              onClick={handleSaveStatus}
              className="mt-4 w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
            >
              Valider
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
