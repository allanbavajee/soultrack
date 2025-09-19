/* /pages/members.js */
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" = tous
  const [cellFilter, setCellFilter] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("membres").select("*").order("date_premiere_visite", { ascending: true });
      setMembers(data);
    }
    fetchData();
  }, []);

  const filteredMembers = members.filter(m => {
    const matchesSearch =
      m.nom.toLowerCase().includes(search.toLowerCase()) ||
      m.prenom.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? m.statut === statusFilter : true;
    const matchesCell = cellFilter ? m.cellule_name === cellFilter : true;
    return matchesSearch && matchesStatus && matchesCell;
  });

  const getStatusColor = (statut) => {
    switch(statut) {
      case "de passage": return "#4CAF50"; // vert
      case "veut rejoindre ICC": return "#2196F3"; // bleu
      case "a déjà mon église": return "#f44336"; // rouge
      default: return "#888";
    }
  };

  const CELLS = [
    "Cellule de Curepipe",
    "Cellule de Bois Rouge",
    "Cellule de Bambous",
    "Cellule de Mon Gout",
    "Cellule de Rose Hill",
    "Eglise"
  ];

  return (
    <div style={{ padding: 20, fontFamily: "'Roboto', sans-serif", maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ color: "#4A90E2", textAlign: "center", marginBottom: 20 }}>📋 Membres de l'église</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Rechercher par nom ou prénom"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}>
          <option value="">-- Filtrer par statut --</option>
          <option value="de passage">De passage</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="a déjà mon église">A déjà mon église</option>
        </select>

        <select value={cellFilter} onChange={(e) => setCellFilter(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}>
          <option value="">-- Filtrer par cellule --</option>
          {CELLS.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredMembers.map(m => (
          <li key={m.id} style={{
            marginBottom: 12,
            padding: 15,
            borderRadius: 10,
            backgroundColor: getStatusColor(m.statut),
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap"
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <strong>{m.prenom} {m.nom}</strong> <br/>
              Assignée : {m.cellule_name || "N/A"} <br/>
              Statut : {m.statut} <br/>
              Besoin : {m.notes || "Aucun"} <br/>
              Responsable : {m.responsable_suivi || "N/A"} <br/>
              Téléphone : {m.telephone || "N/A"}
            </div>
          </li>
        ))}
      </ul>

      {filteredMembers.length === 0 && <p style={{ textAlign: "center", color: "#555" }}>Aucun membre trouvé.</p>}
    </div>
  );
}
