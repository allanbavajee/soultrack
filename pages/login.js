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
      // 🔹 Récupère le profil
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

      // 🔹 Vérifie le mot de passe en ligne via PostgreSQL
      const { data: verify } = await supabase.rpc("verify_password", {
        p_password: password,
        p_hash: profile.password_hash,
      });

      if (!verify || verify.length === 0 || !verify[0].result) {
        setError("Email ou mot de passe incorrect ❌");
        setLoading(false);
        return;
      }

      // 🔹 Normalise les rôles
      const rolesArray = Array.isArray(profile.roles) ? profile.roles : [profile.role];
      const normalizedRoles = rolesArray.map((r) => {
        const lower = r.toLowerCase();
        if (lower.includes("admin")) return "Admin";
        if (lower.includes("responsablecellule")) return "ResponsableCellule";
        if (lower.includes("responsableintegration")) return "ResponsableIntegration";
        if (lower.includes("responsableevangelisation")) return "ResponsableEvangelisation";
        if (lower.includes("membre")) return "Membre";
        return r;
      });

      // 🔹 Stocke dans localStorage
      localStorage.setItem("userEmail", profile.email);
      localStorage.setItem("userName", profile.prenom + " " + profile.nom);
      localStorage.setItem("userRole", JSON.stringify(normalizedRoles));

      console.log("Login OK ! Redirection vers : /");
      router.replace("/"); // 🔹 Important : replace() pour éviter boucle

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
