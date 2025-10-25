// pages/api/create-user.js
const { createClient } = require("@supabase/supabase-js");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
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

    const { data: userData, error: userError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { prenom, nom, telephone, role },
      });

    if (userError) {
      return res.status(500).json({ error: userError.message });
    }

    const user = userData.user;

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

    return res.status(200).json({ message: "Utilisateur créé avec succès.", userId: user.id });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Erreur serveur" });
  }
}
