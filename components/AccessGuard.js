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
  }, [router.pathname]);

  const checkAccess = () => {
    try {
      const storedRoles = localStorage.getItem("userRole");
      if (!storedRoles) {
        console.warn("🚫 Aucun rôle trouvé → redirection vers /login");
        if (router.pathname !== "/login") router.push("/login");
        return;
      }

      const roles = JSON.parse(storedRoles);

      if (canAccessPage(roles, router.pathname)) {
        setAuthorized(true);
      } else {
        console.warn("⛔ Accès refusé :", router.pathname, "pour rôle(s)", roles);
        if (router.pathname !== "/index") router.push("/index");
      }
    } catch (err) {
      console.error("Erreur AccessGuard :", err);
      if (router.pathname !== "/login") router.push("/login");
    }
  };

  if (!authorized) return null;
  return <>{children}</>;
}

