// pages/suivis-membres.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [filter, setFilter] = useState("");
  const [selectedStatut, setSelectedStatut] = useState({});
  const [commentaire, setCommentaire] = useState({});

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select(
          `id, statut AS statut_suivi, commentaire, membres (*)`
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      // filtrer uniquement 'visiteur' et 'veut rejoindre ICC'
      const filtered = data.filter(
        (s) =>
          s.membres.statut === "visiteur" ||
          s.membres.statut === "veut rejoindre ICC"
      );
      setSuivis(filtered || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await supabase
        .from("suivis_membres")
        .update({
          statut: selectedStatut[id],
          commentaire: commentaire[id],
        })
        .eq("id", id);
      fetchSuivis();
      setDetailsOpen((prev) => ({ ...prev, [id]: false }));
    } catch (err) {
      console.error("Erreur update:", err.message);
    }
  };

  const refus = () => {
    // ici tu peux rediriger vers la page des refus
    window.alert("Redirection vers les refus...");
  };

  const integres = () => {
    // ici tu peux rediriger vers la page des intégrés
    window.alert("Redirection vers les intégrés...");
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-r from-indigo-600 to-cyan-400">
      <h1 className="text-5xl font-handwriting text-white mb-4">Suivis Membres 📋</h1>

      {/* Filtre central */}
      <div className="mb-4 w-full max-w-md flex justify-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Filtrer par statut membre --</option>
          <option value="visiteur">Visiteur</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
        </select>
      </div>

      {/* Table */}
      <div className="w-full max-w-6xl overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Prénom</th>
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Statut Membre</th>
              <th className="py-2 px-4">Détails</th>
            </tr>
          </thead>
          <tbody>
            {suivis
              .filter((s) => !filter || s.membres.statut === filter)
              .map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2 px-4">{s.membres.prenom}</td>
                  <td className="py-2 px-4">{s.membres.nom}</td>
                  <td className="py-2 px-4">{s.membres.statut}</td>
                  <td className="py-2 px-4">
                    <p
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() =>
                        setDetailsOpen((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                      }
                    >
                      {detailsOpen[s.id] ? "Fermer détails" : "Détails"}
                    </p>

                    {detailsOpen[s.id] && (
                      <div className="mt-2 text-sm text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-2">
                        <p>
                          <strong>Prénom:</strong> {s.membres.prenom}
                        </p>
                        <p>
                          <strong>Nom:</strong> {s.membres.nom}
                        </p>
                        <p>
                          <strong>Statut Membre:</strong> {s.membres.statut}
                        </p>
                        <p>
                          <strong>Téléphone:</strong> {s.membres.telephone || "—"}
                        </p>
                        <p>
                          <strong>Besoin:</strong> {s.membres.besoin || "—"}
                        </p>
                        <p>
                          <strong>Infos supplémentaires:</strong>{" "}
                          {s.membres.infos_supplementaires || "—"}
                        </p>
                        <p>
                          <strong>Statut Suivi:</strong>
                          <select
                            className="border rounded-lg px-2 py-1 text-sm ml-2"
                            value={selectedStatut[s.id] || s.statut_suivi}
                            onChange={(e) =>
                              setSelectedStatut((prev) => ({
                                ...prev,
                                [s.id]: e.target.value,
                              }))
                            }
                          >
                            <option value="en cours">En cours</option>
                            <option value="refus">Refus</option>
                            <option value="intégré">Intégré</option>
                          </select>
                        </p>
                        <p className="col-span-2">
                          <strong>Commentaire:</strong>
                          <input
                            type="text"
                            className="border rounded-lg px-2 py-1 w-full mt-1"
                            value={commentaire[s.id] || s.commentaire || ""}
                            onChange={(e) =>
                              setCommentaire((prev) => ({
                                ...prev,
                                [s.id]: e.target.value,
                              }))
                            }
                          />
                        </p>
                        <button
                          className="mt-2 col-span-2 bg-green-500 text-white px-4 py-2 rounded-xl"
                          onClick={() => handleUpdate(s.id)}
                        >
                          Valider
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Boutons de redirection */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={refus}
          className="bg-red-500 text-white px-4 py-2 rounded-xl"
        >
          Refus
        </button>
        <button
          onClick={integres}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl"
        >
          Intégrés
        </button>
      </div>

      <p className="mt-6 mb-6 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens 12:14 ❤️
      </p>
    </div>
  );
}
