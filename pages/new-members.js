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
    <div style={{ padding: 20, fontFamily: "'Roboto', sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ color: "#4A90E2", textAlign: "center", marginBottom: 20 }}>📋 Nouveaux membres</h2>

      <input
        type="text"
        placeholder="Rechercher par nom ou prénom"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20, padding: 10, width: "100%", borderRadius: 8, border: "1px solid #ccc" }}
      />

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
              Besoin : {m.notes || "Aucun"} <br/>
              Responsable : {m.responsable_suivi || "N/A"}
            </div>

            {m.statut === "veut rejoindre ICC" && (
              <a
                href={createWhatsAppLink(m)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: 10 }}
              >
                <img src="/whatsapp-logo.png" alt="WhatsApp" width={35} />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
