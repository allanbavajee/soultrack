/* /pages/add-member.js */
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

/* Supabase client */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AddMember() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("members")
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          phone_e164: phone,
          welcome_sent: false,
          date_premiere_visite: new Date().toISOString(),
        },
      ]);
    if (error) setMessage("Erreur : " + error.message);
    else setMessage("Membre ajouté avec succès !");
    setFirstName(""); setLastName(""); setPhone("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>➕ Ajouter un membre</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        /><br/><br/>
        <input
          type="text"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        /><br/><br/>
        <input
          type="text"
          placeholder="Numéro téléphone (+230...)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        /><br/><br/>
        <button type="submit">Ajouter</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
