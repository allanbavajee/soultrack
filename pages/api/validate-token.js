// pages/api/validate-token.js
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const { token } = req.query;

  console.log("Token reçu :", token);

  if (!token) {
    return res.status(400).json({ error: "Token manquant" });
  }

  try {
    // Requête pour récupérer le token
    const { data, error } = await supabase
      .from("access_tokens")
      .select("*")
      .eq("token", token)
      .single();

    console.log("Data :", data, "Error :", error);

    if (error) {
      console.error("Erreur Supabase :", error);
      return res.status(500).json({ valid: false, message: "Erreur serveur Supabase" });
    }

    if (!data) {
      return res.status(404).json({ valid: false, message: "Token invalide" });
    }

    // Détermination de la page selon le type d'accès
    let redirectUrl = null;
    if (data.access_type === "ajouter_membre") {
      redirectUrl = "/ajouter-membre";
    } else if (data.access_type === "ajouter_evangelise") {
      redirectUrl = "/ajouter-evangelise";
    } else {
      return res.status(400).json({ valid: false, message: "Type d'accès inconnu" });
    }

    console.log("Redirection vers :", redirectUrl);

    // Redirection vers la page finale
    res.writeHead(307, { Location: redirectUrl });
    res.end();
  } catch (err) {
    console.error("Erreur serveur :", err);
    return res.status(500).json({ valid: false, message: "Erreur serveur" });
  }
}
