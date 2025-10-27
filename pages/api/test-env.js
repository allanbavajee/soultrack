// pages/api/test-env.js

export default async function handler(req, res) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Log côté serveur (apparaît dans les logs Vercel)
    console.log("🔍 Vérification des variables d'environnement...");
    console.log("NEXT_PUBLIC_SUPABASE_URL:", url ? "✅ OK" : "❌ ABSENTE");
    console.log("SUPABASE_SERVICE_ROLE_KEY:", serviceKey ? "✅ OK" : "❌ ABSENTE");

    // Réponse côté navigateur
    if (!url || !serviceKey) {
      return res.status(500).json({
        status: "❌ Erreur",
        message: "Une ou plusieurs variables sont manquantes sur le serveur.",
        NEXT_PUBLIC_SUPABASE_URL: !!url,
        SUPABASE_SERVICE_ROLE_KEY: !!serviceKey,
      });
    }

    return res.status(200).json({
      status: "✅ Succès",
      message: "Toutes les variables d'environnement sont bien détectées sur le serveur.",
      NEXT_PUBLIC_SUPABASE_URL: url,
      SUPABASE_SERVICE_ROLE_KEY: "✅ Détectée (cachée pour sécurité)",
    });
  } catch (error) {
    console.error("🔥 Erreur test-env:", error);
    return res.status(500).json({ error: error.message });
  }
}
