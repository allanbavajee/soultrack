// ✅ pages/api/create-user.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  console.log("➡️ [API] /api/create-user appelée");

  // ✅ Vérifie la méthode
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // ✅ Vérifie la configuration des clés
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Clés Supabase manquantes !");
    return res.status(500).json({ error: "Clé Supabase non configurée sur le serveur." });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { email, password, prenom, nom, telephone, role } = req.body;

    if (!email || !password || !prenom || !nom) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    console.log("🟡 Création utilisateur Auth...");
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

    console.log("🟡 Insertion du profil...");
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

    console.log("✅ Profil inséré avec succès !");
    return res.status(200).json({
      message: "Utilisateur créé avec succès.",
      userId: user.id,
    });
  } catch (error) {
    console.error("🔥 Erreur interne :", error);
    return res.status(500).json({ error: error.message || "Erreur serveur." });
  }
}
