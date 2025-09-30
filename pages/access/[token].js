// pages/access/[token].js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AccessTokenPage() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token) return;

    // Appel à l'API pour valider le token
    fetch(`/api/validate-token?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.valid === false) {
          alert("Lien invalide ou expiré !");
          router.replace("/"); // redirige vers la page d'accueil si lien invalide
        }
        // Si valide, l'API redirige automatiquement, donc pas besoin de plus ici
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors de la vérification du lien.");
        router.replace("/");
      });
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Vérification du lien...</p>
    </div>
  );
}
