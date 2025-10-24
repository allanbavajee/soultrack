//pages/membres-cellule.js

import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const role = localStorage.getItem("role");
      const userId = localStorage.getItem("userId");
      let userCelluleId = null;

      // Récupérer l'ID de la cellule si c'est un ResponsableCellule
      if (role === "ResponsableCellule") {
        const { data: celluleData, error: celluleError } = await supabase
          .from("cellules")
          .select("id")
          .eq("responsable_id", userId)
          .single();
        if (celluleError) console.error(celluleError);
        else userCelluleId = celluleData?.id;
      }

      let query = supabase
        .from("suivis_membres")
        .select("*")
        .order("created_at", { ascending: false });

      if (role === "ResponsableCellule" && userCelluleId) {
        query = query.eq("cellule_id", userCelluleId);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Erreur chargement suivis :", error);
        setMessage({ type: "error", text: `Erreur chargement : ${error.message}` });
        setSuivis([]);
      } else {
        setSuivis(data || []);
      }
    } catch (err) {
      console.error("Exception fetchSuivis:", err);
      setMessage({ type: "error", text: `Exception fetch: ${err.message}` });
      setSuivis([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {message && <p>{message.text}</p>}
      <ul>
        {suivis.map((s) => (
          <li key={s.id}>{s.nom_membre}</li>
        ))}
      </ul>
    </div>
  );
}

