// pages/api/create-user.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  console.log("➡️ [API] /api/create-user appelée");

  // ✅ Vérifier la méthode
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non au// pages/api/create-user.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // Vérifie la méthode
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Vérifie que la clé service_role est bien définie
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Clé Supabase non configurée sur le serveur" });
  }

  // Création du client Supabase côté serveur
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { email, password, prenom, nom, telephone, role } = req.body;

    if (!email || !password || !prenom || !nom) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    // Création utilisateur Auth côté serveur
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { prenom, nom, telephone, role },
    });

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    const user = userData.user;

    // Création du profil lié
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
      return res.status(500).json({ error: profileError.message });
    }

    // Tout s’est bien passé
    return res.status(200).json({
      message: "Utilisateur créé avec succès.",
      userId: user.id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}
orisée" });
  }

  // ✅ Vérifier que la clé est définie
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Clé Supabase non configurée sur le serveur !");
    return res.status(500).json({ error: "Clé Supabase non configurée sur le serveur" });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { email, password, prenom, nom, telephone, role } = req.body;

    // Vérifier les champs obligatoires
    if (!email || !password || !prenom || !nom) {
      console.log("❌ Champs manquants :", req.body);
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    console.log("🟡 Création utilisateur Auth...");
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { prenom, nom, telephone, role },
    });

    if (userError) {
      console.error("❌ Erreur création utilisateur Auth:", userError);
      return res.status(500).json({ error: userError.message });
    }

    const user = userData.user;
    console.log("✅ Utilisateur créé avec ID :", user.id);

    // Créer le profil dans la table profiles
    console.log("🟡 Création profil...");
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
      console.error("❌ Erreur création profil :", profileError);
      return res.status(500).json({ error: profileError.message });
    }

    console.log("✅ Profil créé avec succès !");
    return res.status(200).json({
      message: "Utilisateur créé avec succès",
      userId: user.id,
    });
  } catch (error) {
    console.error("🔥 Erreur interne :", error);
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}
