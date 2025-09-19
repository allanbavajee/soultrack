/* pages/new-members.js */
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/* Supabase client */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewMembers() {
  const [members, setMembers] = useState([]);
  const [cells, setCells] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: membersData } = await supabase.from("members").select("*").eq("welcome_sent", false);
      const { data: cellsData } = await supabase.from("cells").select("*");
      setMembers(membersData);
      setCells(cellsData);
    }
    fetchData();
  }, []);

  const filteredMembers = members.filter(
    m => m.first_name.toLowerCase().includes(search.toLowerCase()) ||
         m.last_name.toLowerCase().includes(search.toLowerCase())
  );

  const createWhatsAppLink = (phone, firstName, cellId) => {
    const cell = cells.find(c => c.id === cellId);
    if (!cell) return "#";
    const message = `Bonjour ${cell.responsable_name}, un nouveau membre ${firstName} a été assigné à votre cellule ${cell.name}.`;
    return `https://wa.me/${cell.phone_e164}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🚀 Nouveaux venus</h2>
      <input
        type="text"
        placeholder="Rechercher par nom ou prénom"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20, padding: 5, width: "300px" }}
      />
      <ul>
        {filteredMembers.map(m => (
          <li key={m.id} style={{ marginBottom: 10 }}>
            {m.first_name} {m.last_name} — {m.phone_e164} — Cellule : {cells.find(c => c.id === m.cell_id)?.name || "Non assignée"}
            <a
              href={createWhatsAppLink(m.phone_e164, m.first_name, m.cell_id)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: 10, color: 'green', fontWeight: 'bold' }}
            >
              📲 Notifier le responsable
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
