// pages/api/validate-token.js
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: "Token manquant" });
  }

  try {
    const { data, error } = await supabase
      .from("access_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !data) {
      return res.status(404).json({ valid: false, message: "Token invalide" });
    }

    // Redirige vers la page selon le type d'accès
    if (data.access_type === "ajouter_membre") {
      return res.redirect(307, "/ajouter-membre");
    } else if (data.access_type === "ajouter_evangelise") {
      return res.redirect(307, "/ajouter-evangelise");
    } else {
      return res.status(400).json({ valid: false, message: "Type d'accès inconnu" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ valid: false, message: "Erreur serveur" });
  }
}
