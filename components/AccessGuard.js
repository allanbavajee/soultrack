// components/AccessGuard.js
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { canAccessPage } from "../lib/accessControl";

export default function AccessGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      const storedRoles = localStorage.getItem("userRole");
      if (!storedRoles) {
        router.replace("/login");
        return;
      }

      try {
        const roles = JSON.parse(storedRoles);
        if (canAccessPage(roles, router.pathname)) {
          setAuthorized(true);
        } else {
          router.replace("/index"); // redirection vers accueil si pas autorisé
        }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (loading) return <div className="text-center mt-20 text-white">Vérification des accès...</div>;

  return authorized ? children : null;
}
