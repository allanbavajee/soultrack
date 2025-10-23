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
      // 🔹 1️⃣ Cherche l'utilisateur
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        setError("Email ou mot de passe incorrect ❌");
        setLoading(false);
        return;
      }

      // 🔹 2️⃣ Vérifie le mot de passe via RPC
      const { data: passwordCheck, error: rpcError } = await supabase.rpc("verify_password", {
        p_password: password,
        p_hash: profile.password_hash,
      });

      if (rpcError || !passwordCheck || passwordCheck[0].result === false) {
        setError("Email ou mot de passe incorrect ❌");
        setLoading(false);
        return;
      }

      // 🔹 3️⃣ Stocke les infos localement
      const roles = Array.isArray(profile.roles) ? profile.roles : [profile.role];
      localStorage.setItem("userEmail", profile.email);
      localStorage.setItem("userName", profile.prenom + " " + profile.nom);
      localStorage.setItem("userRole", JSON.stringify(roles));

      // 🔹 4️⃣ Redirection selon rôle
      if (roles.includes("Admin")) router.push("/");
      else if (roles.includes("ResponsableCellule")) router.push("/cellules-hub");
      else if (roles.includes("ResponsableIntegration")) router.push("/membres-hub");
      else if (roles.includes("ResponsableEvangelisation")) router.push("/evangelisation-hub");
      else router.push("/");

    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-50">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Connexion</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full rounded-xl mb-4"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full rounded-xl mb-4"
          />
          {error && <p className="text-red-600 font-semibold mb-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-xl transition-all duration-200"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
