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
      const { data: membersData } = await supabase.from("to_welcome").select("*").order("date_premiere_visite", { ascending: true });
      const { data: cellsData } = await supabase.from("cells").select("*");
      setMembers(membersData);
      setCells(cellsData);
    }
    fetchData();
  }, []);

  const filteredMembers = members.filter(
    m => m.nom.toLowerCase().includes(search.toLowerCase()) ||
         m.prenom.toLowerCase().includes(search.toLowerCase())
  );

  const createWhatsAppLink = (m) => {
    const cell = cells.find(c => c.responsable_name === m.responsable_suivi);
    if (!cell) return "#";
    return `https://wa.me/${cell.phone_e164}?text=${encodeURIComponent(
      `Bonjour ${cell.responsable_name}, un nouveau membre ${m.nom} ${m.prenom} a été assigné à votre cellule ${cell.name}.`
    )}`;
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
            {m.nom} {m.prenom} — {m.telephone} — Responsable : {m.responsable_suivi}
            <a
              href={createWhatsAppLink(m)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: 10 }}
            >
              <img src="/whatsapp-logo.png" alt="WhatsApp" width={24} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
