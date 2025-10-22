//pages/login.js
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
      // Utilisation de Supabase Auth pour vérifier le mot de passe
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Mot de passe incorrect ❌");
        setLoading(false);
        return;
      }

      // Récupération des rôles depuis user_metadata
      const userRoles = data.user?.user_metadata?.roles || [];
      localStorage.setItem("userRole", JSON.stringify(userRoles));
      localStorage.setItem("userEmail", data.user.email);

      // Redirection vers la page d'accueil
      router.push("/index");
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("❌ Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-blue-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
      >
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
