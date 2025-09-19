// /utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Remplace ces valeurs par celles de ton projet Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
