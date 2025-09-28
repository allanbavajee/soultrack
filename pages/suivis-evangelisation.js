/* pages/suivi-evangelisation.js */
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuiviEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [celluleId, setCelluleId] = useState(null); // cellule du responsable
  const [loading, setLoading] = useState(true);

  // 🟢 Charger la cellule du responsable connecté
  useEffect(() => {
    const fetchCellule = async () => {
      // Remplace ceci par la logique pour récupérer la cellule du responsable connecté
      const { data: celluleData, error: celluleError } = await supabase
        .from("cellules")
        .select("*")
        .eq("responsable", supabase.auth.user()?.email)
        .single();

      if (!celluleError && celluleData) {
        setCelluleId(celluleData.id);
      }
    };
    fetchCellule();
  }, []);

  // 🔄 Charger les suivis de cette cellule
  useEffect(() => {
    if (!celluleId) return;
    const fetchSuivis = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("suivis")
        .select(
          `id, statut, commentaire, membre_id, created_at, membres(*)`
        )
        .eq("cellule_id", celluleId)
        .order("created_at", { ascending: false });

      if (!error && data) setSuivis(data);
      setLoading(false);
    };

    fetchSuivis();
  }, [celluleId]);

  // 🔄 Mettre à jour statut ou commentaire
  const updateSuivi = async (id, field, value) => {
    const { error } = await supabase
      .from("suivis")
      .update({ [field]: value })
      .eq("id", id);

    if (!error) {
      setSuivis((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
      );
    }
  };

  if (loading) return <p className="p-6 text-center">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suivi des évangélisés
      </h1>

      {suivis.length === 0 && (
        <p className="text-center text-gray-600 mt-6">Aucun suivi pour le moment.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {suivis.map((suivi) => (
          <div
            key={suivi.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              {suivi.membres.prenom} {suivi.membres.nom}
            </h2>
            <p className="text-sm text-gray-600 mb-1">📱 {suivi.membres.telephone}</p>
            <p className="text-sm text-gray-600 mb-2">
              📧 {suivi.membres.email || "—"}
            </p>

            {/* Statut */}
            <label className="block font-semibold mb-1">Statut :</label>
            <select
              value={suivi.statut}
              onChange={(e) => updateSuivi(suivi.id, "statut", e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
            >
              <option value="en attente">En attente</option>
              <option value="contacté">Contacté</option>
              <option value="actif">Actif</option>
            </select>

            {/* Commentaire */}
            <label className="block font-semibold mb-1">Commentaire :</label>
            <textarea
              value={suivi.commentaire || ""}
              onChange={(e) => updateSuivi(suivi.id, "commentaire", e.target.value)}
              className="w-full p-2 border rounded-lg mb-2"
              rows={3}
              placeholder="Ajouter un commentaire..."
            />

            <p className="text-xs text-gray-500 mt-2">
              Ajouté le : {new Date(suivi.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
