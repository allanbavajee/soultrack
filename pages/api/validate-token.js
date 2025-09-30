// pages/api/validate-token.js
import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) return res.status(400).send("Token manquant");

  try {
    const { data, error } = await supabase
      .from("access_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !data) return res.status(404).send("Token invalide");

    // Détermine la page de redirection selon le type d'accès
    const redirectUrl =
      data.access_type === "ajouter_membre"
        ? "/add-member"
        : "/add-evangelise";

    // Redirection côté serveur
    res.writeHead(307, { Location: redirectUrl });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
}
