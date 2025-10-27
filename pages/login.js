// pages/login.js

"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true); setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) { setError("Email ou mot de passe incorrect ❌"); return; }
      if (!data.user) { setError("Email ou mot de passe incorrect ❌"); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName", `${profile?.prenom || ""} ${profile?.nom || ""}`.trim());
      localStorage.setItem("userRole", JSON.stringify(profile?.role || "Membre"));

      // Redirection
      const role = profile?.role;
      let path = "/index";
      if (role === "ResponsableCellule") path = "/cellules-hub";
      else if (role === "ResponsableIntegration") path = "/membres-hub";
      else if (role === "ResponsableEvangelisation") path = "/evangelisation-hub";

      router.push(path);
    } catch (err) { setError("Erreur interne ❌"); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-900">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Connexion</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required className="w-full px-3 py-2 border rounded-lg"/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" required className="w-full px-3 py-2 border rounded-lg"/>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white py-2 rounded-lg">{loading ? "Connexion..." : "Se connecter"}</button>
        </form>
      </div>
    </div>
  );
}


