// pages/api/create-user.js
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // ⚠️ Service Role Key (jamais exposée au front)
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { email, password, username, nomComplet, role } = req.body;

  try {
    // 1️⃣ Créer l’utilisateur dans Auth
    const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    const userId = user.user.id;

    // 2️⃣ Ajouter profil
    const { error: profileError } = await supabaseAdmin.from("profiles").insert([
      {
        id: userId,
        username,
        email,
        role,
        responsable: nomComplet,
        access_pages: JSON.stringify(getAccessPages(role)),
      },
    ]);

    if (profileError) throw profileError;

    res.status(200).json({ success: true, message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

function getAccessPages(role) {
  switch (role) {
    case "ResponsableCelluleCpe":
      return ["/suivis-membres"];
    case "ResponsableCellule":
      return ["/membres"];
    case "ResponsableEvangelisation":
      return ["/evangelisation"];
    case "Admin":
      return ["/admin/creation-utilisateur", "/suivis-membres", "/membres"];
    default:
      return [];
  }
}
