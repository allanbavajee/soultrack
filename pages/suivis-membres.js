// pages/suivis-membres.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");

  useEffect(() => {
    fetchCellules();
    fetchSuivis();
  }, []);

  useEffect(() => {
    if (selectedCellule) fetchSuivis(selectedCellule);
    else fetchSuivis();
  }, [selectedCellule]);

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("*");
    if (!error && data) setCellules(data);
  };

  const fetchSuivis = async (celluleId = null) => {
    let query = supabase
      .from("suivis_membres")
      .select(`
        id,
        statut,
        created_at,
        membre:membre_id (
          id, prenom, nom, telephone, email, ville, infos_supplementaires, statut
        ),
        cellule:cellule_id (id, cellule, responsable, telephone)
      `)
      .order("created_at", { ascending: false });

    if (celluleId) query = query.eq("cellule_id", celluleId);

    const { data, error } = await query;
    if (!error && data) {
      // 🔹 Filtrer uniquement les membres "visiteur" ou "veut rejoindre ICC"
      setSuivis(
        data.filter(
          (s) =>
            s.membre?.statut === "visiteur" ||
            s.membre?.statut === "veut rejoindre ICC"
        )
      );
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      {/* Retour */}
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      {/* Logo */}
      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      {/* Titre */}
      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-6">
        Suivi des membres
      </h1>

      {/* Filtre cellule */}
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

      {/* Tableau des suivis */}
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
                <td className="border px-4 py-2">{s.statut}</td>
                <td className="border px-4 py-2">
                  <details className="text-left">
                    <summary className="cursor-pointer text-blue-600 underline">
                      Afficher
                    </summary>
                    <div className="mt-2">
                      <p>📱 {s.membre.telephone || "—"}</p>
                      <p>📧 {s.membre.email || "—"}</p>
                      <p>🏙️ {s.membre.ville || "—"}</p>
                      <p>📝 {s.membre.infos_supplementaires || "—"}</p>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Flèche pour remonter en haut */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold bg-transparent hover:text-gray-200"
      >
        ↑
      </button>
    </div>
  );
}
