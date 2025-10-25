import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // Vérifier la méthode
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Vérifier que la clé est bien présente
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "Clé Supabase non configurée sur le serveur." });
  }

  // Créer le client admin
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { email, password, prenom, nom } = req.body;

    if (!email || !password || !prenom || !nom) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    // Créer l'utilisateur Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { prenom, nom },
    });

    if (userError) throw userError;

    // Créer le profil
    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      { id: userData.user.id, email, prenom, nom, created_at: new Date() },
    ]);

    if (profileError) throw profileError;

    return res.status(200).json({ message: "Utilisateur créé avec succès.", userId: userData.user.id });
  } catch (err) {
    console.error("Erreur API create-user:", err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  }
}
