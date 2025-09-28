// pages/suivi-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuiviEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [celluleId, setCelluleId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1️⃣ Récupérer l'utilisateur connecté
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2️⃣ Récupérer sa cellule depuis la table "users" (ou "responsables")
      const { data: profile, error } = await supabase
        .from("users")
        .select("cellule_id")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Erreur récupération cellule:", error);
        return;
      }

      if (profile?.cellule_id) {
        setCelluleId(profile.cellule_id);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!celluleId) return;

    // 3️⃣ Récupérer les suivis pour cette cellule
    const fetchSuivis = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("suivis")
        .select(`
          id,
          statut,
          commentaire,
          created_at,
          membres(*)
        `)
        .eq("cellule_id", celluleId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur récupération suivis:", error);
      } else {
        setSuivis(data);
      }
      setLoading(false);
    };

    fetchSuivis();
  }, [celluleId]);

  const handleUpdate = async (suiviId, newStatut, newCommentaire) => {
    const { error } = await supabase
      .from("suivis")
      .update({ statut: newStatut, commentaire: newCommentaire })
      .eq("id", suiviId);

    if (error) {
      alert("Erreur mise à jour: " + error.message);
    } else {
      setSuivis((prev) =>
        prev.map((s) =>
          s.id === suiviId ? { ...s, statut: newStatut, commentaire: newCommentaire } : s
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Titre */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Suivi des évangélisés
      </h1>

      {loading && <p className="text-center text-gray-600">Chargement...</p>}

      {!loading && suivis.length === 0 && (
        <p className="text-center text-gray-600">Aucun suivi pour votre cellule.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suivis.map((suivi) => (
          <div
            key={suivi.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {suivi.membres.prenom} {suivi.membres.nom}
            </h2>
            <p className="text-sm text-gray-600 mb-1">📱 {suivi.membres.telephone}</p>
            <p className="text-sm font-bold text-orange-500 mb-2">
              Statut : {suivi.statut}
            </p>

            <label className="block mb-1 font-semibold">Changer le statut :</label>
            <select
              value={suivi.statut}
              onChange={(e) =>
                handleUpdate(suivi.id, e.target.value, suivi.commentaire)
              }
              className="w-full p-2 border rounded-lg mb-2"
            >
              <option value="en attente">En attente</option>
              <option value="contacté">Contacté</option>
              <option value="actif">Actif</option>
              <option value="ancien">Ancien</option>
            </select>

            <label className="block mb-1 font-semibold">Commentaire :</label>
            <textarea
              value={suivi.commentaire || ""}
              onChange={(e) =>
                setSuivis((prev) =>
                  prev.map((s) =>
                    s.id === suivi.id ? { ...s, commentaire: e.target.value } : s
                  )
                )
              }
              onBlur={(e) =>
                handleUpdate(suivi.id, suivi.statut, e.target.value)
              }
              className="w-full p-2 border rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
