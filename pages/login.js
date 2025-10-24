//pages/login.js

"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import AccessGuard from "../components/AccessGuard";

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

      const { data, error: rpcError } = await supabase.rpc("verify_password", {
        user_email: email,
        user_password: password,
      });

      if (rpcError) {
        console.error("Erreur Supabase :", rpcError);
        throw new Error("Erreur interne Supabase");
      }

      const user = data?.[0];
      if (!user) {
        setError("Email ou mot de passe incorrect ❌");
        return;
      }

      // ✅ Stocke les infos
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", `${user.prenom || ""} ${user.nom || ""}`.trim());
      const roles = user.roles || [user.role || "Membre"];
      localStorage.setItem("userRole", JSON.stringify(roles));

      console.log("✅ Rôle détecté :", roles);

      // 🔀 Redirection selon rôle
      if (roles.includes("ResponsableCellule")) {
        console.log("🔀 Redirection vers : /cellules-hub");
        router.push("/cellules-hub");
      } else if (roles.includes("ResponsableIntegration")) {
        console.log("🔀 Redirection vers : /membres-hub");
        router.push("/membres-hub");
      } else if (roles.includes("ResponsableEvangelisation")) {
        console.log("🔀 Redirection vers : /evangelisation-hub");
        router.push("/evangelisation-hub");
      } else if (roles.includes("Admin")) {
        console.log("🔀 Redirection vers : /index");
        router.push("/index");
      } else {
        setError("Rôle non autorisé ❌");
      }
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
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Connexion</h1>

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

