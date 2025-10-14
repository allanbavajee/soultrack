// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("⚠️ Vérifie tes variables d'environnement Supabase");
}

// ✅ Crée un client Supabase persistant avec gestion automatique de la session
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // 🔒 garde la session active
    autoRefreshToken: true, // 🔁 renouvelle automatiquement le token
    detectSessionInUrl: true, // ✅ capture la session depuis l’URL (utile pour Vercel)
  },
});

export default supabase;
