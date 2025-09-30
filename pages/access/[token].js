// pages/access/[token].js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AccessTokenPage() {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/validate-token?token=${token}`);
        const data = await res.json();

        if (data.valid) {
          // Redirection automatique selon le type d'accès
          if (data.access_type === "ajouter_membre") {
            router.replace("/add-member");
          } else if (data.access_type === "ajouter_evangelise") {
            router.replace("/add-evangelise");
          } else {
            setError("Type d'accès inconnu");
          }
        } else {
          setError(data.message || "Token invalide");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur serveur");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, router]);

  if (loading) return <p className="text-center mt-20 text-lg">Vérification du lien...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return null;
}
