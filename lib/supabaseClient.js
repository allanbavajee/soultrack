// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Variables d'environnement Supabase manquantes.");
}

// ⚡ Empêche l'accès à localStorage côté serveur
const isBrowser = typeof window !== "undefined";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isBrowser,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: isBrowser ? localStorage : undefined,
  },
});

export default supabase;
