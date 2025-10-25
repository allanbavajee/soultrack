// ✅ pages/api/create-user.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { prenom, nom, email, telephone, password, role } = req.body;

    if (!email || !password || !prenom || !nom) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    // Création de l’utilisateur dans Supabase Auth
    const { data: user, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { prenom, nom, telephone, role },
    });

    if (authError) {
      console.error("Erreur création utilisateur :", authError);
      return res.status(400).json({ error: authError.message });
    }

    // Insertion dans la table "responsables"
    const { error: insertError } = await supabase
      .from("responsables")
      .insert([{ prenom, nom, email, telephone, role, user_id: user.user.id }]);

    if (insertError) {
      console.error("Erreur insertion base :", insertError);
      return res.status(400).json({ error: insertError.message });
    }

    return res.status(200).json({ message: "Utilisateur créé avec succès !" });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
