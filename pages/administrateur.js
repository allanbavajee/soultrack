// pages/administrateur.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { canAccessPage } from "./index"; // On réutilise la fonction depuis index.js
import LogoutLink from "../components/LogoutLink";

export default function AdministrateurPage() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRoles = localStorage.getItem("userRole");

    if (!storedRoles) {
      router.push("/login");
      return;
    }

    try {
      const parsedRoles = JSON.parse(storedRoles);
      const normalizedRoles = Array.isArray(parsedRoles)
        ? parsedRoles.map(r => r.trim().toLowerCase())
        : [parsedRoles.trim().toLowerCase()];
      setRoles(normalizedRoles);

      // Vérification de l'accès
      if (!canAccessPage(normalizedRoles, "/administrateur")) {
        alert("⛔ Accès non autorisé !");
        router.push("/index");
        return;
      }

    } catch {
      setRoles([storedRoles.trim().toLowerCase()]);
      alert("⛔ Accès non autorisé !");
      router.push("/index");
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) return <div className="text-center mt-20">Chargement...</div>;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-100">
      <div className="absolute top-4 right-4">
        <LogoutLink />
      </div>

      <h1 className="text-4xl font-bold mb-4">Page Administrateur</h1>
      <p className="text-lg mb-6">Seuls les utilisateurs avec le rôle Admin peuvent accéder à cette page.</p>

      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Gestion des fonctionnalités</h2>
        <p>Vous pouvez ici gérer toutes les sections réservées aux administrateurs.</p>
      </div>
    </div>
  );
}
