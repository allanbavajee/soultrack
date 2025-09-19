/* /pages/add-member.js */
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

/* Supabase client */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/* Liste des cellules */
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

    /* Insert into membres */
    const { error: memberError } = await supabase.from("membres").insert([
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
        how_came: howCame,
      },
    ]);

    if (memberError) setMessage("Erreur : " + memberError.message);
    else setMessage("Membre ajouté avec succès !");

    setFirstName(""); setLastName(""); setPhone(""); setEmail(""); setStatut("nouveau");
    setWantsVisit(true); setHowCame("Invité"); setCellId("");
  };

  const createWhatsAppLink = () => {
    if (!cellId) return "#";
    const cell = CELLULES.find(c => c.id === cellId);
    return `https://wa.me/${cell.phone_e164}?text=${encodeURIComponent(
     `Bonjour ${cell.responsable_name} 🌸, nous avons la joie d’accueillir ${firstName} ${lastName} dans notre église. Il habite à ${address || "n/a"} et son téléphone est ${phone}. Il a été assigné à votre cellule ${cell.name}. Merci de l’accueillir avec amour ! 🙏`
    )}`;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>➕ Ajouter un nouveau membre</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Téléphone (+230...)" value={phone} onChange={(e) => setPhone(e.target.value)} required /><br/><br/>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br/><br/>

        <label>Statut : </label>
        <select value={statut} onChange={(e) => setStatut(e.target.value)}>
          <option value="nouveau">Nouveau</option>
          <option value="de passage">De passage</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
        </select><br/><br/>

        <label>Comment es-tu venu à l'église ?</label>
        <select value={howCame} onChange={(e) => setHowCame(e.target.value)}>
          <option>Invité</option>
          <option>Réseaux</option>
          <option>Autre</option>
        </select><br/><br/>

        <label>
          <input type="checkbox" checked={wantsVisit} onChange={(e) => setWantsVisit(e.target.checked)} /> Souhaite être visité
        </label><br/><br/>

        <label>Cellule : </label>
        <select value={cellId} onChange={(e) => setCellId(e.target.value)} required>
          <option value="">-- Sélectionner une cellule --</option>
          {CELLULES.map((c) => (
            <option key={c.id} value={c.id}>{c.name} ({c.responsable_name})</option>
          ))}
        </select><br/><br/>

        {cellId && (
          <div>
            Responsable : {CELLULES.find(c => c.id === cellId)?.responsable_name}
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
