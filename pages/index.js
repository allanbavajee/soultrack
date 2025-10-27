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
    const stored = localStorage.getItem("userRole");
    if (stored) {
      try { setRoles(JSON.parse(stored)); }
      catch { setRoles([stored]); }
    } else router.push("/login");
    setLoading(false);
  }, [router]);

  if (loading) return <div className="text-center mt-20">Chargement...</div>;
  const hasRole = role => roles.includes(role);
  const redirect = path => router.push(path);

  return (
    <AccessGuard>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-blue-500 p-6">
        <LogoutLink />
        <h1 className="text-4xl font-bold text-white mb-4">SoulTrack</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          {(hasRole("ResponsableIntegration")||hasRole("Admin")) && <button onClick={()=>redirect("/membres-hub")}>Suivis membres</button>}
          {(hasRole("ResponsableEvangelisation")||hasRole("Admin")) && <button onClick={()=>redirect("/evangelisation-hub")}>Évangélisation</button>}
          {(hasRole("ResponsableCellule")||hasRole("Admin")) && <button onClick={()=>redirect("/cellules-hub")}>Cellule</button>}
          {hasRole("Admin") && <>
            <button onClick={()=>redirect("/rapport")}>Rapport</button>
            <button onClick={()=>redirect("/administrateur")}>Admin</button>
          </>}
        </div>
      </div>
    </AccessGuard>
  );
}
