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
      if (canAccessPage(roles, router.pathname)) {
        setAuthorized(true);
      } else {
        router.push("/index");
      }
    } catch {
      router.push("/login");
    }
  };

  if (!authorized) return null;
  return <>{children}</>;
}

