// lib/accessControl.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { canAccessPage } from "../lib/accessControl";

export default function AccessGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const rolesData = localStorage.getItem("userRole");

    if (!rolesData) {
      router.push("/login");
      return;
    }

    let roles;
    try {
      const parsed = JSON.parse(rolesData);
      roles = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      roles = [rolesData];
    }

    // Vérifie l’accès à la page actuelle
    if (canAccessPage(roles, router.pathname)) {
      setAuthorized(true);
    } else {
      console.warn("⛔ Accès refusé :", router.pathname, "pour rôle(s)", roles);
      router.push("/index"); // Redirection vers page par défaut
    }
  }, [router.pathname]);

  if (!authorized) return null; // cache le contenu le temps de vérifier

  return <>{children}</>;
}
