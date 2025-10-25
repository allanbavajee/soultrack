import { createClient } from "@supabase/supabase-js";

// 🧩 Vérifie que les variables sont bien présentes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Clés Supabase manquantes dans les variables d'environnement.");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // ✅ Vérifie la méthode
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    // ✅ Création de l'utilisateur dans Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // confirmation immédiate pour pouvoir se connecter
      user_metadata: { role },
    });

    if (userError) {
      console.error("❌ Erreur création user :", userError.message);
      return res.status(400).json({ error: userError.message });
    }

    // ✅ Ajout du rôle dans ta table "users" si tu en as une
    const { error: dbError } = await supabaseAdmin
      .from("users")
      .insert([{ email, role }]);

    if (dbError) {
      console.error("⚠️ Erreur insertion base :", dbError.message);
      // On continue quand même, l'utilisateur Auth est créé
    }

    console.log("✅ Utilisateur créé avec succès :", userData.user.email);

    return res.status(200).json({
      message: "Utilisateur créé avec succès",
      user: userData.user,
    });

  } catch (error) {
    console.error("🔥 Erreur inattendue :", error);
    return res.status(500).json({ error: "Erreur serveur interne" });
  }
}
