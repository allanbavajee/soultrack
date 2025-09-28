// pages/suivi-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";

export default function SuiviEvangelisation() {
  const [suivis, setSuivis] = useState([]);

  const RESPONSABLE_CELLULE_ID = "id-de-la-cellule-du-responsable"; // à remplacer dynamiquement

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    const { data, error } = await supabase
      .from("suivis")
      .select(`
        id,
        statut,
        membre_id,
        membres (prenom, nom, telephone, email, ville, besoin, infos_supplementaires, is_whatsapp),
        cellules (cellule)
      `)
      .eq("cellule_id", RESPONSABLE_CELLULE_ID);
    if (!error && data) setSuivis(data);
  };

  const handleChangeStatut = async (suiviId, newStatut) => {
    const { error } = await supabase
      .from("suivis")
      .update({ statut: newStatut })
      .eq("id", suiviId);
    if (!error) {
      setSuivis((prev) =>
        prev.map((s) => (s.id === suiviId ? { ...s, statut: newStatut } : s))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suivi des évangélisés
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suivis.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                {s.membres.prenom} {s.membres.nom}
              </h2>
              <p className="text-sm font-semibold text-indigo-500 mb-2">
                Cellule : {s.cellules.cellule}
              </p>
              <label className="font-semibold">Statut :</label>
              <select
                className="w-full p-1 border rounded mt-1"
                value={s.statut}
                onChange={(e) => handleChangeStatut(s.id, e.target.value)}
              >
                <option value="en attente">En attente</option>
                <option value="en cours">En cours</option>
                <option value="terminé">Terminé</option>
              </select>
            </div>

            <div className="mt-2 text-right">
              <Link
                href={`/suivi-evangelise-details/${s.membre_id}`}
                className="text-blue-500 underline hover:text-blue-700"
              >
                Détails
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
