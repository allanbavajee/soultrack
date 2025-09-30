/* pages/api/validate-token.js */
import supabase from "@/lib/supabaseClient";

export default async function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send("Token manquant");
  }

  // Vérifier le token dans la base
  const { data, error } = await supabase
    .from("access_tokens")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !data) {
    return res.status(400).send("Lien invalide ou expiré");
  }

  // Rediriger directement selon le type
  if (data.access_type === "ajouter_membre") {
    return res.redirect(302, "/ajouter-membre");
  } else if (data.access_type === "ajouter_evangelise") {
    return res.redirect(302, "/ajouter-evangelise");
  } else {
    return res.status(400).send("Type d’accès inconnu");
  }
}
