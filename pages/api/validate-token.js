// pages/api/validate-token.js
/*import { supabase } from "../../lib/supabaseClient";*/
import supabase from "../../lib/supabaseClient"; 

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ valid: false, message: "Token manquant" });
  }

  try {
    const { data, error } = await supabase
      .from("access_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !data) {
      console.error("Erreur Supabase:", error);
      return res.status(404).json({ valid: false, message: "Token invalide" });
    }

    // Renvoie le type d'accès pour la page
    res.status(200).json({
      valid: true,
      access_type: data.access_type
    });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ valid: false, message: "Erreur serveur" });
  }
}
