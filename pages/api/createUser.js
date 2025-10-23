// pages/api/createUser.js

import supabase from "../../lib/supabaseClient";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { prenom, nom, email, telephone, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // 🔒 Hash du mot de passe avant enregistrement
    const password_hash = await bcrypt.hash(password, 10);

    // 🔹 Insertion dans Supabase
    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          prenom,
          nom,
          email,
          telephone,
          role,
          roles: [role], // Ex: ["ResponsableCellule"]
          password_hash,
        },
      ])
      .select("id");

    if (error) {
      console.error("Erreur Supabase :", error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Utilisateur créé avec succès",
      userId: data[0].id,
    });
  } catch (err) {
    console.error("Erreur API :", err);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

