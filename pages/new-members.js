/* /pages/new-members.js */
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("membres").select("*").order("date_premiere_visite", { ascending: true });
      setMembers(data);
    }
    fetchData();
  }, []);

  const filteredMembers = members.filter(
    m => m.nom.toLowerCase().includes(search.toLowerCase()) || m.prenom.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (statut) => {
    switch(statut) {
      case "de passage": return "#4CAF50"; // vert
      case "veut rejoindre ICC": return "#2196F3"; // bleu
      case "a déjà mon église": return "#f44336"; // rouge
      default: return "#888";
    }
  };

  const createWhatsAppLink = (m) => {
    if(m.statut !== "veut rejoindre ICC") return null;
    return `https://wa.me/${m.responsable_suivi_phone}?text=${encodeURIComponent(
      `Bonjour ${m.responsable_suivi} 🌸, nous avons la joie d’accueillir ${m.prenom} ${m.nom} dans notre église. Il a été assigné à votre cellule ${m.cellule_name}. Merci de l’accueillir et de le guider avec amour ! 🙏`
    )}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📋 Liste des nouveaux membres</h2>
      <input
        type="text"
        placeholder="Rechercher par nom ou prénom"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20, padding: 8, width: "100%", borderRadius: 6 }}
      />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredMembers.map(m => (
          <li key={m.id} style={{
            marginBottom: 10,
            padding: 12,
            borderRadius: 8,
            backgroundColor: getStatusColor(m.statut),
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div>
              {m.prenom} {m.nom} <br/>
              Cellule : {m.cellule_name} <br/>
              Responsable : {m.responsable_suivi}
            </div>
            {m.statut === "veut rejoindre ICC" && (
              <a
                href={createWhatsAppLink(m)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: 10 }}
              >
                <img src="/whatsapp-logo.png" alt="WhatsApp" width={30} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
