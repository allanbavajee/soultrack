import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AccessPage() {
  const router = useRouter();
  const { token } = router.query;
  const [role, setRole] = useState(null);

  // Vérifier le token à la récupération de l'URL
  useEffect(() => {
    if (!token) return;

    // Liste des tokens valides (à stocker côté supabase dans la vraie vie)
    const validTokens = {
      "MEMBER123": "add_member",
      "EVANG123": "add_evangelise",
    };

    if (validTokens[token]) {
      setRole(validTokens[token]);
      localStorage.setItem("role_access", validTokens[token]);
    } else {
      setRole("invalid");
    }
  }, [token]);

  if (!token) return <p>Chargement...</p>;
  if (role === "invalid") return <p>Token invalide ou expiré.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Bienvenue sur la plateforme</h1>
      {role === "add_member" && (
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={() => router.push("/add-member")}
        >
          Ajouter un membre
        </button>
      )}
      {role === "add_evangelise" && (
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => router.push("/add-evangelise")}
        >
          Ajouter un évangélisé
        </button>
      )}
    </div>
  );
}
