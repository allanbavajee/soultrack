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

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("membres").select("*").order("date_premiere_visite", { ascending: true });
      setMembers(data);
    }
    fetchData();
  }, []);

  const sendWhatsApp = (m) => {
    const phone = m.responsable_suivi_phone; // numéro du responsable en E164
    const message = `Bonjour ${m.responsable_suivi} 🌸, nous avons la joie d’accueillir ${m.prenom} ${m.nom} dans notre église.\n
Téléphone : ${m.telephone}\n
Assigné à : ${m.cellule_name || "N/A"}\n
Besoin : ${m.notes || "Aucun"}\n
Comment il/elle est venu : ${m.how_came}\n
Merci de l’accueillir et de le guider avec amour ! 🙏`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    // Marquer comme “envoyé” pour changer le style et retirer le bouton
    supabase.from("membres").update({ statut: "a déjà mon église" }).eq("id", m.id)
      .then(() => {
        setMembers(prev => prev.map(x => x.id === m.id ? { ...x, statut: "a déjà mon église" } : x));
      });
  };

  const getStatusColor = (statut) => {
    switch(statut) {
      case "de passage": return "#4CAF50"; // vert
      case "veut rejoindre ICC": return "#2196F3"; // bleu
      case "a déjà mon église": return "#fff"; // noir sur blanc
      default: return "#888";
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "'Roboto', sans-serif", maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ color: "#4A90E2", textAlign: "center", marginBottom: 20 }}>📋 Membres de l'église</h2>

      <input
        type="text"
        placeholder="Rechercher par nom ou prénom"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 20, padding: 10, width: "100%", borderRadius: 8, border: "1px solid #ccc" }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {members.filter(m => m.nom.toLowerCase().includes(search.toLowerCase()) || m.prenom.toLowerCase().includes(search.toLowerCase())).map(m => (
          <li key={m.id} style={{
            marginBottom: 12,
            padding: 15,
            borderRadius: 10,
            backgroundColor: getStatusColor(m.statut),
            color: m.statut === "a déjà mon église" ? "#000" : "#fff",
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

            {m.statut === "veut rejoindre ICC" && m.responsable_suivi_phone && (
              <button
                onClick={() => sendWhatsApp(m)}
                style={{ padding: 8, background: "#25D366", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}
              >
                WhatsApp
              </button>
            )}
          </li>
        ))}
      </ul>

      {members.filter(m => m.nom.toLowerCase().includes(search.toLowerCase()) || m.prenom.toLowerCase().includes(search.toLowerCase())).length === 0 &&
        <p style={{ textAlign: "center", color: "#555" }}>Aucun membre trouvé.</p>}
    </div>
  );
}
