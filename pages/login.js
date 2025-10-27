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
    setLoading(true);
    setError("");

    try {
      console.log("Tentative de login :", email, password);

      // 🔑 Connexion via Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Erreur de connexion Supabase :", authError);
        setError("Email ou mot de passe incorrect ❌");
        return;
      }

      const user = data.user;
      if (!user) {
        setError("Email ou mot de passe incorrect ❌");
        return;
      }

      // ✅ Récupère le profil dans la table "profiles"
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Erreur récupération profil :", profileError);
      }

      // 🔒 Stockage local pour usage dans l'app
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem(
        "userName",
        `${profile?.prenom || ""} ${profile?.nom || ""}`.trim()
      );
      localStorage.setItem("userRole", profile?.role || "Membre");

      console.log("✅ Profil récupéré :", profile);

      // 🔀 Redirection selon le rôle
      let redirectPath = "/index"; // défaut
      if (profile?.role === "Admin") redirectPath = "/index";
      else if (profile?.role === "ResponsableCellule")
        redirectPath = "/cellules-hub";
      else if (profile?.role === "ResponsableIntegration")
        redirectPath = "/membres-hub";
      else if (profile?.role === "ResponsableEvangelisation")
        redirectPath = "/evangelisation-hub";

      console.log("🔀 Redirection vers :", redirectPath);
      router.push(redirectPath);
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("Erreur interne ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Connexion
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
