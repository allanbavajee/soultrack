// pages/login.js
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import bcrypt from "bcryptjs";

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
      // 1️⃣ Récupère le profil par email
      const { data: user, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileError || !user) {
        setError("Utilisateur introuvable ❌");
        setLoading(false);
        return;
      }

      // 2️⃣ Vérifie le mot de passe
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        setError("Mot de passe incorrect ❌");
        setLoading(false);
        return;
      }

      // 3️⃣ Normalise les rôles
      const userRoles = Array.isArray(user.roles)
        ? user.roles
        : [user.role || ""];

      const normalizedRoles = userRoles.map((r) => {
        const lower = r.toLowerCase();
        if (lower.includes("admin")) return "Admin";
        if (lower.includes("responsablecellule")) return "ResponsableCellule";
        if (lower.includes("responsable integration")) return "ResponsableIntegration";
        if (lower.includes("responsableevangelisation")) return "ResponsableEvangelisation";
        if (lower.includes("membre")) return "Membre";
        return r;
      });

      // 4️⃣ Stockage local
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", `${user.prenom} ${user.nom}`);
      localStorage.setItem("userRole", JSON.stringify(normalizedRoles));

      // 5️⃣ Redirection
      if (normalizedRoles.includes("Admin")) router.push("/");
      else if (normalizedRoles.includes("ResponsableCellule")) router.push("/cellules-hub");
      else if (normalizedRoles.includes("ResponsableIntegration")) router.push("/membres-hub");
      else if (normalizedRoles.includes("ResponsableEvangelisation")) router.push("/evangelisation-hub");
      else router.push("/");

    } catch (err) {
      console.error(err);
      setError("Erreur de connexion ❌");
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
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full rounded-xl mb-4"
            required
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
