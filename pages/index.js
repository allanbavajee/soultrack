"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function IndexPage() {
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || "Inconnu");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
      <h1 className="text-3xl font-bold mb-4">🏠 Page d'accueil</h1>
      <p className="text-lg mb-6">Bienvenue {userEmail}</p>
    </div>
  );
}
