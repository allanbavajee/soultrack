// pages/suivis-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuivisEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentSuivi, setCurrentSuivi] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchCellules();
    fetchSuivis();
  }, []);

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id, cellule");
    if (!error && data) setCellules(data);
  };

  const fetchSuivis = async () => {
    const { data, error } = await supabase
      .from("suivis")
      .select(`
        id,
        statut,
        commentaire,
        membre:membre_id (id, prenom, nom, telephone, email, ville, besoin, infos_supplementaires, cellule_id)
      `)
      .neq("statut", "actif");
    if (!error && data) setSuivis(data);
  };

  const handleOpenModal = (suivi) => {
    setCurrentSuivi(suivi);
    setNewStatus(suivi.statut);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentSuivi(null);
  };

  const handleValidateStatus = async () => {
    if (!currentSuivi) return;

    await supabase
      .from("suivis")
      .update({ statut: newStatus })
      .eq("id", currentSuivi.id);

    if (newStatus === "actif") {
      await supabase
        .from("membres")
        .update({ statut: "actif" })
        .eq("id", currentSuivi.membre.id);

      setSuivis((prev) => prev.filter((s) => s.id !== currentSuivi.id));
    } else {
      setSuivis((prev) =>
        prev.map((s) =>
          s.id === currentSuivi.id ? { ...s, statut: newStatus } : s
        )
      );
    }

    handleCloseModal();
  };

  const filteredSuivis = selectedCellule
    ? suivis.filter((s) => s.membre.cellule_id === selectedCellule)
    : suivis;

  const getStatusColor = (status) => {
    switch (status) {
      case "envoyé": return "bg-yellow-100 text-yellow-800";
      case "en cours": return "bg-blue-100 text-blue-800";
      case "refus": return "bg-red-100 text-red-800";
      case "actif": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
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
              {c.cellule}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau */}
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
                  {cellules.find((c) => c.id === s.membre.cellule_id)?.cellule || "—"}
                </td>
                <td className={`py-2 px-4 border font-semibold ${getStatusColor(s.statut)}`}>
                  {s.statut}
                </td>
                <td className="py-2 px-4 border">
                  <span
                    className="text-blue-500 cursor-pointer underline"
                    onClick={() => handleOpenModal(s)}
                  >
                    Afficher
                  </span>
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

      {/* Modal popup moderne */}
      {modalOpen && currentSuivi && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl w-11/12 md:w-1/2 p-6 shadow-lg relative animate-fadeIn">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              {currentSuivi.membre.prenom} {currentSuivi.membre.nom}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 mb-4">
              <p><span className="font-semibold">Téléphone:</span> {currentSuivi.membre.telephone}</p>
              <p><span className="font-semibold">Email:</span> {currentSuivi.membre.email || "—"}</p>
              <p><span className="font-semibold">Ville:</span> {currentSuivi.membre.ville || "—"}</p>
              <p><span className="font-semibold">Besoin:</span> {currentSuivi.membre.besoin || "—"}</p>
              <p className="md:col-span-2"><span className="font-semibold">Infos supplémentaires:</span> {currentSuivi.membre.infos_supplementaires || "—"}</p>
              <p className="md:col-span-2"><span className="font-semibold">Commentaire:</span> {currentSuivi.commentaire || "—"}</p>
            </div>

            <div className="flex items-center mt-4">
              <label className="font-semibold mr-2">Changer le statut :</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="envoyé">Envoyé</option>
                <option value="en cours">En cours</option>
                <option value="refus">Refus</option>
                <option value="actif">Actif</option>
              </select>
              <button
                onClick={handleValidateStatus}
                className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
