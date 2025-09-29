// pages/suivis-membres.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [commentaire, setCommentaire] = useState("");

  useEffect(() => {
    fetchCellules();
    fetchSuivis();
  }, []);

  useEffect(() => {
    fetchSuivis(selectedCellule);
  }, [selectedCellule]);

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("*");
    if (!error) setCellules(data);
  };

  const fetchSuivis = async (cellule = "") => {
    let query = supabase
      .from("suivis_membres")
      .select(`
        id,
        statut,
        commentaire,
        membre:membre_id (
          id, prenom, nom, telephone, email, ville, infos_supplementaires, is_whatsapp
        ),
        cellule:cellule_id (id, cellule, responsable, telephone)
      `)
      .in("statut", ["envoye", "encours", "integrer", "refus"]);

    if (cellule) query = query.eq("cellule_id", cellule);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (!error) setSuivis(data || []);
  };

  const openPopup = (member) => {
    setCurrentMember(member);
    setNewStatus(member.statut);
    setCommentaire(member.commentaire || "");
    setShowPopup(true);
  };

  const handleStatusChange = (e) => setNewStatus(e.target.value);

  const handleValidate = async () => {
    if (!currentMember) return;
    await supabase
      .from("suivis_membres")
      .update({ statut: newStatus, commentaire })
      .eq("id", currentMember.id);

    setShowPopup(false);
    fetchSuivis(selectedCellule);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Flèche retour */}
      <button
        onClick={() => window.history.back()}
        className="mb-4 text-orange-500 font-semibold"
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
        <table className="table-auto w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Prénom</th>
              <th className="border px-4 py-2">Téléphone</th>
              <th className="border px-4 py-2">Cellule</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Détails</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map(
              (s) =>
                s.membre && (
                  <tr key={s.id}>
                    <td className="border px-4 py-2">{s.membre.nom}</td>
                    <td className="border px-4 py-2">{s.membre.prenom}</td>
                    <td className="border px-4 py-2">{s.membre.telephone}</td>
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
                )
            )}
          </tbody>
        </table>
      </div>

      {/* Popup détails */}
      {showPopup && currentMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={() => setShowPopup(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Détails du membre</h2>
            <p>Nom : {currentMember.membre.nom}</p>
            <p>Prénom : {currentMember.membre.prenom}</p>
            <p>📱 Téléphone : {currentMember.membre.telephone}</p>
            <p>📧 Email : {currentMember.membre.email || "—"}</p>
            <p>🏙️ Ville : {currentMember.membre.ville || "—"}</p>
            <p>📝 Infos supplémentaires : {currentMember.membre.infos_supplementaires || "—"}</p>

            <div className="mt-4">
              <label className="block mb-2 font-semibold">Changer le statut :</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={newStatus}
                onChange={handleStatusChange}
              >
                <option value="envoye">Envoyé</option>
                <option value="encours">En cours</option>
                <option value="integrer">Intégrer</option>
                <option value="refus">Refus</option>
              </select>

              <label className="block mb-2 mt-2 font-semibold">Commentaire :</label>
              <textarea
                className="w-full p-2 border rounded-lg"
                rows={3}
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
              />

              {(newStatus !== currentMember.statut || commentaire !== currentMember.commentaire) && (
                <button
                  className="mt-4 w-full py-2 bg-green-500 text-white rounded-lg"
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
