// ✅ pages/api/create-user.js
import { createClient } from "@supabase/supabase-js"; // ← import manquant corrigé
import supabase from "../../lib/supabaseClient";

// ⚠️ Crée un client admin avec la clé service_role (jamais côté client)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // à définir dans .env.local
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { email, password, prenom, nom, telephone, role } = req.body;

    if (!email || !password || !prenom || !nom) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    // ✅ Étape 1 : Créer l'utilisateur dans Auth
    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // évite confirmation par email
        user_metadata: { prenom, nom, telephone, role },
      });

    if (userError) {
      console.error("Erreur création utilisateur Auth:", userError);
      return res.status(500).json({ error: userError.message });
    }

    const user = userData.user;

    // ✅ Étape 2 : Créer le profil lié à l'utilisateur
    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      {
        id: user.id, // même ID que l’utilisateur Auth
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

    // ✅ Réponse finale propre
    return res.status(200).json({
      message: "Utilisateur créé avec succès.",
      userId: user.id,
    });
  } catch (error) {
    console.error("Erreur interne:", error);
    return res.status(500).json({ error: "Erreur interne du serveur." });
  }
}
