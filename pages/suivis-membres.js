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

  // Liste des membres refus
  const [showRefus, setShowRefus] = useState(false);
  const [refusMembers, setRefusMembers] = useState([]);

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
          id, prenom, nom, telephone, email, ville, infos_supplementaires, is_whatsapp
        ),
        cellule:cellule_id (id, cellule)
      `
      )
      .not("statut", "in", "(integrer,refus)"); // exclure intégrés et refusés

    if (cellule) query = query.eq("cellule_id", cellule);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (!error) setSuivis(data);
  };

  const fetchRefus = async () => {
    const { data, error } = await supabase
      .from("suivis_membres")
      .select(
        `
        id,
        statut,
        membre:membre_id (
          id, prenom, nom, telephone, email, ville, infos_supplementaires, is_whatsapp
        ),
        cellule:cellule_id (id, cellule)
      `
      )
      .eq("statut", "refus")
      .order("created_at", { ascending: false });

    if (!error) setRefusMembers(data);
  };

  const openPopup = (member) => {
    setCurrentMember(member);
    setNewStatus(member.statut);
    setShowPopup(true);
  };

  const handleStatusChange = (e) => setNewStatus(e.target.value);

  const handleValidate = async () => {
    if (!currentMember) return;

    // Mettre à jour le suivi
    await supabase
      .from("suivis_membres")
      .update({ statut: newStatus })
      .eq("id", currentMember.id);

    // Si "integrer", mettre à jour aussi le membre
    if (newStatus === "integrer") {
      await supabase
        .from("membres")
        .update({ statut: "actif" })
        .eq("id", currentMember.membre.id);
    }

    setShowPopup(false);
    fetchSuivis(selectedCellule);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Suivi des membres ajoutés</h1>

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

      {/* Lien pour afficher les refus */}
      <div className="mb-4 text-center">
        <span
          className="text-blue-600 cursor-pointer hover:underline"
          onClick={() => {
            setShowRefus(true);
            fetchRefus();
          }}
        >
          Voir les refus
        </span>
      </div>

      {/* Tableau des membres */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full max-w-4xl mx-auto border-collapse border border-gray-300 text-center">
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
      {showPopup && currentMember && (
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
              <p>Nom : {currentMember.membre.nom}</p>
              <p>Prénom : {currentMember.membre.prenom}</p>
              <p>📱 Téléphone : {currentMember.membre.telephone}</p>
              <p>📧 Email : {currentMember.membre.email || "—"}</p>
              <p>🏙️ Ville : {currentMember.membre.ville || "—"}</p>
              <p>📝 Infos supplémentaires : {currentMember.membre.infos_supplementaires || "—"}</p>
              <p>WhatsApp : {currentMember.membre.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
            </div>

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

              {newStatus !== currentMember.statut && (
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

      {/* Popup liste refus */}
      {showRefus && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-3xl w-full relative">
            <h2 className="text-xl font-bold mb-4">Membres refusés</h2>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowRefus(false)}
            >
              ✖
            </button>
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-300 text-center">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Nom</th>
                    <th className="border px-4 py-2">Prénom</th>
                    <th className="border px-4 py-2">Cellule</th>
                    <th className="border px-4 py-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {refusMembers.map((s) => (
                    <tr key={s.id}>
                      <td className="border px-4 py-2">{s.membre.nom}</td>
                      <td className="border px-4 py-2">{s.membre.prenom}</td>
                      <td className="border px-4 py-2">{s.cellule?.cellule || "—"}</td>
                      <td className="border px-4 py-2">{s.statut}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
