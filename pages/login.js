//pages/login.js

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
      const { data, error } = await supabase.rpc("verify_password", {
        p_email: email,
        p_password: password,
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const user = data[0];

        // Stocke les infos dans localStorage
        localStorage.setItem("user", JSON.stringify(user));

        // Redirection selon le rôle
        if (user.roles && user.roles.includes("Admin")) {
          router.push("/index");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } catch (err) {
      console.error("Erreur de connexion :", err.message);
      setError("Erreur interne : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-8 w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          required
        />

        <label className="block mb-2 font-medium">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-6"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

