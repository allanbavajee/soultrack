import { createClient } from "@supabase/supabase-js";

// 🔑 Remplace par ton URL Supabase et ta SERVICE_ROLE_KEY
const supabase = createClient(
  "https://TON-PROJECT.supabase.co",
  "SERVICE_ROLE_KEY"
);

async function createAdmin() {
  const email = "admin@soultrack.com";
  const password = "Admin123";
  const prenom = "Allan";
  const nom = "Bavajee";
  const telephone = "58000000";

  try {
    // Créer l'utilisateur dans Auth
    const { user, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });
    if (authError) throw authError;

    console.log("✅ Utilisateur Auth créé :", user.id);

    // Créer le profil lié
    const { data, error: profileError } = await supabase
      .from("profiles")
      .insert([{
        id: user.id,
        prenom,
        nom,
        email,
        telephone,
        role: "Administrateur",
        roles: ["Administrateur"],
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (profileError) throw profileError;

    console.log("✅ Profil créé :", data);
    console.log(`🔑 Tu peux te connecter avec : ${email} / ${password}`);
  } catch (err) {
    console.error("❌ Erreur :", err);
  }
}

createAdmin();
