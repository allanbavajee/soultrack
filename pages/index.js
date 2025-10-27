// pages/index.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AccessGuard from "../components/AccessGuard";
import LogoutLink from "../components/LogoutLink";

export default function HomePage() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRoles = localStorage.getItem("userRole");
    if (storedRoles) {
      setRoles(JSON.parse(storedRoles));
    } else {
      setTimeout(() => router.push("/login"), 100);
    }
    setLoading(false);
  }, [router]);

  if (loading) return <div>Chargement...</div>;

  const hasRole = (role) => roles.includes(role);

  const handleRedirect = (path) => router.push(path);

  return (
    <AccessGuard>
      <div className="p-6 flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-700 to-blue-300">
        <LogoutLink />
        <h1 className="text-5xl text-white mb-6">SoulTrack</h1>

        <div className="flex flex-wrap gap-4 justify-center">
          {hasRole("ResponsableIntegration") && (
            <div onClick={() => handleRedirect("/membres-hub")}>
              Suivis des membres
            </div>
          )}
          {hasRole("ResponsableEvangelisation") && (
            <div onClick={() => handleRedirect("/evangelisation-hub")}>
              Évangélisation
            </div>
          )}
          {hasRole("ResponsableCellule") && (
            <div onClick={() => handleRedirect("/cellules-hub")}>Cellule</div>
          )}
          {hasRole("Admin") && (
            <>
              <div onClick={() => handleRedirect("/rapport")}>Rapport</div>
              <div onClick={() => handleRedirect("/administrateur")}>Admin</div>
            </>
          )}
        </div>
      </div>
    </AccessGuard>
  );
}
