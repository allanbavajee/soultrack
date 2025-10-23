// /pages/api/createUser.js
import supabase from "../../lib/supabaseClient";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const { prenom, nom, email, telephone, password, role } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          prenom,
          nom,
          email,
          telephone,
          role,
          password_hash: hash,
          roles: [role],
        },
      ])
      .select();

    if (error) throw error;

    res.status(200).json({ success: true, userId: data[0].id });
  } catch (err) {
    console.error("Erreur création utilisateur:", err);
    res.status(400).json({ error: err.message });
  }
}
