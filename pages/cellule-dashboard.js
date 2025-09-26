// pages/cellule-dashboard.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function CelluleDashboard({ user }) {
  const [suivi, setSuivi] = useState([]);
  const [cellule, setCellule] = useState("");
  const [statuses] = useState(["evangelisé", "contacté", "actif", "non intéressé"]);

  // Récupérer le responsable actuel (par exemple, user.id)
  const responsableId = user?.id;

  useEffect(() => {
    if (responsableId) fetchSuivi();
  }, [responsableId]);

  const fetchSuivi = async () => {
    let query = supabase
      .from("suivi_cellule")
      .select(`
        id,
        commentaire,
        status,
        date,
        membre_id (
          prenom,
          nom,
          telephone,
          email,
          ville,
          besoin,
          infos_supplementaires
        )
      `)
      .eq("responsable_id", responsableId);

    if (cellule) query = query.eq("cellule", cellule);

    const { data, error } = await query.order("date", { ascending: false });
    if (error) console.error("Erreur fetchSuivi:", error);
    else setSuivi(data);
  };

  const handleUpdate = async (id, status, commentaire) => {
    const { error } = await supabase
      .from("suivi_cellule")
      .update({ status, commentaire })
      .eq("id", id);

    if (error) console.error("Erreur update:", error);
    else fetchSuivi();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Tableau de suivi - Ma cellule
      </h1>

      {/* Filtre cellule */}
      <div className="flex justify-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Filtrer par cellule"
          value={cellule}
          onChange={(e) => setCellule(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />
        <button
          onClick={fetchSuivi}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Filtrer
        </button>
      </div>

      {/* Cartes des évangélisés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {suivi.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {item.membre_id.prenom} {item.membre_id.nom}
            </h2>
            <p>📱 {item.membre_id.telephone}</p>
            <p>Email: {item.membre_id.email || "—"}</p>
            <p>Ville: {item.membre_id.ville || "—"}</p>
            <p>Besoin: {item.membre_id.besoin || "—"}</p>
            <p>Infos: {item.membre_id.infos_supplementaires || "—"}</p>

            {/* Commentaire */}
            <textarea
              value={item.commentaire || ""}
              onChange={(e) =>
                setSuivi((prev) =>
                  prev.map((s) => (s.id === item.id ? { ...s, commentaire: e.target.value } : s))
                )
              }
              placeholder="Ajouter un commentaire..."
              className="w-full p-2 border rounded-lg mt-2"
            />

            {/* Statut */}
            <select
              value={item.status}
              onChange={(e) =>
                setSuivi((prev) =>
                  prev.map((s) => (s.id === item.id ? { ...s, status: e.target.value } : s))
                )
              }
              className="w-full p-2 border rounded-lg mt-2"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={() => handleUpdate(item.id, item.status, item.commentaire)}
              className="mt-2 w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
            >
              💾 Enregistrer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
