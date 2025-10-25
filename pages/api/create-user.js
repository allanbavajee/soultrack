import { createClient } from "@supabase/supabase-js";

// ⚠️ Clé service_role, jamais côté client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { prenom, nom, email, password, role } = req.body;

    if (!prenom || !nom || !email || !password) {
      return res.status(400).json({ error: "Champs requis manquants." });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { prenom, nom, role },
    });

    if (userError) return res.status(500).json({ error: userError.message });

    const user = userData.user;

    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      { id: user.id, prenom, nom, email, role, created_at: new Date() },
    ]);

    if (profileError) return res.status(500).json({ error: profileError.message });

    return res.status(200).json({ message: "Utilisateur créé avec succès", userId: user.id });
  } catch (err) {
    console.error("Erreur interne:", err);
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  }
}
