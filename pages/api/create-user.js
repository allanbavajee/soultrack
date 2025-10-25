// ✅ pages/api/create-user.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // ✅ Vérifier la méthode HTTP
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // ✅ Vérifier que les clés Supabase existent
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("❌ Clés Supabase manquantes sur le serveur");
    return res.status(500).json({ error: "Clé Supabase non configurée sur le serveur." });
  }

  // ✅ Créer le client admin (seulement côté serveur)
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  try {
    const { email, password, prenom, nom, telephone, role } = req.body;

    if (!email || !password || !prenom || !nom) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    console.log("🟡 Création de l'utilisateur dans Supabase Auth...");
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
    console.log("✅ Utilisateur Auth créé :", user.id);

    // ✅ Créer le profil lié à l'utilisateur Auth
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
      console.error("❌ Erreur insertion profil:", profileError);
      return res.status(500).json({ error: profileError.message });
    }

    console.log("✅ Profil créé avec succès !");
    return res.status(200).json({
      message: "Utilisateur créé avec succès 🎉",
      userId: user.id,
    });
  } catch (error) {
    console.error("🔥 Erreur interne:", error);
    return res.status(500).json({ error: error.message || "Erreur serveur." });
  }
}
