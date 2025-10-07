import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    const { data, error } = await supabase
      .from("suivis_membres")
      .select(`
        id,
        statut,
        created_at,
        membre:membre_id (
          id, prenom, nom, statut
        ),
        cellule:cellule_id (id, cellule, responsable)
      `)
      .eq("statut", "envoye")
      .order("created_at", { ascending: false });

    if (!error) {
      const filtered = data.filter(
        (s) =>
          s.membre.statut === "visiteur" ||
          s.membre.statut === "veut rejoindre ICC"
      );
      setSuivis(filtered);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Suivis des membres</h1>
      <div className="w-full max-w-5xl space-y-4">
        {suivis.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-xl shadow-md border-l-4"
            style={{ borderColor: "#34A853" }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {s.membre.prenom} {s.membre.nom}
            </h3>
            <p className="text-sm text-gray-600">
              Status: {s.membre.statut} | Envoyé le:{" "}
              {new Date(s.created_at).toLocaleString()}
            </p>
            {s.cellule && (
              <p className="text-sm text-gray-600">
                Cellule: {s.cellule.cellule} ({s.cellule.responsable})
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
