// pages/suivis-membres.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");

  useEffect(() => {
    fetchCellules();
    fetchSuivis();
  }, []);

  useEffect(() => {
    if (selectedCellule) fetchSuivis(selectedCellule);
    else fetchSuivis();
  }, [selectedCellule]);

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("*");
    if (!error) setCellules(data);
  };

  const fetchSuivis = async (cellule = null) => {
    let query = supabase
      .from("suivis_membres")
      .select(`
        id,
        statut,
        created_at,
        membre:membre_id (
          id, prenom, nom, telephone, statut
        ),
        cellule:cellule_id (id, cellule, responsable)
      `);

    if (cellule) query = query.eq("cellule_id", cellule);

    const { data, error } = await query.order("created_at", { ascending: false });

    if (!error) {
      const filtered = data.filter(
        (s) =>
          s.membre &&
          (s.membre.statut === "visiteur" || s.membre.statut === "veut rejoindre ICC")
      );
      setSuivis(filtered);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Suivis des membres</h1>

      <div className="w-full max-w-6xl">
        {suivis.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 mb-4 rounded-xl shadow flex justify-between items-center border-l-4"
            style={{
              borderColor:
                s.membre.statut === "visiteur" || s.membre.statut === "veut rejoindre ICC"
                  ? "#34A853"
                  : "#ccc",
            }}
          >
            <div>
              <p className="font-semibold">{s.membre.prenom} {s.membre.nom}</p>
              <p className="text-sm text-gray-600">{s.membre.telephone || "—"}</p>
              <p className="text-sm text-gray-500">Statut : {s.membre.statut}</p>
              <p className="text-sm text-gray-400">Date : {new Date(s.created_at).toLocaleString()}</p>
            </div>
            <div>
              {s.cellule && (
                <p className="text-sm font-semibold text-indigo-600">
                  {s.cellule.cellule} ({s.cellule.responsable})
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
