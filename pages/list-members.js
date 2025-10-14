//pages/list-members.js
"use client";
import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";
import BoutonEnvoyer from "../components/BoutonEnvoyer";

export default function ListMembersPage() {
  const [membres, setMembres] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [vue, setVue] = useState("cartes"); // cartes | table
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [selectedMembre, setSelectedMembre] = useState(null); // pour la popup

  // ✅ Charger les données au montage
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("❌ Erreur : utilisateur non connecté");
        return;
      }

      const { data: membresData, error: membresError } = await supabase
        .from("membres")
        .select("*")
        .order("prenom", { ascending: true });

      if (membresError) console.error("Erreur chargement membres :", membresError);
      else setMembres(membresData || []);

      const { data: cellulesData, error: cellulesError } = await supabase
        .from("cellules")
        .select("*");

      if (cellulesError) console.error("Erreur chargement cellules :", cellulesError);
      else setCellules(cellulesData || []);
    };

    fetchData();
  }, []);

  // ✅ Mise à jour du statut en direct après envoi
  const handleEnvoyer = (idMembre) => {
    setMembres((prev) =>
      prev.map((m) => (m.id === idMembre ? { ...m, statut: "actif" } : m))
    );
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className="text-2xl font-bold text-gray-800">Liste des membres</h1>
        <div className="flex gap-2">
          <select
            value={selectedCellule ? selectedCellule.id : ""}
            onChange={(e) =>
              setSelectedCellule(
                cellules.find((c) => c.id === parseInt(e.target.value)) || null
              )
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">Sélectionner une cellule</option>
            {cellules.map((cell) => (
              <option key={cell.id} value={cell.id}>
                {cell.cellule}
              </option>
            ))}
          </select>

          <button
            onClick={() => setVue(vue === "cartes" ? "table" : "cartes")}
            className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            {vue === "cartes" ? "Vue Table" : "Vue Cartes"}
          </button>
        </div>
      </div>

      {/* Vue Cartes */}
      {vue === "cartes" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {membres.map((membre) => (
            <div
              key={membre.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <p className="font-semibold text-gray-800">
                  {membre.prenom} {membre.nom}
                </p>
                <p className="text-sm text-gray-600">{membre.telephone}</p>
                <p className="text-sm">
                  <span className="font-semibold">Statut:</span>{" "}
                  {membre.statut || "—"}
                </p>
              </div>

              <div className="mt-1 flex flex-col gap-1">
                <button
                  onClick={() => setSelectedMembre(membre)}
                  className="bg-gray-200 text-gray-700 py-1 rounded-lg hover:bg-gray-300 text-sm transition"
                >
                  🔍 Détails
                </button>
                <BoutonEnvoyer
                  membre={membre}
                  cellule={selectedCellule}
                  onEnvoyer={handleEnvoyer}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vue Table */}
      {vue === "table" && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Nom</th>
                <th className="border p-2 text-left">Téléphone</th>
                <th className="border p-2 text-left">Statut</th>
                <th className="border p-2 text-center">Détails</th>
              </tr>
            </thead>
            <tbody>
              {membres.map((membre) => (
                <tr key={membre.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {membre.prenom} {membre.nom}
                  </td>
                  <td className="border p-2">{membre.telephone}</td>
                  <td className="border p-2">{membre.statut || "—"}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => setSelectedMembre(membre)}
                      className="text-indigo-600 hover:underline"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Popup Détails */}
      {selectedMembre && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-4 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-2">
              {selectedMembre.prenom} {selectedMembre.nom}
            </h2>

            <div className="text-sm space-y-1 mb-3">
              <p>
                <span className="font-semibold">Téléphone :</span>{" "}
                {selectedMembre.telephone}
              </p>
              <p>
                <span className="font-semibold">Statut :</span>{" "}
                {selectedMembre.statut || "—"}
              </p>
              <p>
                <span className="font-semibold">Besoin :</span>{" "}
                {selectedMembre.besoin || "—"}
              </p>
              <p>
                <span className="font-semibold">Infos :</span>{" "}
                {selectedMembre.infos_supplementaires || "—"}
              </p>
            </div>

            {/* Boutons popup */}
            <div className="flex flex-col gap-2">
              <a
                href={`https://wa.me/${selectedMembre.telephone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-center"
              >
                💬 Contacter sur WhatsApp
              </a>

              <BoutonEnvoyer
                membre={selectedMembre}
                cellule={selectedCellule}
                onEnvoyer={handleEnvoyer}
              />

              <button
                onClick={() => setSelectedMembre(null)}
                className="bg-gray-300 hover:bg-gray-400 py-2 rounded-lg"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
