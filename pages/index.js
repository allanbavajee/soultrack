import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      let { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false });
      if (!error) setMembers(data);
    }
    fetchMembers();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>📖 SoulTrack Dashboard</h1>
      <a href="/add-member">+ Ajouter un membre</a>
      <ul>
        {members.map(m => (
          <li key={m.id}>
            {m.first_name} {m.last_name} — {m.status} — {m.phone_e164}
            {m.welcome_sent ? " ✅ Bienvenue envoyé" : " ⏳ en attente"}
          </li>
        ))}
      </ul>
    </div>
  );
}
