/* /pages/add-member.js */
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CELLULES = [
  { id: "1", name: "Cellule de Curepipe", responsable_name: "Charlotte", phone_e164: "59732188" },
  { id: "2", name: "Cellule de Bois Rouge", responsable_name: "Lucie", phone_e164: "51234567" },
  { id: "3", name: "Cellule de Bambous", responsable_name: "Manish", phone_e164: "59865475" },
  { id: "4", name: "Cellule de Mon Gout", responsable_name: "May Jane", phone_e164: "59876413" },
  { id: "5", name: "Cellule de Rose Hill", responsable_name: "Fabrice", phone_e164: "59861473" },
  { id: "6", name: "Eglise", responsable_name: "", phone_e164: "" },
];

export default function AddMember() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [statut, setStatut] = useState("de passage");
  const [wantsVisit, setWantsVisit] = useState(true);
  const [howCame, setHowCame] = useState("Invité");
  const [assignedCell, setAssignedCell] = useState("");
  const [need, setNeed] = useState(""); // nouveau champ
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!assignedCell) {
      setMessage("Veuillez sélectionner où la personne est assignée.");
      return;
    }
    const cell = CELLULES.find(c => c.id === assignedCell);

    const { error } = await supabase.from("membres").insert([
      {
        nom: firstName,
        prenom: lastName,
        telephone: phone,
        email,
        statut,
        date_premiere_visite: new Date().toISOString(),
        welcome_sent_at: null,
        notes: need, // on utilise le champ "Besoin de la personne"
        responsable_suivi: cell.responsable_name,
        created_at: new Date().toISOString(),
        how_came: howCame,
      },
    ]);

    if (error) setMessage("Erreur : " + error.message);
    else {
      setMessage("👏 Membre enregistré avec succès !");
      setFirstName(""); setLastName(""); setPhone(""); setEmail(""); setStatut("de passage");
      setWantsVisit(true); setHowCame("Invité"); setAssignedCell(""); setNeed("");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", maxWidth: 500, margin: "0 auto" }}>
      {/* Logo + verset biblique */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <img src="/logo.png" alt="Logo de l'église" style={{ width: 100, marginBottom: 10 }} />
        <p style={{ fontStyle: "italic", color: "#555" }}>
          "Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d’eux." - Matthieu 18:20
        </p>
      </div>

      <h2 style={{ color: "#4A90E2", textAlign: "center", marginBottom: 20 }}>📋 Enregistrer un nouveau membre</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
        <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
        <input type="text" placeholder="Téléphone (+230...)" value={phone} onChange={(e) => setPhone(e.target.value)} required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />
        <input type="email" placeholder="Email (optionnel)" value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }} />

        <label>Statut du membre :</label>
        <select value={statut} onChange={(e) => setStatut(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}>
          <option value="de passage">De passage</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="a déjà mon église">A déjà mon église</option>
        </select>

        <label>Comment as-tu connu notre église ?</label>
        <select value={howCame} onChange={(e) => setHowCame(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}>
          <option>Invité</option>
          <option>Réseaux</option>
          <option>Autre</option>
        </select>

        <label>Besoin de la personne :</label>
        <textarea placeholder="Notes ou besoin spécifique..." value={need} onChange={(e) => setNeed(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", minHeight: 60 }} />

        <label>Assignée :</label>
        <select value={assignedCell} onChange={(e) => setAssignedCell(e.target.value)} required
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}>
          <option value="">-- Sélectionner --</option>
          {CELLULES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button type="submit"
          style={{ padding: 12, background: "#4A90E2", color: "#fff", border: "none", borderRadius: 8, fontWeight: "bold" }}>
          Ajouter le membre
        </button>
      </form>

      {message && <p style={{ marginTop: 15, color: "#2E7D32", fontWeight: "bold", textAlign: "center" }}>{message}</p>}
    </div>
  );
}
