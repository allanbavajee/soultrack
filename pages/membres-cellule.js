//pages/membres-cellule.js

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

      // Récupérer la cellule si c'est un ResponsableCellule
      if (role === "ResponsableCellule") {
        const { data: celluleData, error: celluleError } = await supabase
          .from("cellules")
          .select("id")
          .eq("responsable_id", userId)
          .single();

        if (celluleError) {
          console.error("Erreur cellule:", celluleError);
          setMessage({ type: "error", text: "Erreur récupération cellule." });
        } else if (!celluleData) {
          console.warn("Aucune cellule trouvée pour ce responsable.");
          setMessage({ type: "info", text: "Vous n'avez pas de cellule assignée." });
        } else {
          userCelluleId = celluleData.id;
        }
      }

      let query = supabase.from("membres").select("*").order("nom", { ascending: true });

      if (role === "ResponsableCellule") {
        if (!userCelluleId) {
          // Si le responsable n'a pas de cellule, on n'affiche rien
          setMembres([]);
          setLoading(false);
          return;
        }
        query = query.eq("cellule_id", userCelluleId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erreur chargement membres :", error);
        setMessage({ type: "error", text: `Erreur chargement : ${error.message}` });
        setMembres([]);
      } else {
        setMembres(data || []);
        if ((data || []).length === 0 && role !== "ResponsableCellule") {
          setMessage({ type: "info", text: "Aucun membre trouvé." });
        }
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
      {membres.length > 0 ? (
        <ul>
          {membres.map((m) => (
            <li key={m.id}>{m.nom}</li>
          ))}
        </ul>
      ) : (
        !loading && <p>Aucun membre à afficher.</p>
      )}
    </div>
  );
}

