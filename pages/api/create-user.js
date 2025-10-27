// ✅ pages/api/create-user.js
// pages/api/create-user.js
import { createClient } from "@supabase/supabase-js";

// ⚠️ Toujours utiliser la clé SERVICE_ROLE côté serveur
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
    // ✅ Crée un utilisateur Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { prenom, nom, telephone, role },
    });

    if (userError) {
      console.error("Erreur création utilisateur Auth :", userError);
      return res.status(500).json({ error: userError.message });
    }

    const user = userData.user;

    // ✅ Crée un profil dans la table "profiles"
    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      {
        id: user.id, // même ID que Auth
        prenom,
        nom,
        email,
        telephone,
        role,
        created_at: new Date(),
      },
    ]);

    if (profileError) {
      console.error("Erreur création profil :", profileError);
      return res.status(500).json({ error: profileError.message });
    }

    // ✅ Réponse JSON
    return res.status(200).json({
      message: "Utilisateur créé avec succès ✅",
      userId: user.id,
      email: user.email,
      role,
    });
  } catch (err) {
    console.error("Erreur interne :", err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  }
}

