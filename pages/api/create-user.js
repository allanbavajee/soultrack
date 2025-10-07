// pages/api/create-user.js
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // clé service_role
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, email, nomComplet, role, password } = req.body;

  if (!username || !email || !nomComplet || !role || !password) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  try {
    // 1️⃣ Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) throw authError;

    const userId = authData.id;

    // 2️⃣ Ajouter le profil dans la table profiles
    const { error: profileError } = await supabaseAdmin.from('profiles').insert([
      {
        id: userId,
        username,
        email,
        role,
        responsable: nomComplet,
        access_pages: JSON.stringify(getAccessPages(role)),
      },
    ]);

    if (profileError) throw profileError;

    res.status(200).json({ message: 'Utilisateur créé avec succès !' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Définir les pages accessibles selon le rôle
function getAccessPages(role) {
  switch (role) {
    case 'ResponsableCelluleCpe':
      return ['/suivis-membres'];
    case 'ResponsableCellule':
      return ['/membres'];
    case 'ResponsableEvangelisation':
      return ['/evangelisation'];
    case 'Admin':
      return ['/admin/creation-utilisateur', '/suivis-membres', '/membres'];
    default:
      return [];
  }
}
