// pages/suivis-cellule.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuivisCellule() {
  const [suivis, setSuivis] = useState([]);

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    // ⚠️ Ici il faudra filtrer par cellule_id du responsable connecté
    const { data, error } = await supabase
      .from("suivis")
      .select(`
        id,
        statut,
        commentaire,
        membre:membre_id (id, prenom, nom, telephone, email),
        cellule:cellule_id (cellule, responsable)
      `)
      .order("updated_at", { ascending: false });

    if (!error && data) setSuivis(data);
  };

  const updateSuivi = async (id, updates) => {
    const { error } = await supabase
      .from("suivis")
      .update({ ...updates, updated_at: new Date() })
      .eq("id", id);

    if (!error) {
      fetchSuivis(); // refresh après update
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        📋 Suivi des évangélisés dans ma cellule
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suivis.map((suivi) => (
          <div
            key={suivi.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <h2 className="text-lg font-bold text-gray-800">
              {suivi.membre.prenom} {suivi.membre.nom}
            </h2>
            <p className="text-sm text-gray-600">
              📱 {suivi.membre.telephone}
            </p>
            <p className="text-sm text-gray-600">
              📧 {suivi.membre.email || "—"}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Cellule : <b>{suivi.cellule?.cellule || "—"}</b>
            </p>

            {/* Statut */}
            <div className="mt-3">
              <label className="block text-sm font-semibold mb-1">
                Statut :
              </label>
              <select
                value={suivi.statut}
                onChange={(e) =>
                  updateSuivi(suivi.id, { statut: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              >
                <option value="en attente">⏳ En attente</option>
                <option value="contacté">📞 Contacté</option>
                <option value="venu">🙌 Venu</option>
                <option value="intégré">✅ Intégré</option>
              </select>
            </div>

            {/* Commentaire */}
            <div className="mt-3">
              <label className="block text-sm font-semibold mb-1">
                Commentaire :
              </label>
              <textarea
                className="w-full border rounded-lg p-2 text-sm"
                value={suivi.commentaire || ""}
                onChange={(e) =>
                  updateSuivi(suivi.id, { commentaire: e.target.value })
                }
                placeholder="Notes sur les appels, visites..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
