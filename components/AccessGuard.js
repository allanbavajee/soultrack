// /components/AccessGuard.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { canAccessPage } from "../lib/accessControl";

export default function AccessGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAccess();
    // Re-vérifie quand le pathname change
  }, [router.pathname]);

  const checkAccess = () => {
    const rolesData = localStorage.getItem("userRole");
    if (!rolesData) {
      console.warn("🚫 Aucun rôle trouvé → redirection vers /login");
      if (router.pathname !== "/login") router.push("/login");
      return;
    }

    let roles = [];
    try {
      roles = JSON.parse(rolesData);
    } catch {
      roles = [rolesData]; // si ce n'est pas JSON, transforme en tableau
    }

    // Normalisation des rôles
    roles = Array.isArray(roles)
      ? roles.map(r => r.trim().replace(/^./, c => c.toUpperCase()))
      : [roles.trim().replace(/^./, c => c.toUpperCase())];

    if (canAccessPage(roles, router.pathname)) {
      setAuthorized(true);
    } else {
      console.warn("⛔ Accès refusé :", router.pathname, "pour rôle(s)", roles);
      if (router.pathname !== "/index") router.push("/index"); // redirection safe
    }
  };

  if (!authorized) return null; // rien pendant la vérification

  return <>{children}</>;
}
