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
    const rolesData = localStorage.getItem("userRole");
    if (!rolesData) {
      router.push("/login");
      return;
    }

    let roles;
    try { roles = JSON.parse(rolesData); } 
    catch { roles = [rolesData]; }

    if (canAccessPage(roles, router.pathname)) setAuthorized(true);
    else if (router.pathname !== "/index") router.push("/index");
  };

  if (!authorized) return null;
  return <>{children}</>;
}
