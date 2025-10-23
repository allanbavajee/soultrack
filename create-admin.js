import { createClient } from "@supabase/supabase-js";

// 🔑 Remplace par ton URL Supabase et ta SERVICE_ROLE_KEY
const supabase = createClient(
  "https://TON-PROJECT.supabase.co", 
  "SERVICE_ROLE_KEY"
);

async function createAdmin() {
  const email = "souladmin@soultrack.com";   // email de l'admin
  const password = "Admin123";        // mot de passe
  const prenom = "Allan";
  const nom = "Bavajee";
  const telephone = "58000000";

  try {
    // 1️⃣ Création de l'utilisateur dans Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) throw authError;

    console.log("✅ Utilisateur Auth créé :", authUser);

    // 2️⃣ Création du profil associé dans "profiles"
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([{
        id: authUser.id,      // 🔗 lien avec auth.users.id
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

    console.log("✅ Profil admin créé :", profileData);
    console.log(`🔑 Connexion : ${email} / ${password}`);

  } catch (err) {
    console.error("❌ Erreur création admin :", err);
  }
}

createAdmin();
