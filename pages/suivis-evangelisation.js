// pages/suivi-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuiviEvangelisation({ currentUserCelluleId }) {
  const [suivis, setSuivis] = useState([]);

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    const { data, error } = await supabase
      .from("suivis")
      .select("*, membres(*), cellules(*)")
      .eq("cellule_id", currentUserCelluleId);
    if (!error && data) setSuivis(data);
  };

  const updateSuivi = async (id, statut, commentaire) => {
    const { error } = await supabase
      .from("suivis")
      .update({ statut, commentaire })
      .eq("id", id);
    if (!error) fetchSuivis();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Suivi des évangélisés</h1>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
        {suivis.map(suivi => (
          <div key={suivi.id} className="bg-white p-4 rounded-xl shadow-md flex flex-col">
            <h2 className="text-lg font-bold">{suivi.membres.prenom} {suivi.membres.nom}</h2>
            <p>Envoyé le: {new Date(suivi.created_at).toLocaleDateString()}</p>
            <p>Statut: {suivi.statut}</p>

            <div className="mt-2 flex flex-col">
              <select
                className="border p-2 rounded mb-2"
                value={suivi.statut}
                onChange={e => updateSuivi(suivi.id, e.target.value, suivi.commentaire)}
              >
                <option value="envoyé">Envoyé</option>
                <option value="en cours">En cours</option>
                <option value="suivi terminé">Suivi terminé</option>
              </select>

              <textarea
                className="border p-2 rounded"
                placeholder="Commentaire"
                value={suivi.commentaire || ""}
                onChange={e => updateSuivi(suivi.id, suivi.statut, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
