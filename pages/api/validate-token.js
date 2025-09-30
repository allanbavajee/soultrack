// pages/api/validate-token.js
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token manquant" });
  }

  try {
    // Vérifie le token dans Supabase
    const { data, error } = await supabase
      .from("access_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (error) {
      console.error("Erreur Supabase:", error);
      return res.status(500).json({ valid: false, message: error.message });
    }

    if (!data) {
      return res.status(404).json({ valid: false, message: "Token introuvable" });
    }

    // Redirige directement selon le type
    if (data.access_type === "ajouter_membre") {
      return res.redirect(307, "/add-member");
    } else if (data.access_type === "ajouter_evangelise") {
      return res.redirect(307, "/add-evangelise");
    } else {
      return res.status(400).json({ valid: false, message: "Type d'accès inconnu" });
    }
  } catch (err) {
    console.error("Erreur catch:", err);
    return res.status(500).json({ valid: false, message: err.message });
  }
}
