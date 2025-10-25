// ✅ pages/api/create-user.js
// pages/api/create-user.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  console.log("➡️ [API] /api/create-user appelée");

  // ✅ Autoriser uniquement POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // ✅ Vérifier la clé Supabase Service Role
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Clé Supabase manquante !");
    return res.status(500).json({ error: "Clé Supabase non configurée sur le serveur." });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

  try {
    const { email, password, prenom, nom, telephone, role } = req.body;

    if (!email || !password || !prenom || !nom) {
      console.log("❌ Champs manquants :", req.body);
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    console.log("🟡 Création utilisateur Supabase Auth...");
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { prenom, nom, telephone, role },
    });

    if (userError) {
      console.error("❌ Erreur création Auth:", userError);
      return res.status(500).json({ error: userError.message });
    }

    const user = userData.user;
    console.log("✅ Utilisateur créé :", user.id);

    console.log("🟡 Insertion profil...");
    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      {
        id: user.id,
        email,
        prenom,
        nom,
        telephone,
        role,
        created_at: new Date(),
      },
    ]);

    if (profileError) {
      console.error("❌ Erreur création profil:", profileError);
      return res.status(500).json({ error: profileError.message });
    }

    console.log("✅ Profil créé avec succès !");
    return res.status(200).json({
      message: "Utilisateur créé avec succès.",
      userId: user.id,
    });
  } catch (error) {
    console.error("🔥 Erreur interne du serveur :", error);
    return res.status(500).json({ error: error.message || "Erreur serveur interne." });
  }
}

