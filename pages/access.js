// pages/acces.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AccessPage({ token }) {
  const [accessType, setAccessType] = useState(null);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setValid(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("access_tokens")
        .select("access_type, expires_at")
        .eq("token", token)
        .single();

      if (error || !data) {
        setValid(false);
      } else {
        const now = new Date();
        const expires = new Date(data.expires_at);
        if (now > expires) {
          setValid(false);
        } else {
          setAccessType(data.access_type);
          setValid(true);
        }
      }
      setLoading(false);
    };

    checkToken();
  }, [token]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (!valid) return <p className="text-center mt-10 text-red-600">Lien invalide ou expiré</p>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Accès spécial</h1>

      {accessType === "ajouter_membre" && (
        <a
          href="/add-member" // lien vers la page ajouter membre
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          ➕ Ajouter Membre
        </a>
      )}

      {accessType === "ajouter_evangeliser" && (
        <a
          href="/add-evangeliser" // lien vers la page ajouter evangeliser
          className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition"
        >
          ➕ Ajouter Evangeliser
        </a>
      )}
    </div>
  );
}

// Récupération du token depuis l'URL
export async function getServerSideProps(context) {
  const token = context.query.token || null;
  return { props: { token } };
}
