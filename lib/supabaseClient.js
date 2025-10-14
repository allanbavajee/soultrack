// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("⚠️ Vérifie tes variables d'environnement Supabase");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Vérifie si une session existe, sinon tente de la restaurer
(async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) {
    console.warn("⚠️ Aucune session active — connexion requise");
  }
})();

export default supabase;
