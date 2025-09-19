/* pages/add-member.js */
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/* Supabase client */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AddMember() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [hasWhatsApp, setHasWhatsApp] = useState(true);
  const [visitType, setVisitType] = useState("de passage");
  const [howCame, setHowCame] = useState("Invité par quelqu'un");
  const [wantsVisit, setWantsVisit] = useState(true);
  const [cellId, setCellId] = useState("");
  const [cells, setCells] = useState([]);
  const [message, setMessage] = useState("");

  /* Fetch cells from Supabase */
  useEffect(() => {
    async function fetchCells() {
      const { data, error } = await supabase.from("cells").select("*");
      if (!error) setCells(data);
    }
    fetchCells();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("members").insert([
      {
        first_name: firstName,
        last_name: lastName,
        address,
        city,
        phone_e164: phone,
        has_whatsapp: hasWhatsApp,
        visit_type: visitType,
        how_came: howCame,
        wants_visit: wantsVisit,
        cell_id: cellId,
        welcome_sent: false,
        created_at: new Date().toISOString(),
      },
    ]);
    if (error) setMessage("Erreur : " + error.message);
    else setMessage("Membre ajouté avec succès !");
    setFirstName(""); setLastName(""); setAddress(""); setCity(""); setPhone("");
    setHasWhatsApp(true); setVisitType("de passage"); setHowCame("Invité par quelqu'un");
    setWantsVisit(true); setCellId("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>➕ Ajouter un nouveau membre</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Téléphone (+230...)" value={phone} onChange={(e) => setPhone(e.target.value)} required /><br/><br/>
        <label>
          <input type="checkbox" checked={hasWhatsApp} onChange={(e) => setHasWhatsApp(e.target.checked)} /> WhatsApp disponible
        </label><br/><br/>
        <label>Type de visite : </label>
        <select value={visitType} onChange={(e) => setVisitType(e.target.value)}>
          <option value="de passage">De passage</option>
          <option value="visite">Visite</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
        </select><br/><br/>
        <label>Comment est venu : </label>
        <select value={howCame} onChange={(e) => setHowCame(e.target.value)}>
          <option>Invité par quelqu'un</option>
          <option>Réseaux sociaux</option>
          <option>Autre</option>
        </select><br/><br/>
        <label>
          <input type="checkbox" checked={wantsVisit} onChange={(e) => setWantsVisit(e.target.checked)} /> Souhaite être visité
        </label><br/><br/>
        <label>Cellule assignée : </label>
        <select value={cellId} onChange={(e) => setCellId(e.target.value)} required>
          <option value="">-- Sélectionner une cellule --</option>
          {cells.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.responsable_name})</option>
          ))}
        </select><br/><br/>
        <button type="submit">Ajouter le membre</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
