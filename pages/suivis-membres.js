//pages/suivis-membres.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);

  useEffect(() => {
    fetchSuivis();

    // ⚡ Temps réel Supabase
    const channel = supabase
      .channel("realtime-suivis")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "suivis_membres" },
        (payload) => {
          const newSuivi = payload.new;
          // On récupère le membre complet
          supabase
            .from("membres")
            .select("*")
            .eq("id", newSuivi.membre_id)
            .single()
            .then(({ data }) => {
              if (data.statut === "visiteur" || data.statut === "veut rejoindre ICC") {
                setSuivis(prev => [{ membre: data, statut: "envoye", created_at: newSuivi.created_at, id: newSuivi.id }, ...prev]);
              }
            });
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchSuivis = async () => {
    const { data, error } = await supabase
      .from("suivis_membres")
      .select(`
        id,
        statut,
        created_at,
        membre:membre_id (id, prenom, nom, statut),
        cellule:cellule_id (cellule, responsable)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      const filtered = data.filter(s => s.membre.statut === "visiteur" || s.membre.statut === "veut rejoindre ICC");
      setSuivis(filtered);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      <h1 className="text-white text-5xl mb-6">Suivis des membres</h1>
      <div className="w-full max-w-5xl space-y-4">
        {suivis.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-xl shadow-md border-l-4" style={{ borderColor: "#34A853" }}>
            <h3 className="text-lg font-bold text-gray-800">{s.membre.prenom} {s.membre.nom}</h3>
            <p className="text-sm text-gray-600">Statut: {s.membre.statut}</p>
            {s.cellule && <p className="text-sm text-gray-600">Cellule: {s.cellule.cellule} ({s.cellule.responsable})</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
