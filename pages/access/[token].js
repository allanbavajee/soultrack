// pages/access/[token].js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function AccessTokenPage() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const { data, error } = await supabase
          .from("access_tokens")
          .select("*")
          .eq("token", token)
          .single();

        if (error || !data) {
          alert("Lien invalide ou expiré !");
          return router.push("/"); // retour à l'accueil
        }

        // Redirige selon le type d'accès
        if (data.access_type === "ajouter_membre") {
          router.replace("/add-member");
        } else if (data.access_type === "ajouter_evangelise") {
          router.replace("/add-evangelise");
        } else {
          alert("Type d'accès inconnu !");
          router.push("/");
        }
      } catch (err) {
        console.error(err);
        alert("Erreur serveur, merci de réessayer.");
        router.push("/");
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <p className="text-gray-700 text-lg font-semibold">Vérification du lien...</p>
    </div>
  );
}
