//pages/suivis-membres.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchCellules();
    fetchSuivis();

    // ⚡ Subscription Realtime Supabase
    const subscription = supabase
      .from('suivis_membres')
      .on('*', () => {
        fetchSuivis(selectedCellule);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [selectedCellule]);

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("*");
    if (!error) setCellules(data);
  };

  const fetchSuivis = async (cellule = null) => {
    let query = supabase
      .from("suivis_membres")
      .select(`
        id,
        statut,
        created_at,
        membre:membre_id (
          id, prenom, nom, telephone, email, ville, infos_supplementaires, is_whatsapp, statut
        ),
        cellule:cellule_id (id, cellule, responsable, telephone)
      `);

    if (cellule) query = query.eq("cellule_id", cellule);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (!error) {
      // ⚡ Afficher seulement visiteur et veut rejoindre ICC
      const filtered = data.filter(
        (s) =>
          s.membre.statut === "visiteur" ||
          s.membre.statut === "veut rejoindre ICC"
      );
      setSuivis(filtered);
    }
  };

  const openPopup = (member) => {
    setCurrentMember(member);
    setNewStatus(member.statut);
    setShowPopup(true);
  };

  const handleStatusChange = (e) => setNewStatus(e.target.value);

  const handleValidate = async () => {
    if (!currentMember) return;

    await supabase
      .from("suivis_membres")
      .update({ statut: newStatus })
      .eq("id", currentMember.id);

    if (newStatus === "actif") {
      await supabase
        .from("membres")
        .update({ statut: "actif" })
        .eq("id", currentMember.membre.id);
    }

    setShowPopup(false);
    fetchSuivis(selectedCellule);
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        Suivi des membres
      </h1>

      <div className="mb-6 max-w-md w-full">
        <label className="block mb-2 text-white font-semibold">Filtrer par cellule :</label>
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

      <div className="overflow-x-auto w-full max-w-5xl mb-6">
        <table className="table-auto w-full border-collapse border border-white text-center">
          <thead>
            <tr className="bg-white bg-opacity-20 text-gray-800">
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Prénom</th>
              <th className="border px-4 py-2">Cellule</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Détails</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {suivis.map((s) => (
              <tr key={s.id}>
                <td className="border px-4 py-2">{s.membre.nom}</td>
                <td className="border px-4 py-2">{s.membre.prenom}</td>
                <td className="border px-4 py-2">{s.cellule?.cellule || "—"}</td>
                <td className="border px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      s.statut === "envoye"
                        ? "bg-blue-200 text-blue-800"
                        : s.statut === "en cours"
                        ? "bg-yellow-200 text-yellow-800"
                        : s.statut === "actif"
                        ? "bg-green-200 text-green-800"
                        : s.statut === "refus"
                        ? "bg-red-200 text-red-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {s.statut}
                  </span>
                </td>
                <td className="border px-4 py-2">
                  <span
                    className="text-blue-600 underline cursor-pointer hover:text-blue-800"
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

      {showPopup && currentMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full relative">
            <h2 className="text-xl font-bold mb-4">
              {currentMember.membre.prenom} {currentMember.membre.nom}
            </h2>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setShowPopup(false)}
            >
              ✖
            </button>
            <div className="space-y-1 text-gray-700">
              <p>📱 {currentMember.membre.telephone}</p>
              <p>📧 {currentMember.membre.email || "—"}</p>
              <p>🏙️ {currentMember.membre.ville || "—"}</p>
              <p>📝 {currentMember.membre.infos_supplementaires || "—"}</p>
              <p>WhatsApp : {currentMember.membre.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
              <p>Cellule : {currentMember.cellule?.cellule || "—"}</p>
            </div>
            <div className="mt-4">
              <label className="block mb-2 font-semibold">Changer le statut :</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={newStatus}
                onChange={handleStatusChange}
              >
                <option value="envoye">Envoyé</option>
                <option value="en cours">En cours</option>
                <option value="actif">Actif</option>
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

      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold bg-transparent hover:text-gray-200"
      >
        ↑
      </button>
    </div>
  );
}
