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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔑 Connexion à Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.user) {
        setError("Email ou mot de passe incorrect ❌");
        setLoading(false);
        return;
      }

      // 🔍 Récupération du profil utilisateur
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile) {
        setError("Profil introuvable ❌");
        setLoading(false);
        return;
      }

      // ✅ Sauvegarde du rôle et de l'email
      const roles = Array.isArray(profile.role) ? profile.role : [profile.role];
      localStorage.setItem("userRole", JSON.stringify(roles));
      localStorage.setItem("userEmail", data.user.email);

      console.log("✅ Login réussi, rôles :", roles);

      // ⏳ Petit délai pour laisser le temps à localStorage
      setTimeout(() => {
        console.log("🔀 Redirection vers / ...");
        router.push("/");
      }, 400);
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("❌ Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-blue-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Se connecter</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
}

