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
      const rolesData = localStorage.getItem("userRole");
      if (!rolesData) {
        router.push("/login");
        return;
      }

      const roles = JSON.parse(rolesData);

      // Permet toujours /index si rôle valide
      if (router.pathname === "/index" || canAccessPage(roles, router.pathname)) {
        setAuthorized(true);
      } else {
        console.warn("⛔ Accès refusé :", router.pathname, "pour rôle(s)", roles);
        if (router.pathname !== "/index") router.push("/index");
      }
    } catch (err) {
      console.error("Erreur AccessGuard :", err);
      router.push("/login");
    }
  };

  if (!authorized) return null;

  return <>{children}</>;
}
