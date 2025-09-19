/* /pages/add-member.js */
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const CELLULES = [
  { id: "1", name: "Curepipe", responsable_name: "Charlotte", phone_e164: "59732188" },
  { id: "2", name: "Bois Rouge", responsable_name: "Lucie", phone_e164: "51234567" },
  { id: "3", name: "Bambous", responsable_name: "Manish", phone_e164: "59865475" },
  { id: "4", name: "Mon Gout", responsable_name: "May Jane", phone_e164: "59876413" },
  { id: "5", name: "Rose Hill", responsable_name: "Fabrice", phone_e164: "59861473" },
];

export default function AddMember() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [statut, setStatut] = useState("nouveau");
  const [wantsVisit, setWantsVisit] = useState(true);
  const [howCame, setHowCame] = useState("Invité");
  const [cellId, setCellId] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cellId) {
      setMessage("Veuillez sélectionner une cellule !");
      return;
    }

    const cell = CELLULES.find(c => c.id === cellId);
    if (!cell) return;

    const { error } = await supabase.from("membres").insert([
      {
        nom: firstName,
        prenom: lastName,
        telephone: phone,
        email,
        statut,
        date_premiere_visite: new Date().toISOString(),
        welcome_sent_at: null,
        notes: "",
        responsable_suivi: cell.responsable_name,
        created_at: new Date().toISOString(),
        how_came: howCame,
      },
    ]);

    if (error) setMessage("Erreur : " + error.message);
    else {
      setMessage("Membre ajouté avec succès !");
      setFirstName(""); setLastName(""); setPhone(""); setEmail(""); setStatut("nouveau");
      setWantsVisit(true); setHowCame("Invité"); setCellId("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>➕ Enregistrer un nouveau membre</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <input type="text" placeholder="Téléphone (+230...)" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        
        <label>Statut :</label>
        <select value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="de passage">De passage</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="a déjà mon église">A déjà mon église</option>
        </select>

        <label>Comment es-tu venu à l'église ?</label>
        <select value={howCame} onChange={(e) => setHowCame(e.target.value)}>
          <option>Invité</option>
          <option>Réseaux</option>
          <option>Autre</option>
        </select>

        <label>
          <input type="checkbox" checked={wantsVisit} onChange={(e) => setWantsVisit(e.target.checked)} /> Souhaite être visité
        </label>

        <label>Cellule :</label>
        <select value={cellId} onChange={(e) => setCellId(e.target.value)} required>
          <option value="">-- Sélectionner une cellule --</option>
          {CELLULES.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.responsable_name})</option>
          ))}
        </select>

        <button type="submit" style={{ padding: "10px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "6px" }}>Ajouter le membre</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
