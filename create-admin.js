import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://TON-PROJECT.supabase.co",  // Remplace par ton URL Supabase
  "SERVICE_ROLE_KEY"                  // Remplace par ta Service Role Key
);

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: "admins@soutltrack.com",      // email de l’admin
    password: "Admin123",           // mot de passe
    email_confirm: true,
  });

  if (error) console.log("Erreur création admin:", error);
  else console.log("Admin créé:", data);
}

createAdmin();
