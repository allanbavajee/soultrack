// pages/api/create-user.js
import { createClient } from "@supabase/supabase-js";

// Crée le client Supabase côté serveur uniquement (clé service_role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,       // ton URL Supabase
  process.env.SUPABASE_SERVICE_ROLE_KEY       // clé service_role (jamais exposée au client)
);

export default async function handler(req, res) {
  // ✅ Vérifie la méthode POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { email, password, prenom, nom, telephone, role } = req.body;

    // Vérifie les champs requis
    if (!email || !password || !prenom || !nom) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    // Création de l’utilisateur Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { prenom, nom, telephone, role },
    });

    if (userError) {
      console.error("Erreur création utilisateur Auth:", userError);
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
      console.error("Erreur création profil:", profileError);
      return res.status(500).json({ error: profileError.message });
    }

    // ✅ Réponse JSON réussie
    return res.status(200).json({ message: "Utilisateur créé avec succès.", userId: user.id });
  } catch (error) {
    console.error("Erreur interne serveur:", error);
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}
