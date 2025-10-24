//pages/admin/membres-cellule.js
import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function MembresCellule() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchMembres();
  }, []);

  const fetchMembres = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const role = localStorage.getItem("role");
      const userId = localStorage.getItem("userId");
      let userCelluleId = null;

      if (role === "ResponsableCellule") {
        const { data: celluleData, error: celluleError } = await supabase
          .from("cellules")
          .select("id")
          .eq("responsable_id", userId)
          .single();
        if (celluleError) console.error(celluleError);
        else userCelluleId = celluleData?.id;
      }

      let query = supabase.from("membres").select("*").order("nom", { ascending: true });

      if (role === "ResponsableCellule" && userCelluleId) {
        query = query.eq("cellule_id", userCelluleId);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Erreur chargement membres :", error);
        setMessage({ type: "error", text: `Erreur chargement : ${error.message}` });
        setMembres([]);
      } else {
        setMembres(data || []);
      }
    } catch (err) {
      console.error("Exception fetchMembres:", err);
      setMessage({ type: "error", text: `Exception fetch: ${err.message}` });
      setMembres([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {message && <p>{message.text}</p>}
      <ul>
        {membres.map((m) => (
          <li key={m.id}>{m.nom}</li>
        ))}
      </ul>
    </div>
  );
}
