// pages/suivi-evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function SuiviEvangelisation() {
  const [suivis, setSuivis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("suivis")
      .select(`
        id,
        statut,
        membre:membre_id (prenom, nom, telephone, email, ville, besoin, infos_supplementaires, is_whatsapp),
        cellule:cellule_id (cellule, responsable)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) setSuivis(data);
    setLoading(false);
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

  if (loading) return <p className="text-center mt-20 text-gray-600">Chargement...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Suivi des évangélisés
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg bg-white shadow-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border-b">Prénom</th>
              <th className="p-3 border-b">Nom</th>
              <th className="p-3 border-b">Cellule</th>
              <th className="p-3 border-b">Statut</th>
              <th className="p-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {suivis.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{s.membre?.prenom}</td>
                <td className="p-3 border-b">{s.membre?.nom}</td>
                <td className="p-3 border-b">{s.cellule?.cellule}</td>
                <td className="p-3 border-b">
                  <select
                    value={s.statut}
                    onChange={(e) => handleChangeStatus(s.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="envoyé">Envoyé</option>
                    <option value="en cours">En cours</option>
                    <option value="actif">Actif</option>
                    <option value="refus">Refus</option>
                  </select>
                </td>
                <td className="p-3 border-b">
                  <details>
                    <summary className="text-blue-500 cursor-pointer">Détails</summary>
                    <div className="mt-2 text-sm text-gray-700 space-y-1">
                      <p>📱 {s.membre?.telephone}</p>
                      <p>Email : {s.membre?.email || "—"}</p>
                      <p>Ville : {s.membre?.ville || "—"}</p>
                      <p>Besoin : {s.membre?.besoin || "—"}</p>
                      <p>Infos : {s.membre?.infos_supplementaires || "—"}</p>
                      <p>WhatsApp : {s.membre?.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
                      <p className="mt-2 text-gray-500 text-xs">
                        Responsable : {s.cellule?.responsable}
                      </p>
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
