// pages/api/create-admin.js

import { createClient } from "@supabase/supabase-js";

// ✅ Client admin avec la clé service_role (à ne jamais exposer côté client)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { prenom, nom, email, telephone, password, role } = req.body;

  if (!prenom || !nom || !email || !password || !role) {
    return res.status(400).json({ error: "Champs requis manquants." });
  }

  try {
    // 🔹 Création de l'utilisateur dans Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // évite la confirmation par email
      user_metadata: { prenom, nom, telephone, role },
    });

    if (userError) {
      console.error("Erreur création utilisateur Auth:", userError);
      return res.status(500).json({ error: userError.message });
    }

    const user = userData.user;

    // 🔹 Insertion dans la table profiles
    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      {
        id: user.id,
        prenom,
        nom,
        email,
        telephone,
        role,
        created_at: new Date(),
      },
    ]);

    if (profileError) {
      console.error("Erreur création profil:", profileError);
      return res.status(500).json({ error: profileError.message });
    }

    return res.status(200).json({
      status: "✅ Succès",
      message: `Utilisateur Admin créé avec succès.`,
      userId: user.id,
    });

  } catch (error) {
    console.error("Erreur interne:", error);
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}
