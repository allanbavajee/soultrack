// pages/access/[token].js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AccessTokenPage() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      try {
        const res = await fetch(`/api/validate-token?token=${token}`);
        
        if (res.redirected) {
          // Redirection automatique vers la page finale
          window.location.href = res.url;
        } else {
          const data = await res.json();
          alert(data.message || "Token invalide");
          router.push("/"); // Redirection vers l'accueil si token invalide
        }
      } catch (err) {
        console.error("Erreur lors de la validation du token :", err);
        alert("Erreur serveur lors de la validation du lien");
        router.push("/");
      }
    };

    validateToken();
  }, [token, router]);

  // Rien n'est affiché, on ne voit pas la page intermédiaire
  return null;
}
