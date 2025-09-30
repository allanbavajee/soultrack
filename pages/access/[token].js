// pages/access/[token].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function AccessTokenPage() {
  const router = useRouter();
  const { token } = router.query;
  const [valid, setValid] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!token) return;

    const checkToken = async () => {
      const { data } = await supabase
        .from("access_tokens")
        .select("*")
        .eq("token", token)
        .single();

      if (!data) {
        setValid(false);
        return;
      }

      // Vérifie si le token est déjà utilisé ou expiré
      const now = new Date();
      if (data.used || (data.expires_at && new Date(data.expires_at) < now)) {
        setValid(false);
        return;
      }

      setValid(true);
      setRole(data.role);

      // Marque le token comme utilisé (optionnel si tu veux usage unique)
      await supabase.from("access_tokens").update({ used: true }).eq("id", data.id);
    };

    checkToken();
  }, [token]);

  if (valid === null) return <p>Vérification du lien...</p>;
  if (!valid) return <p className="text-red-500">Lien invalide ou expiré.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">
        {role === "add_member" ? "Ajouter un membre" : "Ajouter un évangélisé"}
      </h1>

      <p className="mb-4">
        Le lien est valide. Vous pouvez maintenant accéder à la page correspondante.
      </p>

      <a
        href={role === "add_member" ? "/add-member" : "/add-evangelise"}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Accéder à la page
      </a>
    </div>
  );
}
