/* /pages/new-members.js */
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

/* Supabase client */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewMembers() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("welcome_sent", false)  // seulement les nouveaux
        .order("date_premiere_visite", { ascending: true });
      if (!error) setMembers(data);
    }
    fetchMembers();
  }, []);

  const createWhatsAppLink = (phone, firstName) => {
    const message = `Bonjour ${firstName || ''}, nous sommes heureux que tu aies visité notre église 🙏 — SoulTrack`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🚀 Nouveaux venus</h2>
      <ul>
        {members.map(m => (
          <li key={m.id} style={{ marginBottom: 10 }}>
            {m.first_name} {m.last_name} — {m.phone_e164} 
            <a 
              href={createWhatsAppLink(m.phone_e164, m.first_name)} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ marginLeft: 10, color: 'green', fontWeight: 'bold' }}
            >
              📲 Envoyer WhatsApp
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
