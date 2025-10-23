// pages/api/createUser.js
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ clé service_role, jamais exposée côté client
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée" });

  const { email, password, prenom, nom, telephone, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email et mot de passe requis" });

  try {
    // 🔹 1) Créer le compte Auth (confirmé immédiatement)
    const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (authError) throw authError;

    // 🔹 2) Ajouter un profil lié à l'id Auth
    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      {
        id: user.user.id,
        email,
        prenom,
        nom,
        telephone,
        role,
        roles: [role],
      },
    ]);
    if (profileError) throw profileError;

    return res.status(200).json({ message: "✅ Utilisateur créé avec succès", id: user.user.id });
  } catch (err) {
    console.error("Erreur création user:", err);
    return res.status(400).json({ error: err.message });
  }
}
