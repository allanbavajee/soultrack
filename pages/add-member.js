import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AddMember() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneE164, setPhoneE164] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("members").insert([{
      first_name: firstName,
      last_name: lastName,
      phone_e164: phoneE164,
      email,
      date_premiere_visite: new Date().toISOString()
    }]);
    if (error) setMsg("❌ Erreur: " + error.message);
    else setMsg("✅ Enregistré avec succès !");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>➕ Ajouter un membre</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="Prénom" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <input placeholder="Nom" value={lastName} onChange={e => setLastName(e.target.value)} />
        <input placeholder="+230..." value={phoneE164} onChange={e => setPhoneE164(e.target.value)} required />
        <input placeholder="Email (optionnel)" value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Enregistrer</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
