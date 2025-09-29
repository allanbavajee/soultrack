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
    const { data, error } = await supabase.from("cellules").select("id, cellule");
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
      <div className="overflow-x-auto">
        <table className="table-auto w-full max-w-5xl mx-auto border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Prénom</th>
              <th className="border px-4 py-2">Cellule</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Détails</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map((s) => (
              <tr key={s.id}>
                <td className="border px-4 py-2">{s.membre.nom}</td>
                <td className="border px-4 py-2">{s.membre.prenom}</td>
                <td className="border px-4 py-2">{s.cellule?.cellule || "—"}</td>
                <td className="border px-4 py-2">{s.statut}</td>
                <td className="border px-4 py-2">
                  <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => openPopup(s)}
                  >
                    Afficher
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup détails */}
      {showPopup && currentSuivi && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-4">Détails du membre</h2>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowPopup(false)}
            >
              ✖
            </button>
            <div className="space-y-1 text-gray-700">
              <p>Nom : {currentSuivi.membre.nom}</p>
              <p>Prénom : {currentSuivi.membre.prenom}</p>
              <p>📱 Téléphone : {currentSuivi.membre.telephone}</p>
              <p>📧 Email : {currentSuivi.membre.email || "—"}</p>
              <p>🏙️ Ville : {currentSuivi.membre.ville || "—"}</p>
              <p>📝 Infos supplémentaires : {currentSuivi.membre.infos_supplementaires || "—"}</p>
              <p>Besoin : {currentSuivi.membre.besoin || "—"}</p>
              <p>Comment venu : {currentSuivi.membre.how_came || "—"}</p>
              <p>WhatsApp : {currentSuivi.membre.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-semibold">Changer le statut :</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={newStatus}
                onChange={handleStatusChange}
              >
                <option value="envoyé">Envoyé</option>
                <option value="en cours">En cours</option>
                <option value="intégré">Intégré</option>
              </select>

              {newStatus !== currentSuivi.statut && (
                <button
                  className="mt-4 w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                  onClick={handleValidate}
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
