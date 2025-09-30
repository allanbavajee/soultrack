import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../lib/supabaseClient"; // <- import corrigé

export default function AccessPage() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState("Vérification du lien...");

  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      try {
        const { data, error } = await supabase
          .from("access_tokens")
          .select("*")
          .eq("token", token)
          .single();

        if (error || !data) {
          setMessage("Lien invalide ou expiré. Vous allez être redirigé...");
          setTimeout(() => router.replace("/"), 3000);
          return;
        }

        // Redirection automatique selon le type d'accès
        if (data.access_type === "ajouter_membre") {
          router.replace("/add-member");
        } else if (data.access_type === "ajouter_evangelise") {
          router.replace("/add-evangelise");
        } else {
          setMessage("Type d'accès inconnu. Redirection...");
          setTimeout(() => router.replace("/"), 3000);
        }
      } catch (err) {
        console.error(err);
        setMessage("Erreur serveur, merci de réessayer. Redirection...");
        setTimeout(() => router.replace("/"), 3000);
      }
    };

    validateToken();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg text-center">
        <p className="text-gray-700 font-semibold text-lg">{message}</p>
      </div>
    </div>
  );
}
