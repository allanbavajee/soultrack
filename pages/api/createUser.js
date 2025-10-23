// pages/api/createUser.js

import { createClient } from '@supabase/supabase-js';

// ⚠️ Mets tes clés Supabase Admin ici depuis les variables d'environnement
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // clé service role (Admin)
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { email, password, prenom, nom, telephone, role } = req.body;

  if (!email || !password || !prenom || !nom || !role) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    // 1️⃣ Créer l'utilisateur dans Auth
    const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // l'utilisateur est directement confirmé
    });

    if (authError) throw authError;

    // 2️⃣ Créer le profil associé
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: user.id,           // id provenant d'Auth
          email,
          prenom,
          nom,
          telephone: telephone || 'N/A',
          role,                  // ex: "ResponsableCellule" ou "Administrateur"
          roles: [role],         // tableau pour flexibilité
          created_at: new Date().toISOString(),
        },
      ]);

    if (profileError) throw profileError;

    return res.status(200).json({
      message: `Utilisateur ${prenom} ${nom} créé avec succès !`,
      userId: user.id,
    });
  } catch (err) {
    console.error('Erreur création utilisateur :', err);
    return res.status(500).json({ error: err.message || err });
  }
}
