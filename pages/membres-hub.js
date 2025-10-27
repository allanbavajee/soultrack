// pages/membres-hub.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MembresHub() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRoles = localStorage.getItem("userRole");
    if (!storedRoles) {
      router.push("/login");
      return;
    }

    const roles = JSON.parse(storedRoles);
    setRole(roles[0] || roles); // simplification
    if (roles.includes("ResponsableIntegration") || roles.includes("Admin")) {
      setLoading(false);
    } else {
      router.push("/login"); // rôle non autorisé
    }
  }, [router]);

  if (loading) return <div className="text-center mt-20">Chargement...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Membres Hub</h1>
      <p>Bienvenue, {role}</p>
    </div>
  );
}
