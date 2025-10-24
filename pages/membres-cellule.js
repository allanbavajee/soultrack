//pages/membres-cellule.js

"use client";
import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function Membres({ currentUser }) {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembres() {
      let query = supabase.from("membres").select("*");

      // Filtre par rôle
      if (currentUser.role === "ResponsableCellule") {
        query = query.eq("cellule_id", currentUser.cellule_id);
      }

      const { data, error } = await query;
      if (error) console.log(error);
      else setMembres(data);

      setLoading(false);
    }

    fetchMembres();
  }, [currentUser]);

  if (loading) return <p>Chargement...</p>;
  if (!membres.length) return <p>Aucun membre à afficher.</p>;

  return (
    <div>
      <h1>Membres</h1>
      <ul>
        {membres.map((m) => (
          <li key={m.id}>{m.prenom} {m.nom}</li>
        ))}
      </ul>
    </div>
  );
}


