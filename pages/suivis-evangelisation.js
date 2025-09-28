// pages/suivi-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuiviEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [filterCellule, setFilterCellule] = useState("");

  useEffect(() => {
    fetchCellules();
    fetchSuivis();
  }, []);

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id,cellule,responsable");
    if (!error && data) setCellules(data);
  };

  const fetchSuivis = async () => {
    const { data, error } = await supabase
      .from("suivis")
      .select(`
        id,
        membre_id,
        cellule_id,
        statut,
        commentaire,
        created_at,
        membres (prenom, nom, telephone, email, ville, besoin, infos_supplementaires, is_whatsapp),
        cellules (cellule,responsable)
      `);
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

  const handleChangeCommentaire = async (suiviId, newCommentaire) => {
    const { error } = await supabase
      .from("suivis")
      .update({ commentaire: newCommentaire })
      .eq("id", suiviId);
    if (!error) {
      setSuivis((prev) =>
        prev.map((s) => (s.id === suiviId ? { ...s, commentaire: newCommentaire } : s))
      );
    }
  };

  const filteredSuivis = suivis.filter((s) =>
    filterCellule ? s.cellule_id === filterCellule : true
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suivi des évangélisés
      </h1>

      {/* Filtre cellule */}
      <div className="mb-6 w-full max-w-md mx-auto">
        <label className="block mb-2 font-semibold">Filtrer par cellule :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={filterCellule}
          onChange={(e) => setFilterCellule(e.target.value)}
        >
          <option value="">-- Toutes les cellules --</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cellule} ({c.responsable})
            </option>
          ))}
        </select>
      </div>

      {/* Liste des suivis */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuivis.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {s.membres.prenom} {s.membres.nom}
            </h2>
            <p className="text-sm text-gray-600 mb-1">📱 {s.membres.telephone}</p>
            <p className="text-sm font-bold text-indigo-500 mb-1">
              Cellule : {s.cellules.cellule} ({s.cellules.responsable})
            </p>

            {/* Statut */}
            <div className="mb-2">
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

            {/* Commentaire */}
            <div>
              <label className="font-semibold">Commentaire :</label>
              <textarea
                className="w-full p-1 border rounded mt-1"
                rows={3}
                value={s.commentaire || ""}
                onChange={(e) => handleChangeCommentaire(s.id, e.target.value)}
              ></textarea>
            </div>

            {/* Infos supplémentaires */}
            <div className="mt-2 text-sm text-gray-700 space-y-1">
              <p>Email : {s.membres.email || "—"}</p>
              <p>Besoin : {s.membres.besoin || "—"}</p>
              <p>Ville : {s.membres.ville || "—"}</p>
              <p>WhatsApp : {s.membres.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
              <p>Infos supplémentaires : {s.membres.infos_supplementaires || "—"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
