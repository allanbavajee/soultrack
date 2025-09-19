/* /pages/add-member.js */
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
  const [email, setEmail] = useState("");
  const [statut, setStatut] = useState("nouveau");
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
    if (!cellId) {
      setMessage("Veuillez sélectionner une cellule !");
      return;
    }

    const cell = cells.find(c => c.id === cellId);
    if (!cell) return;

    /* Insert into membres */
    const { data: memberData, error: memberError } = await supabase.from("membres").insert([
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
      },
    ]);

    /* Insert into to_welcome */
    await supabase.from("to_welcome").insert([
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
      },
    ]);

    if (memberError) setMessage("Erreur : " + memberError.message);
    else setMessage("Membre ajouté avec succès !");

    setFirstName(""); setLastName(""); setAddress(""); setCity("");
    setPhone(""); setEmail(""); setStatut("nouveau"); setWantsVisit(true);
    setCellId("");
  };

  const createWhatsAppLink = () => {
    if (!cellId) return "#";
    const cell = cells.find(c => c.id === cellId);
    return `https://wa.me/${cell.phone_e164}?text=${encodeURIComponent(
      `Bonjour ${cell.responsable_name}, un nouveau membre ${firstName} ${lastName} a été assigné à votre cellule ${cell.name}.`
    )}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>➕ Ajouter un nouveau membre</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} /><br/><br/>
        <input type="text" placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} /><br/><br/>
        <input type="text" placeholder="Téléphone (+230...)" value={phone} onChange={(e) => setPhone(e.target.value)} required /><br/><br/>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br/><br/>
        <label>Statut : </label>
        <select value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="nouveau">Nouveau</option>
          <option value="de passage">De passage</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
        </select><br/><br/>
        <label>
          <input type="checkbox" checked={wantsVisit} onChange={(e) => setWantsVisit(e.target.checked)} /> Souhaite être visité
        </label><br/><br/>
        <label>Cellule : </label>
        <select value={cellId} onChange={(e) => setCellId(e.target.value)} required>
          <option value="">-- Sélectionner une cellule --</option>
          {cells.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.responsable_name})</option>
          ))}
        </select><br/><br/>

        {cellId && (
          <div>
            Responsable : {cells.find(c => c.id === cellId)?.responsable_name}
            <a
              href={createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: 10 }}
            >
              <img src="/whatsapp-logo.png" alt="WhatsApp" width={24} />
            </a>
          </div>
        )}

        <br/>
        <button type="submit">Ajouter le membre</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
