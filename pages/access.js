// pages/access.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function Access() {
  const router = useRouter();
  const { token } = router.query;

  const [accessType, setAccessType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("access_tokens")
        .select("access_type")
        .eq("token", token)
        .single();

      if (error || !data) {
        setError("Token invalide ou expiré.");
      } else {
        setAccessType(data.access_type);
      }
      setLoading(false);
    };

    validateToken();
  }, [token]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Bienvenue sur SoulTrack</h1>

      {accessType === "add_member" && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Ajouter un membre</h2>
          {/* Ici tu peux mettre le formulaire d'ajout de membre */}
          <p className="text-gray-700">Formulaire d’ajout membre ici...</p>
        </div>
      )}

      {accessType === "add_evangelise" && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">Ajouter un evangelisé</h2>
          {/* Ici tu peux mettre le formulaire d'ajout d'évangélisé */}
          <p className="text-gray-700">Formulaire d’ajout evangelisé ici...</p>
        </div>
      )}
    </div>
  );
}
