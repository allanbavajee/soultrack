// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("⚠️ Vérifie tes variables d'environnement Supabase");
}

// Création du client Supabase avec le header approprié pour REST
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  },
});

export default supabase;
