// ✅ pages/api/create-user.js

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  console.log("➡️ [API] /api/create-user appelée");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // ⚙️ Crée le client Supabase admin avec la clé service role
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { email, password, prenom, nom, telephone, role } = req.body;

    // 🧾 Vérifie les champs
    if (!email || !password || !prenom || !nom) {
      console.warn("❌ Champs manquants :", req.body);
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    console.log("🟡 Création de l'utilisateur Supabase Auth...");
    const { data, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { prenom, nom, telephone, role },
    });

    if (userError) {
      console.error("❌ Erreur création utilisateur Auth:", userError);
      return res.status(500).json({ error: userError.message });
    }

    const user = data.user;
    console.log("✅ Utilisateur créé :", user.id);

    console.log("🟡 Insertion du profil dans la table profiles...");
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
    console.error("🔥 Erreur interne du serveur:", error);
    // ⚠️ Toujours renvoyer une réponse JSON même en cas d’erreur
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}
