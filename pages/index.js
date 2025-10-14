// ✅ /pages/index.js — Page d’accueil (Home) //

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import SendLinkPopup from "../components/SendLinkPopup";
import LogoutLink from "../components/LogoutLink";
import { canAccessPage } from "../lib/accessControl";

export default function HomePage() {
  const router = useRouter();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 🔹 Attente légère pour s’assurer que localStorage est bien dispo
    setTimeout(() => {
      const storedRole = localStorage.getItem("userRole");

      if (!storedRole) {
        console.warn("⚠️ Aucun rôle trouvé → Redirection vers /login");
        router.replace("/login");
        return;
      }

      console.log("✅ Rôle détecté :", storedRole);

      // Vérifie accès
      const canAccess = canAccessPage(storedRole, "/index");
      if (!canAccess) {
        console.warn("⛔ Accès non autorisé → redirection /login");
        router.replace("/login");
        return;
      }

      setRole(storedRole);
      setLoading(false);
    }, 400);
  }, [router]);

  if (loading) return <div className="text-center mt-20">Chargement...</div>;

  const handleRedirect = (path) => router.push(path);

  return (
    <div
      className="min-h-screen relative flex flex-col items-center justify-between p-6 gap-2"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
    >
      {/* 🔵 Déconnexion */}
      <LogoutLink />

      {/* Logo */}
      <div className="mt-1">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      {/* Titre */}
      <h1 className="text-5xl font-handwriting text-white mt-2 text-center">
        SoulTrack
      </h1>

      <div className="mt-2 mb-3 text-center text-white text-lg font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, avançons dans l’amour ❤️
      </div>

      {/* 🧩 Cartes principales */}
      <div className="flex flex-col md:flex-row flex-wrap gap-3 justify-center w-full max-w-5xl mt-2">
        {(role === "ResponsableIntegration" || role === "Admin") && (
          <div
            onClick={() => handleRedirect("/membres-hub")}
            className="flex-1 min-w-[250px] h-28 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-500 hover:shadow-lg cursor-pointer"
          >
            <div className="text-4xl mb-1">👤</div>
            <div className="font-bold text-gray-800 text-center">
              Suivis des membres
            </div>
          </div>
        )}

        {(role === "ResponsableEvangelisation" || role === "Admin") && (
          <div
            onClick={() => handleRedirect("/evangelisation-hub")}
            className="flex-1 min-w-[250px] h-28 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-green-500 hover:shadow-lg cursor-pointer"
          >
            <div className="text-4xl mb-1">🙌</div>
            <div className="font-bold text-gray-800 text-center">
              Évangélisation
            </div>
          </div>
        )}

        {role === "Admin" && (
          <>
            <div
              onClick={() => handleRedirect("/rapport")}
              className="flex-1 min-w-[250px] h-28 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-red-500 hover:shadow-lg cursor-pointer"
            >
              <div className="text-4xl mb-1">📊</div>
              <div className="font-bold text-gray-800 text-center">
                Rapport
              </div>
            </div>

            <div
              onClick={() => handleRedirect("/admin/create-internal-user")}
              className="flex-1 min-w-[250px] h-28 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-400 hover:shadow-lg cursor-pointer"
            >
              <div className="text-4xl mb-1">🧑‍💻</div>
              <div className="font-bold text-gray-800 text-center">
                Créer un utilisateur
              </div>
            </div>
          </>
        )}
      </div>

      {/* 🔗 Boutons popup */}
      <div className="flex flex-col gap-3 mt-4 w-full max-w-md">
        {(role === "ResponsableIntegration" || role === "Admin") && (
          <SendLinkPopup
            label="Envoyer l'appli – Nouveau membre"
            type="ajouter_membre"
            buttonColor="from-[#09203F] to-[#537895]"
          />
        )}

        {(role === "ResponsableEvangelisation" || role === "Admin") && (
          <SendLinkPopup
            label="Envoyer l'appli – Évangélisé"
            type="ajouter_evangelise"
            buttonColor="from-[#09203F] to-[#537895]"
          />
        )}

        {role === "Admin" && (
          <SendLinkPopup
            label="Voir / Copier liens…"
            type="voir_copier"
            buttonColor="from-[#005AA7] to-[#FFFDE4]"
          />
        )}
      </div>

      <div className="mt-4 mb-2 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs.  
        <br />
        <span className="italic">1 Corinthiens 12:14 ❤️</span>
      </div>
    </div>
  );
}

