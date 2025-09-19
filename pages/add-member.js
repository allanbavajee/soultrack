/* pages/add-member.js */
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

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
  const [visitType, setVisitType] = useState("visite");
  const [howHeard, setHowHeard] = useState("invité");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("members").insert([
      {
        first_name: firstName,
        last_name: lastName,
        address,
        city,
        phone_e164: phone,
        visit_type: visitType,
        how_heard: howHeard,
        welcome_sent: false,
        date_premiere_visite: new Date().toISOString(),
      },
    ]);
    if (error) setMessage("Erreur : " + error.message);
    else setMessage("Membre ajouté avec succès !");
    setFirstName(""); setLastName(""); setAddress(""); setCity(""); setPhone(""); setVisitType("visite"); setHowHeard("invité");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>➕ Nouveaux venus</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Prénom" value={firstName} onChange={e => setFirstName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Nom" value={lastName} onChange={e => setLastName(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Adresse" value={address} onChange={e => setAddress(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Ville" value={city} onChange={e => setCity(e.target.value)} required /><br/><br/>
        <input type="text" placeholder="Téléphone (+230...)" value={phone} onChange={e => setPhone(e.target.value)} required /><br/><br/>
        
        <label>Type de visite :</label>
        <select value={visitType} onChange={e => setVisitType(e.target.value)}>
          <option value="visite">Visite</option>
          <option value="de passage">De passage</option>
          <option value="veut faire ICC son église">Veut faire ICC son église</option>
        </select><br/><br/>
        
        <label>Comment a-t-il entendu parler de l'église ?</label>
        <select value={howHeard} onChange={e => setHowHeard(e.target.value)}>
          <option value="invité">Invité par quelqu’un</option>
          <option value="réseaux">Réseaux sociaux</option>
          <option value="autre">Autre</option>
        </select><br/><br/>
        
        <button type="submit">Ajouter le nouveau venu</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
