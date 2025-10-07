/* pages/index.js - Page login */
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("Veuillez remplir tous les champs !");
      setLoading(false);
      return;
    }

    try {
      // 🔹 Login via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error("Utilisateur introuvable");

      const userId = data.user.id;

      // 🔹 Vérifier que l'utilisateur est dans profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError || !profile) {
        throw new Error("Profil introuvable. Contacte un admin.");
      }

      // 🔹 Stocker l'id dans localStorage pour compatibilité Home.js
      localStorage.setItem("userId", userId);

      // 🔹 Rediriger vers Home
      router.push("/home");
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Erreur de connexion");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-400 p-6">
      <h1 className="text-4xl text-white font-bold mb-6">Connexion</h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {message && <p className="text-red-600 mt-2">{message}</p>}
      </div>
    </div>
  );
}

