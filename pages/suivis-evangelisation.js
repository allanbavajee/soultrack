// pages/suivi-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuiviEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuivis();
    fetchCellules();
  }, []);

  const fetchSuivis = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("suivis")
      .select(`
        id,
        statut,
        commentaire,
        membre:membre_id (
          id,
          prenom,
          nom,
          telephone,
          email,
          ville,
          besoin,
          infos_supplementaires,
          is_whatsapp
        ),
        cellule:cellule_id (
          id,
          cellule,
          responsable
        )
      `)
      .order("created_at", { ascending: false });

    if (!error && data) setSuivis(data);
    setLoading(false);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("*");
    if (!error && data) setCellules(data);
  };

  const handleChangeStatus = async (suiviId, newStatus) => {
    const { error } = await supabase
      .from("suivis")
      .update({ statut: newStatus })
      .eq("id", suiviId);

    if (error) {
      console.error("Erreur mise à jour statut:", error.message);
      return;
    }
    setSuivis((prev) =>
      prev.map((s) => (s.id === suiviId ? { ...s, statut: newStatus } : s))
    );
  };

  const handleAddComment = async (suiviId, commentaire) => {
    const { error } = await supabase
      .from("suivis")
      .update({ commentaire })
      .eq("id", suiviId);

    if (error) {
      console.error("Erreur ajout commentaire:", error.message);
      return;
    }
    setSuivis((prev) =>
      prev.map((s) => (s.id === suiviId ? { ...s, commentaire } : s))
    );
  };

  if (loading) return <p className="text-center mt-20 text-gray-600">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suivi des évangélisés
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suivis.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {s.membre.prenom} {s.membre.nom}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              Cellule : {s.cellule.cellule} ({s.cellule.responsable})
            </p>
            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">Statut :</label>
              <select
                value={s.statut}
                onChange={(e) => handleChangeStatus(s.id, e.target.value)}
                className="w-full border p-2 rounded-lg text-sm"
              >
                <option value="envoyé">Envoyé</option>
                <option value="en cours">En cours</option>
                <option value="actif">Actif</option>
                <option value="refus">Refus</option>
              </select>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">Commentaire :</label>
              <textarea
                className="w-full border p-2 rounded-lg text-sm"
                rows={2}
                value={s.commentaire || ""}
                onChange={(e) => handleAddComment(s.id, e.target.value)}
              />
            </div>

            <details className="mt-2">
              <summary className="text-blue-500 cursor-pointer">Détails</summary>
              <div className="mt-1 text-sm text-gray-700 space-y-1">
                <p>📱 {s.membre.telephone}</p>
                <p>Email : {s.membre.email || "—"}</p>
                <p>Ville : {s.membre.ville || "—"}</p>
                <p>Besoin : {s.membre.besoin || "—"}</p>
                <p>Infos supplémentaires : {s.membre.infos_supplementaires || "—"}</p>
                <p>WhatsApp : {s.membre.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
